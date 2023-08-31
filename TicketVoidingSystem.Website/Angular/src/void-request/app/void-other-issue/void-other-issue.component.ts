import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingConstant, PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { TemplateValue } from '../../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../../utility/components/template-message/template-message/template.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { AbnormalFilterBy, ModeType, SubIssueTypeGroup, TVSRequestFilterBy } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { EventType } from '../../../utility/constants/sport.constant';
import { TEXT } from '../../../utility/constants/text';
import { AffectedLicensee } from '../../../utility/models/affected-licensee.model';
import { CheckingPermissionModel } from '../../../utility/models/checking-permission.model';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../utility/models/match.model';
import { VoidedReason } from '../../../utility/models/reason.model';
import { CommonService } from '../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../utility/services/mapping-model-static.service';
import { PasswordService } from '../../../utility/services/password.service';
import { StaticService } from '../../../utility/services/static.service';
import { CheckRequestService } from '../services/check-request.service';
import { ConfirmationComponent } from './../../../utility/components/confirmation/confirmation.component';
import { IssueInfo } from './../../../utility/models/issue-type.model';
import { AppService } from './../app.service';
import { GetTicketsQuery } from './../models/get-tickets.query';
import { VoidTicketsQuery } from './../models/void-tickets.query';
import { TicketsModel } from './../tickets-list/tickets.model';
@Component({
  selector: 'void-other-issue',
  templateUrl: './void-other-issue.component.html',
  styleUrls: ['./void-other-issue.component.scss']
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
  correctOdds: string = null;
  isPoolHouseAffected: boolean;
  isShowVar?: boolean;

  affectedLicensee = new AffectedLicensee();
  affectedInstantLicensee = new AffectedLicensee();
  chinaViewLicensee = new AffectedLicensee();
  jollyViewLicensee = new AffectedLicensee();
  cashOutLicensee = new AffectedLicensee();
  voidQuery = new VoidTicketsQuery();

  uncheckedTransIds: string[] = [];
  singleTransIds: string[];
  parlayTransIds: string[];
  cricketTransIds: string[];
  cancelCashOutTransIds: string[];
  usernames = '';
  transInfo: string;

  constructor(
    private readonly commonService: CommonService,
    private readonly appService: AppService,
    private readonly modalService: ModalService,
    private readonly templateService: TemplateService,
    private readonly checkRequestService: CheckRequestService,
    private readonly clipboardService: ClipboardService,
    private readonly element: ElementRef,
    private readonly passwordService: PasswordService
  ) {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
  }

  async initData() {
    this.paging.selection = [PagingConstant.SIZE_ONE, PagingConstant.SIZE_TWO, PagingConstant.SIZE_THREE, PagingConstant.SIZE_FOUR];
    this.paging.pageSize = PagingConstant.SIZE_ONE;
    if (this.isAbnormalAccount()) {
      this.usernames = this.requestDetail.event.usernames.split(',').join(', ');
    }
    if (this.isHasLogInfo()) {
      await this.getLogInfoModel();
    }
    this.initDataForDisplayLogInfo();
    this.initLiveScore();
    await this.getMatchInfo();
    this.issue = await this.commonService.getIssueInfo(StaticService.getSubIssueTypeId(this.requestDetail));
    this.reason = await this.appService.getVoidedReason(this.issue.subIssueTypeId, this.isHasMatchInfo() ? this.match.sportType : 0);
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
      this.correctOdds = this.requestDetail.wrongOddsModels[0].correctOdds;
    }
  }

  async updateTemplate() {
    if (this.paging.total > 0) {
      this.updateTemplateValue();
      this.updateVoidedReason();
    }

    if (this.isWrongOdds()) {
      this.correctOdds = this.requestDetail.wrongOddsModels[0].correctOdds;
    }
  }

  private async initQuery(): Promise<void> {
    this.query.pageIndex = PagingConstant.INDEX_ZERO;
    this.query.pageSize = PagingConstant.SIZE_ONE;
    this.query.match = this.match;
    this.query.kickOffDate = this.getKickOffDate();
    this.query.requestId = this.requestId;
    this.query.issueTypeId = this.requestDetail.request.issueTypeId;
    this.query.subIssueTypeId = StaticService.getSubIssueTypeId(this.requestDetail);
  }

  private getKickOffDate(): string {
    if (this.isWrongScore()) {
      return this.requestDetail.wrongScoreModels[0].eventDate.toString();
    }

    if (this.isWrongOdds()) {
      return this.requestDetail.wrongOddsModels[0].eventDate.toString();
    }

    if (this.isReducedOver()) {
      return this.requestDetail.reducedOverModels[0].eventDate.toString();
    }

    return this.requestDetail.event.kickOffTime?.toString();
  }

  async getTickets() {
    try {
      this.isBlockBetList = true;
      this.isShowTicket = true;
      const data = await this.appService.getTickets(this.query);
      this.isBlockBetList = false;
      this.ticketsModel.initData(data);
      this.paging.total = data.total;
      this.affectedLicensee.licenseesName = data.licenseesName;
      this.affectedLicensee.show = true;
      this.affectedInstantLicensee.licenseesName = data.instantLicenseesName;
      this.affectedInstantLicensee.show = true;
      this.chinaViewLicensee.licenseesName = data.chinaViewLicenseesName;
      this.jollyViewLicensee.licenseesName = data.jollyViewLicenseesName;
      this.chinaViewLicensee.show = true;
      this.jollyViewLicensee.show = true;
      this.cashOutLicensee.licenseesName = data.cashOutLicenseesName;
      this.cashOutLicensee.show = true;
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

  updateTemplateValueForAbnormalBet() {
    if (this.isAbnormalBet()) {
      this.templateValue.filterBy = this.requestDetail.event.filterBy;
    }
  }

  updateTemplateValueForWrongOdds() {
    if (this.isWrongOdds()) {
      this.templateValue.checkAIOMessage = this.ticketsModel.isHasAioMessage;
      this.templateValue.match = this.match;
      this.templateValue.betTeam = this.requestDetail.wrongOddsModels[0].betTeam;
      this.templateValue.filterOuType = this.requestDetail.wrongOddsModels[0].filterOuType;
      this.templateValue.ouValue = this.requestDetail.wrongOddsModels[0].ouValue;
      this.templateValue.correctOdds = this.requestDetail.wrongOddsModels[0].correctOdds;
    }
  }

  updateTemplateValue() {
    if (this.isArchivedTickets()) {
      return;
    }
    this.templateValue = this.templateService.getTemplateValue(this.query.match);
    this.templateValue.kickOffTime = this.query.kickOffDate;
    this.templateValue.checkSettled = this.checkSettled();
    this.templateValue.fromTransTime = this.ticketsModel.fromTime;
    this.templateValue.toTransTime = this.ticketsModel.toTime;
    this.updateTemplateValueForAbnormalBet();
    this.updateTemplateValueForWrongScore();
    this.updateTemplateValueForWrongOdds();
    this.templateValue.totalTickets = this.ticketsModel.total;
  }

  private getLiveScoreForTemplateMessage(scoreNormalTicket: string, scoreOfMatch: string): string {
    return !scoreNormalTicket ? scoreOfMatch : scoreNormalTicket.split('|')[0].replace(/ /g, '');
  }

  updateVoidedReason() {
    this.confirmationComponent.confirmation.reason = this.reason.reasonEnglish;
    this.confirmationComponent.confirmation.reasonSC = this.reason.reasonChineseSimplified;
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
      if (this.requestDetail.event.statusIds === UNSETTLED_STATUS) {
        return false;
      }

      return true;
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
      reason: this.confirmationComponent.confirmation.reason,
      reasonSC: this.confirmationComponent.confirmation.reasonSC,
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
          if (this.isAbnormalAccount() || this.isAbnormalBetMixParlay() || this.isArchivedTickets()) {
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
    if (this.isAbnormalAccount()) {
      return false;
    }

    if (this.isAbnormalBetMixParlay()) {
      return false;
    }

    if (this.isArchivedTickets()) {
      return false;
    }

    return true;
  }

  isAbnormalAccount(): boolean {
    return StaticService.isAbnormalAccount(this.requestDetail.request.issueTypeId.toString());
  }

  isWrongScore(): boolean {
    return StaticService.isWrongScore(this.requestDetail.request.issueTypeId.toString());
  }

  isAbnormalBet(): boolean {
    return StaticService.isAbnormalBet(this.requestDetail.request.issueTypeId.toString());
  }

  isAbnormalBetMixParlay(): boolean {
    return this.isAbnormalBet() && this.requestDetail.event.filterBy === AbnormalFilterBy.MIX_PARLAY;
  }

  isArchivedTickets() {
    return StaticService.isArchivedTicket(this.requestDetail.request.issueTypeId.toString());
  }

  isWrongOdds() {
    return StaticService.isWrongOdds(this.requestDetail.request.issueTypeId.toString());
  }

  isReducedOver() {
    return StaticService.isReducedOver(this.requestDetail.request.issueTypeId.toString());
  }

  public isShowAffectedLicenseeArea(): boolean {
    return this.affectedLicensee.show && this.affectedLicensee.licenseesName.length > 0
      || this.chinaViewLicensee.show && this.chinaViewLicensee.licenseesName.length > 0
      || this.jollyViewLicensee.show && this.jollyViewLicensee.licenseesName.length > 0
      || this.affectedInstantLicensee.show && this.affectedInstantLicensee.licenseesName.length > 0
      || this.cashOutLicensee.show && this.cashOutLicensee.licenseesName.length > 0;
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
      query.matchId = this.requestDetail.wrongScoreModels[0].matchId;
      query.wrongScoreModels = MappingModelStaticService.buidWrongScoreGetLogInfoModel(this.requestDetail.wrongScoreModels);
    } else if (this.isWrongOdds()) {
      query.matchId = this.requestDetail.wrongOddsModels[0].matchId;
      query.wrongOddsModels = MappingModelStaticService.buidWrongOddsGetLogInfoModel(this.requestDetail.wrongOddsModels);
    } else if (this.isReducedOver()) {
      query.matchId = this.requestDetail.reducedOverModels[0].matchId;
      query.reducedOverModels = MappingModelStaticService.buidReducedOverGetLogInfoModel(this.requestDetail.reducedOverModels);
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
}
