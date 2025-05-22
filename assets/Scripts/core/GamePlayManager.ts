import { _decorator, Component, director, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('GamePlayManager')
export class GamePlayManager extends Component {
	@property(Node)
	players: Node | null = null

	@property(Node)
	navBackBtn: Node | null = null

	start() {}

	onLoad() {
		this.navBackBtn?.on(Node.EventType.TOUCH_END, this.onClickBackBtn, this)
	}

	protected onClickBackBtn(): void {
		director.loadScene('game-lobby')
	}

	update(deltaTime: number) {}
}
