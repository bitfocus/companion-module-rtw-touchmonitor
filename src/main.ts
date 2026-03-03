import {
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
	OSCSomeArguments,
} from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { StatusManager } from './status.js'
import PQueue from 'p-queue'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	private config!: ModuleConfig // Setup in init()
	private statusManager = new StatusManager(this, { status: InstanceStatus.Connecting, message: 'Initialising' }, 2000)
	private queue = new PQueue({ concurrency: 1, interval: 10, intervalCap: 1 })
	constructor(internal: unknown) {
		super(internal)
	}

	public async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.configUpdated(config).catch(() => {})
	}
	// When module gets deleted
	public async destroy(): Promise<void> {
		this.debug(`destroy ${this.id}:${this.label}`)
		this.queue.clear()
		this.statusManager.destroy()
	}

	public async configUpdated(config: ModuleConfig): Promise<void> {
		this.debug(`Config Updated. ${JSON.stringify(config)}`)
		if (config.host) {
			this.config = config
			this.statusManager.updateStatus(InstanceStatus.Ok)
			this.updateActions() // export actions
			this.updateFeedbacks() // export feedbacks
			this.updateVariableDefinitions() // export variable definitions
		} else {
			this.statusManager.updateStatus(InstanceStatus.BadConfig, 'No host')
		}
	}

	private debug(msg: string | object): void {
		if (this.config.verbose) {
			if (typeof msg == 'object') msg = JSON.stringify(msg)
			this.log('debug', msg)
		}
	}

	public async sendMessage(
		path: string,
		args: OSCSomeArguments, //string | number, | boolean,
		priority: number = 1,
	): Promise<void> {
		this.debug(`Queueing message to ${path} with args: ${typeof args == 'object' ? JSON.stringify(args) : args}`)
		return await this.queue.add(
			(): void => {
				this.oscSend(this.config.host, this.config.port, path, args)
			},
			{ priority: priority },
		)
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
