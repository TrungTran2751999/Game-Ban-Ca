// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet1 from "./Bullet1";
import CaVangBu from "./CaVangBu";
import Gun1 from "./Gun1";
import ListViTriCaDiChuyen from "./ListViTriCaDiChuyen";
import XuBac from "./XuBac";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameCtrl extends cc.Component {

    @property(Gun1)
    public gun1:Gun1
    @property(ListViTriCaDiChuyen)
    public listViTri:ListViTriCaDiChuyen
    @property(cc.Node)
    public fishes:cc.Node
    @property(cc.Prefab)
    public caVangBu:cc.Node
    @property(cc.Prefab)
    public xuBac:cc.Node
    
    protected onLoad(): void {
        let managerCollision = cc.director.getCollisionManager();
        managerCollision.enabled = true;
        this.initListener()
        this.initCaVangBu()
    }
    initListener(){
        this.gun1.initListener()
    }
    public initCaVangBu(){
        let insCaVangBu = cc.instantiate(this.caVangBu)
        let caVangBuClass:CaVangBu = insCaVangBu.getComponent("CaVangBu")
        caVangBuClass.listViTri = this.listViTri
        caVangBuClass.xuBac = this.initXuBac()
        insCaVangBu.setPosition(cc.Vec2.ZERO)
        this.fishes.addChild(insCaVangBu)
    }
    initXuBac():cc.Node{
        let insXuBac = cc.instantiate(this.xuBac)
        return insXuBac
    }
}
