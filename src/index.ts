import { GameObject } from './GameObject';
import { Item } from './Item';
import { User } from './User';
import { Enemy } from './Enemy';
import { Village } from './Village';
import { Questionnaire } from './Questionnaire'

const RESET = '\u001b[0m';

function hello(name: string): string {
    return `Hello, ${name}`;
}

function gameStart(): string {
    return "ガシャーン！ここはどこおこび？\n[咒]\n|::|\n口口ｺ";
}

class SearchEvent {
    getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }

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
            const options = ["戦う", "アイテムを使う", "逃げる"];
            const answer = await Questionnaire.questionWithOptions(`何をしますか？`, options);
            if (answer == 0) {

                console.log(`${this.user.name}の攻撃。${this.user.attack()}のダメージを与えた！`);
                this.enemy.getDamage(this.user.attack());
                if (this.enemy.hp == 0) {
                    console.log(`${this.enemy.name}を倒した！`);
                    return Battle.WIN;
                }
            }
            if (answer == 1) {
                const items = this.user.inventory.list();
                let usableItems = items.slice(0).filter(items=>items.usableInBattle == 1);

                if(usableItems.length==0){
                    console.log(`${this.user.name}は何も使えない！`);
                }
                else{
                    const answer = await Questionnaire.questionWithOptions(`どのアイテムを使いますか？`, usableItems.map(item => item.name));
                    if (isNaN(answer)) {
                        console.log("アイテムを使いませんでした");
                    }
                    const result = this.user.useItem(usableItems[answer]);
                    console.log(result);
                }
            }

            if (answer == 2) {
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

function showUserStatus(user: User) {
    console.log(`\n================`);
    console.log(`│ ${user.name}`);
    console.log(`│ 場所:${user.currentPlace.name}`);
    console.log(`│ HP:${String(user.hp)}`);
    console.log(`================`);
 
}

const main = async() => {

    console.log("start.");
    console.log(gameStart());
    const name: string = <string> await Questionnaire.question(`あなたの名前は何ですか？`);
    const user = new User(name);
    let now = 0;

    console.log(`${name}は異世界に転生してしまったようだ・・・`);
    //user.destinations(0).id=${user.name}+'のおうち';

    for(;;) {
        
        showUserStatus(user);
        const answer = await Questionnaire.question(`何をしますか？(1:周りを探す 2:持ち物を見る 3:移動する)`);
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
                    console.log(`${gameObject.description}`);
                    user.destinations.push(gameObject);
//                }
            }
        }
        if (answer == "2") {
            const items = user.inventory.list();
            let usableItems = items.slice(0).filter(items=>items.usableInBattle == 1);

            if(usableItems.length==0){
                console.log(`${user.name}は何も持っていない！`);
            } else{
                const answer = await Questionnaire.questionWithOptions(`アイテムを使いますか？`, usableItems.map(item => item.name));
                if (isNaN(answer)) {
                    console.log("アイテムを使いませんでした");
                } else {
                    const result = user.useItem(usableItems[answer]);
                    console.log(result);
                }
            }
        }
        if (answer == "3") {
            const dest_answer = Number(await Questionnaire.questionWithOptions(`どこへ行きますか？`, user.destinations.map(destination => destination.name)));

            if (dest_answer == NaN) {
                console.log("そんな場所はありません");
            } else if (dest_answer == 1) {
                console.log(`${user.name}は元の世界に帰った。だが、元の世界は核戦争によって滅んだままだった。${user.name}は未来を変えることはできなかったようだ・・・。\n【BAD END】`);
                break;
            } else {
                console.log(`${user.name}は${user.destinations[dest_answer].name}へ移動した！`);
                user.move(user.destinations[dest_answer]);
            }
            
        }

    const name: string = <string> await Questionnaire.question(`エンターキーを押して続ける`);
    }

    console.log(RESET);
}

main();

