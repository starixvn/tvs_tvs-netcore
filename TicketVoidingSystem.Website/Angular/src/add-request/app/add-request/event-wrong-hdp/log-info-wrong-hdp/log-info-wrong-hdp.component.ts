import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AffectedTicketsModel, LiveGameEarlyTicketsQuery } from '../../models/live-game-early-ticket.model';
import { GetPoolHouseTicketQuery, PoolHouseTicketsModel } from '../../pool-house-ticket/pool-house-ticket.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { FilterWithHdpComponent } from '../filter-with-hdp/filter-with-hdp.component';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongHdpService } from '../services/event-wrong-hdp.service';
import { LogInfoService } from '../services/log-info.service';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'log-info-wrong-hdp',
  templateUrl: './log-info-wrong-hdp.component.html',
  styleUrls: ['./log-info-wrong-hdp.component.scss']
})
export class LogInfoWrongHdpComponent {
  @Input() isMainMatch: boolean;
  @Input() isEdit: boolean;
  @Input() filter: FilterModel;
  @Input() logInfo: LogInfoWrongHdp;
  @Input() isDisabled: boolean;
  @Input() requestId: number;
  @Input() primitiveProps: PrimitiveProperty;
  @Output() searchTicketEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();

  @ViewChild('filterWithHdp') filterWithHdpComponent: FilterWithHdpComponent;

  isCollapse: boolean;
  isBlock = false;
  poolHouseTicketsModel = new PoolHouseTicketsModel();
  affectedTicketsModel = new AffectedTicketsModel();

  constructor(
    private readonly modalService: ModalService,
    private readonly logInfoService: LogInfoService,
    private readonly addRequestStore: AddRequestStore,
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService,
    private readonly eventWrongHdpService: EventWrongHdpService,
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

  private async refreshLogInfo(): Promise<void> {
    this.isBlock = true;
    this.clearDataValidation();

    if (this.filterWithHdpComponent.isValid()) {
      await this.logInfoService.getLogInfo([this.logInfo], this.isEdit, this.requestId, this.filter, this.primitiveProps);
      this.logInfo.isShowValidation = true;
    }

    this.isBlock = false;
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
    query.homeFavorite = this.logInfo.filterWithHdp.homeFavorite;
    query.awayFavorite = this.logInfo.filterWithHdp.awayFavorite;
    query.hdpValue = this.logInfo.filterWithHdp.hdpValue;
    query.filterFromTransTime = this.logInfo.filterWithHdp.filterFromTransTime;
    query.filterToTransTime = this.logInfo.filterWithHdp.filterToTransTime;
    query.liveIndicator = this.logInfo.filterWithHdp.liveIndicator;

    if (this.validationService.isSubTypeWrongHdpOrWrong1stHdp(this.filter.subIssueTypeId)) {
      query.homeFavorite = this.logInfo.filterWithHdp.homeFavorite;
      query.awayFavorite = this.logInfo.filterWithHdp.awayFavorite;
    } else {
      query.hdpValue = this.logInfo.filterWithHdp.hdpValue;
    }

    return query;
  }

  public recalculatePoolHouseTicket(model: PoolHouseTicketsModel): void {
    this.logInfo.poolHouseCheckedBetTypes = model.checkedBetTypes;
    this.refreshLogInfoByPoolHouseEvent();
  }

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public handleDeleteEvent(matchId: number) {
    this.deleteEvent.emit(matchId);
  }

  public clearDataValidation(): void {
    this.logInfo.isShowValidation = false;
    this.logInfo.logInfoDetail = null;
    this.logInfo.messageValidationLogInfo = null;
  }

  public emitSearchEvent(): void {
    this.searchTicketEvent.emit();
  }

  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }


  public isHavePoolHouseTicket(singleCount: number, parlayCount: number) {
    return singleCount > 0 || parlayCount > 0;
  }

  public countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  public isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  public displayTransId(ticketCount: number, transId: string): string {
    return ticketCount === 0 ? '-' : transId;
  }

  public async openLiveGameEarlyDetails(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.logInfo.logInfoDetail.liveGameEarlyTicketsJson) {
      const query: LiveGameEarlyTicketsQuery = {
        liveGameEarlyTicketsJson: this.logInfo.logInfoDetail.liveGameEarlyTicketsJson,
        issueTypeId: Number(this.filter.issueTypeId)
      };

      this.affectedTicketsModel.tickets = await this.addRequestApiService.GetLiveGameEarlyTickets(query);
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
    this.logInfo.linkedLogsViewModel = await this.eventWrongHdpService.getLinkedLog(this.logInfo, this.filter);
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
}
