import type {
	CompanionActionDefinitions,
	CompanionInputFieldCheckbox,
	CompanionInputFieldNumber,
	CompanionInputFieldStaticText,
	CompanionInputFieldTextInput,
	OSCMetaArgument,
} from '@companion-module/base'
import type ModuleInstance from './main.js'
import { OscPaths } from './api.js'
import { assertOSCMetaArgument, parseIntArray } from './utils.js'

export enum ActionId {
	RecallPreset = 'recall_preset',
	LoudnessMeter = 'loudness_meter',
	MeteringInRouting = 'metering_in_routing',
	MeteringOutRouting = 'metering_out_routing',
	MonitoringVolumeSet = 'monitoring_volume_set',
	MonitoringDim = 'monitoring_dim',
	MonitoringMute = 'monitoring_mute',
	MonitoringHeadphonesEnable = 'monitoring_headphones_enable',
	MonitoringInputSelect = 'monitoring_input_select',
	MonitoringOutputSelect = 'monitoring_output_select',
	MonitoringDownmix = 'monitoring_downmix',
	MonitoringSurroundAttenuation = 'monitoring_surround_attenuation',
	MonitoringLfBoost = 'monitoring_lf_boost',
	MonitoringMono = 'monitoring_mono',
	MonitoringInRouting = 'monitoring_in_routing',
	MonitoringOutRouting = 'monitoring_out_routing',
	MonitoringInputTrim = 'monitoring_input_trim',
	MonitoringInputMute = 'monitoring_input_mute',
	MonitoringInputDelay = 'monitoring_input_delay',
	MonitoringOutputLevel = 'monitoring_output_level',
	MonitoringOutputPolarity = 'monitoring_output_polarity',
	MonitoringOutputType = 'monitoring_output_type',
	MonitoringOutputBassManagementWeighting = 'monitoring_output_bass_management_weighting',
	MonitoringOutputDelay = 'monitoring_output_delay',
	MonitoringOutputEqEnable = 'monitoring_output_eq_enable',
	MonitoringOutputEqBandActive = 'monitoring_output_eq_band_active',
	MonitoringOutputEqBandType = 'monitoring_output_eq_band_type',
	MonitoringOutputEqBandFrequency = 'monitoring_output_eq_band_frequency',
	MonitoringOutputEqBandGain = 'monitoring_output_eq_band_gain',
	MonitoringOutputEqBandQ = 'monitoring_output_eq_band_q',
	TalkbackEnable = 'talkback_enable',
	TalkbackSetMicGain = 'talkback_set_mic_gain',
	TalkbackSetVolume = 'talkback_set_volume',
	TalkbackInRouting = 'talkback_in_routing',
	TalkbackOutRouting = 'talkback_out_routing',
	DevicePhantomPower = 'device_phantom_power',
	DevicePhonesGain = 'device_phones_gain',
	DeviceXlrGain = 'device_xlr_gain',
}

const FilterTypeChoices = [
	{ id: 'peak', label: 'Peak Filter' },
	{ id: 'low_shelf', label: 'Low Shelf' },
	{ id: 'high_shelf', label: 'High Shelf' },
	{ id: 'low_pass', label: 'Low Pass' },
	{ id: 'band_pass', label: 'Band Pass' },
	{ id: 'high_pass', label: 'High Pass' },
	{ id: 'all_pass_2nd', label: 'All Pass 2nd Order (180° phase shift)' },
	{ id: 'all_pass_4th', label: 'All Pass 4th Order (360° phase shift)' },
	{ id: 'notch', label: 'Notch' },
	{ id: 'low_pass_1st', label: 'Low Pass First Order' },
	{ id: 'high_pass_1st', label: 'High Pass First Order' },
] as const

