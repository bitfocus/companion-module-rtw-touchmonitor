import type {
	CompanionActionDefinitions,
	CompanionInputFieldCheckbox,
	CompanionInputFieldNumber,
	CompanionInputFieldStaticText,
	OSCMetaArgument,
} from '@companion-module/base'
import type ModuleInstance from './main.js'
import { OscPaths } from './api.js'
import { assertOSCMetaArgument } from './utils.js'

export enum ActionId {
	RecallPreset = 'recall_preset',
	LoudnessMeter = 'loudness_meter',
	MonitoringVolumeSet = 'monitoring_volume_set',
	MonitoringDim = 'monitoring_dim',
	MonitoringMute = 'monitoring_mute',
	MonitoringHeadphonesEnable = 'monitoring_headphones_enable',
	MonitoringInputSelect = 'monitoring_input_select',
	MonitoringOutputSelect = 'monitoring_output_select',
	TalkbackEnable = 'talkback_enable',
	TalkbackSetMicGain = 'talkback_set_mic_gain',
	DevicePhantomPower = 'device_phantom_power',
}

export type ActionSchema = {
	[ActionId.RecallPreset]: {
		options: {
			number: number
			name: string
			byName: boolean
		}
	}
	[ActionId.LoudnessMeter]: {
		options: {
			appId: number
			placeholder: never
			all: boolean
			action: 'start' | 'stop' | 'reset'
		}
	}
	[ActionId.MonitoringVolumeSet]: {
		options: {
			volume: number
			placeholder: never
			ref: boolean
		}
	}
	[ActionId.MonitoringDim]: {
		options: {
			dim: boolean
		}
	}
	[ActionId.MonitoringMute]: {
		options: {
			mute: boolean
		}
	}
	[ActionId.MonitoringHeadphonesEnable]: {
		options: {
			enable: boolean
		}
	}
	[ActionId.MonitoringInputSelect]: {
		options: {
			input: number
		}
	}
	[ActionId.MonitoringOutputSelect]: {
		options: {
			output: number
		}
	}
	[ActionId.TalkbackSetMicGain]: {
		options: {
			appId: number
			placeholder: never
			all: boolean
			gain: number
		}
	}
	[ActionId.TalkbackEnable]: {
		options: {
			appId: number
			placeholder: never
			all: boolean
			enable: boolean
		}
	}
	[ActionId.DevicePhantomPower]: {
		options: {
			p48: boolean
		}
	}
}

const ApplicationIdOption = {
	id: 'appId',
	type: 'number',
	label: 'Application Id',
	default: 0,
	min: 0,
	max: 0xff,
	isVisibleExpression: '!$(options:all)',
	range: true,
	step: 1,
	asInteger: true,
} as const satisfies CompanionInputFieldNumber

const ApplicationIdPlaceholderOption = {
	id: 'placeholder',
	type: 'static-text',
	label: 'Application Id',
	value: 'All',
	isVisibleExpression: '$(options:all)',
	disableAutoExpression: true,
} as const satisfies CompanionInputFieldStaticText

const AllApplicationsOption = {
	id: 'all',
	type: 'checkbox',
	label: 'All Applications',
	default: false,
	tooltip: 'Apply command to all metering applications',
	disableAutoExpression: true,
} as const satisfies CompanionInputFieldCheckbox

const EnableOption = {
	id: 'enable',
	type: 'checkbox',
	label: 'Enable',
	default: false,
} as const satisfies CompanionInputFieldCheckbox

