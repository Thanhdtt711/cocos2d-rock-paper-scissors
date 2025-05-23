import {
	_decorator,
	Button,
	Component,
	ImageAsset,
	Node,
	resources,
	Sprite,
	SpriteFrame,
	Texture2D,
	UIComponent,
} from 'cc'
import { Choice } from '../../common/types/choice.type'
const { ccclass, property } = _decorator

@ccclass('ChoiceBtnScript')
export class ChoiceBtnScript extends Component {
	@property(Button)
	button: Button | null = null

	isDisabled: boolean = true
	type: Choice = Choice.Rock

	sprites: Record<
		Choice.Rock | Choice.Paper | Choice.Scissors,
		{
			enabled: string
			disabled: string
			enabledSpriteFrame: SpriteFrame | null
			disabledSpriteFrame: SpriteFrame | null
		}
	> = {
		[Choice.Rock]: {
			enabled: 'Textures/game-play/main-controller/rock-btn-active',
			disabled: 'Textures/game-play/main-controller/rock-btn-disabled',
			enabledSpriteFrame: null,
			disabledSpriteFrame: null,
		},
		[Choice.Paper]: {
			enabled: 'Textures/game-play/main-controller/paper-btn-active',
			disabled: 'Textures/game-play/main-controller/paper-btn-disabled',
			enabledSpriteFrame: null,
			disabledSpriteFrame: null,
		},
		[Choice.Scissors]: {
			enabled: 'Textures/game-play/main-controller/scissors-btn-active',
			disabled: 'Textures/game-play/main-controller/scissors-btn-disabled',
			enabledSpriteFrame: null,
			disabledSpriteFrame: null,
		},
	}

	async start() {
		console.log('ChoiceBtnScript start')
		for (const item of Object.entries(this.sprites)) {
			const [key, value] = item
			value.enabledSpriteFrame = await this.loadSprite(value.enabled)
			value.disabledSpriteFrame = await this.loadSprite(value.disabled)
		}
		this.setType(this.type)
	}

	onLoad() {
		console.log('ChoiceBtnScript onLoad', this.sprites)

		this.button?.node?.on(Node.EventType.TOUCH_END, this.onClick, this)
		this.button.transition = Button.Transition.SPRITE
	}

	update(deltaTime: number) {}

	async loadSprite(path: string): Promise<SpriteFrame> {
		return new Promise((resolve, reject) => {
			resources.load(`${path}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
				if (err) {
					reject(err)
					return
				}
				resolve(spriteFrame)
			})
		})
	}

	setType(type: Choice) {
		this.type = type
		if (!this.button) return
		if (this.type === Choice.Rock) {
			// this.button.getComponent(Sprite).spriteFrame = this.sprites[this.type].enabledSpriteFrame
			this.button.normalSprite = this.sprites[this.type].enabledSpriteFrame
			this.button.hoverSprite = this.sprites[this.type].enabledSpriteFrame
			this.button.pressedSprite = this.sprites[this.type].enabledSpriteFrame
			this.button.disabledSprite = this.sprites[this.type].disabledSpriteFrame
		} else if (this.type === Choice.Paper) {
			// this.button.getComponent(Sprite).spriteFrame = this.sprites[this.type].enabledSpriteFrame
			this.button.normalSprite = this.sprites[this.type].enabledSpriteFrame
			this.button.hoverSprite = this.sprites[this.type].enabledSpriteFrame
			this.button.pressedSprite = this.sprites[this.type].enabledSpriteFrame
			this.button.disabledSprite = this.sprites[this.type].disabledSpriteFrame
		} else if (this.type === Choice.Scissors) {
			// this.button.getComponent(Sprite).spriteFrame = this.sprites[this.type].enabledSpriteFrame
			this.button.normalSprite = this.sprites[this.type].enabledSpriteFrame
			this.button.hoverSprite = this.sprites[this.type].enabledSpriteFrame
			this.button.pressedSprite = this.sprites[this.type].enabledSpriteFrame
			this.button.disabledSprite = this.sprites[this.type].disabledSpriteFrame
		}
	}

	setDisabled(isDisabled: boolean) {
		this.isDisabled = isDisabled
		if (!this.button) return
		this.button.enabled = !isDisabled
	}

	onClick() {
		console.log('ChoiceBtnScript onClick')
	}
}