type FilterType = (typeof FilterTypeChoices)[number]['id']

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
	[ActionId.MeteringInRouting]: {
		options: {
			appId: number
			placeholder: never
			all: boolean
			routing: string
			info: never
		}
	}
	[ActionId.MeteringOutRouting]: {
		options: {
			appId: number
			placeholder: never
			all: boolean
			routing: string
			info: never
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
	[ActionId.MonitoringDownmix]: {
		options: {
			downmix: boolean
			info: never
		}
	}
	[ActionId.MonitoringSurroundAttenuation]: {
		options: {
			surrAtt: boolean
			info: never
		}
	}
	[ActionId.MonitoringLfBoost]: {
		options: {
			lfBoost: boolean
			info: never
		}
	}
	[ActionId.MonitoringMono]: {
		options: {
			mono: boolean
			info: never
		}
	}
	[ActionId.MonitoringInRouting]: {
		options: {
			routing: string
			info: never
		}
	}
	[ActionId.MonitoringOutRouting]: {
		options: {
			routing: string
			info: never
		}
	}
	[ActionId.MonitoringInputTrim]: {
		options: {
			input: number
			trim: number
			info: never
		}
	}
	[ActionId.MonitoringInputMute]: {
		options: {
			input: number
			mute: boolean
			info: never
		}
	}
	[ActionId.MonitoringInputDelay]: {
		options: {
			input: number
			delay: number
			info: never
		}
	}
	[ActionId.MonitoringOutputLevel]: {
		options: {
			output: number
			speaker: number
			level: number
			info: never
		}
	}
	[ActionId.MonitoringOutputPolarity]: {
		options: {
			output: number
			speaker: number
			polarity: boolean
			info: never
		}
	}
	[ActionId.MonitoringOutputType]: {
		options: {
			output: number
			speaker: number
			type: 'full_range' | 'bass_managed'
			info: never
		}
	}
	[ActionId.MonitoringOutputBassManagementWeighting]: {
		options: {
			output: number
			speaker: number
			weighting: number
			info: never
		}
	}
	[ActionId.MonitoringOutputDelay]: {
		options: {
			output: number
			speaker: number
			delay: number
			info: never
		}
	}
	[ActionId.MonitoringOutputEqEnable]: {
		options: {
			output: number
			speaker: number
			enable: boolean
			info: never
		}
	}
	[ActionId.MonitoringOutputEqBandActive]: {
		options: {
			output: number
			speaker: number
			band: number
			active: boolean
			info: never
		}
	}
	[ActionId.MonitoringOutputEqBandType]: {
		options: {
			output: number
			speaker: number
			band: number
			filterType: FilterType
			info: never
		}
	}
	[ActionId.MonitoringOutputEqBandFrequency]: {
		options: {
			output: number
			speaker: number
			band: number
			frequency: number
			info: never
		}
	}
	[ActionId.MonitoringOutputEqBandGain]: {
		options: {
			output: number
			speaker: number
			band: number
			gain: number
			info: never
		}
	}
	[ActionId.MonitoringOutputEqBandQ]: {
		options: {
			output: number
			speaker: number
			band: number
			q: number
			info: never
		}
	}
	[ActionId.TalkbackSetMicGain]: {
		options: {
			appId: number
			placeholder: never
			all: boolean
			gain: number
			info: never
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
	[ActionId.TalkbackSetVolume]: {
		options: {
			appId: number
			placeholder: never
			all: boolean
			info: never
		}
	}
	[ActionId.TalkbackInRouting]: {
		options: {
			appId: number
			placeholder: never
			all: boolean
			routing: string
			info: never
		}
	}
	[ActionId.TalkbackOutRouting]: {
		options: {
			appId: number
			placeholder: never
			all: boolean
			routing: string
			info: never
		}
	}
	[ActionId.DevicePhantomPower]: {
		options: {
			p48: boolean
		}
	}
	[ActionId.DevicePhonesGain]: {
		options: {
			gain: number
			info: never
		}
	}
	[ActionId.DeviceXlrGain]: {
		options: {
			gain: number
			info: never
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

const RoutingOption = {
	id: 'routing',
	type: 'textinput',
	label: 'Routing',
	default: '',
	useVariables: true,
	description: 'Comma-separated list of source indices, one per channel, in order (-1 = unrouted)',
} as const satisfies CompanionInputFieldTextInput

const MinFirmwareInfoOption = {
	id: 'info',
	type: 'static-text',
	label: 'Info',
	value: 'Minimum supported firmware v2.2',
	disableAutoExpression: true,
} as const satisfies CompanionInputFieldStaticText

const UnsupportedFirmwareInfoOption = {
	id: 'info',
	type: 'static-text',
	label: 'Info',
	value: 'Not supported in firmware v2.2 and later',
	disableAutoExpression: true,
} as const satisfies CompanionInputFieldStaticText

const MonitoringOutputIndexOption = {
	id: 'output',
	type: 'number',
	label: 'Output',
	default: 1,
	min: 1,
	max: 4,
	range: true,
	step: 1,
	asInteger: true,
} as const satisfies CompanionInputFieldNumber

const MonitoringSpeakerIndexOption = {
	id: 'speaker',
	type: 'number',
	label: 'Speaker',
	default: 1,
	min: 1,
	max: 32,
	range: true,
	step: 1,
	asInteger: true,
	description: 'Speaker channel within the selected output',
} as const satisfies CompanionInputFieldNumber

const MonitoringBandIndexOption = {
	id: 'band',
	type: 'number',
	label: 'EQ Band',
	default: 1,
	min: 1,
	max: 8,
	range: true,
	step: 1,
	asInteger: true,
} as const satisfies CompanionInputFieldNumber

const MonitoringInputIndexOption = {
	id: 'input',
	type: 'number',
	label: 'Input',
	default: 1,
	min: 1,
	max: 4,
	range: true,
	step: 1,
	asInteger: true,
} as const satisfies CompanionInputFieldNumber

function buildRoutingArgs(routing: string): OSCMetaArgument[] {
	return parseIntArray(routing).map((value) => ({ type: 'i', value }))
}

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
				let path: string
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
		[ActionId.MeteringInRouting]: {
			name: 'Metering - Input Routing',
			options: [
				ApplicationIdOption,
				ApplicationIdPlaceholderOption,
				AllApplicationsOption,
				RoutingOption,
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const appId = event.options.all ? 'all' : Math.floor(event.options.appId)
				await self.sendMessage(OscPaths.Metering.InRouting(appId), buildRoutingArgs(event.options.routing))
			},
		},
		[ActionId.MeteringOutRouting]: {
			name: 'Metering - Output Routing',
			options: [
				ApplicationIdOption,
				ApplicationIdPlaceholderOption,
				AllApplicationsOption,
				RoutingOption,
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const appId = event.options.all ? 'all' : Math.floor(event.options.appId)
				await self.sendMessage(OscPaths.Metering.OutRouting(appId), buildRoutingArgs(event.options.routing))
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
					min: 0,
					max: 100,
					isVisibleExpression: '!$(options:ref)',
					asInteger: false,
					clampValues: true,
					description: 'Value in dB SPL, 0 to 100',
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
					max: 4,
					range: true,
					step: 1,
					asInteger: true,
					description: 'Select input 1-4',
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
					max: 4,
					range: true,
					step: 1,
					asInteger: true,
					description: 'Select output 1-4',
				},
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 'i', value: Math.floor(event.options.output - 1) }
				await self.sendMessage(OscPaths.Monitoring.SelectOutput(), args)
			},
		},
		[ActionId.MonitoringDownmix]: {
			name: 'Monitoring - Downmix',
			options: [
				{
					id: 'downmix',
					type: 'checkbox',
					label: 'Downmix',
					default: false,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 's', value: String(event.options.downmix) }
				await self.sendMessage(OscPaths.Monitoring.Downmix(), args)
			},
		},
		[ActionId.MonitoringSurroundAttenuation]: {
			name: 'Monitoring - Surround Attenuation',
			options: [
				{
					id: 'surrAtt',
					type: 'checkbox',
					label: 'Surround Attenuation',
					default: false,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 's', value: String(event.options.surrAtt) }
				await self.sendMessage(OscPaths.Monitoring.SurroundAttenuation(), args)
			},
		},
		[ActionId.MonitoringLfBoost]: {
			name: 'Monitoring - LF Channel Boost',
			options: [
				{
					id: 'lfBoost',
					type: 'checkbox',
					label: 'LF Channel Boost',
					default: false,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 's', value: String(event.options.lfBoost) }
				await self.sendMessage(OscPaths.Monitoring.LfBoost(), args)
			},
		},
		[ActionId.MonitoringMono]: {
			name: 'Monitoring - Mono',
			options: [
				{
					id: 'mono',
					type: 'checkbox',
					label: 'Mono',
					default: false,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 's', value: String(event.options.mono) }
				await self.sendMessage(OscPaths.Monitoring.Mono(), args)
			},
		},
		[ActionId.MonitoringInRouting]: {
			name: 'Monitoring - Input Routing',
			options: [RoutingOption, MinFirmwareInfoOption],
			callback: async (event, _context) => {
				await self.sendMessage(OscPaths.Monitoring.InRouting(), buildRoutingArgs(event.options.routing))
			},
		},
		[ActionId.MonitoringOutRouting]: {
			name: 'Monitoring - Output Routing',
			options: [RoutingOption, MinFirmwareInfoOption],
			callback: async (event, _context) => {
				await self.sendMessage(OscPaths.Monitoring.OutRouting(), buildRoutingArgs(event.options.routing))
			},
		},
		[ActionId.MonitoringInputTrim]: {
			name: 'Monitoring - Input Trim',
			options: [
				MonitoringInputIndexOption,
				{
					id: 'trim',
					type: 'number',
					label: 'Trim',
					default: 0,
					min: -60,
					max: 6,
					range: true,
					step: 0.1,
					asInteger: false,
					clampValues: true,
					description: 'Value in dB',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const inputIdx = Math.floor(event.options.input - 1)
				const args: OSCMetaArgument = { type: 'f', value: event.options.trim }
				await self.sendMessage(OscPaths.Monitoring.Input.Trim(inputIdx), args)
			},
		},
		[ActionId.MonitoringInputMute]: {
			name: 'Monitoring - Input Mute',
			options: [
				MonitoringInputIndexOption,
				{
					id: 'mute',
					type: 'checkbox',
					label: 'Mute',
					default: false,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const inputIdx = Math.floor(event.options.input - 1)
				const args: OSCMetaArgument = { type: 's', value: String(event.options.mute) }
				await self.sendMessage(OscPaths.Monitoring.Input.Mute(inputIdx), args)
			},
		},
		[ActionId.MonitoringInputDelay]: {
			name: 'Monitoring - Input Delay',
			options: [
				MonitoringInputIndexOption,
				{
					id: 'delay',
					type: 'number',
					label: 'Delay',
					default: 0,
					min: 0,
					max: 200,
					range: true,
					step: 1,
					asInteger: false,
					clampValues: true,
					description: 'Value in ms',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const inputIdx = Math.floor(event.options.input - 1)
				const args: OSCMetaArgument = { type: 'f', value: event.options.delay }
				await self.sendMessage(OscPaths.Monitoring.Input.Delay(inputIdx), args)
			},
		},
		[ActionId.MonitoringOutputLevel]: {
			name: 'Monitoring - Output Level',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				{
					id: 'level',
					type: 'number',
					label: 'Level',
					default: 0,
					min: -24,
					max: 12,
					range: true,
					step: 0.1,
					asInteger: false,
					clampValues: true,
					description: 'Value in dB',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const args: OSCMetaArgument = { type: 'f', value: event.options.level }
				await self.sendMessage(OscPaths.Monitoring.Output.Level(outputIdx, speakerIdx), args)
			},
		},
		[ActionId.MonitoringOutputPolarity]: {
			name: 'Monitoring - Output Polarity',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				{
					id: 'polarity',
					type: 'checkbox',
					label: 'Polarity',
					default: false,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const args: OSCMetaArgument = { type: 's', value: String(event.options.polarity) }
				await self.sendMessage(OscPaths.Monitoring.Output.Polarity(outputIdx, speakerIdx), args)
			},
		},
		[ActionId.MonitoringOutputType]: {
			name: 'Monitoring - Output Speaker Type',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				{
					id: 'type',
					type: 'dropdown',
					label: 'Speaker Type',
					choices: [
						{ id: 'full_range', label: 'Full Range Speaker' },
						{ id: 'bass_managed', label: 'Bass Managed Speaker' },
					],
					default: 'full_range',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const value = event.options.type === 'bass_managed' ? 1 : 0
				const args: OSCMetaArgument = { type: 'i', value }
				await self.sendMessage(OscPaths.Monitoring.Output.Type(outputIdx, speakerIdx), args)
			},
		},
		[ActionId.MonitoringOutputBassManagementWeighting]: {
			name: 'Monitoring - Output Bass Management Weighting',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				{
					id: 'weighting',
					type: 'number',
					label: 'Bass Management Weighting',
					default: 0,
					min: -24,
					max: 12,
					range: true,
					step: 0.1,
					asInteger: false,
					clampValues: true,
					description: 'Value in dB',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const args: OSCMetaArgument = { type: 'f', value: event.options.weighting }
				await self.sendMessage(OscPaths.Monitoring.Output.BassManagementWeighting(outputIdx, speakerIdx), args)
			},
		},
		[ActionId.MonitoringOutputDelay]: {
			name: 'Monitoring - Output Delay',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				{
					id: 'delay',
					type: 'number',
					label: 'Delay',
					default: 0,
					min: 0,
					max: 200,
					range: true,
					step: 1,
					asInteger: false,
					clampValues: true,
					description: 'Value in ms',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const args: OSCMetaArgument = { type: 'f', value: event.options.delay }
				await self.sendMessage(OscPaths.Monitoring.Output.Delay(outputIdx, speakerIdx), args)
			},
		},
		[ActionId.MonitoringOutputEqEnable]: {
			name: 'Monitoring - Output EQ Enable',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable EQ',
					default: false,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const args: OSCMetaArgument = { type: 's', value: String(event.options.enable) }
				await self.sendMessage(OscPaths.Monitoring.Output.Eq.Enable(outputIdx, speakerIdx), args)
			},
		},
		[ActionId.MonitoringOutputEqBandActive]: {
			name: 'Monitoring - Output EQ Band Active',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				MonitoringBandIndexOption,
				{
					id: 'active',
					type: 'checkbox',
					label: 'Active',
					default: false,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const bandIdx = Math.floor(event.options.band - 1)
				const args: OSCMetaArgument = { type: 's', value: String(event.options.active) }
				await self.sendMessage(OscPaths.Monitoring.Output.Eq.BandActive(outputIdx, speakerIdx, bandIdx), args)
			},
		},
		[ActionId.MonitoringOutputEqBandType]: {
			name: 'Monitoring - Output EQ Band Filter Type',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				MonitoringBandIndexOption,
				{
					id: 'filterType',
					type: 'dropdown',
					label: 'Filter Type',
					choices: FilterTypeChoices.map((choice) => ({ ...choice })),
					default: 'peak',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const bandIdx = Math.floor(event.options.band - 1)
				const value = FilterTypeChoices.findIndex((choice) => choice.id === event.options.filterType)
				const args: OSCMetaArgument = { type: 'i', value }
				await self.sendMessage(OscPaths.Monitoring.Output.Eq.BandType(outputIdx, speakerIdx, bandIdx), args)
			},
		},
		[ActionId.MonitoringOutputEqBandFrequency]: {
			name: 'Monitoring - Output EQ Band Frequency',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				MonitoringBandIndexOption,
				{
					id: 'frequency',
					type: 'number',
					label: 'Frequency',
					default: 1000,
					min: 1,
					max: 20000,
					range: true,
					step: 1,
					asInteger: false,
					clampValues: true,
					description: 'Corner frequency in Hz',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const bandIdx = Math.floor(event.options.band - 1)
				const args: OSCMetaArgument = { type: 'f', value: event.options.frequency }
				await self.sendMessage(OscPaths.Monitoring.Output.Eq.BandFrequency(outputIdx, speakerIdx, bandIdx), args)
			},
		},
		[ActionId.MonitoringOutputEqBandGain]: {
			name: 'Monitoring - Output EQ Band Gain',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				MonitoringBandIndexOption,
				{
					id: 'gain',
					type: 'number',
					label: 'Gain',
					default: 0,
					min: -18,
					max: 18,
					range: true,
					step: 0.1,
					asInteger: false,
					clampValues: true,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const bandIdx = Math.floor(event.options.band - 1)
				const args: OSCMetaArgument = { type: 'f', value: event.options.gain }
				await self.sendMessage(OscPaths.Monitoring.Output.Eq.BandGain(outputIdx, speakerIdx, bandIdx), args)
			},
		},
		[ActionId.MonitoringOutputEqBandQ]: {
			name: 'Monitoring - Output EQ Band Q',
			options: [
				MonitoringOutputIndexOption,
				MonitoringSpeakerIndexOption,
				MonitoringBandIndexOption,
				{
					id: 'q',
					type: 'number',
					label: 'Q Factor',
					default: 1,
					min: 0.1,
					max: 10,
					range: true,
					step: 0.1,
					asInteger: false,
					clampValues: true,
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const outputIdx = Math.floor(event.options.output - 1)
				const speakerIdx = Math.floor(event.options.speaker - 1)
				const bandIdx = Math.floor(event.options.band - 1)
				const args: OSCMetaArgument = { type: 'f', value: event.options.q }
				await self.sendMessage(OscPaths.Monitoring.Output.Eq.BandQ(outputIdx, speakerIdx, bandIdx), args)
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
				UnsupportedFirmwareInfoOption,
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
		[ActionId.TalkbackSetVolume]: {
			name: 'Talkback - Volume',
			options: [
				ApplicationIdOption,
				ApplicationIdPlaceholderOption,
				AllApplicationsOption,
				{
					id: 'info',
					type: 'static-text',
					label: 'Info',
					value:
						'No settable value is documented for this command - sending it without an argument requests the current volume in the feedback response. Minimum supported firmware v2.2',
					disableAutoExpression: true,
				},
			],
			callback: async (event, _context) => {
				const appId = event.options.all ? 'all' : Math.floor(event.options.appId)
				await self.sendMessage(OscPaths.Talkback.SetVolume(appId), [])
			},
		},
		[ActionId.TalkbackInRouting]: {
			name: 'Talkback - Input Routing',
			options: [
				ApplicationIdOption,
				ApplicationIdPlaceholderOption,
				AllApplicationsOption,
				RoutingOption,
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const appId = event.options.all ? 'all' : Math.floor(event.options.appId)
				await self.sendMessage(OscPaths.Talkback.InRouting(appId), buildRoutingArgs(event.options.routing))
			},
		},
		[ActionId.TalkbackOutRouting]: {
			name: 'Talkback - Output Routing',
			options: [
				ApplicationIdOption,
				ApplicationIdPlaceholderOption,
				AllApplicationsOption,
				RoutingOption,
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const appId = event.options.all ? 'all' : Math.floor(event.options.appId)
				await self.sendMessage(OscPaths.Talkback.OutRouting(appId), buildRoutingArgs(event.options.routing))
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
		[ActionId.DevicePhonesGain]: {
			name: 'Device - Headphones Gain',
			options: [
				{
					id: 'gain',
					type: 'number',
					label: 'Headphones Level',
					default: 0,
					min: -60,
					max: 20,
					range: true,
					step: 0.1,
					asInteger: false,
					clampValues: true,
					description: 'Value in dB',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 'f', value: event.options.gain }
				await self.sendMessage(OscPaths.Device.PhonesGain(), args)
			},
		},
		[ActionId.DeviceXlrGain]: {
			name: 'Device - XLR Gain',
			options: [
				{
					id: 'gain',
					type: 'number',
					label: 'XLR Gain',
					default: 0,
					min: -8,
					max: 60,
					range: true,
					step: 0.1,
					asInteger: false,
					clampValues: true,
					description: 'Value in dB',
				},
				MinFirmwareInfoOption,
			],
			callback: async (event, _context) => {
				const args: OSCMetaArgument = { type: 'f', value: event.options.gain }
				await self.sendMessage(OscPaths.Device.XlrGain(), args)
			},
		},
	}
	return actions
}
