import { director, game } from 'cc'

export class BackgroundRunner {
	private static isRunning: boolean = false
	private static updateInterval: number = null
	private static lastTime: number = 0
	private static updateCallback: (dt: number) => void = null

	// Khởi tạo chạy nền
	public static enableBackgroundRunning(updateCallback: (dt: number) => void): void {
		if (this.isRunning) return

		this.isRunning = true
		this.updateCallback = updateCallback

		// Ghi đè hành vi tạm dừng của Cocos2d-js
		game.pause = () => {
			console.log('Game pause prevented')
		}
		game.resume = () => {
			console.log('Game resume triggered')
			// Đảm bảo scheduler được kích hoạt lại
			director.getScheduler().resumeTarget(director.getScheduler())
		}

		// Sử dụng performance.now() để tính thời gian chính xác hơn
		this.lastTime = performance.now()
		this.updateInterval = window.setInterval(() => {
			const currentTime = performance.now()
			const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1) // Giới hạn dt để tránh nhảy thời gian lớn
			this.lastTime = currentTime

			if (this.updateCallback) {
				this.updateCallback(dt)
			}
		}, 1000 / 60) // 60 FPS

		// Xử lý sự kiện focus/blur
		window.addEventListener('focus', () => {
			console.log('Tab focused, syncing time')
			this.lastTime = performance.now() // Đồng bộ thời gian khi focus lại
			game.resume()
		})

		window.addEventListener('blur', () => {
			console.log('Tab blurred, keeping game running')
		})
	}

	// Tắt chạy nền
	public static disableBackgroundRunning(): void {
		if (!this.isRunning) return

		this.isRunning = false
		if (this.updateInterval) {
			window.clearInterval(this.updateInterval)
			this.updateInterval = null
		}
		this.updateCallback = null

		// Khôi phục hành vi mặc định
		game.pause = () => director.pause()
		game.resume = () => director.resume()

		window.removeEventListener('focus', () => {})
		window.removeEventListener('blur', () => {})
	}
}
