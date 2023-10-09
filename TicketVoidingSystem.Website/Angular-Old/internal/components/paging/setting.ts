export class PagingText {
    public static get INDEX_ZERO(): number { return 0; }
    public static get SIZE_DEFAULT(): number { return 3000; }
    public static get SIZE_ONE(): number { return 500; }
    public static get SIZE_TWO(): number { return 1000; }
    public static get SIZE_THREE(): number { return 2000; }
    public static get SIZE_FOUR(): number { return 3000; }
    public static get GO_TO_PAGE(): string { return '...'; }
    public static get PREVIOUS(): string { return '<'; }
    public static get NEXT(): string { return '>'; }
}

export class PagingCssClass {
    public static get PREVIOUS(): string { return 'previous-page'; }
    public static get NEXT(): string { return 'next-page'; }
    public static get CURRENT(): string { return 'current-page'; }
    public static get GO_TO_PAGE(): string { return 'go-to-page'; }
    public static get NORMAL(): string { return 'normal-page'; }
}