// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import GameCtrl from "./GameCtrl";
import GlobalVariable from "./GlobalVariable";
import ListViTriCaDiChuyen from "./ListViTriCaDiChuyen";
import ListViTriKhoiTao from "./ListViTriKhoiTao";
import ThongTinNguoiChoi from "./ThongTinNguoiChoi";
import XuBac from "./XuBac";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Util extends cc.Component{
    public static lookAt(self:cc.Vec2, targetNode:cc.Vec2):number{
        // let lookAtRotation = cc.v3(0, 0, 0);
        let angle = Math.atan2(targetNode.y - self.y, targetNode.x - self.x) * 180 / Math.PI;
        return -angle
    }
    public static caculateTimeMove(pos1:cc.Vec2, pos2:cc.Vec2, speed:number){
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
    public static initCa(ca:cc.Node, nameScriptCa:string, listViTri:ListViTriCaDiChuyen, xuBac:cc.Node, fishes:cc.Node){
        let nodeViTriKhoiTao = GameCtrl.getInstance().initXuBac()
        console.log(nodeViTriKhoiTao)

        // let vec2KhoiTao = nodeViTriKhoiTao.setViTriForObj();
        // let insCa = cc.instantiate(ca)
        // let insCaClass = insCa.getComponent(nameScriptCa)
        // insCaClass.listViTri = listViTri
        // insCaClass.xuBac = xuBac
        // insCa.setPosition(vec2KhoiTao)
        // fishes.addChild(insCa)
    }
    public static caDiChuyen(ca:cc.Node, viTris:cc.Vec2[], isInit:boolean, speed:number){
        let listFiteTimeAct = [];
       
       for(let i=0; i<viTris.length; i++){
            if(i!=viTris.length-1){
                let xViTri2 = viTris[i+1].x;
                let yViTri2 = viTris[i+1].y;
                let timeMode = Util.caculateTimeMove(viTris[i], viTris[i+1], speed);
                let fiteTimeAction = cc.spawn(
                    cc.moveTo(timeMode, new cc.Vec2(xViTri2, yViTri2)),
                    cc.rotateTo(1, Util.lookAt(viTris[i], viTris[i+1]))
                )
                listFiteTimeAct.push(fiteTimeAction)
            }else{
                let timeMode = Util.caculateTimeMove(viTris[i], viTris[0], speed);
                let actionLast = cc.spawn(
                    cc.moveTo(timeMode, viTris[0]),
                    cc.rotateTo(1, Util.lookAt(viTris[i],viTris[0]))
                )
                listFiteTimeAct.push(actionLast)
            }
       }
       //cho phep ca co the xuat phat bat ki toa o nao
       if(isInit){
            let timeMode = Util.caculateTimeMove(viTris[0], new cc.Vec2(ca.position.x, ca.position.y), speed);
            listFiteTimeAct.unshift(
                cc.spawn(
                    cc.moveTo(timeMode, viTris[0]),
                    cc.rotateTo(1, Util.lookAt(new cc.Vec2(ca.position.x, ca.position.y), viTris[0]))
                )
            )
        }
        let action = cc.sequence(listFiteTimeAct)
        ca.runAction(action)
    }
    public die(ca:cc.Node,heath:number,  anim:cc.Animation, xu:cc.Node, collider:cc.Collider, nguoiChoi:cc.Node, soDiem:number){
        if(heath==0){
            anim.pause()
            collider.destroy()
            let containerCanvas = cc.find("Canvas")
            let xuBacClass:XuBac = xu.getComponent("XuBac")
            if(xuBacClass!=null){
                xu.setParent(ca);
                let viTriXuBac = Util.quyDoiGocTaoDoCha(xu, containerCanvas);
                xu.setParent(containerCanvas)
                xu.setPosition(new cc.Vec2(viTriXuBac.x, viTriXuBac.y))
                //lay vi tri cua label so xu
                let thongTinNguoiChoi:ThongTinNguoiChoi = nguoiChoi.getComponent("ThongTinNguoiChoi")
                let labelSoXu = thongTinNguoiChoi.SoXuBac
                xuBacClass.labelXuBacNguoiBan = labelSoXu
                xuBacClass.animateTarget(soDiem)
            }
            Util.hieuUngChetXoayVong(ca, 1)
            this.scheduleOnce(()=>{
                ca.destroy()
                let listViTri = ca.parent.children
                //tim nhung node Vi tri duoc tao ra de xoa di neu ca chet
                for(let i=0; i<listViTri.length; i++){
                    if(listViTri[i].getComponent("Ca")==null){
                        listViTri[i].destroy()
                    }
                }
            },1)
        }
    }
    public datLichtrinhDiChuyen(ca:cc.Node, viTris:cc.Vec2[], speed:number){
        let init = true;
        let timeStart = Util.caculateTimeMove(new cc.Vec2(ca.position.x, ca.position.y), viTris[0], speed);
        let toTalTime = 0;
        for(let i=0; i<viTris.length; i++){
            if(i!=viTris.length-1){
                let timeMode = Util.caculateTimeMove(viTris[i], viTris[i+1], speed);
                toTalTime += timeMode;
            }else{
                let timeMode = Util.caculateTimeMove(viTris[i], viTris[0], speed);
                toTalTime += timeMode;
            }
        }
        this.scheduleOnce(()=>{
            Util.caDiChuyen(ca, viTris, init, speed)
            //diChuyen()
        }, 0)
        this.scheduleOnce(()=>{
            this.schedule(()=>{
                init = false
                Util.caDiChuyen(ca, viTris, init, speed)
                //this.diChuyen()
            }, toTalTime, 1000, 0)
        }, timeStart)
    }
    public static getTenNguoiBan(bulletOther:Bullet):cc.Node{
        let tenNguoiBan = bulletOther.node.name.split("|")[1]
        let nguoiBan:cc.Node;
        //lay node nguoi ban
        if(tenNguoiBan!=undefined){
            nguoiBan = cc.find(`${GlobalVariable.rootNguoiBan}/${tenNguoiBan}`)
        }
        return nguoiBan;
    }
}
