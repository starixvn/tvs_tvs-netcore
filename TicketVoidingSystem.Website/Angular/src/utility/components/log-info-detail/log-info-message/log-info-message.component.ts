import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ValidationMessage } from '../../../../add-request-new/models/get-log-info.model';
import { StaticService } from '../../../../utility/services/static.service';
import { ModalService } from '../../modal/modal.service';

@Component({
  standalone: true,
  selector: 'log-info-message',
  templateUrl: './log-info-message.component.html',
  styleUrls: ['./log-info-message.component.scss'],
  imports: [CommonModule]
})
export class LogInfoMessageComponent {
  @Input() messages: ValidationMessage[];
  private readonly modalService = inject(ModalService);

  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }
}
