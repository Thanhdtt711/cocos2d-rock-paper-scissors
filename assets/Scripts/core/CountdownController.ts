import { _decorator, Component, Node, Prefab, resources, Sprite, SpriteFrame } from 'cc'
const { ccclass, property } = _decorator

import { default as mitt } from 'mitt'
import { AudioControl } from './AudioControl'

@ccclass('CountdownController')
export class CountdownController extends Component {
	@property(Node)
	NumberLayout: Node | null = null

	@property(Prefab)
	numberPrefab: Prefab | null = null

	@property([SpriteFrame])
	digitFrames: SpriteFrame[] = [] // Gán 10 sprite frame (0-9) trong editor

	@property(Node)
	digitSlot1: Node | null = null
	@property(Node)
	digitSlot2: Node | null = null
	@property(Node)
	digitSlot3: Node | null = null

	@property({
		type: AudioControl,
		tooltip: 'add audio controller',
	})
	public clip: AudioControl

	private _digitSlots: Node[] = []
	private _isRunning: boolean = false
	private _startTime: number = performance.now() // milliseconds
	private _duration: number = 30 // Thời gian đếm ngược ban đầu: seconds
	private _timer: any = null // Biến đếm thời gian
	private _emitter = mitt()
	private _onFinishCb: () => void

	start() {}

	update(deltaTime: number) {}

	public show() {
		this.node.active = true
	}

	public hide() {
		this.node.active = false
	}

	protected onEnable(): void {
		console.log('onEnabled')
		this._digitSlots = [this.digitSlot1, this.digitSlot2, this.digitSlot3]
		this.setTime(30) // Set default time to 30s
	}

	protected onDisable(): void {
		this._emitter.all.clear()
	}

	public setTime(num: number) {
		if (num > 999) {
			console.log('Time is too long, max is 999')
			return
		}
		this._startTime = performance.now()
		this._duration = num
		this.updateDisplay()
	}

	public startCoundown(onfinish?: () => void) {
		if (!this._isRunning) {
			this._isRunning = true
			this.clip.onAudioLoop(4) // loop tictac
			this._startTime = performance.now()
			this.schedule(this.updateTimer, 0.1) // Cập nhật mỗi giây
			this._onFinishCb = onfinish
		}
	}

	protected updateTimer(dt: number): void {
		this.updateDisplay()
	}

	public stopCountdown() {
		this._isRunning = false
		this.clip.onAudioStop()
		this.unschedule(this.updateTimer)
	}

	protected updateDisplay() {
		const elapsed = (performance.now() - this._startTime) / 1000
		const remainingTime = Math.max(0, Math.floor(this._duration - elapsed))
		const timeStr = Math.abs(remainingTime).toFixed(0).toString()
		let countdownText = ''

		if (this._duration < 100) {
			countdownText = timeStr.padStart(2, '0')
			this.digitSlot3.active = false
		} else {
			countdownText = timeStr.padStart(3, '0')
			this.digitSlot3.active = true
		}
		for (let i = 0; i < countdownText.length; i++) {
			const digit = parseInt(countdownText[i])
			const numberNode = this._digitSlots[i]
			if (numberNode) {
				const sprite = numberNode.getComponentInChildren(Sprite)
				if (sprite) {
					sprite.spriteFrame = this.digitFrames[digit]
				}
			}
		}
		if (remainingTime <= 0) {
			this.stopCountdown()
			this._emitter.emit('countdown', { type: 'onCountdownEnd' })
			this._onFinishCb?.()
		}
	}

	public onFinish(cb: () => void) {
		this._onFinishCb = cb
	}

	// Lấy thời gian hiện tại
	public getCurrentTime(): number {
		const elapsed = (performance.now() - this._startTime) / 1000
		return Math.max(0, this._duration - elapsed)
	}
}
