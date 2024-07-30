import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { LiveGameEarlyTicketsModel, LiveGameEarlyTicketsQuery } from '../../models/live-game-early-ticket.model';
import { GetPoolHouseTicketQuery, PoolHouseTicketsModel } from '../../pool-house-ticket/pool-house-ticket.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { LogAnalysisService } from '../../services/log-analysis.service';
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
  liveGameEarlyTicketsModel = new LiveGameEarlyTicketsModel();

  constructor(private readonly modalService: ModalService,
    private readonly eventWrongOddsService: EventWrongOddsService,
    private readonly addRequestStore: AddRequestStore,
    private readonly addRequestApiService: AddRequestApiService,
    private readonly logAnalysisService: LogAnalysisService
  ) { }

  public ngOnInit(): void {
    if (this.isEdit) {
      this.logInfo.isShowValidation = true;
    }
  }

  public recalculatePoolHouseTicket(model: PoolHouseTicketsModel): void {
    this.logInfo.poolHouseCheckedBetTypes = model.checkedBetTypes;
    this.searchEvent.emit();
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
    query.wrongOddsInfo = [wrongOddsInfo];

    return query;
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

  public async openLiveGameEarlyDetails(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.logInfo.logInfoDetail.liveGameEarlyTicketsJson) {
      let query: LiveGameEarlyTicketsQuery = {
        liveGameEarlyTicketsJson: this.logInfo.logInfoDetail.liveGameEarlyTicketsJson,
        pageIndex: this.liveGameEarlyTicketsModel.query ? this.liveGameEarlyTicketsModel.query.pageIndex : 0,
        pageSize: this.liveGameEarlyTicketsModel.query ? this.liveGameEarlyTicketsModel.query.pageSize : 500,
        issueTypeId: Number(this.filter.issueTypeId)
      };

      this.liveGameEarlyTicketsModel.tickets = await this.addRequestApiService.GetLiveGameEarlyTickets(query);
      this.liveGameEarlyTicketsModel.tickets.groups[0].isExpanded = true;
      this.liveGameEarlyTicketsModel.tickets.groups[0].tickets.forEach(x => x.isChecked = true);

    } else {
      this.liveGameEarlyTicketsModel.tickets = new TicketsModel();
    }

    await this.logAnalysisService.writeLogClickLiveGameDetails(this.filter.issueTypeId);
    this.addRequestStore.changeBlockingUiStatus(false);
    this.liveGameEarlyTicketsModel.isOpen = true;
  }

  public async openPoolHouseDetails(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    const query = this.initGetPoolHouseTicketQuery();
    this.logInfo.linkedLogsViewModel = await this.eventWrongOddsService.getLinkedLog(this.logInfo, this.filter);
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
