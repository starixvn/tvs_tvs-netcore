export class NegativeBalance {
    custId: number;
    userName: string;
    site: string;
}

export class CheckNegativeBalanceQuery {
    transIds: string;
    type: boolean;
}

export class NegativeType {
    public static get VOID(): boolean { return false; }
    public static get RECOVER(): boolean { return true; }
}