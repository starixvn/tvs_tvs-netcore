import { BallSequence } from '../components/bettypes/bettypes.model';

export class BallSequenceItem {
    value: number;
    name: string;
    isChecked: boolean;
    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
        this.isChecked = true;
    }
}

export class BallSequences {
    name: string;
    items: BallSequenceItem[];
    value: number[];
    isChecked: boolean;

    constructor() {
        this.name = 'All';
        this.items = [];
        this.items.push(new BallSequenceItem(BallSequence.First, '1st'));
        this.items.push(new BallSequenceItem(BallSequence.Second, '2nd'));
        this.items.push(new BallSequenceItem(BallSequence.Third, '3rd'));
        this.isChecked = true;
        this.value = [1, 2, 3];
    }

    changeAll() {
        this.items.forEach(item => {
            item.isChecked = this.isChecked;
        });
        this.value = this.isChecked ? [1, 2, 3] : [];
    }

    changeItem() {
        this.isChecked = true;
        this.value = [];
        this.items.forEach(item => {
            if (item.isChecked) {
                this.value.push(item.value);
            } else {
                this.isChecked = false;
            }
        });
    }
}