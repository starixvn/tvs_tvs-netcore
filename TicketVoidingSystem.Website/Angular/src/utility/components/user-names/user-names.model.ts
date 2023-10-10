export class CSSCLASS {
    public static get VALID(): string { return 'item-username-valid'; }
    public static get INVALID(): string { return 'item-username-invalid'; }
    public static get EXISTED(): string { return 'item-username-existed'; }
    public static get MOVED(): string { return 'item-username-move-bet'; }
    public static get SELECTED(): string { return 'item-username-selected'; }
}

export class GroupUsername {
    items: Array<UsernameItem>;
    isSelectedAll = false;
    isExceededTotalUsernames = false;
    isSelected: boolean;
    cssClass: string;
    defaultClass: string;

    constructor() {
        this.items = [];
    }

    selectAllItems() {
        this.isSelectedAll = !this.isSelectedAll;
        this.items.forEach(item => {
            item.changeSelectedAll(this.isSelectedAll);
        });
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

    getAllValue(): string {
        let result = '';
        this.items.forEach(item => {
            result = result === '' ? item.value : result + ',' + item.value;
        });

        return result;
    }

    checkValidItems(): number {
        if (this.items.length === 0) {
            return 1;
        } else if (this.items.some(x => !x.isValid)) {
            return 2;
        } else if (this.isExceededTotalUsernames) {
            return 3;
        }

        return 0;
    }

    setItemListValue(list: string[], item: UsernameItem, css: string, toolTipText = '') {
        list.forEach(invalidItem => {
            if (item.value === invalidItem) {
                item.cssClass = css;
                item.defaultClass = css;
                item.isValid = false;
                item.isShowTooltip = toolTipText.length > 0;
                item.tooltipText = toolTipText;
            }
        });
    }

    updateInvalid(text: string) {
        if (text !== null) {
            const invalidItems = text.split(',');
            this.items.forEach(item => {
                this.setItemListValue(invalidItems, item, CSSCLASS.INVALID);
            });
        }
    }

    updateExisted(text: string) {
        if (text !== null) {
            const existedItems = text.split(',');
            this.items.forEach(item => {
                this.setItemListValue(existedItems, item, CSSCLASS.EXISTED);
            });
        }
    }

    updateInvalidWithToolTip(text: string, tooltipText: string) {
        if (text !== null) {
            const invalidItems = text.split(',');
            this.items.forEach(item => {
                this.setItemListValue(invalidItems, item, CSSCLASS.INVALID, tooltipText);
            });
        }
    }

    updateMoved(text: string) {
        if (text !== null) {
            const movedItems = text.split(',');
            this.items.forEach(item => {
                this.setItemListValue(movedItems, item, CSSCLASS.MOVED);
            });
        }
    }

    updateDuplicatedItems(text: string) {
        if (text !== null) {
            const duplicatedItems = this.getDuplicatedItems(text);
            this.items.forEach(item => {
                this.setItemListValue(duplicatedItems, item, CSSCLASS.MOVED);
            });
        }
    }

    getDuplicatedItems(text: string): string[] {
        if (text !== null) {
            const list = text.split(',');
            const tempList = list.filter((item, index) => list.indexOf(item) !== index);
            const duplicatedItems = Array.from(new Set(tempList));
            return duplicatedItems;
        }

        return [];
    }

    remove(item: UsernameItem) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    removeLasted() {
        this.items.pop();
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

    resetAllValue() {
        this.items.forEach(item => {
            item.isValid = true;
                item.cssClass = CSSCLASS.VALID;
                item.defaultClass = CSSCLASS.VALID;
                item.isShowTooltip = false;
                item.tooltipText = '';
        });
    }
}

export class UsernameItem {
    value: string;
    isValid: boolean;
    cssClass: string;
    defaultClass: string;
    isSelected: boolean;
    isShowTooltip: boolean;
    tooltipText: string;

    constructor(value: string) {
        this.value = value;
        this.defaultClass = CSSCLASS.VALID;
        this.isValid = true;
        this.cssClass = this.defaultClass;
        this.isSelected = false;
        this.isShowTooltip = false;
        this.tooltipText = '';
    }

    changeSelectedAll(isSelected: boolean) {
        this.isSelected = isSelected;
        this.cssClass = this.isSelected ? CSSCLASS.SELECTED : this.defaultClass;
    }
}