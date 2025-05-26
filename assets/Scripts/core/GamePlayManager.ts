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
import { PrimaryBtn } from './gameplay/PrimaryBtn'
import { AudioControl } from './AudioControl'
import { ChoiceBtnScript } from './gameplay/ChoiceBtnScript'
import { CountdownController } from './CountdownController'
import { Navigation } from './gameplay/Navigation'
import { RoundResultController } from './gameplay/RoundResultController'
import { Player } from './gameplay/Player'

enum GameState {
	WaitingForPlayers = 'WaitingForPlayers',
	WaitingForChoices = 'WaitingForChoices',
	CommittingChoices = 'CommittingChoices',
	RevealingChoices = 'RevealingChoices',
	WaitingForPayout = 'WaitingForPayout',
	ShowRoundResult = 'ShowRoundResult',
	WaitingForNextRound = 'WaitingForNextRound',
}

@ccclass('GamePlayManager')
export class GamePlayManager extends Component {
	@property({
		type: PrimaryBtn,
		tooltip: 'add primary btn',
	})
	primaryBtn: PrimaryBtn

	@property({
		type: Navigation,
		tooltip: 'add navigation',
	})
	nav: Navigation

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

	@property({
		type: CountdownController,
		tooltip: 'add countdown controller',
	})
	countdownController: CountdownController
	@property({
		type: RoundResultController,
		tooltip: 'add round result controller',
	})
	roundResultController: RoundResultController | null = null

	//
	@property({
		type: Player,
		tooltip: 'add player A',
	})
	playerA: Player
	@property({
		type: Player,
		tooltip: 'add player B',
	})
	playerB: Player

	private _gameState: GameState
	choiceMapper: Record<Choice, Node> = {
		[Choice.None]: null,
		[Choice.Rock]: this.rockBtnNode,
		[Choice.Paper]: this.paperBtnNode,
		[Choice.Scissors]: this.scissorsBtnNode,
	}

	protected start() {}

	protected onEnable() {
		// init event listeners
		this.primaryBtn.node.on(Node.EventType.TOUCH_END, this.onClickPrimaryBtn, this)
		this.initChoiceBtn()

		// init game state
		this.gameState = GameState.WaitingForPlayers
		this.playerA.initData({
			username: 'Player A',
			coinAmount: `100 tADA`,
			avatarUrl: '',
		})
		this.playerB.initData({
			username: 'Player B',
			coinAmount: `120 tADA`,
			avatarUrl: '',
		})
	}

	protected update(deltaTime: number) {}

	protected initChoiceBtn() {
		this.getChoiceBtn(this.rockBtnNode)?.onClick(() => {
			this.onClickChoice(Choice.Rock)
		})
		this.getChoiceBtn(this.paperBtnNode)?.onClick(() => {
			this.onClickChoice(Choice.Paper)
		})
		this.getChoiceBtn(this.scissorsBtnNode)?.onClick(() => {
			this.onClickChoice(Choice.Scissors)
		})
	}

	protected getChoiceBtn(node: Node) {
		const button = node?.getComponent(ChoiceBtnScript)
		if (!button) return null
		return button
	}

	protected setChoiceBtnInteractive([rockI, paperI, scissorsI]: boolean[]) {
		this.getChoiceBtn(this.rockBtnNode).interactable = rockI
		this.getChoiceBtn(this.paperBtnNode).interactable = paperI
		this.getChoiceBtn(this.scissorsBtnNode).interactable = scissorsI
	}

	protected onClickPrimaryBtn(): void {
		console.log('Click Ready Btn')
		if (this.primaryBtn.type === 'READY') {
			this.clip.onAudioQueue(3) // button click
			this.primaryBtn.interactable = false
			this.nav.interactable = false
			this.playerA.ready()
			this.waitAllPlayersReady()

			// Mock:
			// Player B ready after 5s
			// TODO: Remove this
			console.log('Player B ready after 3s')
			setTimeout(() => {
				this.playerB.ready()
			}, 3000)
		} else if (this.primaryBtn.type === 'CONFIRM') {
			this.clip.onAudioQueue(3) // button click
			this.gameState = GameState.CommittingChoices
		}
	}

	get gameState() {
		return this._gameState
	}
	set gameState(value: GameState) {
		this._gameState = value
		this.handleGameStateChange()
	}

