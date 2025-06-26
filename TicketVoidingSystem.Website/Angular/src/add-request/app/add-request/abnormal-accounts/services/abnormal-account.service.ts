import { Injectable } from '@angular/core';
import { CheckBoxConfirmModel, CheckBoxItem, ExtraWarningModel } from '../../confirm-add-request/confirm-add-request.model';

@Injectable()
export class AbnormalAccountService {
  getExtraWarningModel(numberOfTicketsExistedInRequest: number) {
    if (numberOfTicketsExistedInRequest > 0) {
      return {
        title: `There are some tickets (${numberOfTicketsExistedInRequest}) that existed in other Requests.`,
        messages: []
      } as ExtraWarningModel;
    }

    return null;
  }

  getCheckBoxConfirmModel(usernamesOfCreditCashService: string) {
    if (usernamesOfCreditCashService) {
      return {
        title: '<i class="fa fa-exclamation-triangle pt-2 me-1 text-red"></i>HAVE TICKET(S) ON REQUEST AS BELOW:',
        items: [
          {
            key: 'usernames-of-credit-cash-service',
            value: false,
            label: 'Remove username(s) of Credit (cash service)',
            message: `- CREDIT (CASH SERVICE): <strong>${usernamesOfCreditCashService}</strong>`
          } as CheckBoxItem
        ]
      } as CheckBoxConfirmModel;
    }

    return null;
  }
}