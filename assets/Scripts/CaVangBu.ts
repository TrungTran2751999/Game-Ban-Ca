// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import Bullet1 from "./Bullet1";
import GameCtrl from "./GameCtrl";
import GlobalVariable from "./GlobalVariable";
import ListViTriCaDiChuyen from "./ListViTriCaDiChuyen";
import ThongTinNguoiChoi from "./ThongTinNguoiChoi";
import Util from "./Util";
import XuBac from "./XuBac";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CaVangBu extends cc.Component {
    @property
    public speed: number = 10
    @property
    public heath:number = 5
    @property(ListViTriCaDiChuyen)
    public listViTri:ListViTriCaDiChuyen;
    @property(cc.Node)
    public xuBac:cc.Node;
    @property
    public soDiem:number = 0;

    public viTris:cc.Vec2[];
    public anim:cc.Animation;
    public collider:cc.Collider;
    
    protected onLoad(): void {
        this.viTris = this.listViTri.setViTriForObj();
        this.collider = this.node.getComponent(cc.Collider)
        this.anim = this.node.getComponent(cc.Animation)
        this.anim.play("CaVangBu")
        this.anim.on("finished", ()=>{this.anim.play("CaVangBu")}, this)
        new Util().datLichtrinhDiChuyen(this.node, this.viTris, this.speed)
        
    }
    onCollisionEnter(other:cc.Collider, self:cc.Collider){
        //ca bi dan ban trung
        let bulletOther:Bullet = other.node.getComponent("Bullet")
        let tenNguoiBan = bulletOther.node.name.split("|")[1]
        let nguoiBan:cc.Node;
        //lay node nguoi ban
        if(tenNguoiBan!=undefined){
            nguoiBan = cc.find(`${GlobalVariable.rootNguoiBan}/${tenNguoiBan}`)
        }
        if(other.tag==0){
            this.node.color = cc.Color.RED;
            this.heath-=bulletOther.damage
            //this.die(nguoiBan);
           new Util().die(this.node, this.heath, this.anim, this.xuBac, this.collider, nguoiBan, this.soDiem)
            this.scheduleOnce(()=>{
                this.node.color = cc.Color.WHITE
            },0.1)
        }
    }
}
