import { _decorator, Component, director, Node,  } from 'cc';
import { add } from 'lodash-es';
const { ccclass, property } = _decorator;

declare const io: any;

@ccclass('StartScene')
export class StartScene extends Component {
    @property(Node)
    startGameBtn: Node | null = null;

    start() {
        this.startGameBtn?.on(Node.EventType.TOUCH_END, this.initGame, this);
    }

    update(deltaTime: number) {
        // console.log('Update', deltaTime)
    }

    protected onLoad(): void {
        console.log('OnLoad', add(1, 2));

        fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then((response: Response) => {
            return response.json()
        })
        .then((value) => {
            console.log(value);
        })
            .catch((error) => {
                console.log(error);
            });

        console.log('io', io)
        const socket = io('http://localhost:3000');
        socket.on('connect', () => {
            console.log('Connected to server');
        });
    }

    protected initGame(): void {
        director.loadScene('game-lobby');
    }
}

