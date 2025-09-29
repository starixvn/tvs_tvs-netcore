export class CSSCLASS {
    public static get VALID(): string { return 'item-username-valid'; }
    public static get INVALID(): string { return 'item-username-invalid'; }
    public static get EXISTED(): string { return 'item-username-existed'; }
    public static get MOVED(): string { return 'item-username-move-bet'; }
    public static get SELECTED(): string { return 'item-username-selected'; }
    public static get SITE_DB_DOWN(): string { return 'item-username-existed'; }
}

export class GroupUsername {
    items: Array<UsernameItem> = [];
    isSelectedAll = false;
    isExceededTotalUsernames = false;
    isSelected: boolean;
    cssClass: string;
    defaultClass: string;
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
}