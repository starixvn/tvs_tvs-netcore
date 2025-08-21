import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { BlockUiDirective } from '../../../../../utility/components/block-ui/block-ui.directive';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { SportType } from '../../../../../utility/constants/sport.constant';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { AffectedTicketComponent } from '../../affected-ticket/affected-ticket.component';
import { AffectedTicketService } from '../../affected-ticket/affected-ticket.service';
import { FilterModel } from '../../filter/filter.model';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { PoolHouseTicketComponent } from '../../pool-house-ticket/pool-house-ticket.component';
import { PoolHouseTicketValue } from '../../pool-house-ticket/pool-house-ticket.constant';
import { GetPoolHouseTicketQuery, PoolHouseTicketsModel } from '../../pool-house-ticket/pool-house-ticket.model';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { TicketCountOtherSportsComponent } from '../../ticket-count-other-sports/ticket-count-other-sports.component';
import { FilterWithHdpComponent } from '../filter-with-hdp/filter-with-hdp.component';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongHdpService } from '../services/event-wrong-hdp.service';
import { LogInfoService } from '../services/log-info.service';
import { ValidationService } from '../services/validation.service';
import { SanitizeHtmlPipe } from '../../../../../utility/modules/sanitize-html.pipe';

@Component({
  selector: 'log-info-wrong-hdp',
  templateUrl: './log-info-wrong-hdp.component.html',
  styleUrls: ['./log-info-wrong-hdp.component.scss'],
  standalone: true,
  imports: [AffectedTicketComponent, BlockUiDirective, FilterWithHdpComponent, FormsModule, CommonModule,
    TicketCountOtherSportsComponent, PoolHouseTicketComponent, SanitizeHtmlPipe],
  providers: [ModalService, AddRequestApiService, AffectedTicketService]
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

  private readonly modalService = inject(ModalService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly validationService = inject(ValidationService);
  private readonly eventWrongHdpService = inject(EventWrongHdpService);
  private readonly logAnalysisService = inject(LogAnalysisService);

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
    this.primitiveProps.isShowInfoSiteDBDown = false;
  }

  public resetPoolHouseCheckedBetTypes(): void {
    this.logInfo.poolHouseCheckedBetTypes = this.logInfo.isMainMatch ? PoolHouseTicketValue.SELECT_ALL_BETTYPE : null;
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

  public showAffectedTicketsDetails() {
    this.affectedTicketsModel.issueTypeId = Number(this.filter.issueTypeId);
    this.affectedTicketsModel.logInfoTicketsJson = this.logInfo.logInfoDetail.logInfoTicketsJson;
    this.affectedTicketsModel.isOpen = true;
    this.affectedTicketsModel = _.clone(this.affectedTicketsModel);
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

  public isSportTypeSoccer(): boolean {
    return this.logInfo.sportType === SportType.SOCCER;
  }
}
