import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { PrimitiveProperty } from '../models/primitive-property.model';

@Component({
  selector: 'log-info-wrong-offered-name',
  templateUrl: './log-info-wrong-offered-name.component.html',
  styleUrls: ['./log-info-wrong-offered-name.component.scss']
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

  constructor(
    private readonly modalService: ModalService
  ) { }

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