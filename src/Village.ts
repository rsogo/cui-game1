import { GameObject } from "./GameObject";

export class Village extends GameObject {

    //hp: number;

    static VILLAGE_KIND: Village[] = [
        new Village('SEASIDE','海辺のむら'),
        new Village('MOUNTAIN', '山のむら'),
        new Village('TAIGA', '氷のむら'),
        new Village('DUNE', '砂漠のむら')
    ]

    // constructor(id: string, name: string, hp: number) {
    //     super(id, name);
    //     this.hp = hp;
    // }
    constructor(id: string, vname: string ){
        super(id, vname);
        //this.hp = hp;
    }

    // getDamage(value: number): number {
    //     this.hp = this.hp - value;
    //     if (this.hp < 0) {
    //         this.hp = 0;
    //     }
    //     return this.hp;
    // }

    // attack(): number {
    //     return 3;
    // }
}
