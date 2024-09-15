// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Socket extends cc.Component {
    public initSocket:WebSocket
    
    private constructor(){
        super();
        this.initSocket = new WebSocket("ws://localhost:5221/ws");
    }
    public static instance:Socket;
    public static getInstance():Socket{
        if(!Socket.instance){
            Socket.instance = new Socket();
        }
        return Socket.instance;
    }
    public static init(data:string){
        let socket = Socket.getInstance()
        socket.initSocket.addEventListener("open", ()=>{
            socket.initSocket.send(data)
        })
    }
    public static sendData(data:string){
        let socket = Socket.getInstance()
        socket.initSocket.send(data)

    }
}
