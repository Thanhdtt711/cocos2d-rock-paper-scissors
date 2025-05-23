import {
	_decorator,
	Component,
	director,
	instantiate,
	Node,
	Prefab,
	RichText,
	ScrollView,
	Size,
	UITransform,
} from 'cc'
const { ccclass, property } = _decorator

import { GameInteraction } from '../common/web-interaction'
import { Room } from '../common/types/room.type'
import { LobbyItemScript } from './prefabs/LobbyItemScript'

@ccclass('Lobby')
export class Lobby extends Component {
	@property(Node)
	lobbyCreateBtn: Node | null = null

	@property(Node)
	lobbyTestBtn: Node | null = null

	@property(Node)
	lobbyTabBtn: Node | null = null

	@property(ScrollView)
	lobbyScrollView: ScrollView | null = null

	@property(Prefab)
	lobbyItemPrefab: Prefab | null = null

	@property(RichText)
	loadingText: RichText | null = null

	//
	lobbyItems: Room[] = []
	lobbyInteraction = new GameInteraction().lobby
	isLoading = false

	start() {
		this.lobbyCreateBtn?.on(Node.EventType.TOUCH_END, this.createLobby, this)
		this.lobbyTestBtn?.on(Node.EventType.TOUCH_END, this.onClickTestBtn, this)
		this.lobbyTabBtn?.on(Node.EventType.TOUCH_END, this.onClickLobbyTabBtn, this)
	}

	update(deltaTime: number) {}

	async onLoad() {
		this.lobbyInteraction.renderLobbyList = this.renderLobbyList.bind(this)
		this.lobbyInteraction.setLobbyItems = this.setLobbyItems.bind(this)
		this.lobbyInteraction.setLoading = this.setLoading.bind(this)
		;(window as any).lobby.setLoading(true)
		setTimeout(() => {
			;(window as any).lobby.setLobbyItems([
				{
					name: 'Lobby 1',
					betAmount: '5 tADA',
					requiredPassword: true,
					isLocked: false,
					code: '1234',
					roundTimeMillis: 60000,
				},
				{
					name: 'Lobby 2',
					betAmount: '10 tADA',
					requiredPassword: true,
					isLocked: true,
					code: '5678',
					roundTimeMillis: 60000,
				},
				{
					name: 'Lobby với 1 cái tên cực dài',
					betAmount: '100 t₳',
					requiredPassword: true,
					isLocked: true,
					code: '5678',
					roundTimeMillis: 60000,
				},
			])
			;(window as any).lobby.renderLobbyList()
			;(window as any).lobby.setLoading(false)
		}, 3000)
	}

	protected createLobby(): void {
		console.log('Create Lobby')
	}

	protected joinLobby(): void {
		console.log('Join Lobby')
	}

	renderLobbyList(): void {
		console.log('[Cocos Script] Render Lobby List')
		if (!this.lobbyScrollView || !this.lobbyItemPrefab) {
			return
		}
		// Xóa các node cũ trong content
		const content = this.lobbyScrollView.content
		content.removeAllChildren()

		// W: 197 H: 240
		// Align to grid width 3 items in first row, 4 items in second row
		const itemNum = this.lobbyItems.length + 1
		const itemWidth = 197
		const itemHeight = 240
		const itemPerRow = 4
		const itemSpacing = 24
		for (let i = 0; i < itemNum; i++) {
			if (i == 0) {
				content.addChild(this.lobbyCreateBtn)
				this.lobbyCreateBtn.setPosition(0, 0, 0)
				continue
			}
			const lobbyItem = instantiate(this.lobbyItemPrefab)
			const row = Math.floor(i / itemPerRow)
			const col = i % itemPerRow
			lobbyItem.setPosition(
				col * itemWidth + col * itemSpacing,
				-row * itemHeight - row * itemSpacing,
				0
			)
			this.initLobbyItem(lobbyItem, this.lobbyItems[i - 1])
			content.addChild(lobbyItem)
		}

		const contentHeight =
			itemHeight * Math.ceil(itemNum / itemPerRow) + itemSpacing * Math.ceil(itemNum / itemPerRow)
		content
			.getComponent(UITransform)
			.setContentSize(new Size(content.getComponent(UITransform).width, contentHeight))
	}

	protected setLobbyItems(items: Room[]): void {
		this.lobbyItems = items
	}

	protected setVisibleLobbyList(isVisible: boolean): void {
		if (!this.lobbyScrollView) {
			return
		}
		this.lobbyScrollView.node.active = isVisible
	}

	protected initLobbyItem(node: Node, data: Room): void {
		node.on(
			Node.EventType.TOUCH_END,
			() => {
				console.log('Join Lobby', data)
				director.loadScene('game-play')
			},
			this
		)
		const lobbyItemScript = node.getComponentInChildren(LobbyItemScript)
		if (lobbyItemScript) {
			lobbyItemScript.roomData = data
		}
	}

	protected setLoading(isLoading: boolean): void {
		console.log('[Cocos Script] Set loading', isLoading)
		this.isLoading = isLoading
		if (!this.loadingText) {
			return
		}
		this.setVisibleLobbyList(!isLoading)
		this.loadingText.node.active = isLoading
	}

	protected onClickLobbyTabBtn(): void {
		this.lobbyInteraction.emitter.emit('lobby', { type: 'onClickLobbyTabBtn' })
	}

	protected onClickTestBtn(): void {
		this.lobbyInteraction.emitter.emit('lobby', { type: 'onClickTestBtn' })
	}
}
