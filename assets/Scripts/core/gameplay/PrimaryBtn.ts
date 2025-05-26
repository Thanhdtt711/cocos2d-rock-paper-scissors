import {
	_decorator,
	Animation,
	Color,
	Component,
	Label,
	math,
	Node,
	Sprite,
	tween,
	UIOpacity,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('PrimaryBtn')
export class PrimaryBtn extends Component {
	@property(Label)
	label: Label | null = null

	@property(Node)
	effectNode: Node | null = null

	@property(Node)
	ringNode: Node | null = null

	private _type: 'DEFAULT' | 'READY' | 'CONFIRM' = 'DEFAULT'
	private _interactable: boolean = true

	start() {}

	onEnable() {
		// if (!this.effectNode) return
		// tween(this.effectNode)
		// 	.to(15, { scale: math.v3(1.05, 1.05, 1.05), angle: 360 }, { easing: 'linear' })
		// 	.repeatForever()
		// 	.start()
	}
	onDisable() {
		// Dừng tween khi node bị ẩn
		// tween(this.effectNode).stop()
	}

	update(deltaTime: number) {
		//
	}

	public setType(type: typeof this._type) {
		console.log('PrimaryBtnScript setType', type)
		this._type = type
		if (!this.label) return
		if (type === 'DEFAULT') {
			this.label.string = ''
			this.node.getComponent(UIOpacity).opacity = 80
			return
		} else if (type === 'READY') {
			this.label.string = 'READY'
			this.effectNode.getComponent(UIOpacity).opacity = 255
			return
		} else if (type === 'CONFIRM') {
			this.label.string = 'CONFIRM'
			this.effectNode.getComponent(UIOpacity).opacity = 255
			return
		}
	}

	public get type(): Readonly<typeof this._type> {
		return this._type
	}
	public set interactable(isActive: boolean) {
		if (isActive === this._interactable) return // No change, do nothing
		this._interactable = isActive
		if (!this.effectNode) return
		if (isActive) {
			this.node.getComponent(Animation)?.play()
			this.label.getComponent(Animation)?.play()
			this.label.color = new Color('#C5FFF2')
			this.label.outlineColor = new Color('#05624E')

			this.effectNode.getComponent(Sprite).grayscale = false
			this.ringNode.getComponent(Sprite).grayscale = false
		} else {
			this.node.getComponent(Animation)?.stop()
			this.label.getComponent(Animation)?.stop()
			this.label.color = new Color('#D9D9D9')
			this.label.outlineColor = new Color('#777777')
			this.effectNode.getComponent(Sprite).grayscale = true
			this.ringNode.getComponent(Sprite).grayscale = true
		}
	}
	public get interactable() {
		return this._interactable
	}
}
