import { _decorator, Button, Color, Component, Label, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('PrimaryButton')
export class PrimaryButton extends Component {
	@property(Label)
	label: Label | null = null

	@property(Button)
	button: Button | null = null

	@property({
		type: Color,
		tooltip: 'default text color',
		group: `Label's color`,
	})
	defaultColor: Color = new Color('#256605')
	@property({
		type: Color,
		tooltip: 'disabled text color',
		group: `Label's color`,
	})
	disabledColor: Color = new Color('#999999')
	@property({
		type: Color,
		tooltip: 'hovered text color',
		group: `Label's color`,
	})
	hoveredColor: Color = new Color('#499722')
	@property({
		type: Color,
		tooltip: 'pressed text color',
		group: `Label's color`,
	})
	pressedColor: Color = new Color('#499722')
	@property({
		type: Color,
		tooltip: 'default outline color',
		group: `Label's outline color`,
	})
	defaultOutlineColor: Color = new Color('#499722')
	@property({
		type: Color,
		tooltip: 'disabled outline color',
		group: `Label's outline color`,
	})
	disabledOutlineColor: Color = new Color('#999999')

	start() {
		this.node.on(
			Node.EventType.TOUCH_MOVE,
			() => {
				if (this.interactable) {
					this.label.color = this.hoveredColor
				}
			},
			this
		)
		this.node.on(
			Node.EventType.TOUCH_END,
			() => {
				if (this.interactable) {
					this.label.color = this.pressedColor
				}
			},
			this
		)
		this.interactable = this.button.interactable
	}

	update(deltaTime: number) {}

	public set interactable(value: boolean) {
		if (value) {
			this.button.interactable = true
			this.label.color = this.defaultColor
			this.label.outlineColor = this.defaultOutlineColor
		} else {
			this.button.interactable = false
			this.label.color = this.disabledColor
			this.label.outlineColor = this.disabledOutlineColor
		}
	}
	public get interactable() {
		return this.button.interactable
	}
}
