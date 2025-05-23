import { _decorator, Component, Node, resources, Sprite, SpriteFrame } from 'cc'
import { Choice } from '../../common/types/choice.type'
const { ccclass, property } = _decorator

@ccclass('ChoiceBtnScript')
export class ChoiceBtnScript extends Component {
	@property(Node)
	button: Node | null = null

	isDisabled: boolean = false
	type: Choice = Choice.None

	sprites: Record<Choice, { enabled: string; disabled: string }> = {
		[Choice.None]: {
			enabled: 'res/Textures/game-play/main-controller/rock-btn-active.png',
			disabled: 'res/Textures/game-play/main-controller/rock-btn-disabled.png',
		},
		[Choice.Rock]: {
			enabled: 'res/Textures/game-play/main-controller/rock-btn-active.png',
			disabled: 'res/Textures/game-play/main-controller/rock-btn-disabled.png',
		},
		[Choice.Paper]: {
			enabled: null,
			disabled: null,
		},
		[Choice.Scissors]: {
			enabled: null,
			disabled: null,
		},
	}

	start() {}

	onload() {
		console.log('ChoiceBtnScript onload')
		resources.load(
			'res/Textures/game-play/main-controller/rock-btn-disabled.png',
			SpriteFrame,
			(err, spriteFrame) => {
				if (err) {
					console.error('Failed to load sprite frame:', err)

					return
				}
				const sprite = this.button.getComponent(Sprite)
				console.log('>>> / sprite:', sprite)

				if (sprite) {
					sprite.spriteFrame = spriteFrame
				}
			}
		)
	}

	update(deltaTime: number) {}

	setType(type: Choice) {
		this.type = type

		if (type === Choice.Rock) {
			//
		}
	}
}
