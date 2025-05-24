import {
	_decorator,
	Button,
	Component,
	director,
	instantiate,
	Node,
	Prefab,
	UIOpacityComponent,
} from 'cc'
const { ccclass, property } = _decorator

import { default as jsSha256 } from 'js-sha256'
import { Choice } from '../common/types/choice.type'
import { ChoiceBtnScript } from './prefabs/ChoiceBtnScript'
import { PrimaryBtnScript } from './gameplay/PrimaryBtnScript'
import { AudioControl } from './AudioControl'

class GamePlayer {
	choice: Choice = Choice.None
	salt: string
	hashedChoice: string
	isRevealed: boolean = false
	isReady: boolean = false

	constructor() {
		// Generate a random salt
		this.salt =
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
	}

	async setChoice(choice: Choice) {
		this.choice = choice
		console.log(jsSha256.sha256)
		this.hashedChoice = jsSha256.sha256.hmac(this.salt, choice.toString())
	}

	revealChoice() {
		this.isRevealed = true
	}

	ready() {
		this.isReady = true
	}
}

enum GameState {
	WaitingForPlayers = 0,
	WaitingForChoices = 1,
	RevealingChoices = 2,
	WaitingForNextRound = 3,
}

@ccclass('GamePlayManager')
export class GamePlayManager extends Component {
	@property(Node)
	players: Node | null = null

	@property(Node)
	navBackBtn: Node | null = null

	@property(Node)
	readyBtn: Node | null = null

	@property(Node)
	uiController: Node | null = null

	@property({
		type: AudioControl,
		tooltip: 'add audio controller',
	})
	public clip: AudioControl

	@property(Node)
	rockBtnNode: Node | null = null
	@property(Node)
	paperBtnNode: Node | null = null
	@property(Node)
	scissorsBtnNode: Node | null = null

	@property(Prefab)
	choiceBtnPrefab: Prefab | null = null

	//
	playerA: GamePlayer = new GamePlayer()
	playerB: GamePlayer = new GamePlayer()
	gameState: GameState = GameState.WaitingForPlayers
	choiceMapper: Record<Choice, Node> = {
		[Choice.None]: null,
		[Choice.Rock]: this.rockBtnNode,
		[Choice.Paper]: this.paperBtnNode,
		[Choice.Scissors]: this.scissorsBtnNode,
	}

	start() {}

	onLoad() {
		this.navBackBtn?.on(Node.EventType.TOUCH_END, this.onClickBackBtn, this)
		this.readyBtn?.on(Node.EventType.TOUCH_END, this.onClickReadyBtn, this)
		this.initChoiceBtn()
	}
	update(deltaTime: number) {}

	protected initChoiceBtn() {
		this.rockBtnNode.on(Node.EventType.TOUCH_END, () => {
			this.onClickChoice(Choice.Rock)
		})
		this.paperBtnNode.on(Node.EventType.TOUCH_END, () => {
			this.onClickChoice(Choice.Paper)
		})
		this.scissorsBtnNode.on(Node.EventType.TOUCH_END, () => {
			this.onClickChoice(Choice.Scissors)
		})
	}

	protected getChoiceBtn(node: Node) {
		const button = node?.getComponentInChildren(Button)
		if (!button) throw new Error('Button not found')
		console.log('>>> / button:', button)
		return button
	}

	protected onClickBackBtn(): void {
		director.loadScene('game-lobby')
	}

	protected onClickReadyBtn(): void {
		console.log('Click Ready Btn')
		this.clip.onAudioQueue(3) // swoosh
		this.playerA.ready()
		this.readyBtn.getComponentInChildren(PrimaryBtnScript)?.setType('CONFIRM')

		this.getChoiceBtn(this.rockBtnNode).interactable = true
		this.getChoiceBtn(this.paperBtnNode).interactable = true
		this.getChoiceBtn(this.scissorsBtnNode).interactable = true
	}

	protected onClickChoice(choice: Choice): void {
		console.log('Player A choice', this.playerA)
		this.playerA.setChoice(choice)
		const selectedNode = this.choiceMapper[choice]
		if (selectedNode) {
			selectedNode.getComponent(UIOpacityComponent).opacity = 255
		}
	}
}
