import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { ClipboardService } from 'ngx-clipboard';
import { GetLogInfoQuery } from '../../../add-request/app/add-request/models/add-request.query';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { CheckedBetType, GetPlayersQuery } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GetBetTypesQuery, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { AffectedLicensee } from '../../../utility/components/licensee-affected-list/licensee-affected-list.model';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingConstant, PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { TemplateService } from '../../../utility/components/template-message/template-message/services/template.service';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { TemplateValue } from '../../../utility/components/template-message/template-message/template.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ModeType, SubIssueTypeGroup, TVSRequestFilterBy } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { EventType } from '../../../utility/constants/sport.constant';
import { TEXT } from '../../../utility/constants/text';
import { CheckingPermissionModel } from '../../../utility/models/checking-permission.model';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../utility/models/match.model';
import { VoidedReason } from '../../../utility/models/reason.model';
import { CommonService } from '../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../utility/services/mapping-model-static.service';
import { PasswordService } from '../../../utility/services/password.service';
import { StaticService } from '../../../utility/services/static.service';
import { CheckRequestService } from '../services/check-request.service';
import { LogChangeContentService } from '../services/log-change-content.service';
import { ConfirmationComponent } from '../../../utility/components/confirmation/confirmation.component';
import { IssueInfo } from '../../../utility/models/issue-type.model';
import { AppService } from './../app.service';
import { GetTicketsQuery } from './../models/get-tickets.query';
import { VoidTicketsQuery } from './../models/void-tickets.query';
import { TicketsModel } from './../tickets-list/tickets.model';
import { CommonModule } from '@angular/common';
import { LicenseeAffectedListComponent } from '../../../utility/components/licensee-affected-list/licensee-affected-list.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { FilterComponent } from '../filter/filter.component';
import { LogInfoComponent } from '../log-info/log-info.component';
import { EventInfoComponent } from '../event-info/event-info.component';
import { IssueTypeComponent } from '../../../utility/components/issue-type/issue-type.component';

@Component({
  standalone: true,
  selector: 'void-other-issue',
  templateUrl: './void-other-issue.component.html',
  styleUrls: ['./void-other-issue.component.scss'],
  imports: [CommonModule, TemplateMessageComponent, ConfirmationComponent, LicenseeAffectedListComponent, TicketsListComponent,
    TooltipComponent, LogInfoComponent, FilterComponent, EventInfoComponent, IssueTypeComponent],
  providers: [ClipboardService]
})
export class VoidOtherIssueComponent implements OnInit {
  @Input('requestId') requestId: number;
  @Input('requestDetail') requestDetail: RequestDetailViewModel;
  @ViewChild('messages') messagesComponent: TemplateMessageComponent;
  @ViewChild('confirmation') confirmationComponent: ConfirmationComponent;
  @ViewChild('groupBetTypesComponent') groupBetTypesComponent: GroupBetTypesComponent;
  @ViewChild('advancedMode') advancedModelComponent: AdvancedModeComponent;

  ticketsModel = new TicketsModel();
  paging = new PagingModel();
  query = new GetTicketsQuery();
  tooltip = new Tooltip();
  match = new MatchModel();
  issue = new IssueInfo();
  reason = new VoidedReason();
  templateValue = new TemplateValue();
  isBlockBetList: boolean;
  logInfoDetails: LogInfoDetail[] = [];
  groupBetTypes: GroupBetTypesModel;
  allBetTypes: BetType[];
  getPlayerQuery: GetPlayersQuery;
  liveScoreSelection: string[] = [];
  isShowTicket = true;
  filterBy: number;
  actualScore: string = null;
  correctOddsHomeOver: string = null;
  correctOddsAwayUnder: string = null;
  isPoolHouseAffected: boolean;
  isShowVar?: boolean;
  voidQuery = new VoidTicketsQuery();
  uncheckedTransIds: string[] = [];
  singleTransIds: string[];
  parlayTransIds: string[];
  cricketTransIds: string[];
  cancelCashOutTransIds: string[];
  usernames = '';
  transInfo: string;
  licenseeAffectedList: AffectedLicensee[] = [];
  issueTypeName: string;

