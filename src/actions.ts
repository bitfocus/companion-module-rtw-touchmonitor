import type { CompanionActionDefinition, SomeCompanionActionInputField } from '@companion-module/base'
import type { ModuleInstance } from './main.js'
import { OscPaths } from './api.js'

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
} as const satisfies SomeCompanionActionInputField

const ApplicationIdPlaceholderOption = {
	id: 'placeholder',
	type: 'static-text',
	label: 'Application Id',
	value: 'All',
	isVisibleExpression: '$(options:all)',
} as const satisfies SomeCompanionActionInputField

const AllApplicationsOption = {
	id: 'all',
	type: 'checkbox',
	label: 'All Applications',
	default: false,
	tooltip: 'Apply command to all metering applications',
} as const satisfies SomeCompanionActionInputField

const EnableOption = {
	id: 'enable',
	type: 'checkbox',
	label: 'Enable',
	default: false,
} as const satisfies SomeCompanionActionInputField

export function UpdateActions(self: ModuleInstance): void {
	const actions: { [id in ActionId]: CompanionActionDefinition } = {
		[ActionId.RecallPreset]: {
			name: 'Preset - Recall',
			options: [
				{
					id: 'number',
					type: 'number',
					label: 'Preset Number',
					default: 0,
					min: 0,
					max: 0xff,
					isVisibleExpression: '!$(options:byName)',
					range: true,
					step: 1,
					description: 'Default preset is 0',
				},
				{
					id: 'name',
					type: 'textinput',
					label: 'Preset Name',
					default: '',
					useVariables: { local: true },
					isVisibleExpression: '$(options:byName)',
					description: 'Case sensitive',
				},
				{
					id: 'byName',
					type: 'checkbox',
					label: 'Recall by name',
					default: false,
				},
			],
			callback: async (event, _context) => {
				const preset = (event.options.byName ? event.options.name?.toString() : Number(event.options.number)) ?? 0
				const type = event.options.byName ? 's' : 'i'
				await self.sendMessage(OscPaths.Preset.Recall(), preset, type)
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
				},
			],
			callback: async (event, _context) => {
				const appId = event.options.all ? 'all' : Number(event.options.appId)
				let path = ''
				switch (event.options.action) {
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
						return
				}
				await self.sendMessage(path, '')
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
				},
				{
					id: 'placeholder',
					type: 'static-text',
					label: 'Volume',
					value: 'Reference',
					isVisibleExpression: '$(options:ref)',
				},
				{
					id: 'ref',
					type: 'checkbox',
					label: 'Reference Volume',
					default: false,
				},
			],
			callback: async (event, _context) => {
				let path = OscPaths.Monitoring.SetVolume()
				const volume = Number(event.options.volume)
				if (event.options.ref) path = OscPaths.Monitoring.RecallReferenceVolume()
				await self.sendMessage(path, volume, 'f')
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
				await self.sendMessage(OscPaths.Monitoring.Dim(), Boolean(event.options.dim))
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
				await self.sendMessage(OscPaths.Monitoring.Mute(), Boolean(event.options.mute))
			},
		},
		[ActionId.MonitoringHeadphonesEnable]: {
			name: 'Monitoring - Headphones Enable',
			options: [EnableOption],
			callback: async (event, _context) => {
				await self.sendMessage(OscPaths.Monitoring.EnableHeadphones(), Boolean(event.options.enable))
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
					max: 0xff,
					range: true,
					step: 1,
				},
			],
			callback: async (event, _context) => {
				await self.sendMessage(OscPaths.Monitoring.SelectInput(), Math.floor(Number(event.options.input) - 1), 'i')
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
					max: 0xff,
					range: true,
					step: 1,
				},
			],
			callback: async (event, _context) => {
				await self.sendMessage(OscPaths.Monitoring.SelectOutput(), Math.floor(Number(event.options.output) - 1), 'i')
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
				},
			],
			callback: async (event, _context) => {
				await self.sendMessage(
					OscPaths.Talkback.SetMicGain(event.options.all ? 'all' : Number(event.options.appId)),
					Number(event.options.gain),
					'f',
				)
			},
		},
		[ActionId.TalkbackEnable]: {
			name: 'Talkback - Enable',
			options: [ApplicationIdOption, ApplicationIdPlaceholderOption, AllApplicationsOption, EnableOption],
			callback: async (event, _context) => {
				await self.sendMessage(
					OscPaths.Talkback.Enable(event.options.all ? 'all' : Number(event.options.appId)),
					Boolean(event.options.enable).toString(),
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
				await self.sendMessage(OscPaths.Device.PhantomPower(), Boolean(event.options.p48).toString())
			},
		},
	}
	self.setActionDefinitions(actions)
}
