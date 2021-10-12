import readline from 'readline';
import { Inventory } from './Inventory';
import { GameObject } from './GameObject';
import { Item } from './Item';
import { User } from './User';
import { Enemy } from './Enemy';

const GREEN = '\u001b[32m';
const RESET = '\u001b[0m';

function hello(name: string): string {
    return `Hello, ${name}`;
}

function gameStart(): string {
    return "ガシャーン！ここはどこだ？\n[咒]\n|::|\n口口ｺ";
}

const question = (question: string) => {
    const readLineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        readLineInterface.question(GREEN + question, (answer) => {
            resolve(answer);
            readLineInterface.close();
        })
    })
}

class SearchEvent {
    getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }

    isItem(): boolean {
        const i = this.getRandomInt(2);
        return i == 1;
    }

    search():GameObject {

        if (this.isItem()) {
            const i: number = this.getRandomInt(Item.ITEM_KIND.length);
            return Item.ITEM_KIND[i];
        } else {
            const i = this.getRandomInt(Enemy.ENEMY_KIND.length);
            return Enemy.ENEMY_KIND[i];
        }
    }
}

class Battle {
    user: User;
    enemy: Enemy;

    constructor(user: User, enemy: Enemy) {
        this.user = user;
        this.enemy = enemy;
    }

    static DOING = 0;
    static WIN = 1;
    static LOSE = 2;
    static RUN_AWAY = 3;

    async buttle(): Promise<number> {

        let result: number = Battle.DOING;

        for(;;) {
            const answer = await question(`何をしますか？(1:戦う 2:持ち物を見る 3:逃げる)`);
            if (answer == "1") {

                console.log(`${this.user.name}の攻撃。${this.user.attack()}のダメージを与えた！`);
                this.enemy.getDamage(this.user.attack());
                if (this.enemy.hp == 0) {
                    console.log(`${this.enemy.name}を倒した！`);
                    return Battle.WIN;
                }
            }
            if (answer == "2") {
                const items = this.user.inventory.list();
                items.forEach(item => console.log(item.name));
            }

            if (answer == "3") {
                console.log(`${this.user.name}は逃げた`);
                return Battle.RUN_AWAY;
            }
                
            console.log(`${this.enemy.name}の攻撃。${this.enemy.attack()}のダメージ！`);
            this.user.hp -= this.enemy.attack();
            if (this.user.hp <= 0) {
                console.log(`${this.user.name}は死んでしまった。`);
                return Battle.LOSE;
            }
            console.log(`${this.user.name}の残りの体力は${this.user.hp}。`);
        }
    }

}

const main = async() => {

    console.log("start.");
    console.log(gameStart());
    const name: string = <string> await question(`あなたの名前は何ですか？`);
    const user = new User(name);

    console.log(`${name}は異世界に転生してしまったようだ・・・`);

    for(;;) {
        const answer = await question(`何をしますか？(1:周りを探す 2:持ち物を見る 3:終わる)`);
        if (answer == "1") {
            const searchEvent = new SearchEvent();
            const gameObject = searchEvent.search();

            if (gameObject instanceof Enemy) {
                console.log(`${gameObject.name}に会ってしまった！`);
                const battle = new Battle(user, gameObject);
                const result = await battle.buttle();

                if (result == Battle.LOSE) {
                    break;
                }
            }

            if (gameObject instanceof Item) {
                console.log(`${gameObject.name}を拾った`);
                user.inventory.add(gameObject);
            }
        }
        if (answer == "2") {
            const items = user.inventory.list();
            items.forEach(item => console.log(item.name));
        }
        if (answer == "3") {
            console.log(`${user.name}は元の世界に帰った`);
            break;
        }
    }

    console.log(RESET);
}

main();

