import { _decorator, Button, Component, Node } from 'cc'
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
	}

	update(deltaTime: number) {}

	public setSelected(value: boolean) {
		if (!this._interactable) return

		this.isSelected = value
		if (!this.effectNode) return
		this.effectNode.active = this.isSelected
		this.audioControl.onAudioQueue(3) // swoosh
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
