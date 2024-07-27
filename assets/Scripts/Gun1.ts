// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

    initListener(){
        this.gocXoay.on(cc.Node.EventType.MOUSE_MOVE, this.controlGun, this)
        this.gocXoay.on(cc.Node.EventType.TOUCH_END, this.fireBullet, this)
    }
}
