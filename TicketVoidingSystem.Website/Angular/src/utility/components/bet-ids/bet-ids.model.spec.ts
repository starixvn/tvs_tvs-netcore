import { CSSCLASS, GroupNumber, NumberItem } from "./bet-ids.model";

describe('GroupNumber', () => {
    describe('checkValidItems', () => {
        const testCase1 =  [{value:"1",cssClass: '',  isValid: true }, {value:"2",cssClass: CSSCLASS.SITE_DB_DOWN,  isValid: true }, {value:"3",cssClass: CSSCLASS.INVALID,  isValid: false }] as NumberItem[];
        const testCase2 =  [{value:"1",cssClass: CSSCLASS.SITE_DB_DOWN,  isValid: true }, {value:"2",cssClass: CSSCLASS.SITE_DB_DOWN,  isValid: true }] as NumberItem[];
        const testCase3 =  [{value:"1",cssClass: '',  isValid: true }, {value:"2",cssClass: CSSCLASS.SITE_DB_DOWN,  isValid: true }] as NumberItem[];
        const testCase4 =  [];
        
        it('should return 1 when has ticket Invalid', () => {
            const groupNumber = new GroupNumber();
            groupNumber.items = testCase1;
            expect(groupNumber.checkValidItems()).toBe(1);
        });

        it('should return 1 when all tickets are valid but all have SITE_DB_DOWN cssClass', () => {
            const groupNumber = new GroupNumber();
            groupNumber.items = testCase2;
            expect(groupNumber.checkValidItems()).toBe(1);
        });

        it('should return 2 when all tickets are valid and has valid ticket not SITE_DB_DOWN', () => {
            const groupNumber = new GroupNumber();
            groupNumber.items = testCase3;
            expect(groupNumber.checkValidItems()).toBe(2);
        });

        it('should return 0 when items array is empty', () => {
            const groupNumber = new GroupNumber();
            groupNumber.items = testCase4;
            expect(groupNumber.checkValidItems()).toBe(0);
        });
    });
});