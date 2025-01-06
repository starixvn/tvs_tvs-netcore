import { Injectable } from '@angular/core';
import { AddRequestApiService } from '../../add-request-api.service';
import { ExtraWarningModel } from '../../confirm-add-request/confirm-add-request.model';

@Injectable({
  providedIn: 'root'
})
export class AbnormalAccountService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService
  ) { }


  getExtraWarningModel(numberOfTicketsExistedInRequest: number) {
    if (numberOfTicketsExistedInRequest > 0) {
      return {
        title: `There are some tickets (${numberOfTicketsExistedInRequest}) that existed in other Requests.`,
        messages: []
      } as ExtraWarningModel;
    }
  }
}