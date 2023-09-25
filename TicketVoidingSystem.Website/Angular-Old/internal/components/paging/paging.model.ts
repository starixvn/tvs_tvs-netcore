export class PagingModel {
    totalItems: number;
    pageIndex: number;
    pageSize: number;
}

export class ItemPageList {
    value: string;
    cssClass: string;

    constructor(value: string, cssClass: string) {
        this.value = value;
        this.cssClass = cssClass;
    }
}

export class PagingEvent {
    pageIndex: number;
    pageSize: number;
}