import { _decorator, Button, Color, Component, Label, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('PrimaryButton')
export class PrimaryButton extends Component {
	@property(Label)
	label: Label | null = null

	@property(Button)
	button: Button | null = null

	protected _labelColor = {
		default: new Color('#256605'),
		disabled: new Color('#999999'),
		hovered: new Color('#499722'),
		pressed: new Color('#499722'),
	}

	start() {
		this.node.on(
			Node.EventType.TOUCH_MOVE,
			() => {
				if (this.interactable) {
					this.label.color = this._labelColor.hovered
				}
			},
			this
		)
		this.node.on(
			Node.EventType.TOUCH_END,
			() => {
				if (this.interactable) {
					this.label.color = this._labelColor.pressed
				}
			},
			this
		)
	}

	update(deltaTime: number) {}

	public set interactable(value: boolean) {
		if (value) {
			this.button.interactable = true
			this.label.color = this._labelColor.default
		} else {
			this.button.interactable = false
			this.label.color = this._labelColor.disabled
		}
	}
	public get interactable() {
		return this.button.interactable
	}
}
