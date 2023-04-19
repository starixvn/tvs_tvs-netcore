export class Type {
    value: string;
    items: Item[];
}

export class Item {
    value: string;
    name: string;
    constructor(value: string, name: string) {
        this.value = value;
        this.name = name;
    }
}

export class Bet {
    value = 'All';
    name = 'Bet';
    items = ['All', 'Single', 'Sub Parlay'];
}


