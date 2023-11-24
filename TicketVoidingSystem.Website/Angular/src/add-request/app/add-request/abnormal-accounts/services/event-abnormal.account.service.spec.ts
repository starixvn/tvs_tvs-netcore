import { AccountWinlostModel } from "../models/account-winlost.model";
import { EventAbnormalAccountService } from "./event-abnormal.account.service";

describe('EventAbnormalAccountService', () => {
  let eventAbnormalAccountService: EventAbnormalAccountService;

  beforeEach(() => {
    eventAbnormalAccountService = new EventAbnormalAccountService();
  });

  it('#getAccountWinlostModels should return correctly model winlost', async () => {
    const validAccount = new AccountWinlostModel();
    validAccount.username = 'AAA';

    const actual = eventAbnormalAccountService.getAccountWinlostModels('AAA,BBB', [validAccount]);

    expect(actual.length).toBe(2);
    expect(actual.some(x => x.username === 'AAA')).toBeTruthy();
  });
})