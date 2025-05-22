import {
	_decorator,
	Component,
	resources,
	Sprite,
	SpriteFrame,
	Node,
	assetManager,
	Texture2D,
	ImageAsset,
	RichText,
} from 'cc'
import { GameInteraction } from '../common/web-interaction/index'
import { User } from '../common/types/user.type'
const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends Component {
	@property(Sprite)
	playerAvatar: Sprite | null = null
	@property(RichText)
	username: RichText | null = null
	@property(RichText)
	walletAddress: RichText | null = null
	@property(RichText)
	userCoin: RichText | null = null

	start() {}

	onLoad() {
		this.playerAvatar.node.on(Node.EventType.TOUCH_END, this.onClickAvatar, this)

		new GameInteraction().player.setAvatar = this.setAvatar.bind(this)
		new GameInteraction().player.setUserInfo = this.setUserInfo.bind(this)
	}

	update(deltaTime: number) {}

	protected setAvatar(avatarUrl: string): void {
		assetManager.loadRemote(avatarUrl, (err, imageAsset) => {
			if (err) {
				console.error('Lỗi khi tải avatar:', err)
				return
			}
			if (this.playerAvatar) {
				const spriteFrame = new SpriteFrame()
				const texture = new Texture2D()
				texture.image = imageAsset as ImageAsset
				spriteFrame.texture = texture
				this.playerAvatar.spriteFrame = spriteFrame
			}
		})
	}

	protected onClickAvatar(): void {
		console.log('Click avatar')
		new GameInteraction().player.setAvatar('https://i.pravatar.cc/300')
	}

	protected setUserInfo(data: User): void {
		this.username.string = data.username
		this.walletAddress.string = data.walletAddress
		this.userCoin.string = data.coin.toString()
	}
}
