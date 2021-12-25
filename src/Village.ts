import { GameObject } from "./GameObject";

export class Village extends GameObject {

    description: string;

    static VILLAGE_KIND: Village[] = [
        new Village('SEASIDE','海辺のむら', '魚が美味しい港町。'),
        new Village('MOUNTAIN', '山のむら', '長命の種・エルフが住む村。人間はエルフから歓迎されていないようだ・・・'),
        new Village('TAIGA', '氷のむら', '分厚い氷で隔たれ、外の世界との交流はほとんどない。'),
        new Village('DUNE', '砂漠のむら', 'ここは砂漠の民が住む村。代々２つの部族から交代に代表を決めているらしい。')
    ]

    // constructor(id: string, name: string, hp: number) {
    //     super(id, name);
    //     this.hp = hp;
    // }
    constructor(id: string, vname: string, description: string){
        super(id, vname);
        this.description = description;
    }
}
