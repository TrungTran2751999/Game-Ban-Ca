// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalVariable from "../GlobalVariable";
import Player from "../model/Player";
import HandleNetworkApi from "../utils/HandleNetworkApi";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartGame extends cc.Component {
    @property(cc.EditBox)
    public tenPlayerEdt:cc.EditBox
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.startGame, this)
    }
    startGame(){
        let player = new Player()
        player.Id = this.uuid.toString()
        player.NamePlayer = this.tenPlayerEdt.string
        player.SoDiem = 12000
        HandleNetworkApi.TimPhong(player)
        .then(res=>{
            if(!res.ok){
                alert("ERROR")
                throw new Error() 
            }
            return res.json()
        })
        .then(data=>{
            console.log(data)
            cc.director.loadScene("MainScene")
            GlobalVariable.idNguoiChoi = this.tenPlayerEdt.string
        })
        .catch(err=>{
            console.log(err)
        })
    }
    
}
