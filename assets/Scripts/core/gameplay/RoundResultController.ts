import { _decorator, Component, math, Node, Sprite, SpriteFrame, tween } from 'cc'
import { Choice } from '../../common/types/choice.type'
import { AudioControl } from '../AudioControl'
const { ccclass, property } = _decorator

type ChoiceType = Choice.Rock | Choice.Paper | Choice.Scissors
type ShowOptions = {
	playerAChoice: ChoiceType
	playerBChoice: ChoiceType
	status: 'WIN' | 'LOSE' | 'DRAW'
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

	@property(Node)
	playerAChoiceNode: Node | null = null
	@property(Node)
	playerBChoiceNode: Node | null = null
	@property(Node)
	statusNode: Node | null = null

	@property({
		type: AudioControl,
		tooltip: 'add audio controller',
	})
	public clip: AudioControl

	private _choiceMapper: Record<ChoiceType, { enabled: SpriteFrame; disabled: SpriteFrame }>

	onEnable() {
		this._choiceMapper = {
			[Choice.Rock]: {
				enabled: this.choiceSpriteFrames[0],
				disabled: this.disabledChoiceSpriteFrames[0],
			},
			[Choice.Paper]: {
				enabled: this.choiceSpriteFrames[1],
				disabled: this.disabledChoiceSpriteFrames[1],
			},
			[Choice.Scissors]: {
				enabled: this.choiceSpriteFrames[2],
				disabled: this.disabledChoiceSpriteFrames[2],
			},
		}
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
			this.showChoice(options.playerAChoice, this.playerAChoiceNode, false)
			this.showChoice(options.playerBChoice, this.playerBChoiceNode, true)
		} else if (options.status === 'DRAW') {
			this.clip.onAudioQueue(1) // draw
			this.showChoice(options.playerAChoice, this.playerAChoiceNode, false)
			this.showChoice(options.playerBChoice, this.playerBChoiceNode, false)
		} else {
			this.clip.onAudioQueue(2) // lose
			this.showChoice(options.playerAChoice, this.playerAChoiceNode, true)
			this.showChoice(options.playerBChoice, this.playerBChoiceNode, false)
		}
		this.showStatus(options.status)
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

	protected showChoice(choice: ChoiceType, node: Node | null, isDisabled: boolean = false) {
		if (!node) return
		const sprite = node.getComponent(Sprite)
		if (!sprite) return
		sprite.spriteFrame = this._choiceMapper[choice][isDisabled ? 'disabled' : 'enabled']
	}

	public hide() {
		this.node.active = false
	}
}
