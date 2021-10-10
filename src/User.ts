import { GameObject } from "./GameObject";
import { Inventory } from "./Inventory";

export class User extends GameObject {
    power: number;
    hp: number;
    inventory: Inventory;

    constructor(name: string) {
        super("USER", name);
        this.hp = 10;
        this.power = 4;
        this.inventory = new Inventory();
    }

    attack() : number {
        return this.power;
    }
}
