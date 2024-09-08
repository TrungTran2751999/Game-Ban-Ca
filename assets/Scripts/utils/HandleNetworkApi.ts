// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../model/Player";
import NetworkApi from "./NetworkApi";


export default class HandleNetworkApi {
    public static TimPhong(player:Player):Promise<Response>{
        const url = NetworkApi.API_TIM_PHONG
        return fetch(url, {
            method: 'POST', // Chỉ định phương thức POST
            headers: {
                'Content-Type': 'application/json' // Định dạng dữ liệu gửi đi
            },
            body: JSON.stringify(player) // Chuyển đổi dữ liệu thành chuỗi JSON
        })
    }
}
