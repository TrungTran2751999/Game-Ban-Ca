// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ListViTriCaDiChuyen from "./ListViTriCaDiChuyen";
import Util from "./Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Sua extends cc.Component {
    @property
    public speed: number = 10
    @property(ListViTriCaDiChuyen)
    public listViTri:ListViTriCaDiChuyen;
    @property(cc.Node)
    public xuBac:cc.Node;
    @property
    public soDiem:number = 0;

    public viTris:cc.Vec2[];
    public collider:cc.Collider;
    public anim:cc.Animation;
    
    protected onLoad(): void {
        this.viTris = this.listViTri.setViTriForObj();
        this.anim = this.node.getComponent(cc.Animation)
        this.anim.play("Sua")
        this.anim.on("finished", ()=>{this.anim.play("Sua")}, this)
        new Util().datLichtrinhDiChuyen(this.node, this.viTris, this.speed)
    }

}
