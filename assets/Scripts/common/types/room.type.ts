export type Room = {
	name: string
	/**
	 * Text of bet amount
	 * @example '5 tADA'
	 */
	betAmount: string
	requiredPassword: boolean
	isLocked: boolean
	code: string
	roundTimeMillis: number
}
