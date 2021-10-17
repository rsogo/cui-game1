import readline from 'readline';
import { Inventory } from './Inventory';
import { GameObject } from './GameObject';
import { Item } from './Item';
import { User } from './User';
import { Enemy } from './Enemy';
import { Village } from './Village';

const GREEN = '\u001b[32m';
const RESET = '\u001b[0m';

function hello(name: string): string {
    return `Hello, ${name}`;
}

function gameStart(): string {
    return "ガシャーン！ここはどこおこび？\n[咒]\n|::|\n口口ｺ";
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

    // isItem(): boolean {
    //     const i = this.getRandomInt(2);
    //     return i == 1;
    // }

    getEventID(): number {
        const i = this.getRandomInt(4);
        return i;
    }

    search():GameObject {

        if (this.getEventID()==1) {
            const i: number = this.getRandomInt(Item.ITEM_KIND.length);
            return Item.ITEM_KIND[i];
        } else if(this.getEventID()==2) {
            const i = this.getRandomInt(Enemy.ENEMY_KIND.length);
            return Enemy.ENEMY_KIND[i];
        } else if(this.getEventID()==3) {
            const i = this.getRandomInt(Village.VILLAGE_KIND.length);
            return Village.VILLAGE_KIND[i];
        }
        else {
            // const i = this.getRandomInt(Enemy.ENEMY_KIND.length);
            // return Enemy.ENEMY_KIND[i];
            return Item.ITEM_KIND[0];
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
            const answer = await question(`何をしますか？(1:戦う 2:アイテムを使う 3:逃げる)`);
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
                let usableItems = new Array();

                
                usableItems = items.slice(0).filter(items=>items.usableInBattle == 1);

                if(usableItems.length==0){
                    console.log(`${this.user.name}は何も使えない！`);
                }
                else{
                    usableItems.forEach(function(element,index,array){console.log((index+1)+'.'+element.name)});

                    const useitem = await question(`どのアイテムを使いますか？`);
                    if (Number(useitem) <= Number(usableItems.length)) {
                        this.user.hp = this.user.hp + usableItems[Number(useitem)-1].hp;
                        console.log(`${this.user.name}は${usableItems[Number(useitem)-1].name}を使った！HPが ${usableItems[Number(useitem)-1].hp} 回復した！`);
                        //console.log(`${this.user.name}は${usableItems[1].name}を使った！${this.user.attack()}のダメージを与えた！`);

                    }
                    else{
                        console.log(`${this.user.name}は何も使えない！`);

                    }
                }
            }

            if (answer == "3") {
                console.log(`${this.user.name}は逃げた`);
                return Battle.RUN_AWAY;
            }
                
            console.log(`${this.enemy.name}の攻撃。${this.enemy.attack()}のダメージ！`);
            this.user.hp -= this.enemy.attack();
            if (this.user.hp <= 0) {
                //console.log(`${this.user.name}は死んでしまった。`);
//                console.log(`${this.user.name}は死んでしまった。\n________________\n|      ＋      |\n|      |       |\n|      お      |\n|      こ      |\n|      ぶ      |`);
                console.log(`${this.user.name}は死んでしまった。\n_______________\n|      †      |\n|             |\n|    R.I.P.   |\n|    おこぶ   |\n`);
                console.log(`${this.user.name}は死んでしまった。\n_______________\n|      †      |\n|             |\n|    R.I.P.   |\n|    ${this.user.name}   |\n`);
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
    let now = 0;

    console.log(`${name}は異世界に転生してしまったようだ・・・`);
    //user.destinations(0).id=${user.name}+'のおうち';

    for(;;) {
//        const answer = await question(`何をしますか？(1:周りを探す 2:持ち物を見る 3:終わる)`);
        //let destination = new Array();
        //destination.push(${GameObject.name}'のおうち','元の世界（おわる）');
        const answer = await question(`何をしますか？(1:周りを探す 2:持ち物を見る 3:移動する)`);
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
                if(gameObject.name==" "){
                    console.log(`そこには何もない!`);
                }
                else{
                    console.log(`${gameObject.name}を拾った`);
                    user.inventory.add(gameObject);
                }
            }
            if (gameObject instanceof Village) {
                // if(gameObject.name==""){
                //     console.log(`そこには何もない!`);
                // }
                // else{
                    console.log(`${gameObject.name}を見つけた！`);
                    // user.inventory.add(gameObject);
//                }
            }
        }
        if (answer == "2") {
            const items = user.inventory.list();
            items.forEach(item => console.log(item.name));
        }
        if (answer == "3") {
            const dest_answer = await question(`どこへ行きますか？(1:${user.name}のおうち 2:${user.destinations[1].name} )`);
            if (dest_answer == "1") {
                console.log(`${user.name}はおうちへ移動した！`);
                now = 1;
            }
            else if (dest_answer == "2") {
                console.log(`${user.name}は元の世界に帰った`);
                break;
            }
            
//            console.log(`${user.name}は元の世界に帰った`);
//            break;
        }
    }

    console.log(RESET);
}

//const items = Item.ITEM_KIND;
// items.slice(1).forEach(item => {
//     console.log(item.id+'.'+item.name)
// });


main();

