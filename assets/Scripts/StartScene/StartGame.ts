// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalVariable from "../GlobalVariable";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartGame extends cc.Component {
    @property(cc.EditBox)
    public tenPlayerEdt:cc.EditBox
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.startGame, this)
    }
    startGame(){
        cc.director.loadScene("MainScene")
        GlobalVariable.idNguoiChoi = this.tenPlayerEdt.string
    }
}
