import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ValidationMessage } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { StaticService } from '../../../../utility/services/static.service';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'log-info-message',
  templateUrl: './log-info-message.component.html',
  styleUrls: ['./log-info-message.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LogInfoMessageComponent {
  @Input() messages: ValidationMessage[];

  constructor(private readonly modalService: ModalService) { }

  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }
}
