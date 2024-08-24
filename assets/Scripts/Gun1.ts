// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet1 from "./Bullet1";
import ThongTinNguoiChoi from "./ThongTinNguoiChoi";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Gun1 extends cc.Component {
    @property(cc.Node)
    public gocXoay:cc.Node
    
    @property(cc.Prefab)
    public bullet:cc.Prefab

    @property(cc.Node)
    public gocBan:cc.Node

    @property(cc.Node)
    public bulletContainer:cc.Node

    @property(cc.Label)
    public labelXuBac:cc.Label

    private isContinousFire = false
    private count=0;

    controlGun(event:any){
        let Gun1Pos = cc.v2(this.node.position.x, this.node.position.y);
        let mousePos = event.getLocation();
        mousePos = this.gocXoay.convertToNodeSpaceAR(mousePos);
        let angle = mousePos.signAngle(Gun1Pos);
        let angleD = cc.misc.radiansToDegrees(angle);
        angleD = (angleD*-1)-180
        this.node.angle = angleD
    }
    fireBullet(){
        const anim = this.node.getComponent(cc.Animation)
        anim.play("Gun1Fire")
        let instanceBullet = cc.instantiate(this.bullet)

        instanceBullet.name = "Bullet|GunStation1"
        let diemHienTai = +this.labelXuBac.string
        if(diemHienTai!=0){
            let bulletScript:Bullet1 = instanceBullet.getComponent("Bullet1")
            this.labelXuBac.string = `${diemHienTai-bulletScript.soXuTieuHao}`
        }

        let gunAngle = this.node.angle
        let cloneGocBan = cc.instantiate(this.gocBan);
        
        let gocBanAbPos = this.gocBan.convertToWorldSpaceAR(cc.Vec2.ZERO)
        
        cloneGocBan.setParent(this.bulletContainer)
        cloneGocBan.setPosition(this.bulletContainer.convertToNodeSpaceAR(gocBanAbPos))
        cloneGocBan.angle = gunAngle
        cloneGocBan.addChild(instanceBullet)
        //instanceBullet.angle = cloneGocBan.angle
        cloneGocBan.setScale(new cc.Vec2(0.8,0.8))
        cloneGocBan.addChild(instanceBullet)
    }
    protected update(dt: number): void {
        if(this.isContinousFire){
            if(this.count==30){
                this.count=0
                this.fireBullet()
            }
            this.count++;
        }
    }
    initListener(){
        this.gocXoay.on(cc.Node.EventType.MOUSE_MOVE, this.controlGun, this)
        //this.gocXoay.on(cc.Node.EventType.TOUCH_START, this.fireBullet, this)
        this.gocXoay.on(cc.Node.EventType.TOUCH_START, ()=>{this.isContinousFire = true;}, this)
        this.gocXoay.on(cc.Node.EventType.TOUCH_END, ()=>{this.isContinousFire = false;}, this)
    }
}
