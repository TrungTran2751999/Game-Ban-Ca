// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Gun1 from "./Gun1";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet1 extends cc.Component {
    @property
    public speed:number = 200
    @property
    public soXuTieuHao:number = 10;

    public xFrame:number = cc.view.getCanvasSize().width
    public yFrame:number = cc.view.getCanvasSize().height
    protected update(dt: number): void {
        this.node.y+=this.speed*dt
        this.node.setPosition(new cc.Vec2(this.node.x, this.node.y))
        if(this.node.position.y > Math.abs(this.yFrame)*1.5 || this.node.x > Math.abs(this.xFrame)*1.5){
            this.node.parent.destroy()
        }   
    }
    onCollisionEnter(other:cc.Collider, self:cc.Collider){
        //ban trung ca
        if(other.tag==1){
            const anim = this.node.getComponent(cc.Animation)
            this.speed=0;
            this.scheduleOnce(() => {
                this.node.destroy();
            }, anim.play("Explosion").duration);
        }
    }
}
