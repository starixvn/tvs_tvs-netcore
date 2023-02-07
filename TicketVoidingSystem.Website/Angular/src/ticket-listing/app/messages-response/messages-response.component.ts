import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessagesResponse } from './messages-response.model';

@Component({
  selector: 'messages-response',
  templateUrl: './messages-response.component.html',
  styleUrls: ['./messages-response.component.scss']
})
export class MessagesResponseComponent {
  @Input() messagesResponse: MessagesResponse;
  @Output() resendDataEvent = new EventEmitter<boolean>();

  public onClickResendData(isChinaView: boolean): void {
    this.resendDataEvent.emit(isChinaView);
  }
}
