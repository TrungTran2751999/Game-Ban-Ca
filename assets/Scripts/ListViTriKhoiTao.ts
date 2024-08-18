// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ListViTriKhoiTao extends cc.Component {
    @property(cc.Node)
    public listViTriKhoiTao:cc.Node
    @property(cc.Node)
    public rootNode:cc.Node
    public randomViTri():cc.Node{
        let lengthListViTri = this.listViTriKhoiTao.children.length;
        let rdNode = Math.floor(Math.random()*lengthListViTri);
        return this.listViTriKhoiTao.children[rdNode];
    }
    public setViTriForObj():cc.Vec2{
        let viTriKhoiTao = this.randomViTri();
        let cloneViTri = cc.instantiate(viTriKhoiTao)
        let posCloneViTri = new cc.Vec2();
        posCloneViTri = viTriKhoiTao.convertToWorldSpaceAR(cc.Vec2.ZERO)
        cloneViTri.setParent(this.rootNode);
        cloneViTri.setPosition(this.rootNode.convertToNodeSpaceAR(posCloneViTri))
        let vec2CloneViTri = new cc.Vec2(cloneViTri.x, cloneViTri.y);
        cloneViTri.destroy()
        return vec2CloneViTri;
    }
}
