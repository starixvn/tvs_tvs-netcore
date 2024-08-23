import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';

import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AffectedTicketsModel, LogInfoTicketsQuery } from '../../models/live-game-early-ticket.model';
import { GetPoolHouseTicketQuery, PoolHouseTicketsModel } from '../../pool-house-ticket/pool-house-ticket.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { FilterWrongOuComponent } from '../filter-wrong-ou/filter-wrong-ou.component';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOuService } from '../services/event-wrong-ou.service';
import { LogInfoService } from '../services/log-info.service';

@Component({
  selector: 'log-info-wrong-ou',
  templateUrl: './log-info-wrong-ou.component.html',
  styleUrls: ['./log-info-wrong-ou.component.scss']
})
export class LogInfoWrongOuComponent implements OnInit {
  @Input() isMainMatch: boolean;
  @Input() isEdit: boolean;
  @Input() filter: FilterModel;
  @Input() logInfo: LogInfoWrongOu;
  @Input() isDisabled: boolean;
  @Input() requestId: number;
  @Input() primitiveProps: PrimitiveProperty;
  @Output() searchTicketEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();

  @ViewChild('filterWrongOu') filterWrongOuComponent: FilterWrongOuComponent;

  isCollapse: boolean;
  isBlock = false;

  poolHouseTicketsModel = new PoolHouseTicketsModel();
  affectedTicketsModel = new AffectedTicketsModel();
  constructor(
    private readonly modalService: ModalService,
    private readonly addRequestStore: AddRequestStore,
    private readonly logInfoWrongOuService: LogInfoService,
    private readonly eventWrongOuService: EventWrongOuService,
    private readonly addRequestApiService: AddRequestApiService,
    private readonly logAnalysisService: LogAnalysisService
  ) { }

  public ngOnInit(): void {
    if (this.isEdit) {
      this.logInfo.isShowValidation = true;
    }
  }

  public async refreshLogInfoBySearchEvent(): Promise<void> {
    await this.refreshLogInfo();
  }

  public async refreshLogInfoByPoolHouseEvent(): Promise<void> {
    await this.refreshLogInfo();
  }

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public async refreshLogInfo(): Promise<void> {
    this.isBlock = true;
    this.clearDataValidation();

    if (this.filterWrongOuComponent.isValid()) {
      await this.logInfoWrongOuService.getLogInfo([this.logInfo], this.isEdit, this.requestId, this.filter, this.primitiveProps);
      this.logInfo.isShowValidation = true;
    }

    this.isBlock = false;
  }

  public recalculatePoolHouseTicket(model: PoolHouseTicketsModel): void {
    this.logInfo.poolHouseCheckedBetTypes = model.checkedBetTypes;
    this.refreshLogInfoByPoolHouseEvent();
  }

  private initGetPoolHouseTicketQuery(): GetPoolHouseTicketQuery {
    const query = new GetPoolHouseTicketQuery();
    query.requestId = this.requestId;
    query.matchId = this.logInfo.matchId;
    query.actionId = Number(this.filter.action);
    query.isLinkGroup1X2 = this.logInfo.linkedLogsViewModel.isLinkGroup1X2;
    query.isLinkGroupAIO = this.logInfo.linkedLogsViewModel.isLinkGroupAIO;
    query.issueTypeId = Number(this.filter.issueTypeId);
    query.subIssueTypeId = Number(this.filter.subIssueTypeId);
    query.wrongMarket = this.logInfo.filterWrongOu.wrongMarket;
    query.filterFromTransTime = this.logInfo.filterWrongOu.filterFromTransTime;
    query.filterToTransTime = this.logInfo.filterWrongOu.filterToTransTime;
    query.liveIndicator = this.logInfo.filterWrongOu.liveIndicator;

    return query;
  }

  public async openLiveGameEarlyDetails(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.logInfo.logInfoDetail.liveGameEarlyTicketsJson) {
      const query: LogInfoTicketsQuery = {
        logInfoTicketsJson: this.logInfo.logInfoDetail.liveGameEarlyTicketsJson,
        issueTypeId: Number(this.filter.issueTypeId)
      };

      this.affectedTicketsModel.tickets = await this.addRequestApiService.GetLogInfoTickets(query);
      this.affectedTicketsModel.tickets.groups[0].isExpanded = true;
      this.affectedTicketsModel.tickets.groups[0].tickets.forEach(x => x.isChecked = true);

    } else {
      this.affectedTicketsModel.tickets = new TicketsModel();
    }

    await this.logAnalysisService.writeLogClickLiveGameDetails(this.filter.issueTypeId);
    this.addRequestStore.changeBlockingUiStatus(false);
    this.affectedTicketsModel.isOpen = true;
  }

  public async openPoolHouseDetails(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    const query = this.initGetPoolHouseTicketQuery();
    this.logInfo.linkedLogsViewModel = await this.eventWrongOuService.getLinkedLog(this.logInfo, this.filter);
    query.isLinkGroup1X2 = this.logInfo.linkedLogsViewModel.isLinkGroup1X2;
    query.isLinkGroupAIO = this.logInfo.linkedLogsViewModel.isLinkGroupAIO;
    const viewModel = await this.addRequestApiService.getPoolHouseTickets(query);

    await this.logAnalysisService.writeLogClickPoolHouseDetails(this.filter.issueTypeId);
    this.addRequestStore.changeBlockingUiStatus(false);

    this.poolHouseTicketsModel.query = query;
    this.poolHouseTicketsModel.linkedLogsViewModel = this.logInfo.linkedLogsViewModel;
    this.poolHouseTicketsModel.groupBetTypes = viewModel.groupBetTypes;
    this.poolHouseTicketsModel.affectedTickets = viewModel.affectedTickets;
    this.poolHouseTicketsModel.otherTickets = viewModel.otherTickets;
    this.poolHouseTicketsModel.checkedBetTypes = this.logInfo.poolHouseCheckedBetTypes;
    this.poolHouseTicketsModel.isOpen = true;
    this.poolHouseTicketsModel = _.clone(this.poolHouseTicketsModel);
  }

  public handleDeleteEvent(matchId: number) {
    this.deleteEvent.emit(matchId);
  }

  public emitSearchEvent(): void {
    this.searchTicketEvent.emit();
  }

  public clearDataValidation(): void {
    this.logInfo.isShowValidation = false;
    this.logInfo.logInfoDetail = null;
    this.logInfo.messageValidationLogInfo = null;
  }

  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  public countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  public displayTransId(ticketCount: number, transId: string): string {
    return ticketCount === 0 ? '-' : transId;
  }

  public isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }
}
