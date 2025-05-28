import { _decorator, Button, Component, Node, RichText, UIOpacity, UITransform } from 'cc'
import { Room } from '../../common/types/room.type'
import { formatString } from '../../common/utils/useFormat'
const { ccclass, property } = _decorator

@ccclass('LobbyItem')
export class LobbyItem extends Component {
	@property(Node)
	lockedIcon: Node | null = null

	@property(RichText)
	lobbyShowedName: RichText | null = null

	@property(RichText)
	lobbyBetAmountText: RichText | null = null

	@property(Button)
	joinButton: Button | null = null

	// Internal data
	roomData: Room | null = null

	protected onEnable(): void {
		if (!this.joinButton) {
			return
		}
		this.joinButton.node.on(Node.EventType.TOUCH_END, this.onClickJoinButton, this)
	}

	onLoad() {
		console.log('Lobby Item Script onLoad', this.roomData)
		if (!this.roomData) {
			return
		}
		if (this.roomData.isLocked && this.lockedIcon) {
			this.lockedIcon.active = true
		} else {
			this.lockedIcon.active = false
		}

		// Showed name's max length is 20
		this.lobbyShowedName && (this.lobbyShowedName.string = formatString(this.roomData.name, 20, 0))
		this.lobbyBetAmountText && (this.lobbyBetAmountText.string = this.roomData.betAmount)
	}

	update(deltaTime: number) {}

	protected onClickJoinButton(): void {
		this.node.emit('join-lobby', this.roomData)
	}
}
