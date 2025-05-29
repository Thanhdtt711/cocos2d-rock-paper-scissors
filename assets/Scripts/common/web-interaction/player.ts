import { User } from '../types/user.type'

export interface PlayerInteraction {
	setAvatar(avatarUrl: string): void
	setUserInfo(data: User): void
}

export class PlayerInteractionImpl implements PlayerInteraction {
	setAvatar(avatarUrl: string) {
		console.log('[Default Interaction]', avatarUrl)
	}
	setUserInfo(data: User) {
		console.log('[Default Interaction]', data)
	}
}
