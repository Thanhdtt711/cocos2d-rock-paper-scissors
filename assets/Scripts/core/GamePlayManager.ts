import { _decorator, Component, director, instantiate, Node, Prefab, UIOpacityComponent } from 'cc'
const { ccclass, property } = _decorator

import { default as jsSha256 } from 'js-sha256'
import { Choice } from '../common/types/choice.type'
import { ChoiceBtnScript } from './prefabs/ChoiceBtnScript'

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

	@property(Node)
	rockBtn: Node | null = null
	@property(Node)
	paperBtn: Node | null = null
	@property(Node)
	scissorsBtn: Node | null = null

	@property(Prefab)
	testChoiceBtnPrefab: Prefab | null = null

	//
	playerA: GamePlayer = new GamePlayer()
	playerB: GamePlayer = new GamePlayer()
	gameState: GameState = GameState.WaitingForPlayers
	choiceMapper: Record<Choice, Node> = {
		[Choice.None]: null,
		[Choice.Rock]: this.rockBtn,
		[Choice.Paper]: this.paperBtn,
		[Choice.Scissors]: this.scissorsBtn,
	}

	start() {}

	onLoad() {
		this.navBackBtn?.on(Node.EventType.TOUCH_END, this.onClickBackBtn, this)
		this.readyBtn?.on(Node.EventType.TOUCH_END, this.onClickReadyBtn, this)
		this.rockBtn?.on(Node.EventType.TOUCH_END, () => this.onClickChoice(Choice.Rock), this)
		this.paperBtn?.on(Node.EventType.TOUCH_END, () => this.onClickChoice(Choice.Paper), this)
		this.scissorsBtn?.on(Node.EventType.TOUCH_END, () => this.onClickChoice(Choice.Scissors), this)

		// const testChoiceBtn = instantiate(this.testChoiceBtnPrefab)
		// console.log('>>> / testChoiceBtn:', testChoiceBtn)

		// testChoiceBtn.setPosition(0, 0, 0)
		// this.uiController?.addChild(testChoiceBtn)
		// testChoiceBtn?.getComponentInChildren(ChoiceBtnScript)?.setType(Choice.Rock)
		// console.log(testChoiceBtn?.getComponentInChildren(ChoiceBtnScript))
	}
	update(deltaTime: number) {}

	protected onClickBackBtn(): void {
		director.loadScene('game-lobby')
	}

	protected onClickReadyBtn(): void {
		this.playerA.ready()
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
