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
import Socket from "./Socket";
import ThongTinNguoiChoi from "./ThongTinNguoiChoi";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Gun1 extends cc.Component {
    @property(cc.Node)
    public gocXoay:cc.Node
    
    @property(cc.Prefab)
    public bullet:cc.Prefab

    @property(cc.Node)
    public gocBan:cc.Node //lay tu GameCtrl

    @property(cc.Node)
    public bulletContainer:cc.Node //lay tu GameCtrl

    @property(cc.Label)
    public labelXuBac:cc.Label

    @property(cc.Label)
    public tenNguoiChoi:cc.Label
    
    @property(cc.Node)
    public btnNangCapSung:cc.Node

    @property(cc.Node)
    public btnGiamCapSung:cc.Node

    @property
    public tocDoBan:number = 10

    @property(cc.Node)
    public frameGunContainer:cc.Node //lay tu GameCtrl

    public isTop:boolean = false
    public bulletCopy:cc.Node
    public capHienTai:number = 0;
    private isContinousFire = false
    public thongTinNguoiChoi:ThongTinNguoiChoi
    public soXuBac:number
    private count=0;

    protected onLoad(): void {
        this.bulletCopy = cc.instantiate(this.bullet)
        this.labelXuBac.string = `100`
        this.tenNguoiChoi.string = GlobalVariable.idNguoiChoi
        this.node.parent.name = GlobalVariable.idNguoiChoi

        Socket.sendData("zo ne");
        Socket.getInstance().initSocket.addEventListener("message",(data)=>{
            console.log(data)
        })
    }
    controlGun(event:any){
        let Gun1Pos = cc.v2(this.node.position.x, this.node.position.y);
        let mousePos = event.getLocation();
        mousePos = this.gocXoay.convertToNodeSpaceAR(mousePos);
        let angle = mousePos.signAngle(Gun1Pos);
        let angleD = cc.misc.radiansToDegrees(angle);
        if(this.isTop==true){
            angleD = (angleD*-1)
        }else{
            angleD = (angleD*-1)+180
        }
        
        this.node.angle = angleD
    }
    fireBullet(){
        let diemHienTai = +this.labelXuBac.string
        if(GameCtrl.hetXu(diemHienTai)) return 

        const anim = this.node.getComponent(cc.Animation)
        anim.play(anim.defaultClip.name)
        let instanceBullet = cc.instantiate(this.bulletCopy)

        instanceBullet.name = `Bullet|${GlobalVariable.idNguoiChoi}`
        
        if(diemHienTai!=0){
            let bulletScript:Bullet1 = instanceBullet.getComponent("Bullet1")
            bulletScript.isTop = this.isTop
            let diemTru = diemHienTai-bulletScript.soXuTieuHao
            
            if(diemTru<0){
                this.labelXuBac.string = `${0}`
            }else{
                this.labelXuBac.string = `${diemTru}`
            }
            GlobalVariable.soXuTichLuy = +`${this.labelXuBac.string}`
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
    nangCapSung(){
        let anim = this.btnNangCapSung.getComponent(cc.Animation)
        anim.play("BamNut")
        if(this.capHienTai<this.frameGunContainer.children.length-1){
            this.capHienTai+=1
            this.thayDoiCapSung(this.capHienTai)
        }
    }
    giamCapSung(){
        let anim = this.btnGiamCapSung.getComponent(cc.Animation)
        anim.play("BamNut")
        if(this.capHienTai>0){
            this.capHienTai-=1
            this.thayDoiCapSung(this.capHienTai)
        }
    }
    thayDoiCapSung(capBac:number){
        let listframeGun = this.frameGunContainer.children;
        let spriteFrame = listframeGun[capBac].getComponent(cc.Sprite).spriteFrame
        let animation = listframeGun[capBac].getComponent(cc.Animation).defaultClip
        
        let currentAnimationGun = this.node.getComponent(cc.Animation)
        this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame

        currentAnimationGun.removeClip(currentAnimationGun.defaultClip)
        currentAnimationGun.addClip(animation, "Gun1Fire")

        this.node.getComponent(cc.Animation).defaultClip = animation

        //thay doi goc ban
        let gocBanFramePostionx = listframeGun[capBac].children[0].position.x
        this.gocBan.setPosition(new cc.Vec2(gocBanFramePostionx, this.gocBan.position.y))
        //thay doi bullet
        this.bulletCopy = cc.instantiate(this.bullet)
        let spriteFrameBulletNangCap = listframeGun[capBac].children[1].getComponent(cc.Sprite).spriteFrame
        let colliderBulletNangCap = listframeGun[capBac].children[1].getComponent(cc.PolygonCollider)
        let dameNangCap = listframeGun[capBac].children[1].getComponent(Bullet).damage
        let soXuTieuHao = listframeGun[capBac].children[1].getComponent(Bullet).soXuTieuHao

        this.bulletCopy.getComponent(cc.Sprite).spriteFrame = spriteFrameBulletNangCap

        this.bulletCopy.removeComponent(cc.BoxCollider)
        this.bulletCopy.addComponent(cc.PolygonCollider)

        this.bulletCopy.getComponent(cc.PolygonCollider).points = colliderBulletNangCap.points
        this.bulletCopy.getComponent(Bullet1).damage = dameNangCap
        this.bulletCopy.getComponent(Bullet1).soXuTieuHao = soXuTieuHao
    }
    
    protected update(dt: number): void {
        if(this.isContinousFire){
            if(this.count==this.tocDoBan){
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
        
        this.btnNangCapSung.on(cc.Node.EventType.TOUCH_START, this.nangCapSung, this)
        this.btnGiamCapSung.on(cc.Node.EventType.TOUCH_START, this.giamCapSung, this)
    }
}
