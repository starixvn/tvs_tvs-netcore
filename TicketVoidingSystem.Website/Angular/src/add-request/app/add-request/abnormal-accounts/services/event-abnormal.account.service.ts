import { Injectable } from '@angular/core';
import { AccountWinlostModel } from '../models/account-winlost.model';

@Injectable({
  providedIn: 'root'
})
export class EventAbnormalAccountService {
  public getAccountWinlostModels(usernames: string, validAccountWinlostModels: AccountWinlostModel[]): AccountWinlostModel[] {
    return usernames?.split(',').map(x => {
      const validAccount = validAccountWinlostModels?.find(y => y.username === x);
      return {
        username: x,
        givenCredit: validAccount?.givenCredit,
        adjustVoidLimit: validAccount?.adjustVoidLimit,
        currentLosing: validAccount?.currentLosing,
        currentWinning: validAccount?.currentWinning,
        custId: validAccount?.custId,
        estimateVoidAmount: validAccount?.estimateVoidAmount,
        winLostAfterVoid: validAccount?.winLostAfterVoid
      } as AccountWinlostModel
    });
  }
}