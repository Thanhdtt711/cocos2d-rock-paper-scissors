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
		const instanceMapper = {
			player: new PlayerInteractionImpl(),
			lobby: new LobbyInteractionImpl(),
		}
		const instance = instanceMapper[key]
		if (!instance) return null

		if (!(window as any)[key]) {
			;(window as any)[key] = instance
		}
		return sys.isBrowser ? (window as any)[key] : null
	}

	player = GameInteraction.getInstance('player') as PlayerInteraction
	lobby = GameInteraction.getInstance('lobby') as LobbyInteractionImpl
}
