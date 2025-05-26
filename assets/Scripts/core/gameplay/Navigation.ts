import { _decorator, Button, Component, director, math, Node, tween } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Navigation')
export class Navigation extends Component {
	@property(Button)
	navBackBtn: Button | null = null

	start() {}

	protected onLoad(): void {
		this.navBackBtn.node.on(Node.EventType.TOUCH_END, this.onClickBackBtn, this)
	}

	update(deltaTime: number) {}

	protected onClickBackBtn(): void {
		console.log('Click Back Btn')
		// director.loadScene('game-lobby')
	}

	public set interactable(value: boolean) {
		if (!this.navBackBtn) return
		this.navBackBtn.interactable = value

		if (value) {
			tween(this.node)
				.to(1, { x: -616, scale: math.v3(1, 1, 1) })
				.start()
		} else {
			tween(this.node)
				.to(1, { x: -616 - 424 - 100, scale: math.v3(0.9, 0.9, 0.9) })
				.start()
		}
	}

	public get interactable() {
		if (!this.navBackBtn) return false
		return this.navBackBtn.interactable
	}
}
