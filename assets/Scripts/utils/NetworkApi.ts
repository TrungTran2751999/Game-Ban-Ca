// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export default class NetworkApi {
    public static readonly DOMAIN = "http://localhost:5221/"
    public static readonly API_TIM_PHONG = NetworkApi.DOMAIN + "api/socket/tim-phong"
}
