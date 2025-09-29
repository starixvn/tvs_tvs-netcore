import { NumberItemService } from "./number-item.service";

export class CSSCLASS {
    static readonly ITEM_NUMBER_SELECTED = 'item-number-selected';
    public static get VALID(): string { return 'item-number-valid'; }
    public static get INVALID(): string { return 'item-number-invalid'; }
    public static get MOVED(): string { return 'item-number-move-bet'; }
    public static get SELECTED(): string { return CSSCLASS.ITEM_NUMBER_SELECTED; }
    public static get DIFFERENT(): string { return CSSCLASS.ITEM_NUMBER_SELECTED; }
    public static get SITE_DB_DOWN(): string { return CSSCLASS.ITEM_NUMBER_SELECTED; }
}

export class GroupNumber {
    items: Array<NumberItem> = [];
    isSelectedAll = false;
            });
        }
    }

    updateBeingBalanceUp(text: string, tooltipText: string) {
        if (StaticService.isStringHasLength(text)) {
            const transIds = text.split(',');
            this.items.forEach(item => {
                this.setItemInvalid(transIds, item, CSSCLASS.MOVED, tooltipText);
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
        this.defaultClass = NumberItemService.isNumber(this) ? CSSCLASS.VALID : CSSCLASS.INVALID;
        this.isValid = NumberItemService.isNumber(this);
        this.cssClass = this.defaultClass;
        this.isSelected = false;
        this.isShowTooltip = false;
        this.tooltipText = '';
    }
}