import { GameObject } from "./GameObject";

export class Enemy extends GameObject {

    hp: number;

    static ENEMY_KIND: Enemy[] = [
        new Enemy('ZOMBIE','ゾンビ', 10),
        new Enemy('SKELETON', 'スケルトン', 20),
        new Enemy('CREEPER', 'くりいぱあー', 100)
    ]

    constructor(id: string, name: string, hp: number) {
        super(id, name);
        this.hp = hp;
    }

    getDamage(value: number): number {
        this.hp = this.hp - value;
        if (this.hp < 0) {
            this.hp = 0;
        }
        return this.hp;
    }

    attack(): number {
        return 3;
    }
}
