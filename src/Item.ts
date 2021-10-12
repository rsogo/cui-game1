import {GameObject} from './GameObject'

export class Item extends GameObject {

    hp: number;
    kind: number;
    usableInBattle: number;

    static ITEM_KIND = [
        new Item('null', ' ',0,0,0),
        new Item('BEEFSTEAK', '牛肉のステーキ(+5)',5,1,1),
        new Item('APPLE', 'りんご(+2)',2,1,1),
        new Item('DIAMOND', 'ダイアモンド',0,2,0),
        new Item('GOLDENWASABI','金のわさび',0,1,0),
        new Item('ENCHANTEDGOLDENWASABI','エンチャントされた金のわさび',7,3,1),
        new Item('WASABIPORTION','わさびのポーション',3,3,1)
    
    ]
    constructor(id: string, name: string, hp: number, kind: number, usableInBattle: number ) {
        super(id, name);
        this.hp = hp;
        this.kind= kind;
        this.usableInBattle= usableInBattle;

    }

}
