import type { OSCMetaArgument } from '@companion-module/base'

export function isOSCMetaArgument(arg: unknown): arg is OSCMetaArgument {
	if (typeof arg !== 'object' || arg === null) return false

	const { type, value } = arg as Record<string, unknown>

	switch (type) {
		case 'i':
		case 'f':
			return typeof value === 'number'
		case 's':
			return typeof value === 'string'
		case 'b':
			return value instanceof Uint8Array
		default:
			return false
	}
}

export function assertOSCMetaArgument(arg: unknown): asserts arg is OSCMetaArgument {
	if (typeof arg !== 'object' || arg === null) throw new TypeError(`Expected an object, got ${typeof arg}`)

	const { type, value } = arg as Record<string, unknown>

	switch (type) {
		case 'i':
		case 'f':
			if (typeof value !== 'number')
				throw new TypeError(`Expected value to be a number for type "${type}", got ${typeof value}`)
			break
		case 's':
			if (typeof value !== 'string')
				throw new TypeError(`Expected value to be a string for type "s", got ${typeof value}`)
			break
		case 'b':
			if (!(value instanceof Uint8Array))
				throw new TypeError(`Expected value to be a Uint8Array for type "b", got ${typeof value}`)
			break
		default:
			throw new TypeError(`Unknown OSC type tag: "${type}"`)
	}
}
