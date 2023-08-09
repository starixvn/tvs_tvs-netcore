import { StaticService } from "../../services/static.service";

export class CSSCLASS {
    public static get VALID(): string { return 'item-number-valid'; }
    public static get INVALID(): string { return 'item-number-invalid'; }
    public static get MOVED(): string { return 'item-number-move-bet'; }
    public static get SELECTED(): string { return 'item-number-selected'; }
    public static get DIFFERENT(): string { return 'item-number-selected'; }
}

export class GroupNumber {
    items: Array<NumberItem>;
    isSelectedAll = false;

    constructor() {
        this.items = [];
    }

    getAllNumberItems(): Array<NumberItem> {
        return this.items.filter(item => item.isNumber());
    }

    getAllNotNumberItems(): Array<NumberItem> {
        return this.items.filter(item => !item.isNumber());
    }

    getAllNotNumberItemsAsString(): string {
        const values = this.getAllNotNumberItems().map(item => item.value);
        return values.join(',');
    }

    getAllNumberItemsAsString(): string {
        const values = this.getAllNumberItems().map(item => item.value);
        return values.join(',');
    }

    getInvalidItemsAsString(): string {
        const values = this.items.filter(item => item.isInvalidItem()).map(item => item.value);
        return values.join(',');
    }

    checkValidItems(): number {
        let result = 0;
        if (this.items.length === 0) {
            return result;
        } else {
            result = 2;
            this.items.forEach(item => {
                if (!item.isValid) {
                    result = 1;
                }
            });
            return result;
        }
    }

    checkDuplicatedItems(): void {
        const items = this.getAllNumberItems();
        if (items.length !== 0) {
            const valueList = items.map(x => x.value);
            const duplicatedValueList = valueList.filter((item, index) => valueList.indexOf(item) !== index);
            const distinctValueList = Array.from(new Set(duplicatedValueList));
            this.items.forEach(item => {
                this.setItemInvalid(distinctValueList, item, CSSCLASS.MOVED);
            });
        }
    }

    updateInvalidItems(text: string, tooltipText?: string) {
        if (StaticService.isStringHasLength(text)) {
            const invalidItems = text.split(',');
            this.items.forEach(item => {
                this.setItemInvalid(invalidItems, item, CSSCLASS.INVALID, tooltipText);
            });
        }
    }

    updateMoved(text: string) {
        if (StaticService.isStringHasLength(text)) {
            const movedItems = text.split(',');
            this.items.forEach(item => {
                this.setItemInvalid(movedItems, item, CSSCLASS.MOVED);
            });
        }
    }

    updateDifferent(text: string) {
        if (StaticService.isStringHasLength(text)) {
            const differentItems = text.split(',');
            this.items.forEach(item => {
                this.setItemInvalid(differentItems, item, CSSCLASS.DIFFERENT);
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

    selectAllItems() {
        this.isSelectedAll = !this.isSelectedAll;
        this.items.forEach(item => {
            item.changeSelectStatus(this.isSelectedAll);
        });
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

    removeByValue(value: string) {
        this.items.filter(item => item.value === value)
        .forEach(x => {
            const index = this.items.indexOf(x);
            if (index > -1) {
                this.items.splice(index, 1);
            }
        });
    }

    resetAllItemsToValid() {
        this.isSelectedAll = false;
        this.items.forEach(item => {
            if (item.isNumber()) {
                item.isValid = true;
                item.cssClass = CSSCLASS.VALID;
                item.defaultClass = CSSCLASS.VALID;
                item.isShowTooltip = false;
                item.tooltipText = '';
            }
        });
    }

    private setItemInvalid(invalidList: string[], item: NumberItem, css: string, toolTipText = '') {
        if (invalidList.some(invalidItem => invalidItem === item.value)) {
            item.cssClass = css;
            item.defaultClass = css;
            item.isValid = false;
            item.isShowTooltip = toolTipText.length > 0;
            item.tooltipText = toolTipText;
        }
    }
}

export class NumberItem {
    value: string;
    isValid: boolean;
    cssClass: string;
    defaultClass: string;
    isSelected: boolean;
    isShowTooltip: boolean;
    tooltipText: string;

    constructor(value: string) {
        this.value = value;
        this.defaultClass = this.isNumber() ? CSSCLASS.VALID : CSSCLASS.INVALID;
        this.isValid = this.isNumber();
        this.cssClass = this.defaultClass;
        this.isSelected = false;
        this.isShowTooltip = false;
        this.tooltipText = '';
    }

    isNumber(): boolean {
        return /^\+?(0|[1-9]\d*)$/.test(this.value);
    }

    isInvalidItem(): boolean {
        return this.cssClass === CSSCLASS.INVALID;
    }

    changeSelectStatus(isSelected: boolean) {
        this.isSelected = isSelected;
        this.cssClass = this.isSelected ? CSSCLASS.SELECTED : this.defaultClass;
    }
}