export function UpdateActions(self: ModuleInstance): CompanionActionDefinitions<ActionSchema> {
	const actions: CompanionActionDefinitions<ActionSchema> = {
		[ActionId.RecallPreset]: {
			name: 'Preset - Recall',
			options: [
				{
					id: 'number',
					type: 'number',
					label: 'Preset Number',
					default: 0,
					min: 0,
					max: 0x20,
					isVisibleExpression: '!$(options:byName)',
					range: true,
					step: 1,
					description: 'Default preset is 0',
					asInteger: true,
					clampValues: true,
				},
				{
					id: 'name',
					type: 'textinput',
					label: 'Preset Name',
					default: '',
					useVariables: true,
					isVisibleExpression: '$(options:byName)',
					description: 'Case sensitive',
				},
				{
					id: 'byName',
					type: 'checkbox',
					label: 'Recall by name',
					default: false,
					disableAutoExpression: true,
				},
			],
			callback: async (event, _context) => {
				const preset = event.options.byName ? event.options.name?.toString() : Math.floor(event.options.number)
				const args = { type: typeof preset == 'string' ? 's' : 'i', value: preset }
				assertOSCMetaArgument(args)
				await self.sendMessage(OscPaths.Preset.Recall(), args)
			},
		},
		[ActionId.LoudnessMeter]: {
			name: 'Loudness Meter - Control',
			options: [
				ApplicationIdOption,
				ApplicationIdPlaceholderOption,
				AllApplicationsOption,
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					choices: [
						{ id: 'start', label: 'Start' },
						{ id: 'stop', label: 'Stop' },
						{ id: 'reset', label: 'Reset' },
					],
					default: 'start',
					expressionDescription: 'Must return start, stop or reset',
				},
			],
			callback: async (event, _context) => {
				const appId = event.options.all ? 'all' : event.options.appId
				let path = ''
				switch (event.options.action.trim().toLowerCase()) {
					case 'start':
						path = OscPaths.Metering.Start(appId)
						break
					case 'stop':
						path = OscPaths.Metering.Stop(appId)
						break
					case 'reset':
						path = OscPaths.Metering.Reset(appId)
						break
					default:
						throw new Error(
							`Invalid action option for Loudness Meter - Control: ${event.options.action}\nExpression must return 'start' | 'stop' | 'reset'`,
						)
				}
				await self.sendMessage(path, [])
			},
		},
		[ActionId.MonitoringVolumeSet]: {
			name: 'Monitoring - Volume Set',
			options: [
				{
					id: 'volume',
					type: 'number',
					label: 'Volume',
					default: 0,
					min: -0xff,
					max: 0xff,
					isVisibleExpression: '!$(options:ref)',
					asInteger: false,
					clampValues: true,
				},
				{
					id: 'placeholder',
					type: 'static-text',
					label: 'Volume',
					value: 'Reference',
					isVisibleExpression: '$(options:ref)',
					disableAutoExpression: true,
				},
				{
					id: 'ref',
					type: 'checkbox',
					label: 'Reference Volume',
					default: false,
					disableAutoExpression: true,
				},
			],
			callback: async (event, _context) => {
				let path = OscPaths.Monitoring.SetVolume()
				const volume = event.options.volume
				if (event.options.ref) path = OscPaths.Monitoring.RecallReferenceVolume()
				const args: OSCMetaArgument = { type: 'f', value: volume }
				await self.sendMessage(path, args)
			},
		},
		[ActionId.MonitoringDim]: {
			name: 'Monitoring - Dim',
			options: [
				{
					id: 'dim',
					type: 'checkbox',
					label: 'Dim',
					default: false,
				},
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 's', value: String(event.options.dim) }
				await self.sendMessage(OscPaths.Monitoring.Dim(), args)
			},
		},
		[ActionId.MonitoringMute]: {
			name: 'Monitoring - Mute',
			options: [
				{
					id: 'mute',
					type: 'checkbox',
					label: 'Mute',
					default: false,
				},
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 's', value: String(event.options.mute) }
				await self.sendMessage(OscPaths.Monitoring.Mute(), args)
			},
		},
		[ActionId.MonitoringHeadphonesEnable]: {
			name: 'Monitoring - Headphones Enable',
			options: [EnableOption],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 's', value: String(event.options.enable) }
				await self.sendMessage(OscPaths.Monitoring.EnableHeadphones(), args)
			},
		},
		[ActionId.MonitoringInputSelect]: {
			name: 'Monitoring - Input Select',
			options: [
				{
					id: 'input',
					type: 'number',
					label: 'Input',
					default: 1,
					min: 1,
					max: 0x20,
					range: true,
					step: 1,
					asInteger: true,
				},
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 'i', value: Math.floor(event.options.input - 1) }
				await self.sendMessage(OscPaths.Monitoring.SelectInput(), args)
			},
		},
		[ActionId.MonitoringOutputSelect]: {
			name: 'Monitoring - Output Select',
			options: [
				{
					id: 'output',
					type: 'number',
					label: 'Output',
					default: 1,
					min: 1,
					max: 0x20,
					range: true,
					step: 1,
					asInteger: true,
				},
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 'i', value: Math.floor(event.options.output - 1) }
				await self.sendMessage(OscPaths.Monitoring.SelectOutput(), args)
			},
		},
		[ActionId.TalkbackSetMicGain]: {
			name: 'Talkback - Set Mic Input Gain',
			options: [
				ApplicationIdOption,
				ApplicationIdPlaceholderOption,
				AllApplicationsOption,
				{
					id: 'gain',
					type: 'number',
					label: 'Gain',
					default: 0,
					min: -12,
					max: 12,
					range: true,
					step: 0.1,
					description: 'Range: -12 to +12 dB',
					asInteger: false,
					clampValues: true,
				},
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 'f', value: event.options.gain }
				await self.sendMessage(
					OscPaths.Talkback.SetMicGain(event.options.all ? 'all' : Math.floor(event.options.appId)),
					args,
				)
			},
		},
		[ActionId.TalkbackEnable]: {
			name: 'Talkback - Enable',
			options: [ApplicationIdOption, ApplicationIdPlaceholderOption, AllApplicationsOption, EnableOption],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 's', value: String(event.options.enable) }
				await self.sendMessage(
					OscPaths.Talkback.Enable(event.options.all ? 'all' : Math.floor(event.options.appId)),
					args,
				)
			},
		},
		[ActionId.DevicePhantomPower]: {
			name: 'Device - Phantom Power',
			options: [
				{
					id: 'p48',
					type: 'checkbox',
					label: 'Phantom Power',
					default: false,
				},
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 's', value: String(event.options.p48) }
				await self.sendMessage(OscPaths.Device.PhantomPower(), args)
			},
		},
	}
	return actions
}
