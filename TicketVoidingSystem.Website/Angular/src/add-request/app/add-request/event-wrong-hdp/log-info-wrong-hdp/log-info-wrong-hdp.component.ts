import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { GetPoolHouseTicketQuery, PoolHouseTicketsModel } from '../../../../../utility/components/pool-house-ticket/pool-house-ticket.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
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
  isShowValidation = false;
  poolHouseTicketsModel = new PoolHouseTicketsModel();

  constructor(
    private readonly modalService: ModalService,
    private readonly logInfoService: LogInfoService,
    private readonly addRequestStore: AddRequestStore,
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService,
    private readonly eventWrongHdpService: EventWrongHdpService
  ) { }

  public async refreshLogInfoBySearchEvent(): Promise<void> {
    await this.refreshLogInfo();
  }

  public async refreshLogInfoByPoolHouseEvent(): Promise<void> {
    await this.refreshLogInfo();
  }

  private async refreshLogInfo(): Promise<void> {
    this.isBlock = true;
    this.isShowValidation = false;
    this.clearDataValidation();

    if (this.filterWithHdpComponent.isValid()) {
      await this.logInfoService.getLogInfo([this.logInfo], this.isEdit, this.requestId, this.filter, this.primitiveProps);
      this.isShowValidation =  true;
    }

    this.isBlock = false;
  }

  public async getPoolHouseData(query: GetPoolHouseTicketQuery): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.isMainMatch) {
      this.logInfo.linkedLogsViewModel = await this.eventWrongHdpService.getLinkedLog(this.logInfo, this.filter);
      query.isLinkGroup1X2 = this.logInfo.linkedLogsViewModel.isLinkGroup1X2;
      query.isLinkGroupAIO = this.logInfo.linkedLogsViewModel.isLinkGroupAIO;
    }
    const viewModel = await this.addRequestApiService.getPoolHouseTickets(query);

    this.poolHouseTicketsModel.query = query;
    this.poolHouseTicketsModel.linkedLogsViewModel = this.logInfo.linkedLogsViewModel;
    this.poolHouseTicketsModel.isAffectedGroup1X2 = viewModel.isAffectedGroup1X2;
    this.poolHouseTicketsModel.isAffectedGroup1H1X2 = viewModel.isAffectedGroup1H1X2;
    this.poolHouseTicketsModel.isAffectedGroupAIO = viewModel.isAffectedGroupAIO;
    this.poolHouseTicketsModel.groupBetTypes = viewModel.groupBetTypes;
    this.poolHouseTicketsModel.tickets = viewModel.tickets;
    this.poolHouseTicketsModel.checkedBetTypes = this.logInfo.poolHouseCheckedBetTypes;

    this.addRequestStore.changeBlockingUiStatus(false);

    this.poolHouseTicketsModel.isOpen = true;
    this.poolHouseTicketsModel = _.clone(this.poolHouseTicketsModel);
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
    query.pageIndex = this.poolHouseTicketsModel.query ? this.poolHouseTicketsModel.query.pageIndex : 0;
    query.pageSize = this.poolHouseTicketsModel.query ? this.poolHouseTicketsModel.query.pageSize : 500;

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
    this.logInfo.logInfoDetail = null;
    this.logInfo.messageValidationLogInfo = null;
  }

  public showValidationDetail() {
    this.isShowValidation = true;
  }

  public emitSearchEvent(): void {
    this.searchTicketEvent.emit();
  }

  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  public async openPoolHouseDetails(): Promise<void> {
    await this.getPoolHouseData(this.initGetPoolHouseTicketQuery());
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
}
