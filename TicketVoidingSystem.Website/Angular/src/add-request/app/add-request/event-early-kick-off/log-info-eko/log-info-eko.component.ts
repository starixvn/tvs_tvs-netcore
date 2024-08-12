import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { PagingConstant } from '../../../../../utility/components/paging/paging/paging.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { LogInfoService } from '../services/log-info.service';

@Component({
  selector: 'log-info-eko',
  templateUrl: './log-info-eko.component.html',
  styleUrls: ['./log-info-eko.component.scss']
})
export class LogInfoEkoComponent implements OnInit {
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

  constructor(
    private readonly modalService: ModalService,
    private readonly logInfoService: LogInfoService
  ) { }

  public async ngOnInit(): Promise<void> {
  }

   async pagingEvent() {
    this.isBlock = true;
    const query = this.logInfoService.initQuery(this.logInfo.pagingModel.page - 1, this.logInfo.pagingModel.pageSize, this.logInfo, this.filter);
    await this.logInfoService.getTickets(query, this.logInfo, this.isEdit, this.requestId, this.filter, this.primitiveProps);
    this.isBlock = false;
  }

  public async clickHeader(): Promise<void> {
    this.logInfo.isCollapse = !this.logInfo.isCollapse;
    if (!this.logInfo.isCollapse) {
      this.isBlock = true;
      const query = this.logInfoService.initQuery(PagingConstant.INDEX_ZERO, PagingConstant.SIZE_ONE, this.logInfo, this.filter);
      await this.logInfoService.getTickets(query, this.logInfo, this.isEdit, this.requestId, this.filter, this.primitiveProps);
      this.logInfo.templateValue.checkSettled = this.logInfo.tableTicketsModel.isHasSettledTicket;
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

  public isNotShowTemplateMessage(){
    return this.logInfo.tableTicketsModel.groups === undefined || this.logInfo.tableTicketsModel.groups.length === 0
    || this.logInfo.tableTicketsModel.groups == null
  }
}
