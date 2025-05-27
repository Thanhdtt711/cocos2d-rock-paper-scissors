import { _decorator, Component, math, Node, Sprite, SpriteFrame, tween } from 'cc'
import { Choice } from '../../common/types/choice.type'
import { AudioControl } from '../AudioControl'
import { ModalResult } from './ModalResult'
import { ResultCard } from './ResultCard'
import { ChoiceFrame } from '../prefabs/ChoiceFrame'
import { Player } from './Player'
const { ccclass, property } = _decorator

type ChoiceType = Choice.Rock | Choice.Paper | Choice.Scissors
type ShowOptions = {
	playerA: Player
	playerB: Player
	status: 'WIN' | 'LOSE' | 'DRAW'
	betAmount: number
	betUnitSymbol: string
}

@ccclass('RoundResultController')
export class RoundResultController extends Component {
	@property({
		type: [SpriteFrame],
		tooltip: 'add sprite frames: [rock, paper, scissors]',
		max: 3,
		min: 3,
	})
	choiceSpriteFrames: SpriteFrame[] = []

	@property({
		type: [SpriteFrame],
		tooltip: 'add sprite frames: [rock, paper, scissors]',
		max: 3,
		min: 3,
	})
	disabledChoiceSpriteFrames: SpriteFrame[] = []

	@property(SpriteFrame)
	winSpriteFrame: SpriteFrame
	@property(SpriteFrame)
	loseSpriteFrame: SpriteFrame
	@property(SpriteFrame)
	drawSpriteFrame: SpriteFrame

	@property({
		type: ChoiceFrame,
		tooltip: 'add choice frame for player A',
	})
	playerAChoiceFrame: ChoiceFrame | null = null
	@property({
		type: ChoiceFrame,
		tooltip: 'add choice frame for player B',
	})
	playerBChoiceFrame: ChoiceFrame | null = null
	@property(Node)
	statusNode: Node | null = null

	@property({
		type: ModalResult,
		tooltip: 'add modal result node',
	})
	modalResult: ModalResult | null = null

	@property({
		type: ResultCard,
		tooltip: 'add card player A node',
	})
	cardPlayerA: ResultCard | null = null
	@property({
		type: ResultCard,
		tooltip: 'add card player B node',
	})
	cardPlayerB: ResultCard | null = null

	@property({
		type: AudioControl,
		tooltip: 'add audio controller',
	})
	public clip: AudioControl

	onEnable() {
		this.modalResult && (this.modalResult.node.active = false)
		this.modalResult?.node.on('replay', () => {
			this.node.emit('replay')
		})
	}

	update(deltaTime: number) {}

	public show(options: ShowOptions) {
		this.node.active = true
		this.node.scale = math.v3(0, 0, 0)
		tween(this.node)
			.to(0.35, { scale: math.v3(1, 1, 1) }, { easing: 'cubicInOut' })
			.start()
		if (options.status === 'WIN') {
			this.clip.onAudioQueue(0) // win
			this.playerAChoiceFrame.showChoice(options.playerA.choice, false)
			this.playerBChoiceFrame.showChoice(options.playerB.choice, true)
		} else if (options.status === 'DRAW') {
			this.clip.onAudioQueue(1) // draw
			this.playerAChoiceFrame.showChoice(options.playerA.choice, false)
			this.playerBChoiceFrame.showChoice(options.playerB.choice, false)
		} else {
			this.clip.onAudioQueue(2) // lose
			this.playerAChoiceFrame.showChoice(options.playerA.choice, true)
			this.playerBChoiceFrame.showChoice(options.playerB.choice, false)
		}
		this.showStatus(options.status)

		// Example: win => 'win 5 tADA'
		// Example: lose => 'lose 5 tADA'
		// Example: draw => 'draw'
		const betAmountMsg = `${options.betAmount} ${options.betUnitSymbol}`
		const msgA =
			options.status === 'DRAW' ? 'draw' : options.status.toLowerCase() + ' ' + betAmountMsg
		const msgB =
			options.status === 'WIN'
				? 'lose ' + betAmountMsg
				: options.status === 'LOSE'
				? 'win ' + betAmountMsg
				: 'draw'
		this.cardPlayerA?.init(
			{
				username: options.playerA.userInfo.username,
				walletAddress: options.playerA.userInfo.walletAddress,
				choice: options.playerA.choice,
				messageText: `${msgA}`,
				avatarUrl: options.playerA.userInfo.avatar,
			},
			options.status
		)
		this.cardPlayerB?.init(
			{
				username: options.playerB.userInfo.username,
				walletAddress: options.playerB.userInfo.walletAddress,
				choice: options.playerB.choice,
				messageText: `${msgB}`,
				avatarUrl: options.playerB.userInfo.avatar,
			},
			options.status === 'WIN' ? 'LOSE' : options.status === 'LOSE' ? 'WIN' : 'DRAW'
		)
		setTimeout(() => {
			this.modalResult.show()
		}, 3000)
		//==========================================================================================
	}

	protected showStatus(status: ShowOptions['status']) {
		if (!this.statusNode) return
		const sprite = this.statusNode.getComponent(Sprite)
		if (!sprite) return
		if (status === 'WIN') {
			sprite.spriteFrame = this.winSpriteFrame
		} else if (status === 'DRAW') {
			sprite.spriteFrame = this.drawSpriteFrame
		} else {
			sprite.spriteFrame = this.loseSpriteFrame
		}
	}

	public hide() {
		this.node.active = false
	}
}
