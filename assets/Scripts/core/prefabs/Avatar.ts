import {
	_decorator,
	assetManager,
	Component,
	ImageAsset,
	Node,
	Sprite,
	SpriteFrame,
	Texture2D,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('Avatar')
export class Avatar extends Component {
	@property(SpriteFrame)
	borderSprite: SpriteFrame | null = null

	@property(SpriteFrame)
	defaultAvatarSprite: SpriteFrame | null = null

	@property(Sprite)
	avatarSprite: Sprite | null = null

	start() {}

	update(deltaTime: number) {}

	public setAvatar(avatarUrl: string): void {
		console.log('Set avatar', avatarUrl)
		if (!avatarUrl || avatarUrl === '') {
			this.avatarSprite.spriteFrame = this.defaultAvatarSprite
			return
		}
		assetManager.loadRemote(avatarUrl, (err, imageAsset) => {
			if (err) {
				console.error('Lỗi khi tải avatar:', err)
				return
			}
			if (this.avatarSprite) {
				const spriteFrame = new SpriteFrame()
				const texture = new Texture2D()
				texture.image = imageAsset as ImageAsset
				spriteFrame.texture = texture
				this.avatarSprite.spriteFrame = spriteFrame
			}
		})
	}
}
