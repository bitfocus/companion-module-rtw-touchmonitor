export const OscPaths = {
	Preset: { Recall: (): string => '/preset/recall' },
	Metering: {
		Start: (appId: number | 'all'): string => `/metering/${appId}/start`,
		Stop: (appId: number | 'all'): string => `/metering/${appId}/stop`,
		Reset: (appId: number | 'all'): string => `/metering/${appId}/reset`,
		InRouting: (appId: number | 'all'): string => `/metering/${appId}/in_routing`,
		OutRouting: (appId: number | 'all'): string => `/metering/${appId}/out_routing`,
	},
	Monitoring: {
		SetVolume: (): string => '/monitoring/volume',
		RecallReferenceVolume: (): string => '/monitoring/reference',
		Dim: (): string => '/monitoring/dim',
		Mute: (): string => '/monitoring/mute',
		EnableHeadphones: (): string => '/monitoring/phones',
		SelectInput: (): string => '/monitoring/input',
		SelectOutput: (): string => '/monitoring/output',
		Downmix: (): string => '/monitoring/downmix',
		SurroundAttenuation: (): string => '/monitoring/surr_att',
		LfBoost: (): string => '/monitoring/lf_boost',
		Mono: (): string => '/monitoring/mono',
		InRouting: (): string => '/monitoring/in_routing',
		OutRouting: (): string => '/monitoring/out_routing',
		Input: {
			Trim: (inputIdx: number): string => `/monitoring/in/${inputIdx}/trim`,
			Mute: (inputIdx: number): string => `/monitoring/in/${inputIdx}/mute`,
			Delay: (inputIdx: number): string => `/monitoring/in/${inputIdx}/delay`,
		},
		Output: {
			Level: (outputIdx: number, speakerIdx: number): string => `/monitoring/out/${outputIdx}/${speakerIdx}/level`,
			Polarity: (outputIdx: number, speakerIdx: number): string =>
				`/monitoring/out/${outputIdx}/${speakerIdx}/polarity`,
			Type: (outputIdx: number, speakerIdx: number): string => `/monitoring/out/${outputIdx}/${speakerIdx}/type`,
			BassManagementWeighting: (outputIdx: number, speakerIdx: number): string =>
				`/monitoring/out/${outputIdx}/${speakerIdx}/bm_weighting`,
			Delay: (outputIdx: number, speakerIdx: number): string => `/monitoring/out/${outputIdx}/${speakerIdx}/delay`,
			Eq: {
				Enable: (outputIdx: number, speakerIdx: number): string =>
					`/monitoring/out/${outputIdx}/${speakerIdx}/eq/enable`,
				BandActive: (outputIdx: number, speakerIdx: number, bandIdx: number): string =>
					`/monitoring/out/${outputIdx}/${speakerIdx}/eq/${bandIdx}/active`,
				BandType: (outputIdx: number, speakerIdx: number, bandIdx: number): string =>
					`/monitoring/out/${outputIdx}/${speakerIdx}/eq/${bandIdx}/type`,
				BandFrequency: (outputIdx: number, speakerIdx: number, bandIdx: number): string =>
					`/monitoring/out/${outputIdx}/${speakerIdx}/eq/${bandIdx}/frequency`,
				BandGain: (outputIdx: number, speakerIdx: number, bandIdx: number): string =>
					`/monitoring/out/${outputIdx}/${speakerIdx}/eq/${bandIdx}/gain`,
				BandQ: (outputIdx: number, speakerIdx: number, bandIdx: number): string =>
					`/monitoring/out/${outputIdx}/${speakerIdx}/eq/${bandIdx}/q`,
			},
		},
	},
	Talkback: {
		SetMicGain: (appId: number | 'all'): string => `/talkback/${appId}/gain`,
		Enable: (appId: number | 'all'): string => `/talkback/${appId}/active`,
		SetVolume: (appId: number | 'all'): string => `/talkback/${appId}/volume`,
		InRouting: (appId: number | 'all'): string => `/talkback/${appId}/in_routing`,
		OutRouting: (appId: number | 'all'): string => `/talkback/${appId}/out_routing`,
	},
	Device: {
		PhantomPower: (): string => '/device/phantom',
		PhonesGain: (): string => '/device/phones_gain',
		XlrGain: (): string => '/device/xlr_gain',
	},
}
