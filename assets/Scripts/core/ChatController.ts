import { _decorator, Component, EditBox, Button, Node, Prefab, instantiate, Label, ScrollView, UITransform, Layout, EventKeyboard, macro, KeyCode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChatController')
export class ChatController extends Component {
    @property(EditBox)
    inputBox: EditBox = null;

    @property(Button)
    sendBtn: Button = null;

    @property(Node)
    contentNode: Node = null; // content của ScrollView

    @property(Prefab)
    messageItemPrefab: Prefab = null; // Prefab message có Label cho username và Label cho message

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property({ displayName: "User" })
    userName: string = "User"; 
    
    
    onLoad() {
        this.sendBtn.node.on(Button.EventType.CLICK, this.onSendClicked, this);

        // Thêm event listener cho phím Enter
        if (this.inputBox) {
            this.inputBox.node.on('editing-did-ended', this.onInputEnded, this);
            this.inputBox.node.on(EditBox.EventType.EDITING_RETURN, this.onEnterPressed, this);
        }

        // Đăng ký event listener cho keyboard
        this.node.on(Node.EventType.KEY_DOWN, this.onKeyDown, this);

        // Debug: Kiểm tra Layout của contentNode
        const layout = this.contentNode.getComponent(Layout);
        if (!layout) {
            console.warn('ContentNode thiếu Layout component!');
        } else {
            console.log('Layout đã được thiết lập');
        }
        
        this.setUserName('thành dtt');
    }

    onDestroy() {
        // Cleanup event listeners
        if (this.sendBtn && this.sendBtn.node) {
            this.sendBtn.node.off(Button.EventType.CLICK, this.onSendClicked, this);
        }

        if (this.inputBox && this.inputBox.node) {
            this.inputBox.node.off('editing-did-ended', this.onInputEnded, this);
            this.inputBox.node.off(EditBox.EventType.EDITING_RETURN, this.onEnterPressed, this);
        }

        this.node.off(Node.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    // Handler cho khi ấn Enter trong EditBox
    onEnterPressed() {
        console.log('Enter pressed in EditBox');
        this.sendMessage();
    }

    // Handler cho keyboard event
    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.ENTER) {
            console.log('Enter key detected');
            this.sendMessage();
        }
    }

    // Handler cho khi kết thúc chỉnh sửa
    onInputEnded() {
        // Có thể thêm logic khác nếu cần
    }

    onSendClicked() {
        this.sendMessage();
    }

    // Tách riêng logic gửi tin nhắn thành method riêng
    sendMessage() {
        // Kiểm tra null safety trước
        if (!this.inputBox) {
            console.error('InputBox is null!');
            return;
        }

        const message = this.inputBox.string.trim();
        if (!message) return;

        console.log('Bắt đầu tạo message:', message);

        // Clear input NGAY LẬP TỨC để tránh lỗi scale
        this.inputBox.string = '';

        // Tạo message item từ prefab
        if (!this.messageItemPrefab) {
            console.error('MessageItemPrefab is null!');
            return;
        }

        const msgItem = instantiate(this.messageItemPrefab);
        console.log('Prefab được tạo:', msgItem.name);

        // Đảm bảo msgItem được active
        msgItem.active = true;

        // Tìm các Label components với null safety
        const usernameLabel = msgItem.getChildByName('UsernameLabel')?.getComponent(Label);
        const messageLabel = msgItem.getChildByName('MessageLabel')?.getComponent(Label);
        const singleLabel = msgItem.getComponent(Label);

        if (usernameLabel && messageLabel) {
            // Trường hợp có 2 Label riêng biệt
            usernameLabel.string = this.userName + ":";
            usernameLabel.isBold = true;
            messageLabel.string = message;
            console.log('Đã gán username và message riêng biệt');
        } else if (singleLabel) {
            // Trường hợp chỉ có 1 Label với Rich Text
            singleLabel.string = `${this.userName}: ${message}`;
            console.log('Đã gán text với username:', singleLabel.string);
        } else {
            console.error('Không tìm thấy Label component trong prefab!');
            msgItem.destroy(); // Cleanup
            return;
        }

        // Kiểm tra và điều chỉnh size với null safety
        const transform = msgItem.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(400, 80);
            console.log('Đã set size:', transform.contentSize);
        }

        // Kiểm tra contentNode trước khi thêm
        if (!this.contentNode) {
            console.error('ContentNode is null!');
            msgItem.destroy();
            return;
        }

        // Thêm vào content
        this.contentNode.addChild(msgItem);
        console.log('Đã thêm vào content. Tổng children:', this.contentNode.children.length);

        // Force update layout và scroll với null safety
        this.scheduleOnce(() => {
            if (!this.contentNode) return;
            
            const layout = this.contentNode.getComponent(Layout);
            if (layout) {
                layout.updateLayout();
                
                this.scheduleOnce(() => {
                    if (layout && this.contentNode) {
                        layout.updateLayout();

                        const contentTransform = this.contentNode.getComponent(UITransform);
                        if (contentTransform) {
                            console.log('Content size sau update:', contentTransform.contentSize);
                        }

                        // Scroll to bottom với null safety
                        if (this.scrollView) {
                            this.scrollView.scrollToBottom(0.3, true);
                            console.log('⬇Đã scroll xuống dưới');
                        }
                    }
                }, 0.05);
            }
        }, 0.1);

        // Focus lại vào input box để tiếp tục chat
        this.scheduleOnce(() => {
            if (this.inputBox) {
                this.inputBox.focus();
            }
        }, 0.1);
        
    }

    // Method để thay đổi tên user (có thể gọi từ ngoài)
    setUserName(newName: string) {
        this.userName = newName;
        console.log('Đã đổi tên user thành:', this.userName);
    }
}