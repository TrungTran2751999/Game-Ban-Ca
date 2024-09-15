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
            let listPlayer = data.listPlayer
            for(let i=0; i<listPlayer.length; i++){
                GlobalVariable.listPlayer.push(listPlayer[i])
                if(listPlayer[i].namePlayer==player.NamePlayer){
                    GlobalVariable.viTri = listPlayer[i].viTri
                    cc.director.loadScene("MainScene")
                    break;
                }
            }
            GlobalVariable.idNguoiChoi = this.tenPlayerEdt.string
            GlobalVariable.idPhong = data.idPhong
        })
        .catch(err=>{
            alert("SERVER 500")
            console.log(err)
        })
    }
    
}
