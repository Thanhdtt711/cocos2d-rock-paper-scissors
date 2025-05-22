import { sys } from 'cc'
import { LobbyInteractionImpl } from './lobby'
import { PlayerInteraction, PlayerInteractionImpl } from './player'

type InteractionInstance = {
	lobby: LobbyInteractionImpl
	player: PlayerInteraction
}

export type InstanceType = PlayerInteraction | LobbyInteractionImpl | null

export class GameInteraction implements InteractionInstance {
	static getInstance(key: keyof InteractionInstance): InstanceType {
		if (key === 'player') {
			if (!(window as any).player) {
				;(window as any).player = new PlayerInteractionImpl()
			}
			return sys.isBrowser ? (window as any).player : null
		} else if (key === 'lobby') {
			if (!(window as any).lobby) {
				;(window as any).lobby = new LobbyInteractionImpl()
			}
			return sys.isBrowser ? (window as any).lobby : null
		}
		return null
	}

	public get player() {
		return GameInteraction.getInstance('player') as PlayerInteraction
	}

	public get lobby() {
		return GameInteraction.getInstance('lobby') as LobbyInteractionImpl
	}
}
