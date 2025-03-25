import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { PipeModule } from 'src/utility/pipes/pipe.module';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { SportType } from '../../../../../utility/constants/sport.constant';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { AffectedTicketComponent } from '../../affected-ticket/affected-ticket.component';
import { FilterModel } from '../../filter/filter.model';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { PoolHouseTicketComponent } from '../../pool-house-ticket/pool-house-ticket.component';
import { GetPoolHouseTicketQuery, PoolHouseTicketsModel } from '../../pool-house-ticket/pool-house-ticket.model';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { TicketCountOtherSportsComponent } from '../../ticket-count-other-sports/ticket-count-other-sports.component';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOddsService } from '../services/event-wrong-odds.service';

@Component({
    selector: 'log-info-wrong-odds',
    templateUrl: './log-info-wrong-odds.component.html',
    styleUrls: ['./log-info-wrong-odds.component.scss'],
    standalone: true,
    imports: [AffectedTicketComponent, PoolHouseTicketComponent, TicketCountOtherSportsComponent, FormsModule, CommonModule, PipeModule]
})
export class LogInfoWrongOddsComponent implements OnInit {
  @Input() logInfo: LogInfoWrongOdds;
  @Input() requestId: number;
  @Input() isEdit: boolean;
  @Input() primitiveProps: PrimitiveProperty;
  @Input() filter: FilterModel;
  @Output() searchEvent = new EventEmitter<string>();
  poolHouseTicketsModel = new PoolHouseTicketsModel();
  affectedTicketsModel = new AffectedTicketsModel();

  private readonly modalService = inject(ModalService);
  private readonly eventWrongOddsService = inject(EventWrongOddsService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly logAnalysisService = inject(LogAnalysisService);

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

  public showAffectedTicketsDetails() {
    this.affectedTicketsModel.issueTypeId = Number(this.filter.issueTypeId);
    this.affectedTicketsModel.logInfoTicketsJson = this.logInfo.logInfoDetail.logInfoTicketsJson;
    this.affectedTicketsModel.isOpen = true;
    this.affectedTicketsModel = _.clone(this.affectedTicketsModel);
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

  public isSportTypeSoccer(): boolean{
    return this.logInfo.sportType === SportType.SOCCER;
  }
}
