import { _decorator, Color, Component, Label, Node, RichText } from 'cc'
import { Choice } from '../../common/types/choice.type'
import { Avatar } from '../prefabs/Avatar'
import { ChoiceFrame } from '../prefabs/ChoiceFrame'
const { ccclass, property } = _decorator

@ccclass('ResultCard')
export class ResultCard extends Component {
	@property({
		type: Avatar,
		tooltip: 'add avatar',
	})
	avatarNode: Avatar | null = null
	@property(Label)
	message: Label | null = null
	@property(RichText)
	username: RichText | null = null
	@property(RichText)
	walletAddress: RichText | null = null

	@property({
		type: ChoiceFrame,
		tooltip: 'add choice frame',
	})
	choiceFrame: ChoiceFrame | null = null

	player = {
		avatarUrl: '',
		username: '',
		walletAddress: '',
		choice: Choice.None as Choice,
		messageText: '',
	}

	start() {
		// this.choiceFrame?.showChoice(Choice.Paper, false)
	}

	update(deltaTime: number) {}

	init(player: ResultCard['player'], status: 'WIN' | 'LOSE' | 'DRAW') {
		this.player = player
		this.username.string = player.username
		this.walletAddress.string = player.walletAddress
		this.choiceFrame?.showChoice(player.choice, status === 'LOSE')
		this.avatarNode?.setAvatar(player.avatarUrl)

		const color = {
			WIN: new Color('#0E881C'),
			LOSE: new Color('#DD3E0D'),
			DRAW: new Color('#6B2E1B'),
		}
		this.message.color = color[status]
		this.message.string = player.messageText
	}
}
