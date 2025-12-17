export const OscPaths = {
	Preset: { Recall: (): string => 'preset/recall' },
	Metering: {
		Start: (appId: number | 'all'): string => `metering/${appId}/start`,
		Stop: (appId: number | 'all'): string => `metering/${appId}/stop`,
		Reset: (appId: number | 'all'): string => `metering/${appId}/reset`,
	},
	Monitoring: {
		SetVolume: (): string => 'monitoring/volume',
		RecallReferenceVolume: (): string => 'monitoring/reference',
		Dim: (): string => 'monitoring/dim',
		Mute: (): string => 'monitoring/mute',
		EnableHeadphones: (): string => 'monitoring/phones',
		SelectInput: (): string => 'monitoring/input',
		SelectOutput: (): string => 'monitoring/output',
	},
	Talkback: {
		SetMicGain: (appId: number | 'all'): string => `talkback/${appId}/gain`,
		Enable: (appId: number | 'all'): string => `talkback/${appId}/active`,
	},
	Device: {
		PhantomPower: (): string => 'device/phantom',
	},
}
