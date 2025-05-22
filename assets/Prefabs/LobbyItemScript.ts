import { _decorator, Component, Node, RichText, UIOpacity, UITransform } from 'cc'
import { Room } from '../Scripts/common/types/room.type'
import { formatString } from '../Scripts/common/utils/useFormat'
const { ccclass, property } = _decorator

@ccclass('LobbyItemScript')
export class LobbyItemScript extends Component {
	@property(Node)
	lockedIcon: Node | null = null

	@property(RichText)
	lobbyShowedName: RichText | null = null

	@property(RichText)
	lobbyBetAmountText: RichText | null = null

	// Internal data
	roomData: Room | null = null

	start() {
		// this.lockedIcon && (this.lockedIcon.active = false)
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
}
