import {
	_decorator,
	assetManager,
	Component,
	ImageAsset,
	Label,
	Node,
	RichText,
	Sprite,
	SpriteFrame,
	Texture2D,
} from 'cc'
const { ccclass, property } = _decorator

import { Choice } from '../../common/types/choice.type'
import { default as jsSha256 } from 'js-sha256'

@ccclass('Player')
export class Player extends Component {
	@property(RichText)
	usernameText: RichText | null = null
	@property(RichText)
	coinAmountText: RichText | null = null
	@property(Node)
	avatar: Node | null = null
	@property(Label)
	readyLabel: Label | null = null
	@property(SpriteFrame)
	defaultAvatarSpriteFrame: SpriteFrame | null = null

	choice: Choice = Choice.None
	salt: string
	hashedChoice: string
	isRevealed: boolean = false
	isReady: boolean = false

	start() {}

	update(deltaTime: number) {}

	public initData({
		username,
		coinAmount,
		avatarUrl,
	}: {
		username: string
		coinAmount: string
		avatarUrl: string
	}) {
		console.log('Init data', { username, coinAmount, avatarUrl })
		this.usernameText.string = username
		this.coinAmountText.string = coinAmount
		this.setAvatar(avatarUrl)
		this.readyLabel.string = 'Waiting for ready...'
	}

	protected setAvatar(avatarUrl: string): void {
		if (!avatarUrl || avatarUrl === '') {
			this.avatar.getComponent(Sprite).spriteFrame = this.defaultAvatarSpriteFrame
			return
		}
		assetManager.loadRemote(avatarUrl, (err, imageAsset) => {
			if (err) {
				console.error('Lỗi khi tải avatar:', err)
				return
			}
			if (this.avatar) {
				const spriteFrame = new SpriteFrame()
				const texture = new Texture2D()
				texture.image = imageAsset as ImageAsset
				spriteFrame.texture = texture
				this.avatar.getComponent(Sprite).spriteFrame = spriteFrame
			}
		})
	}

	public reset() {
		this.choice = Choice.None
		this.salt = ''
		this.hashedChoice = ''
		this.isRevealed = false
		this.isReady = false
	}

	public setChoice(choice: Choice) {
		this.choice = choice
		this.genSalt()
		this.hashedChoice = jsSha256.sha256.hmac(this.salt, choice.toString())
	}

	public makeRandomChoice() {
		const choices = [Choice.Rock, Choice.Paper, Choice.Scissors]
		const choice = choices[Math.floor(Math.random() * 3)]
		return choice
	}

	get hasMadeChoice() {
		return this.hashedChoice && this.choice !== Choice.None
	}

	protected genSalt() {
		this.salt =
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
	}

	revealChoice() {
		this.isRevealed = true
	}

	ready() {
		this.isReady = true
		this.readyLabel.string = 'Ready'
	}
}
