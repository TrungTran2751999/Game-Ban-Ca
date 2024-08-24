// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CaInfo extends cc.Component {
    public ca:cc.Node
    public scriptCa:string
    public getCaInfo(ca:cc.Node, scriptCa:string):CaInfo{
        let caInstance = new CaInfo()
        caInstance.ca = ca
        caInstance.scriptCa = scriptCa
        return caInstance
    }
}
