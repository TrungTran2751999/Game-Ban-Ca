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

    public count:number = 0
    public init = true;
    public viTris:cc.Node[];
    public anim:cc.Animation;
    public collider:cc.Collider;
    
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
        this.collider = this.node.getComponent(cc.Collider)
        this.anim = this.node.getComponent(cc.Animation)
        this.anim.play("CaVangBu")
        this.anim.on("finished", ()=>{this.anim.play("CaVangBu")}, this)
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
    die(nguoiChoi:cc.Node){
        if(this.heath==0){
            this.anim.pause()
            this.collider.destroy()
            let containerCanvas = cc.find("Canvas")
            let xuBacClass:XuBac = this.xuBac.getComponent("XuBac")
            if(xuBacClass!=null){
                this.xuBac.setParent(this.node);
                let viTriXuBac = Util.quyDoiGocTaoDoCha(this.xuBac, containerCanvas);
                this.xuBac.setParent(containerCanvas)
                this.xuBac.setPosition(new cc.Vec2(viTriXuBac.x, viTriXuBac.y))
                //lay vi tri cua label so xu
                let thongTinNguoiChoi:ThongTinNguoiChoi = nguoiChoi.getComponent("ThongTinNguoiChoi")
                let labelSoXu = thongTinNguoiChoi.SoXuBac
                xuBacClass.targetNode = labelSoXu
                xuBacClass.animateTarget(this.soDiem)
            }
            Util.hieuUngChetXoayVong(this.node, 1)
            this.scheduleOnce(()=>{
                this.node.destroy()
                let listViTri = this.node.parent.children
                for(let i=0; i<listViTri.length; i++){
                    if(listViTri[i].getComponent("CaVangBu")==null){
                        listViTri[i].destroy()
                    }
                }
            },1)
        }
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
            this.die(nguoiBan);
            this.scheduleOnce(()=>{
                this.node.color = cc.Color.WHITE
            },0.1)
        }
    }
}
