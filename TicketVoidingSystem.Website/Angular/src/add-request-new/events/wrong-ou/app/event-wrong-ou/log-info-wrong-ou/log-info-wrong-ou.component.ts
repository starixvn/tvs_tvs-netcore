import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import clone from 'lodash/clone';
import moment from 'moment-timezone';
import { BlockUiDirective } from '../../../../../../utility/components/block-ui/block-ui.directive';
import { ModalService } from '../../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { SportType } from '../../../../../../utility/constants/sport.constant';
import { SanitizeHtmlPipe } from '../../../../../../utility/modules/sanitize-html.pipe';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AffectedTicketComponent } from '../../../../../component/affected-ticket/affected-ticket.component';
import { AffectedTicketService } from '../../../../../component/affected-ticket/affected-ticket.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { PoolHouseTicketComponent } from '../../../../../component/pool-house-ticket/pool-house-ticket.component';
import { GetPoolHouseTicketQuery, PoolHouseTicketsModel } from '../../../../../component/pool-house-ticket/pool-house-ticket.model';
import { TicketCountOtherSportsComponent } from '../../../../../component/ticket-count-other-sports/ticket-count-other-sports.component';
import { AffectedTicketsModel } from '../../../../../models/live-game-early-ticket.model';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { LogAnalysisService } from '../../../../../services/log-analysis.service';
import { FilterWrongOuComponent } from '../filter-wrong-ou/filter-wrong-ou.component';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOuService } from '../services/event-wrong-ou.service';
import { LogInfoService } from '../services/log-info.service';

@Component({
  selector: 'log-info-wrong-ou',
  templateUrl: './log-info-wrong-ou.component.html',
  styleUrls: ['./log-info-wrong-ou.component.scss'],
  standalone: true,
  imports: [AffectedTicketComponent, PoolHouseTicketComponent, TicketCountOtherSportsComponent,
    FormsModule, CommonModule, SanitizeHtmlPipe, FilterWrongOuComponent, BlockUiDirective],
  providers: [AffectedTicketService]
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
  private readonly modalService = inject(ModalService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly logInfoWrongOuService = inject(LogInfoService);
  private readonly eventWrongOuService = inject(EventWrongOuService);
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly logAnalysisService = inject(LogAnalysisService);
  private readonly affectedTicketService = inject(AffectedTicketService);

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

  public showAffectedTicketsDetails() {
    this.affectedTicketService.updateShowAffectedTicketsDetails(this.affectedTicketsModel, this.logInfo.logInfoDetail.logInfoTicketsJson, Number(this.filter.issueTypeId));
    this.affectedTicketsModel = clone(this.affectedTicketsModel);
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
    this.poolHouseTicketsModel = clone(this.poolHouseTicketsModel);
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

  public resetPoolHouseCheckedBetTypes(): void {
    this.eventWrongOuService.resetPoolHouseCheckedBetTypes(this.logInfo);
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

  public isSportTypeSoccer(): boolean {
    return this.logInfo.sportType === SportType.SOCCER;
  }
}
