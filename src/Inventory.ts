import {Item} from './Item'

export class Inventory {
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
