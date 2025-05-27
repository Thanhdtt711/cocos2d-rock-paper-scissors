import { _decorator, Button, Component, math, Node, tween } from 'cc'
const { ccclass, property } = _decorator

type ModalConfig = {
	/**
	 * @default false
	 */
	showCloseButton?: boolean
}

@ccclass('BaseModal')
export class BaseModal extends Component {
	@property(Button)
	buttonClose: Button | null = null

	protected isVisible: boolean = false
	protected _configs: ModalConfig = {}

	constructor(configs?: ModalConfig) {
		super()
		this._configs = configs
	}

	start() {
		console.log('BaseModal start', this._configs, this.buttonClose)
		if (this.buttonClose) {
			this.buttonClose.interactable = !!this._configs?.showCloseButton
			this.buttonClose.node.active = !!this._configs?.showCloseButton
			this.buttonClose.node.on(
				Node.EventType.TOUCH_END,
				() => {
					this.hide()
				},
				this
			)
		}
	}

	update(deltaTime: number) {}

	public show(): void {
		this.node.active = true
		this.node.scale = math.v3(0, 0, 0)
		const self = this
		tween(this.node)
			.to(
				0.35,
				{ scale: math.v3(1, 1, 1) },
				{
					easing: 'cubicInOut',
					onComplete(target) {
						self.isVisible = true
						self.node.emit('open')
					},
				}
			)
			.start()
	}

	public hide(): void {
		const self = this
		this.node.scale = math.v3(1, 1, 1)
		tween(this.node)
			.to(
				0.35,
				{ scale: math.v3(0, 0, 0) },
				{
					easing: 'cubicInOut',
					onComplete(target) {
						self.node.active = false
						self.isVisible = false
						self.node.emit('close')
					},
				}
			)
			.start()
	}

	public get visible() {
		return this.isVisible
	}
}
