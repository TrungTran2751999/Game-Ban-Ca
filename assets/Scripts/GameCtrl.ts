// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Gun1 from "./Gun1";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(Gun1)
    public gun1:Gun1

    protected onLoad(): void {
        this.initListener()
    }
    initListener(){
        this.gun1.initListener()
    }

    // update (dt) {}
}