	protected handleGameStateChange() {
		console.log('Game state change', this.gameState)
		switch (this.gameState) {
			case GameState.WaitingForPlayers: {
				this.primaryBtn.interactable = true
				this.primaryBtn.setType('READY')
				this.countdownController.hide()
				this.countdownController.stopCountdown()
				this.roundResultController.hide()
				this.setChoiceBtnInteractive([false, false, false])
				this.nav.interactable = true
				break
			}
			case GameState.WaitingForChoices: {
				this.primaryBtn.interactable = false
				this.primaryBtn.setType('CONFIRM')
				this.setChoiceBtnInteractive([true, true, true])
				this.onClickChoice(this.playerA.makeRandomChoice())
				this.countdownController.show()
				this.countdownController.setTime(5)
				this.countdownController.startCoundown(() => {
					// when countdown finish
					this.onCountdownFinished()
				})
				this.nav.interactable = false
				break
			}
			case GameState.CommittingChoices: {
				this.setChoiceBtnInteractive([false, false, false])
				break
			}
			case GameState.RevealingChoices:
				break
			case GameState.WaitingForPayout:
				break
			case GameState.ShowRoundResult: {
				this.countdownController.hide()
				this.primaryBtn.interactable = false
				this.nav.interactable = false
				this.roundResultController.hide()
				this.setChoiceBtnInteractive([false, false, false])

				if (this.playerA.choice !== Choice.None && this.playerB.choice !== Choice.None) {
					let result: 'WIN' | 'LOSE' | 'DRAW' = 'WIN'
					if (this.playerA.choice === this.playerB.choice) {
						result = 'DRAW'
					} else if (
						(this.playerA.choice === Choice.Rock && this.playerB.choice === Choice.Paper) ||
						(this.playerA.choice === Choice.Paper && this.playerB.choice === Choice.Scissors) ||
						(this.playerA.choice === Choice.Scissors && this.playerB.choice === Choice.Rock)
					) {
						result = 'LOSE'
					} else {
						result = 'WIN'
					}

					this.roundResultController.show({
						playerAChoice: this.playerA.choice,
						playerBChoice: this.playerB.choice,
						status: result,
					})
				}
				break
			}
			case GameState.WaitingForNextRound:
				break
		}
	}

	protected onClickChoice(choice: Choice): void {
		if (!this.playerA.isReady) {
			console.log('Player A not ready')
			return
		}
		if (this.gameState !== GameState.WaitingForChoices) {
			console.log('Not in waiting for choices state')
			return
		}

		this.playerA.setChoice(choice)
		if (choice === Choice.None) return
		else if (choice === Choice.Rock) {
			this.getChoiceBtn(this.rockBtnNode).setSelected(true)
			this.getChoiceBtn(this.paperBtnNode).setSelected(false)
			this.getChoiceBtn(this.scissorsBtnNode).setSelected(false)
		} else if (choice === Choice.Paper) {
			this.getChoiceBtn(this.paperBtnNode).setSelected(true)
			this.getChoiceBtn(this.rockBtnNode).setSelected(false)
			this.getChoiceBtn(this.scissorsBtnNode).setSelected(false)
		} else if (choice === Choice.Scissors) {
			this.getChoiceBtn(this.scissorsBtnNode).setSelected(true)
			this.getChoiceBtn(this.paperBtnNode).setSelected(false)
			this.getChoiceBtn(this.rockBtnNode).setSelected(false)
		}
		this.primaryBtn.interactable = true
	}

	private readyWatcher: any
	protected waitAllPlayersReady() {
		if (!this.readyWatcher) {
			this.readyWatcher = true
			this.schedule(this.checkReadyStatus, 0.1) // Kiểm tra mỗi 0.1 giây
		}
	}
	protected checkReadyStatus() {
		if (this.playerA.isReady && this.playerB.isReady) {
			this.gameState = GameState.WaitingForChoices
			this.unschedule(this.checkReadyStatus)
			this.readyWatcher = null
		}
	}

	protected onCountdownFinished() {
		if (this.playerA.choice === Choice.None) {
			console.log('Player A not choose')
			// Randowm select
			this.onClickChoice(this.playerA.makeRandomChoice())
		}

		// TODO: Mock data for player B, remove this later
		if (this.playerB.choice === Choice.None) {
			console.log('Player B not choose')
			// Randowm select
			this.playerB.setChoice(this.playerB.makeRandomChoice())
			console.log('Player B choice', this.playerB)
		}

		this.gameState = GameState.ShowRoundResult
	}
}
