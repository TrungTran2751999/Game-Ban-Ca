// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ListViTriCaDiChuyen extends cc.Component {
    @property(cc.Node)
    public listViTri:cc.Node
    @property(cc.Node)
    public rootNode:cc.Node
    
    public randomViTri():cc.Node{
        let lengthListViTri = this.listViTri.children.length-1;
        let rdNode = Math.floor(Math.random()*lengthListViTri);
        return this.listViTri.children[rdNode];
    }
    public setViTriForObj():cc.Vec2[]{
        let listViTri = this.randomViTri().children;
        let listResult = [];
        for(let i=0; i<listViTri.length; i++){
            let cloneVitri = cc.instantiate(listViTri[i])
            let posCloneViTri = new cc.Vec2();
            posCloneViTri = listViTri[i].convertToWorldSpaceAR(cc.Vec2.ZERO)
            cloneVitri.setParent(this.rootNode);
            cloneVitri.setPosition(this.rootNode.convertToNodeSpaceAR(posCloneViTri))
            let vec2CloneViTri = new cc.Vec2(cloneVitri.x, cloneVitri.y);
            listResult.push(vec2CloneViTri)
            cloneVitri.destroy();
        }
        return listResult;
    }
}
