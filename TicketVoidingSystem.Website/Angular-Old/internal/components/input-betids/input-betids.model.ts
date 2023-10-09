export class GroupNumber {
    items: Array<NumberItem>;
    isSelectedAll = false;

    constructor() {
        this.items = [];
    }

    getValue(): string {
        let result = '';
        this.items.forEach(item => {
            result = item.isValid ?
                result === '' ? item.value : result + ',' + item.value :
                result;
        });

        return result;
    }

    getAllNumberItems(): Array<NumberItem> {
        return this.items.filter(item => item.isNumber(item.value));
    }

    getAllNumberItemsAsString(): string {
        const values = this.getAllNumberItems().map(item => item.value);

        return values.join(',');
    }

    updateInvalid(text: string) {
        if (text !== null) {
            const invalidItems = text.split(',');
            this.items.forEach(item => {
                invalidItems.forEach(invalidItem => {
                    if (item.value === invalidItem) {
                        item.cssClass = CSSCLASS.INVALID;
                        item.defaultClass = CSSCLASS.INVALID;
                        item.isValid = false;
                    }
                });
            });
        }
    }

    updateMoved(text: string) {
        if (text !== null) {
            const movedItems = text.split(',');
            this.items.forEach(item => {
                movedItems.forEach(invalidItem => {
                    if (item.value === invalidItem) {
                        item.cssClass = CSSCLASS.MOVED;
                        item.defaultClass = CSSCLASS.MOVED;
                        item.isValid = false;
                    }
                });
            });
        }
    }

    remove(item: NumberItem) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    removeLasted() {
        this.items.pop();
    }

    changeSelected() {
        this.isSelectedAll = !this.isSelectedAll;
        this.items.forEach(item => { item.changeSelectedAll(this.isSelectedAll); });
    }

    removeSelected() {
        const removedItems = this.items.filter(function (item) {
            return item.isSelected;
        });
        const newItems = this.items.filter(function (item) {
            return removedItems.indexOf(item) === -1;
        });
        this.items = newItems;
    }
}

export class NumberItem {
    value: string;
    isValid: boolean;
    cssClass: string;
    defaultClass: string;
    isSelected: boolean;

    constructor(value: string) {
        this.value = value;
        this.defaultClass = this.isNumber(value) ? CSSCLASS.VALID : CSSCLASS.INVALID;
        this.isValid = this.isNumber(value) ? true : false;
        this.cssClass = this.defaultClass;
        this.isSelected = false;
    }

    isNumber(value: string): boolean {
        return /^\+?(0|[1-9]\d*)$/.test(value);
    }

    changeSelected() {
        this.isSelected = !this.isSelected;
        this.cssClass = this.isSelected ? CSSCLASS.SELECTED : this.defaultClass;
    }

    changeSelectedAll(isSelected: boolean) {
        this.isSelected = isSelected;
        this.cssClass = this.isSelected ? CSSCLASS.SELECTED : this.defaultClass;
    }
}

export class CSSCLASS {
    public static get VALID(): string { return 'item-number-valid'; }
    public static get INVALID(): string { return 'item-number-invalid'; }
    public static get MOVED(): string { return 'item-number-move-bet'; }
    public static get SELECTED(): string { return 'item-number-selected'; }
}