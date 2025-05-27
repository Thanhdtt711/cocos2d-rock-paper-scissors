import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc'
import { Choice } from '../../common/types/choice.type'
const { ccclass, property } = _decorator

@ccclass('ChoiceFrame')
export class ChoiceFrame extends Component {
	@property({
		type: [SpriteFrame],
		tooltip: 'add sprite frames: [rock, paper, scissors]',
		max: 3,
		min: 3,
	})
	enabledChoiceSpriteFrames: SpriteFrame[] = []

	@property({
		type: [SpriteFrame],
		tooltip: 'add disabled sprite frames: [rock, paper, scissors]',
		max: 3,
		min: 3,
	})
	disabledChoiceSpriteFrames: SpriteFrame[] = []

	get choiceMapper(): Record<
		Choice,
		{ enabled: SpriteFrame | null; disabled: SpriteFrame | null }
	> {
		return {
			[Choice.None]: {
				enabled: null,
				disabled: null,
			},
			[Choice.Rock]: {
				enabled: this.enabledChoiceSpriteFrames[0],
				disabled: this.disabledChoiceSpriteFrames[0],
			},
			[Choice.Paper]: {
				enabled: this.enabledChoiceSpriteFrames[1],
				disabled: this.disabledChoiceSpriteFrames[1],
			},
			[Choice.Scissors]: {
				enabled: this.enabledChoiceSpriteFrames[2],
				disabled: this.disabledChoiceSpriteFrames[2],
			},
		}
	}

	onEnable() {}

	update(deltaTime: number) {}

	public showChoice(choice: Choice, isDisabled: boolean = false) {
		console.log('show choice', choice, isDisabled, this.choiceMapper)
		if (!this.node) return
		const sprite = this.node.getComponent(Sprite)
		if (!sprite) return
		sprite.spriteFrame = isDisabled
			? this.choiceMapper[choice].disabled
			: this.choiceMapper[choice].enabled
	}
}
