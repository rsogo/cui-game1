import { GameObject } from "./GameObject";
import { Inventory } from "./Inventory";
import { Item } from './Item';
import { Village } from "./Village";

export class User extends GameObject {
    power: number;
    hp: number;
    inventory: Inventory;
    destinations: Village[];
    currentPlace;

    constructor(name: string) {
        super("USER", name);
        this.hp = 10;
        this.power = 4;
        this.inventory = new Inventory();
        this.destinations = [new Village('HOUSE','おうち', ''), new Village('HOME','元の世界へもどる', '')];
        this.currentPlace = this.destinations[0];
    }

    attack() : number {
        return this.power;
    }

    move(destination: Village) {
        this.currentPlace = destination;
    }
    
    useItem(targetItem: Item): string {
        const index = this.inventory.items.findIndex(item => item.id === targetItem.id);

        if (index == -1) {
            return "アイテムは使えませんでした";
        }
        this.hp = this.hp + targetItem.hpRecoverValue;
        this.inventory.items.splice(index, 1);
        return `${this.name}は${targetItem.name}を使った！HPが ${targetItem.hpRecoverValue} 回復した！`;
        
    }
}
