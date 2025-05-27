import { PrimaryButton } from '../../UI/buttons/PrimaryButton'
import { BaseModal } from '../../UI/modals/BaseModal'
import { _decorator, Button, Node, Vec3 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('ModalResult')
export class ModalResult extends BaseModal {
	@property(PrimaryButton)
	replayButton: PrimaryButton | null = null

	constructor() {
		super({ showCloseButton: false })
	}

	start() {
		super.start()
		this.replayButton?.node?.on(Node.EventType.TOUCH_END, this.onClickReplayBtn, this)
		this.node.on('open', () => {
			this.replayButton.interactable = true
		})
	}

	update(deltaTime: number) {}

	protected onClickReplayBtn() {
		this.node.emit('replay')
	}
}
