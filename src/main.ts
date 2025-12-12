import {
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
	TCPHelper,
} from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { StatusManager } from './status.js'
import PQueue from 'p-queue'
import OSC from 'osc-js'

const KA_INTERVAL = 30000
const KA_MESSAGE_PATH = ''
const KA_MESSAGE_ARGS = ''
const KA_MESSAGE_PRIO = 0

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	private config!: ModuleConfig // Setup in init()
	private socket!: TCPHelper
	private kaTimer: NodeJS.Timeout | undefined = undefined
	private statusManager = new StatusManager(this, { status: InstanceStatus.Connecting, message: 'Initialising' }, 2000)
	private queue = new PQueue({ concurrency: 1, interval: 50, intervalCap: 1 })
	constructor(internal: unknown) {
		super(internal)
	}

	public async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.statusManager.updateStatus(InstanceStatus.Connecting)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.configUpdated(config).catch(() => {})
	}
	// When module gets deleted
	public async destroy(): Promise<void> {
		this.debug(`destroy ${this.id}:${this.label}`)
		this.queue.clear()
		if (this.socket) this.socket.destroy()
		if (this.kaTimer) clearTimeout(this.kaTimer)
		this.statusManager.destroy()
	}

	public async configUpdated(config: ModuleConfig): Promise<void> {
		this.debug(`Config Updated. ${JSON.stringify(config)}`)
		this.queue.clear()
		this.config = config
		process.title = this.label
		this.createClient(config.host, config.port)
	}

	private debug(msg: string | object): void {
		if (this.config.verbose) {
			if (typeof msg == 'object') msg = JSON.stringify(msg)
			this.log('debug', `[${new Date().toJSON()}] ${msg}`)
		}
	}

	public async sendMessage(path: string, args: string | number | boolean, priority: number = 1): Promise<boolean> {
		return await this.queue.add(
			async (): Promise<boolean> => {
				if (this.socket && this.socket.isConnected) {
					const msg = new OSC.Message(path, args)
					const packet = new OSC.Packet(msg)
					const sent = await this.socket.send(Buffer.from(packet.pack()))
					this.kaMessage()
					this.debug(sent ? `Message sent: ${JSON.stringify(msg)}` : `Could not send: ${JSON.stringify(msg)}`)
					return sent
				}
				this.log(
					'warn',
					`Socket not connected! could not send message to host ${this.config.host}\n Path: ${path}. Arguments: ${args}`,
				)
				return false
			},
			{ priority: priority },
		)
	}

	private kaMessage(): void {
		if (this.kaTimer) {
			clearTimeout(this.kaTimer)
		}
		this.kaTimer = setTimeout(() => {
			this.sendMessage(KA_MESSAGE_PATH, KA_MESSAGE_ARGS, KA_MESSAGE_PRIO).catch(() => {})
		}, KA_INTERVAL)
	}

	private createClient(host = this.config.host, port = this.config.port): void {
		const connectEvent = () => {
			this.log('info', ` Connected to ${host}:${port}`)
			this.kaMessage()
		}
		const dataEvent = (msg: Buffer<ArrayBufferLike>) => {
			this.debug(`Message recieved ${msg}`)
		}
		const endEvent = () => {
			this.log('info', `Connection from ${host}:${port} closed`)
		}
		const errorEvent = (err: Error) => {
			this.log('error', JSON.stringify(err))
		}
		const statusChangeEvent = (status: InstanceStatus, message: string | undefined) => {
			this.statusManager.updateStatus(status, message)
		}

		if (this.socket && !this.socket.isDestroyed) {
			this.socket.removeAllListeners()
			this.socket.destroy()
		}
		if (host) {
			this.debug(`Creating new socket to ${host}:${port}`)
			this.socket = new TCPHelper(host, port, { reconnect: true, reconnect_interval: 5000 })
			this.socket.on('connect', connectEvent)
			this.socket.on('data', dataEvent)
			this.socket.on('end', endEvent)
			this.socket.on('error', errorEvent)
			this.socket.on('status_change', statusChangeEvent)
		} else {
			this.log('warn', 'No host')
			this.statusManager.updateStatus(InstanceStatus.BadConfig, `No host`)
		}
	}

	// Return config fields for web config
	public getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	private updateActions(): void {
		UpdateActions(this)
	}

	private updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	private updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
