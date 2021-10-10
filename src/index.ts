import readline from 'readline';

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
        readLineInterface.question(GREEN + question, (anser) => {
            resolve(anser);
            readLineInterface.close();
        })
    })
}

class Inventory {
    items: Item[];
    constructor() {
        this.items = new Array();
    }

    list(): Item[] {
        return this.items;
    }

    add(value: Item): Item[] {
        this.items.push(value);
        return this.items;
    }
}

class GameObject {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

class User extends GameObject {

    hp: number;
    constructor(name: string) {
        super("USER", name);
        this.hp = 10;
    }
}

class Item extends GameObject {
    static ITEM_KIND = [
        new Item('PICKEL', 'ツルハシ'),
        new Item('AXE', 'オノ'),
        new Item('DIAMOND', 'ダイアモンド')
    ]
}

class Enemy extends GameObject {

    hp: number;

    static ENEMY_KIND: Enemy[] = [
        new Enemy('ZOMBE','ゾンビ', 10),
        new Enemy('SKELETON', 'スケルトン', 20)
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
        return 5;
    }
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

const main = async() => {

    const inventory = new Inventory();
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
                console.log(`${user.name}は逃げた`);
            }

            if (gameObject instanceof Item) {
                console.log(`${gameObject.name}を拾った`);
                inventory.add(gameObject);
            }
        }
        if (answer == "2") {
            const items = inventory.list();
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

