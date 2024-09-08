// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "../Bullet"
import BulletApi from "./Bullet"


export default class Player  {
    public Id:string
    public NamePlayer:string
    public ViTri:number
    public Bullet:BulletApi
    public GocXoay:number
    public SoDiem:number
    
    constructor() {
        this.Id = "";
        this.NamePlayer = "";
        this.ViTri = 0;
        this.Bullet = null;
        this.GocXoay = 0;
        this.SoDiem = 0;
    }
}