  commonService = inject(CommonService);
  appService = inject(AppService);
  modalService = inject(ModalService);
  templateService = inject(TemplateService);
  checkRequestService = inject(CheckRequestService);
  clipboardService = inject(ClipboardService);
  element = inject(ElementRef);
  passwordService = inject(PasswordService);
  logChangeContentService = inject(LogChangeContentService);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
  }

  async initData() {
    this.paging.selection = [PagingConstant.SIZE_ONE, PagingConstant.SIZE_TWO, PagingConstant.SIZE_THREE, PagingConstant.SIZE_FOUR];
    this.paging.pageSize = PagingConstant.SIZE_ONE;
    if (this.isAbnormalAccount()) {
      this.usernames = this.requestDetail.abnormalAccountModel.usernames.split(',').join(', ');
    }
    if (this.isHasLogInfo()) {
      await this.getLogInfoModel();
    }
    this.initDataForDisplayLogInfo();
    this.initLiveScore();
    await this.getMatchInfo();
    this.issue = await this.commonService.getIssueInfo(StaticService.getSubIssueTypeId(this.requestDetail));
    this.issueTypeName = this.issue.name === this.issue.subIssueTypeName ? this.issue.name : `${this.issue.name} - ${this.issue.subIssueTypeName}`;
    this.reason = await this.commonService.getVoidedReason(this.issue.subIssueTypeId, this.isHasMatchInfo() ? this.match.sportType : 0);
    await this.initQuery();
    await this.getTickets();
    await this.getGroupBetTypes();
    await this.updateTemplate();
    this.updateUnchecked();
  }

  private async getMatchInfo(): Promise<void> {
    if (this.isHasMatchInfo()) {
      if (this.isWrongScore()) {
        this.match = await this.commonService.getMatch(this.requestDetail.wrongScoreModels[0].matchId);
        this.isShowVar = this.requestDetail.wrongScoreModels[0].isCheckedVar;
      } else if (this.isWrongOdds()) {
        this.match = await this.commonService.getMatch(this.requestDetail.wrongOddsModels[0].matchId);
      } else if (this.isReducedOver()) {
        this.match = await this.commonService.getMatch(this.requestDetail.reducedOverModels[0].matchId);
      } else {
        this.match = await this.commonService.getMatch(this.requestDetail.event.matchId);
      }
    }
  }

  private initLiveScore(): void {
    if (this.isWrongScore() || this.isWrongOdds()) {
      this.liveScoreSelection = this.logInfoDetails[0].liveScores.split('|');
    }
  }

  private initDataForDisplayLogInfo(): void {
    if (this.isWrongScore()) {
      this.filterBy = this.requestDetail.wrongScoreModels[0].filterBy;
      this.actualScore = this.requestDetail.wrongScoreModels[0].actualScore;
    }

    if (this.isWrongOdds()) {
      this.correctOddsHomeOver = this.requestDetail.wrongOddsModels[0].correctOddsHomeOver;
      this.correctOddsAwayUnder = this.requestDetail.wrongOddsModels[0].correctOddsAwayUnder;
    }
  }

  async updateTemplate() {
    if (this.paging.total > 0) {
      this.updateTemplateValue();
      this.updateVoidedReason();
    }
  }

  private async initQuery(): Promise<void> {
    this.query.pageIndex = PagingConstant.INDEX_ZERO;
    this.query.pageSize = PagingConstant.SIZE_ONE;
    this.query.match = this.match;
    this.query.requestId = this.requestId;
    this.query.issueTypeId = this.requestDetail.request.issueTypeId;
    this.query.subIssueTypeId = StaticService.getSubIssueTypeId(this.requestDetail);
  }

  async getTickets() {
    try {
      this.isBlockBetList = true;
      this.isShowTicket = true;
      const data = await this.appService.getTickets(this.query);
      this.isBlockBetList = false;
      this.ticketsModel.initData(data);
      this.paging.total = data.total;
      this.licenseeAffectedList = data.licenseeAffectedList;
      this.licenseeAffectedList = _.clone(this.licenseeAffectedList);
    } catch {
      this.isShowTicket = false;
    }
  }

  private updateUnchecked() {
    this.singleTransIds = this.ticketsModel.singleTickets.map(x => x.transId);
    this.parlayTransIds = this.ticketsModel.parlayTickets.map(x => x.transId);
    this.cricketTransIds = this.ticketsModel.cricketTickets.map(x => x.transId);
    this.cancelCashOutTransIds = this.ticketsModel.cancelCashOutTickets.map(x => x.transId);

    this.uncheckedTransIds = this.ticketsModel.uncheckedTransIds;
  }

  async pagingEvent() {
    this.query.pageIndex = this.paging.page - 1;
    this.query.pageSize = this.paging.pageSize;
    await this.getTickets();
    this.ticketsModel.updateTicketsByUncheckTransIds(this.uncheckedTransIds);
  }

  async exportExcel() {
    const maxPagingItems = 100000;
    if (this.paging.total > maxPagingItems) {
      const header = 'Export Excel Result';
      const body = LABELS.EXPORT_LARGE_FILE;
      this.modalService.open({ title: header, message: body, type: ModalType.Warning });
    } else {
      this.isBlockBetList = true;
      this.query.requestId = this.requestId;
      await this.appService.exportExcel(this.query);
      this.isBlockBetList = false;
    }
  }

  updateTemplateValueForWrongScore() {
    if (this.isWrongScore()) {
      const score = (this.filterBy === TVSRequestFilterBy.TRANS_TIME || this.filterBy === TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME)
        ? this.requestDetail.wrongScoreModels[0].wrongScore
        : this.getLiveScoreForTemplateMessage(this.logInfoDetails[0].scoreNormalTicket, this.logInfoDetails[0].scoreOfMatch);

      if (SubIssueTypeGroup.SUBTYPE_NO_ONWARDS.includes(this.issue.subIssueTypeId)) {
        this.templateValue.score = score;
      } else {
        this.templateValue.wrongScore = score;
      }

      this.templateValue.eventType = EventType.LIVE;
      this.templateValue.actualScore = this.requestDetail.wrongScoreModels[0].actualScore;
      this.templateValue.isCheckedVar = this.requestDetail.wrongScoreModels[0].isCheckedVar;
    }
  }

  updateTemplateValueForWrongOdds() {
    if (this.isWrongOdds()) {
      this.templateValue.filterFavoriteType = this.requestDetail.wrongOddsModels[0].filterFavoriteType;
      this.templateValue.favoriteValue = this.requestDetail.wrongOddsModels[0].favoriteValue;
      this.templateValue.wrongOU = this.requestDetail.wrongOddsModels[0].wrongOU;
      this.templateValue.correctOddsHomeOver = this.requestDetail.wrongOddsModels[0].correctOddsHomeOver;
      this.templateValue.correctOddsAwayUnder = this.requestDetail.wrongOddsModels[0].correctOddsAwayUnder;
      this.templateValue.score = this.getLiveScoreForTemplateMessage(this.logInfoDetails[0].scoreNormalTicket, this.logInfoDetails[0].scoreOfMatch);
      this.templateValue.eventType = this.ticketsModel.isAllLiveTickets ? EventType.LIVE : null;
    }
  }

  updateTemplateValue() {
    if (this.isArchivedTickets()) {
      return;
    }
    this.templateValue = this.templateService.initializeTemplateValue(this.query.match);
    this.templateValue.groupPHAffected = this.ticketsModel.groupPHAffected;
    this.templateValue.checkSettled = this.checkSettled();
    this.templateValue.fromTransTime = this.ticketsModel.fromTime;
    this.templateValue.toTransTime = this.ticketsModel.toTime;
    this.templateValue.eventType = this.ticketsModel.isAllLiveTickets ? EventType.LIVE : null;
    this.templateValue.isAllNonLiveTickets = this.ticketsModel.isAllNonLiveTickets;
    this.updateTemplateValueForWrongScore();
    this.updateTemplateValueForWrongOdds();
    this.templateValue.totalTickets = this.ticketsModel.total;
  }

  private getLiveScoreForTemplateMessage(scoreNormalTicket: string, scoreOfMatch: string): string {
    return !scoreNormalTicket ? scoreOfMatch : scoreNormalTicket.split('|')[0].replace(/ /g, '');
  }

  updateVoidedReason() {
    this.confirmationComponent.confirmation.voidReason.reasonEnglish = this.reason.reasonEnglish;
    this.confirmationComponent.confirmation.voidReason.reasonChineseSimplified = this.reason.reasonChineseSimplified;
    this.confirmationComponent.initialVoidReason.reasonEnglish = _.cloneDeep(this.reason.reasonEnglish);
    this.confirmationComponent.initialVoidReason.reasonChineseSimplified = _.cloneDeep(this.reason.reasonChineseSimplified);
  }

  ticketsChange() {
    const unCheckedCurrent = this.ticketsModel.getCheckedTickets(false);
    const checkedCurrent = this.ticketsModel.getCheckedTickets(true);
    this.uncheckedTransIds = this.uncheckedTransIds.concat(unCheckedCurrent);
    this.uncheckedTransIds = _.uniq(this.uncheckedTransIds);
    this.uncheckedTransIds = _.difference(this.uncheckedTransIds, checkedCurrent);
    if (!this.isArchivedTickets()) {
      this.templateValue = _.clone(this.templateValue);
      this.templateValue.checkSettled = this.checkSettled();
    }
  }

  voidAll() {
    this.updateVoidQuery();
    if (this.checkValidation() && this.isShowTicket) {
      this.showConfirmVoid();
    }
  }

  checkSettled(): boolean {
    if (this.isAbnormalAccount()) {
      const UNSETTLED_STATUS = '0,1';
      return this.requestDetail.abnormalAccountModel.statusIds !== UNSETTLED_STATUS;
    }

    return this.ticketsModel.checkSettledTickets();
  }

  private checkValidation(): boolean {
    if (this.voidQuery.singleTickets.length === 0
      && this.voidQuery.parlayTickets.length === 0
      && this.voidQuery.cancelCashOutTickets.length === 0
      && this.voidQuery.cricketTickets.length === 0) {
      this.tooltip.display('checkbox-dropdown-list', LABELS.EMPTY_TICKET);
      return false;
    }
    if (!this.isArchivedTickets() && !this.messagesComponent.checkValidation()) {
      return false;
    }
    if (!this.confirmationComponent.checkValidation()) {
      return false;
    }

    return true;
  }

  updateVoidQuery() {
    this.voidQuery = {
      requestId: this.requestId,
      singleTickets: _.difference(this.singleTransIds, this.uncheckedTransIds).map(x => {
        return this.ticketsModel.singleTickets.find(y => y.transId === x);
      }),
      parlayTickets: _.difference(this.parlayTransIds, this.uncheckedTransIds).map(x => {
        return this.ticketsModel.parlayTickets.find(y => y.transId === x);
      }),
      cancelCashOutTickets: _.difference(this.cancelCashOutTransIds, this.uncheckedTransIds).map(x => {
        return this.ticketsModel.cancelCashOutTickets.find(y => y.transId === x);
      }),
      cricketTickets: _.difference(this.cricketTransIds, this.uncheckedTransIds).map(x => {
        return this.ticketsModel.cricketTickets.find(y => y.transId === x);
      }),
      userName: this.confirmationComponent.confirmation.userName,
      userPassword: this.passwordService.hash(this.confirmationComponent.confirmation.userPassword),
      reason: this.confirmationComponent.confirmation.voidReason.reasonEnglish,
      reasonSC: this.confirmationComponent.confirmation.voidReason.reasonChineseSimplified,
      message: this.messagesComponent?.message,
      matchId: this.match.matchId,
      subIssueTypeId: StaticService.getSubIssueTypeId(this.requestDetail),
      subIssueTypeName: this.issue.subIssueTypeName,
      subIssueTypeNameCS: this.issue.subIssueTypeNameCS,
      issueTypeId: this.requestDetail.request.issueTypeId,
      isHasSettledTicket: this.ticketsModel.isHasSettledTicket,
      voidFromTime: moment(new Date(this.ticketsModel.fromTime)).format('hh:mm:ss A'),
      voidToTime: moment(new Date(this.ticketsModel.toTime)).format('hh:mm:ss A'),
      voidFromDate: moment(new Date(this.ticketsModel.fromDate)).format('MM/DD/YYYY'),
      voidToDate: moment(new Date(this.ticketsModel.toDate)).format('MM/DD/YYYY'),
      decidedBy: this.requestDetail.request.decidedBy,
      guid: Guid.create().toString()
    };
  }

  showConfirmVoid() {
    this.modalService.confirm(
      {
        title: 'Void Bet Confirm',
        message: LABELS.CONFIRM_VOID_ALL_TICKETS
      }, async () => {
        this.isBlockBetList = true;
        const isRequestModified = await this.checkRequestService.isRequestModified(this.requestDetail.requestId, this.requestDetail.lastModifiedDate);
        if (!isRequestModified) {
          const checkingPermissionModel = new CheckingPermissionModel();
          checkingPermissionModel.setParam(this.ticketsModel.checkPermissionTickets, this.voidQuery.matchId, 'ticket-voiding-check-void-bet-permission', true,
            StaticService.checkHandlingCashOutAsUnSettledTicketByIssueTypeId(this.requestDetail.request.issueTypeId.toString()), true, this.ticketsModel.allCancelCashOutTickets);
          if (this.isAbnormalAccount() || this.isArchivedTickets()) {
            checkingPermissionModel.matchId = 0;
          }

          const result = await this.commonService.checkVoidBetPermission(checkingPermissionModel);

          if (result.errCode !== 0 && checkingPermissionModel.action) {
            this.modalService.open({
              title: 'Warning!',
              message: result.errMsg,
              type: ModalType.Warning
            }, async () => this.executeGetTickets(true));
          } else {
            await this.insertQueue();
          }
        }

        this.isBlockBetList = false;
      });
  }

  async insertQueue() {
    const WRONG_PASSWORD_CODE = 121;
    this.isBlockBetList = true;
    await this.logChangeContentService.writeLogEditVoidReason(this.requestDetail.requestId,
      this.confirmationComponent.initialVoidReason, this.confirmationComponent.confirmation.voidReason);
    const result = await this.appService.insertQueue(this.voidQuery);
    this.isBlockBetList = false;
    if (!result.isSuccessful) {
      this.modalService.open({
        title: 'Error',
        message: result.errorMsg,
        type: ModalType.Error
      }, () => {
        if (result.errorCode !== WRONG_PASSWORD_CODE) {
          this.closeCurrentPage();
        }
      });
    } else {
      this.modalService.open({
        title: 'Confirmation Result ',
        message: TEXT.REQUEST_CONFIRMED_SUCCESSFULLY,
        type: ModalType.Alert
      }, () => {
        this.closeCurrentPage();
      });
    }
  }

  closeCurrentPage() {
    window.close();
  }

  redirectToPage() {
    window.location.assign('TicketVoidingSystem/ManageRequest/Index');
  }

  copyClipboard(text: string) {
    this.clipboardService.copyFromContent(text);
    alert('The Licensee list has been copied to clipboard.');
  }

  isHasMatchInfo() {
    return !this.isAbnormalAccount() && !this.isArchivedTickets();
  }

  isAbnormalAccount(): boolean {
    return StaticService.isAbnormalAccount(this.requestDetail.request.issueTypeId.toString());
  }

  isWrongScore(): boolean {
    return StaticService.isWrongScore(this.requestDetail.request.issueTypeId.toString());
  }

  isArchivedTickets() {
    return StaticService.isArchivedTicket(this.requestDetail.request.issueTypeId.toString());
  }

  isWrongOdds() {
    return StaticService.isWrongOdds(this.requestDetail.request.issueTypeId.toString());
  }

  isReducedOver() {
    return StaticService.isReducedOver(this.requestDetail.request.issueTypeId.toString())
      || StaticService.isAbandoned(this.requestDetail.request.issueTypeId.toString());
  }

  async getGroupBetTypes(): Promise<void> {
    if (this.ticketsModel.betTypes.length > 0) {
      const query: GetBetTypesQuery = {
        mode: ModeType.MARK_TICKET,
        matchId: this.match.matchId,
        betTypes: this.ticketsModel.betTypes
      };
      const data = await this.commonService.getGroupBetTypes(query);
      this.handleGroupBetTypes(data);
    } else {
      this.groupBetTypes = new GroupBetTypesModel([], true);
      this.allBetTypes = [];
    }
  }

  handleGroupBetTypes(data: GroupBetTypesModel): void {
    this.groupBetTypes = new GroupBetTypesModel(data.groupBetTypes, true);
    this.allBetTypes = this.groupBetTypes.getAllBetType();
    this.handleBetType216();
  }

  handleBetType216(): void {
    const betType216Id = 216;
    if (this.groupBetTypes.hasBetType(betType216Id)) {
      this.getPlayerQuery = new GetPlayersQuery('70200048', '216');
    }
  }

  async executeGetTickets(isOnlySearch: boolean): Promise<void> {
    await this.getTickets();
    if (!isOnlySearch) {
      await this.getGroupBetTypes();
    }
    this.updateUnchecked();
    this.updateTemplateValue();
  }

  async search(checkedBetTypes: CheckedBetType[]): Promise<void> {
    if (!_.isNull(checkedBetTypes)) {
      await this.initQuery();
      this.query.betTypes = checkedBetTypes;
      await this.executeGetTickets(true);
    }
  }

  async getLogInfoModel(): Promise<void> {
    const logInfoList = await this.commonService.getLogInfo(this.getLogInfoQuery());
    if (this.isReducedOver()) {
      this.logInfoDetails.push(logInfoList.getLogInfoModels[0].logInfoDetail);
    } else {
      logInfoList.getLogInfoModels.forEach(logInfo => {
        this.logInfoDetails.push(logInfo.logInfoDetail);
      });

      if (this.isWrongOdds()) {
        this.isPoolHouseAffected = logInfoList.getLogInfoModels[0].validation.isPoolHouseAffected;
      }
    }
  }

  getLogInfoQuery(): GetLogInfoQuery {
    const query: GetLogInfoQuery = {
      requestId: this.requestId,
      actionId: this.requestDetail.request.actionId,
      isShowLogOnly: true,
      issueTypeId: this.requestDetail.request.issueTypeId,
      subIssueTypeId: StaticService.getSubIssueTypeId(this.requestDetail),
    };
    if (this.isWrongScore()) {
      query.wrongScoreModels = MappingModelStaticService.buildWrongScoreGetLogInfoModel(this.requestDetail.wrongScoreModels);
    } else if (this.isWrongOdds()) {
      query.wrongOddsModels = MappingModelStaticService.buildWrongOddsGetLogInfoModel(this.requestDetail.wrongOddsModels);
    } else if (this.isReducedOver()) {
      query.reducedOverModels = MappingModelStaticService.buildReducedOverGetLogInfoModel(this.requestDetail.reducedOverModels);
    }

    return query;
  }

  async callApiGetLogInfo(query: GetLogInfoQuery) {
    const logInfoList = await this.commonService.getLogInfo(query);
    logInfoList.getLogInfoModels.forEach(logInfo => {
      this.logInfoDetails.push(logInfo.logInfoDetail);
    });
  }

  public isHasLogInfo(): boolean {
    return this.isWrongScore() || this.isWrongOdds() || this.isReducedOver();
  }

  getProducts(productIds: string): string {
    return productIds
      .replace('1', 'Sportsbook')
      .replace('2', 'Parlay')
      .replace('3', 'Bet Builder')
      .replace('4', 'Outright')
      .replace('5', 'Saba')
      .replace('6', 'Non-Sports');
  }

  getStatus(statusIds: string): string {
    return statusIds
      .replace('0,1', 'Running')
      .replace('112', 'Won')
      .replace('113', 'Lose')
      .replace('111', 'Draw');
  }
}
