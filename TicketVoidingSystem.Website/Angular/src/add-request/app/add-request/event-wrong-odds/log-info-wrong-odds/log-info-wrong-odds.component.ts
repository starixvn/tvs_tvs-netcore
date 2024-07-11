import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { GetPoolHouseTicketQuery, PoolHouseTicketsModel } from '../../../../../utility/components/pool-house-ticket/pool-house-ticket.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOddsService } from '../services/event-wrong-odds.service';

@Component({
  selector: 'log-info-wrong-odds',
  templateUrl: './log-info-wrong-odds.component.html',
  styleUrls: ['./log-info-wrong-odds.component.scss']
})
export class LogInfoWrongOddsComponent implements OnInit {
  @Input() logInfo: LogInfoWrongOdds;
  @Input() requestId: number;
  @Input() isEdit: boolean;
  @Input() primitiveProps: PrimitiveProperty;
  @Input() filter: FilterModel;
  @Output() searchEvent = new EventEmitter<string>();
  poolHouseTicketsModel = new PoolHouseTicketsModel();

  constructor(private readonly modalService: ModalService,
    private readonly eventWrongOddsService: EventWrongOddsService,
    private readonly addRequestStore: AddRequestStore,
    private readonly addRequestApiService: AddRequestApiService
    ) { }

  public ngOnInit(): void {
    if (this.isEdit) {
      this.primitiveProps.isShowValidation = true;
    }
  }

  public recalculatePoolHouseTicket(model: PoolHouseTicketsModel): void {
    this.logInfo.poolHouseCheckedBetTypes = model.checkedBetTypes;
    this.searchEvent.emit();
  }

  public async getPoolHouseData(query: GetPoolHouseTicketQuery): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.logInfo.linkedLogsViewModel = await this.eventWrongOddsService.getLinkedLog(this.logInfo, this.filter);
    const viewModel = await this.addRequestApiService.getPoolHouseTickets(query);
    this.addRequestStore.changeBlockingUiStatus(false);

    this.poolHouseTicketsModel.query = query;
    this.poolHouseTicketsModel.linkedLogsViewModel = this.logInfo.linkedLogsViewModel;
    this.poolHouseTicketsModel.isAffectedGroup1X2 = viewModel.isAffectedGroup1X2;
    this.poolHouseTicketsModel.isAffectedGroup1H1X2 = viewModel.isAffectedGroup1H1X2;
    this.poolHouseTicketsModel.isAffectedGroupAIO = viewModel.isAffectedGroupAIO;
    this.poolHouseTicketsModel.groupBetTypes = viewModel.groupBetTypes;
    this.poolHouseTicketsModel.tickets = viewModel.tickets;
    this.poolHouseTicketsModel.checkedBetTypes = this.logInfo.poolHouseCheckedBetTypes;
    this.poolHouseTicketsModel.isOpen = true;
    this.poolHouseTicketsModel = _.clone(this.poolHouseTicketsModel);
  }

  private initGetPoolHouseTicketQuery(): GetPoolHouseTicketQuery {
    const wrongOddsInfo = this.eventWrongOddsService.getWrongOddsModel(this.filter, this.logInfo);
    const query = new GetPoolHouseTicketQuery();
    query.requestId = this.requestId;
    query.matchId = this.logInfo.matchId;
    query.actionId = Number(this.filter.action);
    query.isLinkGroup1X2 = this.logInfo.linkedLogsViewModel.isLinkGroup1X2;
    query.isLinkGroupAIO = this.logInfo.linkedLogsViewModel.isLinkGroupAIO;
    query.issueTypeId = Number(this.filter.issueTypeId);
    query.subIssueTypeId = Number(this.filter.subIssueTypeId);
    query.filterFromTransTime = this.logInfo.filterWrongOdds.filterFromTransTime;
    query.filterToTransTime = this.logInfo.filterWrongOdds.filterToTransTime;
    query.liveIndicator = this.logInfo.filterWrongOdds.liveIndicator;
    query.pageIndex = this.poolHouseTicketsModel.query ? this.poolHouseTicketsModel.query.pageIndex : 0;
    query.pageSize = this.poolHouseTicketsModel.query ? this.poolHouseTicketsModel.query.pageSize : 500;
    query.wrongOddsInfo = [wrongOddsInfo];

    return query;
  }

  public async openPoolHouseDetails(): Promise<void> {
    await this.getPoolHouseData(this.initGetPoolHouseTicketQuery());
  }

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public clearDataValidation(): void {
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
