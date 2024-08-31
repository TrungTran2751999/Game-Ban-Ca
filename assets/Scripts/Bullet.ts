// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Gun1 from "./Gun1";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    @property
    public damage:number = 1
    @property
    public soXuTieuHao:number = 10
}
