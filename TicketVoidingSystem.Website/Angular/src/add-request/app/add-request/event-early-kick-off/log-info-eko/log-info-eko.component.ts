import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BlockUiModule } from 'src/utility/components/block-ui/block-ui.module';
import { TemplateMessageComponent } from 'src/utility/components/template-message/template-message/template-message.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { PagingConstant } from '../../../../../utility/components/paging/paging/paging.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { LogInfoService } from '../services/log-info.service';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';

@Component({
  selector: 'log-info-eko',
  templateUrl: './log-info-eko.component.html',
  styleUrls: ['./log-info-eko.component.scss'],
  standalone: true,
  imports: [TemplateMessageComponent, CommonModule, TicketsListComponent, BlockUiModule],
})
export class LogInfoEkoComponent {
  @Input() isMainMatch: boolean;
  @Input() isEdit: boolean;
  @Input() filter: FilterModel;
  @Input() logInfo: LogInfoEarlyKickOff;
  @Input() requestId: number;
  @Input() issueTypes = new IssueTypes();
  @Input() primitiveProps: PrimitiveProperty;
  @Output() searchTicketEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();

  isBlock = false;
  isBlockBetList: boolean;
  private readonly modalService = inject(ModalService);
  private readonly logInfoService = inject(LogInfoService);

  async pagingEvent() {
    this.isBlock = true;
    const query = this.logInfoService.initQuery(this.logInfo.pagingModel.page - 1, this.logInfo.pagingModel.pageSize, this.logInfo, this.filter);
    await this.logInfoService.getTickets(query, this.logInfo, this.isEdit, this.requestId, this.filter);
    this.isBlock = false;
  }

  public async clickHeader(): Promise<void> {
    this.logInfo.isCollapse = !this.logInfo.isCollapse;
    if (!this.logInfo.isCollapse) {
      this.isBlock = true;
      const query = this.logInfoService.initQuery(PagingConstant.INDEX_ZERO, PagingConstant.SIZE_ONE, this.logInfo, this.filter);
      await this.logInfoService.getTickets(query, this.logInfo, this.isEdit, this.requestId, this.filter);
      this.logInfoService.assignTemplateMessageValueToEvent(this.logInfo);
      this.isBlock = false;
    }
  }

  public isShowMessage(): boolean {
    return this.logInfo.messageValidationLogInfo?.some(x => !x.isError);
  }

  public handleDeleteEvent(matchId: number) {
    this.deleteEvent.emit(matchId);
  }

  public emitSearchEvent(): void {
    this.searchTicketEvent.emit();
  }

  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  public getIssueTypeId(): number {
    return Number(this.filter.issueTypeId);
  }

  public getSubIssueTypeId(): number {
    return Number(this.filter.subIssueTypeId);
  }

  public isNotShowTemplateMessage() {
    return this.logInfo.tableTicketsModel.groups === undefined || this.logInfo.tableTicketsModel.groups.length === 0
      || this.logInfo.tableTicketsModel.groups == null
  }
}
