import mitt from 'mitt'

type Options = {
	eventName?: string
	customEmitter?: ReturnType<typeof mitt>
}

export type BaseEventDataType = {
	type: string
	data?: unknown
}

export class BaseInteraction {
	public emitter = mitt()
	public options: Options = {
		eventName: 'game-interaction',
	}
	public onMessage: (data: BaseEventDataType) => unknown | Promise<unknown> = async () => {}
	constructor(options?: Options) {
		this.options = options ?? this.options
	}
	get eventName() {
		return this.options.eventName
	}
	public emit(data: BaseEventDataType) {
		this.emitter.emit(this.eventName, data)
	}
}
