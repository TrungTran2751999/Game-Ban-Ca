// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ThongTinNguoiChoi from "./ThongTinNguoiChoi";
import Util from "./Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class XuBac extends cc.Component {   
    @property(cc.Node)
    public labelXuBacNguoiBan:cc.Label;

    protected onLoad(): void {
        const anim = this.node.getComponent(cc.Animation)
        anim.play("XuBac")
        anim.on("finished", ()=>{anim.play("XuBac")}, this)
        //this.animateTarget(this.targetNode)
    }
    animateTarget(soDiem:number){
        let containerCanvas = cc.find("Canvas")
        let viTriWorldTargetNode = Util.quyDoiGocTaoDoCha(this.labelXuBacNguoiBan.node, containerCanvas)
        let x = viTriWorldTargetNode.x;
        let y = viTriWorldTargetNode.y;
        let action = cc.sequence(
            cc.moveTo(0.5, new cc.Vec2(this.node.x,this.node.y+300)),
            cc.spawn(
                cc.moveTo(1, new cc.Vec2(x,y)),
                cc.scaleTo(1,0.3,0.3)
            )
        )
        this.node.runAction(action);
        this.scheduleOnce(()=>{
            this.node.destroy()
            let soXuBac = +this.labelXuBacNguoiBan.string
            this.labelXuBacNguoiBan.string = `${soXuBac+=soDiem}`
        },1.5)
    }
}
