import { Injectable } from '@angular/core';
import { ExtraWarningModel } from '../../confirm-add-request/confirm-add-request.model';

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
}