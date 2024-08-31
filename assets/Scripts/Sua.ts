// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import ListViTriCaDiChuyen from "./ListViTriCaDiChuyen";
import GameCtrl from "./GameCtrl";
import Bullet1 from "./Bullet1";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Sua extends cc.Component {
    @property
    public speed: number = 10
    @property(ListViTriCaDiChuyen)
    public listViTri:ListViTriCaDiChuyen;
    @property
    public heath:number = 5
    @property(cc.Node)
    public xuBac:cc.Node;
    @property
    public soDiem:number = 0;

    public viTris:cc.Vec2[];
    public collider:cc.Collider;
    public anim:cc.Animation;
    
    protected onLoad(): void {
        this.viTris = this.listViTri.setViTriForObj();
        this.anim = this.node.getComponent(cc.Animation);
        this.collider = this.node.getComponent(cc.Collider)
        this.anim.play("Sua")
        this.anim.on("finished", ()=>{this.anim.play("Sua")}, this)
        GameCtrl.getInstance().datLichtrinhDiChuyen(this.node, this.viTris, this.speed)
    }
    onCollisionEnter(other:cc.Collider, self:cc.Collider){
        //ca bi dan ban trung
        let bulletOther:Bullet1 = other.node.getComponent("Bullet1")
        let nguoiBan = GameCtrl.getTenNguoiBan(bulletOther);
        if(other.tag==0){
            this.node.color = cc.Color.RED;
            this.heath-=bulletOther.damage
            //this.die(nguoiBan);
            GameCtrl.getInstance().die(this.node, this.heath, this.anim, this.xuBac, this.collider, nguoiBan, this.soDiem)
            this.scheduleOnce(()=>{
                this.node.color = cc.Color.WHITE
            },0.1)
        }
    }

}
