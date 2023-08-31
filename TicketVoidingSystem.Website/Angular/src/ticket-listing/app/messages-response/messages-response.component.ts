import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessagesResponse } from './messages-response.model';
import { AmendmentReponse } from '../models/query.model';

@Component({
  selector: 'messages-response',
  templateUrl: './messages-response.component.html',
  styleUrls: ['./messages-response.component.scss']
})
export class MessagesResponseComponent {
  @Input() messagesResponse: MessagesResponse;
  @Output() resendDataEvent = new EventEmitter<AmendmentReponse>();

  public onClickResendData(result: AmendmentReponse): void {
    this.resendDataEvent.emit(result);
  }
}
