import { GameObject } from "./GameObject";
import { Inventory } from "./Inventory";
import { Village } from "./Village";

export class User extends GameObject {
    power: number;
    hp: number;
    inventory: Inventory;
    destinations: Village[];
    

    constructor(name: string) {
        super("USER", name);
        this.hp = 10;
        this.power = 4;
        this.inventory = new Inventory();
        this.destinations = [new Village('HOUSE','おうち'),new Village('HOME','元の世界へもどる')];
    }

    attack() : number {
        return this.power;
    }
}
