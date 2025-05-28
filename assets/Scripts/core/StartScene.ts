import {
	_decorator,
	Animation,
	assetManager,
	Component,
	director,
	Label,
	Node,
	ProgressBar,
	resources,
	Toggle,
} from 'cc'
import { add } from 'lodash-es'
import { AudioControl } from './AudioControl'
import { PrimaryButton } from '../UI/buttons/PrimaryButton'
const { ccclass, property } = _decorator

declare const io: any

@ccclass('StartScene')
export class StartScene extends Component {
	@property(PrimaryButton)
	startGameBtn: PrimaryButton | null = null

	@property({
		type: AudioControl,
		tooltip: 'add audio controller',
	})
	public clip: AudioControl

	@property({
		type: ProgressBar,
		tooltip: 'loading progress bar',
	})
	loadingBar: ProgressBar | null = null

	@property({
		type: Label,
		tooltip: 'loading bar label',
	})
	loadingLabel: Label | null = null

	@property({
		type: Toggle,
		tooltip: 'agree term toggle',
	})
	agreeTermToggle: Toggle | null = null

	start() {
		this.startGameBtn?.node.on(Node.EventType.TOUCH_END, this.initGame, this)
		this.agreeTermToggle?.node?.on(Node.EventType.TOUCH_END, this.onClickAgreeTerm, this)
	}

	update(deltaTime: number) {
		// console.log('Update', deltaTime)
		if (this.startGameBtn) {
			this.startGameBtn.interactable = this.isEnableStartBtn
		}
	}

	get isEnableStartBtn() {
		return this.agreeTermToggle?.isChecked && this.loadingBar?.progress === 1
	}

	protected onClickAgreeTerm(): void {
		console.log('Click agree term', this.agreeTermToggle?.isChecked)
	}

	protected onLoad(): void {
		console.log('OnLoad', add(1, 2)) // test lodash
		this.clip.onAudioLoop(0) // background music

		// fetch('https://jsonplaceholder.typicode.com/todos/1')
		// 	.then((response: Response) => {
		// 		return response.json()
		// 	})
		// 	.then((value) => {
		// 		console.log(value)
		// 	})
		// 	.catch((error) => {
		// 		console.log(error)
		// 	})

		// console.log('io', io)
		// const socket = io('http://localhost:3000')
		// socket.on('connect', () => {
		// 	console.log('Connected to server')
		// })
	}
	protected onEnable(): void {
		this.preloadAllAssets()
	}

	protected initGame(): void {
		if (!this.agreeTermToggle?.isChecked) {
			console.log('Please agree to the term')
			return
		}
		if (this.loadingBar.progress !== 1) {
			return
		}
		director.loadScene('game-lobby')
	}

	private preloadAllAssets() {
		// Tải toàn bộ assets trong thư mục resources
		this.loadingBar.progress = 0
		this.loadingLabel.string = 'Loading... 0%'
		resources.loadDir(
			'',
			(loadedAssets, totalAssets, assets) => {
				// Cập nhật tiến trình tải
				const progress = loadedAssets / totalAssets
				this.loadingBar.progress = progress
				this.loadingLabel.string = `Loading... ${Math.floor(progress * 100)}%`
			},
			(error, assets) => {
				if (error) {
					console.error('Failed to preload assets:', error)
					return
				}
				this.loadingLabel.string = 'Click start now to play'
				this.loadingLabel.getComponent(Animation)?.play()
				console.log('Preload done', assets)
			}
		)
	}
}
