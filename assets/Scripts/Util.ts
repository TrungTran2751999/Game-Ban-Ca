// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Util extends cc.Component {
    public static lookAt(self:cc.Node, targetNode:cc.Node):number{
        // let lookAtRotation = cc.v3(0, 0, 0);
        let angle = Math.atan2(targetNode.position.y - self.position.y, targetNode.position.x - self.position.x) * 180 / Math.PI;
        return -angle
    }
    public static caculateTimeMove(pos1:cc.Vec3, pos2:cc.Vec3, speed:number){
        let distance = pos2.sub(pos1).mag();
        return distance/speed;
    }
    public static hieuUngChetXoayVong(obj:cc.Node, time:number){
        let actionDie = cc.spawn(
            cc.rotateTo(time, 360*5),
            cc.scaleTo(1,0,0)
        )
        obj.runAction(actionDie)
    }
    public static quyDoiGocTaoDoCha(nodeCanDoi:cc.Node, nodeCha:cc.Node):cc.Vec2{
        let vitriHientai = nodeCanDoi.convertToWorldSpaceAR(cc.Vec2.ZERO)
        let viTriCanDen = nodeCha.convertToNodeSpaceAR(vitriHientai)
        return viTriCanDen;
    }
}
