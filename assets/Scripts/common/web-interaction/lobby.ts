import { Room } from '../types/room.type'
import { BaseEventDataType, BaseInteraction } from './base'

export class LobbyInteractionImpl extends BaseInteraction {
	constructor() {
		super({
			eventName: 'lobby',
		})

		this.emitter.on(this.eventName, (data: BaseEventDataType) => {
			this.onMessage(data)
		})
	}

	createLobby() {
		console.log('[Default Interaction]')
	}
	joinLobby() {
		console.log('[Default Interaction]')
	}
	setLobbyItems(items: Room[]) {
		console.log('[Default Interaction]', items)
	}
	renderLobbyList() {
		console.log('[Default Interaction]')
	}
	setLoading(isLoading: boolean) {
		console.log('[Default Interaction]', isLoading)
	}
}
