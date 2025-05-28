import { _decorator, Button, Component, math, Node, tween } from 'cc'
import { AudioControl } from '../AudioControl'
const { ccclass, property } = _decorator

@ccclass('ChoiceBtnScript')
export class ChoiceBtnScript extends Component {
	@property(Button)
	button: Button | null = null

	@property(Node)
	effectNode: Node | null = null
	@property({
		type: AudioControl,
		tooltip: 'add audio controller',
	})
	public audioControl: AudioControl

	isSelected: boolean = false
	private _interactable: boolean = true
	private _onClickCallback: () => void

	start() {}

	onLoad() {
		console.log('onLoad ')
	}

	protected onEnable(): void {
		if (!this.effectNode) return
		this.effectNode.active = this.isSelected

		this.button?.node?.on(Node.EventType.TOUCH_END, this._onClickCallback, this)
		this.button?.node?.on(
			Node.EventType.MOUSE_ENTER,
			() => {
				// this.button.node.setScale(1.1, 1.1, 1)
				tween(this.button.node)
					.to(0.1, { scale: math.v3(1.1, 1.1, 1.1) })
					.start()
			},
			this
		)
		this.button?.node?.on(
			Node.EventType.MOUSE_LEAVE,
			() => {
				tween(this.button.node)
					.to(0.1, { scale: math.v3(1, 1, 1) })
					.start()
			},
			this
		)
	}

	update(deltaTime: number) {}

	public setSelected(value: boolean) {
		this.isSelected = value
		if (!this.effectNode) return
		this.effectNode.active = this.isSelected
		if (this.isSelected) {
			this.audioControl.onAudioQueue(3) // swoosh
		}
	}

	onClick(cb: () => void) {
		this._onClickCallback = cb
	}

	public set interactable(value: boolean) {
		this._interactable = value
		if (!this.button) return
		this.button.interactable = value
	}
	public get interactable() {
		return this._interactable
	}
}
