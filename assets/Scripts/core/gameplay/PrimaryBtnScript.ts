import { _decorator, Component, math, Node, tween } from 'cc'
const { ccclass, property } = _decorator

@ccclass('PrimaryBtnScript')
export class PrimaryBtnScript extends Component {
	@property(Node)
	textReady: Node | null = null

	@property(Node)
	textConfirm: Node | null = null

	@property(Node)
	effectNode: Node | null = null

	_type: 'READY' | 'CONFIRM' = 'READY'

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

	public setType(type: 'READY' | 'CONFIRM') {
		this._type = type
		this.textReady.active = type === 'READY'
		this.textConfirm.active = type === 'CONFIRM'
	}
}
