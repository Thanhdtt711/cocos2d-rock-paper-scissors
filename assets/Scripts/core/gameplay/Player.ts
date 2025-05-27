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
import { Avatar } from '../prefabs/Avatar'
import { User } from '../../common/types/user.type'

@ccclass('Player')
export class Player extends Component {
	@property(RichText)
	usernameText: RichText | null = null
	@property(RichText)
	coinAmountText: RichText | null = null
	@property(Avatar)
	avatar: Avatar | null = null
	@property(Label)
	readyLabel: Label | null = null

	userInfo: User = {
		username: '',
		walletAddress: '',
		avatar: '',
		coin: 0,
		coinSymbol: '',
	}

	choice: Choice = Choice.None
	salt: string
	hashedChoice: string
	isRevealed: boolean = false
	isReady: boolean = false

	start() {}

	update(deltaTime: number) {}

	public initData(user: User) {
		const { username, walletAddress, avatar, coin, coinSymbol } = user
		this.userInfo = user
		this.usernameText.string = username
		this.coinAmountText.string = `${coin} ${coinSymbol}`
		this.avatar?.setAvatar(avatar)
		this.readyLabel.string = 'Waiting for ready...'
	}

	public reset() {
		this.choice = Choice.None
		this.salt = ''
		this.hashedChoice = ''
		this.isRevealed = false
		this.isReady = false
		this.readyLabel.string = 'Waiting for ready...'
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
