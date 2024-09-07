// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import Bullet1 from "./Bullet1";
import CaVangBu from "./CaVangBu";
import GlobalVariable from "./GlobalVariable";
import Gun1 from "./Gun1";
import ListViTriCaDiChuyen from "./ListViTriCaDiChuyen";
import ListViTriKhoiTao from "./ListViTriKhoiTao";
import CaInfo from "./model/CaInfo";
import Sua from "./Sua";
import ThongTinNguoiChoi from "./ThongTinNguoiChoi";
import XuBac from "./XuBac";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameCtrl extends cc.Component {

    @property(Gun1)
    public gun1:Gun1
    @property(ListViTriCaDiChuyen)
    public listViTri:ListViTriCaDiChuyen
    @property(ListViTriKhoiTao)
    public listViTriKhoiTao:ListViTriKhoiTao
    @property(cc.Node)
    public fishes:cc.Node
    @property(cc.Prefab)
    public caVangBu:cc.Node
    @property(cc.Prefab)
    public sua:cc.Node
    @property(cc.Prefab)
    public xuBac:cc.Node
    @property(cc.Node)
    public bulletContainer:cc.Node
    @property(cc.Node)
    public frameGunContainer:cc.Node
    @property(cc.Node)
    public viTri1:cc.Node
    @property(cc.Node)
    public viTri2:cc.Node
    @property(cc.Node)
    public viTri3:cc.Node
    @property(cc.Node)
    public viTri4:cc.Node
    @property(cc.Node)
    public gocXoay1:cc.Node
    @property(cc.Node)
    public gocXoay2:cc.Node
    @property(cc.Node)
    public gocXoay3:cc.Node
    @property(cc.Node)
    public gocXoay4:cc.Node
    @property(cc.Node)
    public gunStation1:cc.Node
    @property(cc.Node)
    public guncStation2:cc.Node
    @property(cc.Node)
    public gunStation3:cc.Node
    @property(cc.Node)
    public guncStation4:cc.Node
    @property(cc.Node)
    public containerPlayer:cc.Node
    @property(cc.Prefab)
    public player:cc.Node

    public listInfoCa:CaInfo[] = []
    public thongTinNguoiChoi:ThongTinNguoiChoi
    private static instance:GameCtrl
    public static soXuTichLuy:number
    private constructor() {
        super();
    }
    public static getInstance():GameCtrl{
        if(this.instance==null){
            this.instance = new GameCtrl()
        }
        return this.instance
    }
    protected onLoad(): void {
        let managerCollision = cc.director.getCollisionManager();
        managerCollision.enabled = true;

        this.initGunStation()

        let caVangBu = new CaInfo().getCaInfo(this.caVangBu, "CaVangBu")
        this.listInfoCa.push(caVangBu)
        let sua = new CaInfo().getCaInfo(this.sua, "Sua")
        this.listInfoCa.push(sua)
    
        GameCtrl.soXuTichLuy = 12000

        this.initListener()
        
        this.schedule(()=>{
            let caInstance = GameCtrl.randomCa(this.listInfoCa) 
            this.initCa(caInstance.ca, caInstance.scriptCa, this.listViTri, this.listViTriKhoiTao, this.initXuBac(), this.fishes)
        },0.5,10)
    }
    initListener(){
        this.gun1.initListener()
    }
    initGunStation(){
        if(this.gunStation1==null){
            this.createGunStation(this.gocXoay1, this.viTri1)
        }else if(this.guncStation2==null){
            this.createGunStation(this.gocXoay2, this.viTri2)
        }else if(this.gunStation3==null){
            this.createGunStation(this.gocXoay3, this.viTri3)
        }else if(this.guncStation4==null){
            this.createGunStation(this.gocXoay4, this.viTri4)
        }
    }
    createGunStation(gocXoay:cc.Node, viTri:cc.Node){
        let playerInstance = cc.instantiate(this.player)
        let gun1:Gun1 = playerInstance.children[2].getComponent("Gun1")
        if(gun1!=null){
            gun1.gocXoay = gocXoay
            gun1.bulletContainer = this.bulletContainer
            gun1.frameGunContainer = this.frameGunContainer
            gun1.initListener()
        }
        if(gocXoay==this.gocXoay3 || gocXoay==this.gocXoay4){
            playerInstance.rotation = 90
            if(gun1!=null){
                gun1.isTop = true
            }
        }
        playerInstance.setPosition(new cc.Vec2(viTri.position.x, viTri.position.y))
        this.containerPlayer.addChild(playerInstance)
    }
    protected update(dt: number): void {
        if(GlobalVariable.isCaChet){
            let caInstance = GameCtrl.randomCa(this.listInfoCa) 
            this.initCa(caInstance.ca, caInstance.scriptCa, this.listViTri, this.listViTriKhoiTao, this.initXuBac(), this.fishes)
        }
    }
    initXuBac():cc.Node{
        let insXuBac = cc.instantiate(this.xuBac)
        return insXuBac
    }
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
    public initCa(ca:cc.Node, nameScriptCa:string, listViTri:ListViTriCaDiChuyen, listViTriKhoiTao:ListViTriKhoiTao, xuBac:cc.Node, fishes:cc.Node){
        let viTriNodeKhoiTao = listViTriKhoiTao.setViTriForObj()
        let insCa = cc.instantiate(ca)
        let insCaClass = insCa.getComponent(nameScriptCa)
        insCaClass.listViTri = listViTri
        insCaClass.xuBac = xuBac
        insCa.setPosition(viTriNodeKhoiTao)
        fishes.addChild(insCa)
        GlobalVariable.isCaChet=false
    }
    public static caDiChuyen(ca:cc.Node, viTris:cc.Vec2[], isInit:boolean, speed:number){
        let listFiteTimeAct = [];
       
       for(let i=0; i<viTris.length; i++){
            if(i!=viTris.length-1){
                let xViTri2 = viTris[i+1].x;
                let yViTri2 = viTris[i+1].y;
                let timeMode = GameCtrl.caculateTimeMove(viTris[i], viTris[i+1], speed);
                let fiteTimeAction = cc.spawn(
                    cc.moveTo(timeMode, new cc.Vec2(xViTri2, yViTri2)),
                    cc.rotateTo(1, GameCtrl.lookAt(viTris[i], viTris[i+1]))
                )
                listFiteTimeAct.push(fiteTimeAction)
            }else{
                let timeMode = GameCtrl.caculateTimeMove(viTris[i], viTris[0], speed);
                let actionLast = cc.spawn(
                    cc.moveTo(timeMode, viTris[0]),
                    cc.rotateTo(1, GameCtrl.lookAt(viTris[i],viTris[0]))
                )
                listFiteTimeAct.push(actionLast)
            }
       }
       //cho phep ca co the xuat phat bat ki toa o nao
       if(isInit){
            let timeMode = GameCtrl.caculateTimeMove(viTris[0], new cc.Vec2(ca.position.x, ca.position.y), speed);
            listFiteTimeAct.unshift(
                cc.spawn(
                    cc.moveTo(timeMode, viTris[0]),
                    cc.rotateTo(1, GameCtrl.lookAt(new cc.Vec2(ca.position.x, ca.position.y), viTris[0]))
                )
            )
        }
        let action = cc.sequence(listFiteTimeAct)
        ca.runAction(action)
    }
    public die(ca:cc.Node,heath:number,  anim:cc.Animation, xu:cc.Node, collider:cc.Collider, nguoiChoi:cc.Node, soDiem:number){
        if(heath<=0){
            anim.pause()
            collider.destroy()
            let containerCanvas = cc.find("Canvas")
            let xuBacClass:XuBac = xu.getComponent("XuBac")
            if(xuBacClass!=null){
                xu.setParent(ca);
                let viTriXuBac = GameCtrl.quyDoiGocTaoDoCha(xu, containerCanvas);
                xu.setParent(containerCanvas)
                xu.setPosition(new cc.Vec2(viTriXuBac.x, viTriXuBac.y))
                //lay vi tri cua label so xu
                let thongTinNguoiChoi:ThongTinNguoiChoi = nguoiChoi.getComponent("ThongTinNguoiChoi")
                let labelSoXu = thongTinNguoiChoi.SoXuBac
                xuBacClass.labelXuBacNguoiBan = labelSoXu
                xuBacClass.animateTarget(soDiem)
            }
            GameCtrl.hieuUngChetXoayVong(ca, 1)
            this.scheduleOnce(()=>{
                ca.destroy()
                let listViTri = ca.parent.children
                //tim nhung node Vi tri duoc tao ra de xoa di neu ca chet
                for(let i=0; i<listViTri.length; i++){
                    if(listViTri[i].getComponent("Ca")==null){
                        listViTri[i].destroy()
                    }
                }
                GlobalVariable.isCaChet = true
            },1)
        }
    }
    public datLichtrinhDiChuyen(ca:cc.Node, viTris:cc.Vec2[], speed:number){
        let init = true;
        let timeStart = GameCtrl.caculateTimeMove(new cc.Vec2(ca.position.x, ca.position.y), viTris[0], speed);
        let toTalTime = 0;
        for(let i=0; i<viTris.length; i++){
            if(i!=viTris.length-1){
                let timeMode = GameCtrl.caculateTimeMove(viTris[i], viTris[i+1], speed);
                toTalTime += timeMode;
            }else{
                let timeMode = GameCtrl.caculateTimeMove(viTris[i], viTris[0], speed);
                toTalTime += timeMode;
            }
        }
        this.scheduleOnce(()=>{
            GameCtrl.caDiChuyen(ca, viTris, init, speed)
            //diChuyen()
        }, 0)
        this.scheduleOnce(()=>{
            this.schedule(()=>{
                init = false
                GameCtrl.caDiChuyen(ca, viTris, init, speed)
                //this.diChuyen()
            }, toTalTime, 1000, 0)
        }, timeStart)
    }
    public static getTenNguoiBan(bulletOther:Bullet1):cc.Node{
        if(bulletOther){
            let tenNguoiBan = bulletOther.node.name.split("|")[1]
            let nguoiBan:cc.Node;
            //lay node nguoi ban
            if(tenNguoiBan!=undefined){
                nguoiBan = cc.find(`${GlobalVariable.rootNguoiBan}/${tenNguoiBan}`)
            }
            return nguoiBan;
        }
    }
    public static hetXu(diem:number):boolean{
        if(diem<=0){
            GlobalVariable.isHetXu = true
            return true
        }
        return false
    }
    public static randomCa(listCaInfo:CaInfo[]):CaInfo{
        let rdCa = Math.floor(Math.random()*listCaInfo.length);
        return listCaInfo[rdCa]
    }
}
