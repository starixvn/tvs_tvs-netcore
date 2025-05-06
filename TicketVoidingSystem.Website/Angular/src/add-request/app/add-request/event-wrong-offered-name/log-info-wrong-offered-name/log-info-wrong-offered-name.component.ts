import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { TemplateMessageComponent } from '../../../../../utility/components/template-message/template-message/template-message.component';
import { StaticService } from '../../../../../utility/services/static.service';
import { VoidReasonComponent } from '../../../../../void-request/app/message-area/void-reason/void-reason.component';
import { FilterModel } from '../../filter/filter.model';
import { TicketsComponent } from '../../pool-house-ticket/tickets/tickets.component';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { PrimitiveProperty } from '../models/primitive-property.model';

@Component({
  selector: 'log-info-wrong-offered-name',
  templateUrl: './log-info-wrong-offered-name.component.html',
  styleUrls: ['./log-info-wrong-offered-name.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, NgbModule, BlockUiModule, TemplateMessageComponent,
    VoidReasonComponent, TicketsComponent]
})
export class LogInfoWrongOfferedNameComponent {
  @Input() isEdit: boolean;
  @Input() logInfo: LogInfoWrongOfferedName;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() primitiveProps: PrimitiveProperty;
  @Output() searchTicketEvent = new EventEmitter();

  isBlock = false;
  isBlockBetList: boolean;
  private readonly modalService = inject(ModalService);

  clickHeader() {
    this.logInfo.isCollapse = !this.logInfo.isCollapse;
  }

  isShowMessage(): boolean {
    return this.logInfo.messageValidationLogInfo?.some(x => !x.isError);
  }

  emitSearchEvent(): void {
    this.searchTicketEvent.emit();
  }

  openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  getIssueTypeId(): number {
    return Number(this.filter.issueTypeId);
  }

  getSubIssueTypeId(): number {
    return Number(this.filter.subIssueTypeId);
  }

  isShowTemplateMessage() {
    return this.logInfo.tableTicketsModel.groups?.length > 0;
  }
}