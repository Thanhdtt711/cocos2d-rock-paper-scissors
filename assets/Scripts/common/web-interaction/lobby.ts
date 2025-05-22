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
		console.log('Create lobby interaction')
	}
	joinLobby() {
		console.log('Join lobby interaction')
	}
	setLobbyItems(items: Room[]) {
		console.log('Set lobby items interaction', items)
	}
	renderLobbyList() {
		console.log('Render lobby list interaction')
	}
	setLoading(isLoading: boolean) {
		console.log('Set loading interaction', isLoading)
	}
}
