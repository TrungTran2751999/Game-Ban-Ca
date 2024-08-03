// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import Bullet1 from "./Bullet1";
import GameCtrl from "./GameCtrl";
import ListViTriCaDiChuyen from "./ListViTriCaDiChuyen";
import Util from "./Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CaVangBu extends cc.Component {
    @property
    public speed: number = 10
    @property
    public heath:number = 5
    @property(ListViTriCaDiChuyen)
    public listViTri:ListViTriCaDiChuyen;

    public count:number = 0
    public init = true;
    public viTris:cc.Node[];
    
    protected onLoad(): void {
        this.viTris = this.listViTri.setViTriForObj();
        let timeStart = Util.caculateTimeMove(this.node.position, this.viTris[0].position, this.speed);
        let toTalTime = 0;
        for(let i=0; i<this.viTris.length; i++){
            if(i!=this.viTris.length-1){
                let timeMode = Util.caculateTimeMove(this.viTris[i].position, this.viTris[i+1].position, this.speed);
                toTalTime += timeMode;
            }else{
                let timeMode = Util.caculateTimeMove(this.viTris[i].position, this.viTris[0].position, this.speed);
                toTalTime += timeMode;
            }
        }
        
        this.scheduleOnce(()=>{
            this.diChuyen()
        }, 0)
        this.scheduleOnce(()=>{
            this.schedule(()=>{
                this.init = false
                this.diChuyen()
            }, toTalTime, 1000, 0)
        }, timeStart)
        
    }
    protected update(dt: number): void {
        if(this.count==80){
            const anim = this.node.getComponent(cc.Animation)
            anim.play("CaVangBu")
            this.count=0
        }
        //this.node.x+=this.speed
        
        this.count++;
    }
    diChuyen(){
       let listFiteTimeAct = [];
       
       for(let i=0; i<this.viTris.length; i++){
            if(i!=this.viTris.length-1){
                let xViTri2 = this.viTris[i+1].position.x;
                let yViTri2 = this.viTris[i+1].position.y;
                let timeMode = Util.caculateTimeMove(this.viTris[i].position, this.viTris[i+1].position, this.speed);
                let fiteTimeAction = cc.spawn(
                    cc.moveTo(timeMode, new cc.Vec2(xViTri2, yViTri2)),
                    cc.rotateTo(1, Util.lookAt(this.viTris[i], this.viTris[i+1]))
                )
                listFiteTimeAct.push(fiteTimeAction)
            }else{
                let timeMode = Util.caculateTimeMove(this.viTris[i].position,this.viTris[0].position, this.speed);
                let actionLast = cc.spawn(
                    cc.moveTo(timeMode, new cc.Vec2(this.viTris[0].position.x, this.viTris[0].position.y)),
                    cc.rotateTo(1, Util.lookAt(this.viTris[i],this.viTris[0]))
                )
                listFiteTimeAct.push(actionLast)
            }
       }
       //cho phep ca co the xuat phat bat ki toa o nao
       if(this.init){
            let timeMode = Util.caculateTimeMove(this.viTris[0].position, this.node.position, this.speed);
            listFiteTimeAct.unshift(
                cc.spawn(
                    cc.moveTo(timeMode, new cc.Vec2(this.viTris[0].position.x, this.viTris[0].position.y)),
                    cc.rotateTo(1, Util.lookAt(this.node, this.viTris[0]))
                )
            )
        }
        let action = cc.sequence(listFiteTimeAct)
        this.node.runAction(action)
       
    }
    die(){
        if(this.heath==0){
            this.node.destroy()
        }
    }
    onCollisionEnter(other:cc.Collider, self:cc.Collider){
        //ca bi dan ban trung
        let bulletOther:Bullet = other.node.getComponent("Bullet")
        if(other.tag==0){
            this.node.color = cc.Color.RED;
            this.heath-=bulletOther.damage
            this.die();
            this.scheduleOnce(()=>{
                this.node.color = cc.Color.WHITE
            },0.1)
        }
    }
}
