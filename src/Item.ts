import {GameObject} from './GameObject'

export class Item extends GameObject {
    static ITEM_KIND = [
        new Item('PICKEL', 'ツルハシ'),
        new Item('APPLE', 'りんご'),
        new Item('DIAMOND', 'ダイアモンド'),
        new Item('GOLDENWASABI','金のわさび'),
        new Item('ENCHANTEDGOLDENWASABI','エンチャントされた金のわさび'),
        new Item('WASABIPORTION','わさびのポーション')
    
    ]
}
