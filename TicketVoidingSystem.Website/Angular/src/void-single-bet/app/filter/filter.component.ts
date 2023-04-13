import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from "moment";
import { ClipboardService } from 'ngx-clipboard';
import { AdvancedModeConstants } from '../../../utility/components/advanced-mode/advanced-mode.constants';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { CheckedBetType, GetPlayersQuery, OddsInfo } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GetBetTypesQuery, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { DateFullTimeNewComponent } from '../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { ItemsSelect } from '../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { PagingConstant } from '../../../utility/components/paging/paging/paging.model';
import { TemplateContent } from '../../../utility/components/template-message/template-message/template.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { BetTypeAutoCheckByIssue, BetTypeAutoUnCheckByIssue, BetTypeAutoUnCheckBySubIssue } from '../../../utility/constants/bettype-auto-check-list.constant';
import { DateTimeFormat, ModeType } from '../../../utility/constants/config';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SportType } from '../../../utility/constants/sport.constant';
import { SubIssueTypeConstant } from '../../../utility/constants/sub-issue-type.constant';
import { TEXT } from '../../../utility/constants/text';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { AppService } from '../app.service';
import { GetTicketsQuery } from '../models/query.model';
import { AffectedLicensee } from './../models/affected-licensee.model';
import { Bet, Item, Type } from './filter.model';
@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() affectedLicensee = new AffectedLicensee();
  @Input() affectedInstantLicensee = new AffectedLicensee();
  @Input() cashOutLicensee = new AffectedLicensee();
  @Input() chinaViewLicensee = new AffectedLicensee();

  @Output() searchEvent = new EventEmitter<GetTicketsQuery>();
  @Output() viewLogInfoEvent = new EventEmitter<GetTicketsQuery>();
  @Output() changeMatchEvent = new EventEmitter<string>();
  @Output() updateEventType = new EventEmitter<string>();
  @Output() updateIssueTypeEvent = new EventEmitter<number>();
  @Output() updateSubIssueTypeEvent = new EventEmitter<number>();
  @Input() matchViewModel = new MatchModel();

  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;
  @ViewChild('groupBetTypesComponent') groupBetTypesComponent: GroupBetTypesComponent;
  @ViewChild('advancedMode') advancedModeComponent: AdvancedModeComponent;


  getTicketsQuery = new GetTicketsQuery();
  tooltip = new Tooltip();
  remark: string[];
  isShowFilter = true;
  matchId: string;
  oddsValue: string;
  preMatchId: string;
  fromTransId: string;
  toTransId: string;
  isSuccessMatch = false;
  ticketType = new Type();
  eventType = new Type();
  oddsType = new Type();
  settledType = new Type();
  issueTypeModel: IssueTypesModel;
  issueType = new Type();
  subIssueType = new Type();
  liveHomeScore: string;
  liveAwayScore: string;
  isViewLogInfoOnly = false;
  searchParlay = false;
  fromDateTime: string;
  toDateTime: string;
  bet = new Bet();
  groupBetTypes: GroupBetTypesModel;
  groupBetTypesHandler: MultipleSelection;
  allBetTypes: BetType[];
  getPlayerQuery: GetPlayersQuery;
  timeType = 0;
  playerNamesSelected: TemplateContent;

  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';
  constructor(
    private readonly element: ElementRef,
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly clipboardService: ClipboardService
  ) {
    this.tooltip.element = this.element;
  }

  async ngOnInit() {
    await this.initFilter();
  }

  setDateTime() {
    const date = new Date();
    this.fromDateTime = moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    this.toDateTime = moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

  }

  async initFilter() {
    this.setDateTime();
    await this.getRemark();
    await this.getIssueTypes();
    this.initBet();
    this.renderTicketType();
    this.renderEventType();
    this.renderOddsType();
    this.renderSettledType();
    this.renderGroupBetTypesHandler();
    this.renderIssueType();
    this.renderSubIssueType();
  }

  initBet() {
    this.bet.value = 'All';
    this.changeControlBet(this.bet.value);
  }

  async getRemark() {
    const data = await this.appService.getRemark();
    this.remark = data;
  }

  async getIssueTypes(): Promise<void> {
    const data = await this.commonService.getIssueTypes();
    data.issueTypes = data.issueTypes.filter(
      x => x.issueTypeId.toString() !== IssueTypeConstant.EARLY_KICK_OFF && x.issueTypeId.toString() !== IssueTypeConstant.WRONG_KICK_OFF
        && x.issueTypeId.toString() !== IssueTypeConstant.ABNORMAL_BET && x.issueTypeId.toString() !== IssueTypeConstant.ABNORMAL_BET_REAL_MEMBER
    );

    this.issueTypeModel = data;
  }

  renderTicketType() {
    this.ticketType.items = [];
    this.ticketType.items.push(new Item('0', 'All'));
    this.ticketType.items.push(new Item('1', 'Normal Tickets'));
    this.ticketType.items.push(new Item('2', 'SA Tickets'));
    this.ticketType.value = '0';
  }

  private renderIssueType(): void {
    this.issueType.items = this.issueTypeModel.issueTypes.map(({ issueTypeId, issueTypeName }) => ({ value: issueTypeId.toString(), name: issueTypeName }));
    this.issueType.value = this.issueType.items[0].value;
  }

  private renderSubIssueType(): void {
    if (this.issueType.value) {
      this.changeIssueTypeEvent();
    }
  }

  renderEventType() {
    this.eventType.items = [];
    this.eventType.items.push(new Item('2', 'All'));
    this.eventType.items.push(new Item('0', 'Dead Ball'));
    this.eventType.items.push(new Item('1', 'Live Ball'));
    this.eventType.value = '2';
  }

  renderOddsType() {
    this.oddsType.items = [];
    this.oddsType.items.push(new Item('DEC', 'DEC'));
    this.oddsType.items.push(new Item('MY', 'MY'));
    this.oddsType.value = 'DEC';
  }

  renderSettledType() {
    this.settledType.items = [];
    this.settledType.items.push(new Item('All', 'All'));
    this.settledType.items.push(new Item('Unsettled', 'Unsettled'));
    this.settledType.items.push(new Item('Instantly', 'Instantly Settled'));
    this.settledType.items.push(new Item('Settled', 'Normal Settled'));
    this.settledType.value = 'All';
  }

  renderGroupBetTypesHandler() {
    this.groupBetTypesHandler = new MultipleSelection();
    this.groupBetTypesHandler.checkAllCheckBoxText = 'Check All';
    this.groupBetTypesHandler.allItemsCheckedText = 'All';
    this.groupBetTypesHandler.noneItemCheckedText = 'Select options';
    this.groupBetTypesHandler.maxWidth = '120px';
    this.groupBetTypesHandler.items = [];
  }

  changeEventType() {
    this.updateEventType.emit(this.eventType.value);
  }

  changeIssueTypeEvent() {
    this.subIssueType.items = this.issueTypeModel.subIssueTypes
      .filter(x => x.issueTypeId.toString() === this.issueType.value)
      .map(({ subIssueTypeId, subIssueTypeName }) => ({ value: subIssueTypeId.toString(), name: subIssueTypeName }));

    //TODO: only remove subtype on UI - feat: 173229
    this.subIssueType.items = this.subIssueType.items.filter(x => x.value !== '27' && x.value !== '39' && x.value !== '41');
    //END

    this.subIssueType.value = this.subIssueType.items[0].value;
    this.updateIssueTypeEvent.emit(Number(this.issueType.value));
    this.changeSubIssueTypeEvent();

  }

  changeSubIssueTypeEvent() {
    if (this.allBetTypes?.length > 0 && this.matchViewModel.sportType === SportType.BASKETBALL) {
      this.handleBetTypeOfBasketball();
    }

    this.updateSubIssueTypeEvent.emit(Number(this.subIssueType.value));
  }

  changeControlBet(value: string) {
    this.bet.value = value;
    if (value !== 'Single') {
      this.searchParlay = true;
      this.ticketType.value = '0';
      this.settledType.value = 'All';
    } else {
      this.searchParlay = false;
    }
  }

  async blurMatchId() {
    if (this.matchId !== undefined && this.matchId !== this.preMatchId) {
      this.groupBetTypes = new GroupBetTypesModel([], false);
      this.advancedModeComponent.resetBetTeam();
      if (this.isNumber(this.matchId)) {
        await this.getMatchInfo();
        await this.getGroupBetTypes();
      } else {
        this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
      }

      this.preMatchId = this.matchId;
      this.changeMatchEvent.emit(this.matchId);
    }

  }

  async getMatchInfo(): Promise<void> {
    this.matchViewModel = await this.appService.getMatchInfo(Number(this.matchId));
  }

  isNumber(value: string): boolean {
    return /^\+?(0|[1-9]\d*)$/.test(value);
  }

  async getGroupBetTypes() {
    const query: GetBetTypesQuery = {
      mode: ModeType.SPORT_BOOK,
      matchId: parseInt(this.matchId, 10)
    };
    const data = await this.appService.getGroupBetTypes(query);
    this.handleGroupBetTypes(data);
  }

  handleGroupBetTypes(data: GroupBetTypesModel) {
    if (data.result.errorCode === 0) {
      if (data.groupBetTypes.length === 0) {
        this.tooltip.display('match-id', TEXT.NO_BETTYPE);
      }

      this.isSuccessMatch = true;
    } else {
      this.tooltip.display('match-id', data.result.errorMsg);
      this.isSuccessMatch = false;
    }
    this.groupBetTypes = new GroupBetTypesModel(data.groupBetTypes, false);
    const temp = [];
    data.groupBetTypes.forEach(group => {
      temp.push(new ItemsSelect(0, group.groupName, group.groupName, true, true, true, []));
    });
    this.groupBetTypesHandler.items = temp;
    this.allBetTypes = this.groupBetTypes.getAllBetType();
    this.handleBetType216();
    this.handleBetTypeOfBasketball();
  }

  displayGroupBetTypes(groups: string[]) {
    this.groupBetTypesComponent.displayGroup(groups);
  }

  handleBetTypeOfBasketball(): void {
    if (this.issueType.value !== IssueTypeConstant.WRONG_HDP
      && this.issueType.value !== IssueTypeConstant.WRONG_1ST_HDP
      && this.issueType.value !== IssueTypeConstant.WRONG_OU
      && this.issueType.value !== IssueTypeConstant.WRONG_1ST_OU
      && this.issueType.value !== IssueTypeConstant.WRONG_QUARTER_HDP
      && this.issueType.value !== IssueTypeConstant.WRONG_SCORE) {
      return;
    }

    this.checkAndUncheckBetTypesOfBasketball();
  }

  private checkAndUncheckBetTypesOfBasketball(): void {
    if (this.allBetTypes.some(x => x.isChecked)) {
      this.unCheckAllBetType();
    }

    if (this.issueType.value.toString() === IssueTypeConstant.WRONG_HDP) {
      this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_HDP);
    }

    if (this.issueType.value.toString() === IssueTypeConstant.WRONG_1ST_HDP) {
      this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_1ST_HDP);
    }

    if (this.issueType.value.toString() === IssueTypeConstant.WRONG_OU) {
      if (this.subIssueType.value.toString() === SubIssueTypeConstant.WRONG_QUARTER_OU) {
        this.checkAllBetType();
        this.unCheckBetTypeByCondition(BetTypeAutoUnCheckBySubIssue.WRONG_QUARTER_OU);
      }
      if (this.subIssueType.value.toString() === SubIssueTypeConstant.WRONG_OU) {
        this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_OU);
      }
    }

    if (this.issueType.value.toString() === IssueTypeConstant.WRONG_1ST_OU) {
      this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_1ST_OU);
    }

    if (this.issueType.value.toString() === IssueTypeConstant.WRONG_QUARTER_HDP) {
      this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_QUARTER_HDP);
    }

    if (this.issueType.value.toString() === IssueTypeConstant.WRONG_SCORE) {
      this.checkAllBetType();
      this.unCheckBetTypeByCondition(BetTypeAutoUnCheckByIssue.WRONG_SCORE);
    }

    this.groupBetTypes.changeCheckGroupByBetTypes();
    this.groupBetTypes.changeCheckedGroupToModel();
    this.changeBetTypes(this.groupBetTypes.getAllBetType());
  }

  private checkAllBetType() {
    this.allBetTypes.forEach(x => {
      x.isChecked = true;
    });
  }

  private unCheckAllBetType() {
    this.allBetTypes.forEach(x => {
      x.isChecked = false;
    });
  }

  private checkBetTypeByCondition(betTypeAutoCheckList: number[]) {
    this.allBetTypes.forEach(x => {
      if (betTypeAutoCheckList.includes(x.id)) {
        x.isChecked = true;
      }
    });
  }

  private unCheckBetTypeByCondition(betTypeAutoCheckList: number[]) {
    this.allBetTypes.forEach(x => {
      if (betTypeAutoCheckList.includes(x.id)) {
        x.isChecked = false;
      }
    });
  }

  handleBetType216() {
    if (this.groupBetTypes.hasBetType(216)) {
      this.getPlayerQuery = new GetPlayersQuery(this.matchId, '216');
    }
  }

  async search() {
    this.isViewLogInfoOnly = false;
    if (this.checkFilterParams()) {
      this.getTicketsQuery = this.getParams();
      this.setPlayerNamesSelected();
      this.searchEvent.emit(this.getTicketsQuery);
    }
  }

  setPlayerNamesSelected() {
    this.playerNamesSelected = new TemplateContent();
    this.playerNamesSelected.msgEnglish = '';
    this.playerNamesSelected.msgChineseTraditional = '';
    this.playerNamesSelected.msgChineseSimplified = '';
    this.playerNamesSelected.msgChineseNewSimplified = '';

    const playerValueSelected = this.getPlayerValueSelectedFromBetTypeQuery();
    if (playerValueSelected.length) {
      const selectedOddsInfo = this.mapPlayerValueToOddsInfo(playerValueSelected);
      this.replaceEnglishForChinese(selectedOddsInfo);
      this.playerNamesSelected.msgEnglish = [...new Set(selectedOddsInfo.map(x => x.playerName))].join(' & ');
      this.playerNamesSelected.msgChineseTraditional = [...new Set(selectedOddsInfo.map(x => x.playNamesChineseTraditional))].join(' 和 ');
      this.playerNamesSelected.msgChineseSimplified = [...new Set(selectedOddsInfo.map(x => x.playNamesChineseSimplified))].join(' 和 ');
      this.playerNamesSelected.msgChineseNewSimplified = [...new Set(selectedOddsInfo.map(x => x.playNamesChineseSimplified))].join(' 和 ');
    }
  }

  replaceEnglishForChinese(selectedOddsInfo: OddsInfo[]) {
    selectedOddsInfo.forEach(player => {
      if (!player.playNamesChineseTraditional) {
        player.playNamesChineseTraditional = player.playerName;
      }
      if (!player.playNamesChineseSimplified) {
        player.playNamesChineseSimplified = player.playerName;
      }
    });
  }

  getPlayerValueSelectedFromBetTypeQuery(): string[] {
    const cricketBetTypeIdList = AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER.split(',');
    const cricketBetTypeList = this.getTicketsQuery.betTypes.filter(x => {
      return cricketBetTypeIdList.includes(x.id.toString());
    });

    return cricketBetTypeList.flatMap(betType => this.splitCricketBetTypeQuery(betType));
  }

  splitCricketBetTypeQuery(betType: CheckedBetType): string[] {
    if (betType.transdesc) {
      return betType.transdesc.split(',');
    }

    if (betType.oddsId) {
      const items: string[] = [];
      const betTeams = betType.betTeam.split(',');
      const oddsIds = betType.oddsId.split(',');
      for (let i = 0; i < betTeams.length; i++) {
        items.push(`${betTeams[i]},${oddsIds[i]}`);
      }

      return items;
    }

    return [];
  }

  isPlayerValueMatchWithOddsInfo(oddsInfo: OddsInfo, value: string): boolean {
    return (value === oddsInfo.playerId) || (value === `${oddsInfo.betChoice},${oddsInfo.oddsId}`);
  }

  mapPlayerValueToOddsInfo(playerValueSelected: string[]): OddsInfo[] {
    const distinctPlayerValue = [...new Set(playerValueSelected)];
    return distinctPlayerValue.map(value => {
      return this.advancedModeComponent.oddsInfo.find(x => this.isPlayerValueMatchWithOddsInfo(x, value));
    }).filter(x => x);
  }

  async viewLogInfo() {
    this.isViewLogInfoOnly = true;
    if (this.checkFilterParams()) {
      this.getTicketsQuery = this.getParams();
      this.viewLogInfoEvent.emit(this.getTicketsQuery);
    }
  }

  private isTransDateValidity(): boolean {
    return this.fromTimeComponent.validateWithTooltip() && this.toTimeComponent.validateWithTooltip()
      && StaticService.isFromTimeSameOrBeforeToTime(this.fromDateTime, this.toDateTime, this.tooltip, this.FROM_DATE_TIME_CLASS);
  }

  checkFilterParams(): boolean {
    if (!this.matchId) {
      this.tooltip.display('match-id', TEXT.REQUIRED_MATCHID);
      return false;
    }
    if (!this.isSuccessMatch) {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
      return false;
    }
    if (this.oddsValue && !this.isCorrectFormatOdds(this.oddsValue, 'odds-input')) {
      return false;
    }
    if (!this.isTransDateValidity()) {
      return false;
    }

    return this.groupBetTypesComponent.validate() && this.advancedModeComponent.validate();
  }

  getParams(): GetTicketsQuery {
    const checkedBetTypes = this.groupBetTypes.getValueCheckedBetTypes();
    const betTypes = this.advancedModeComponent.getBetTypeModels(checkedBetTypes);
    const invalidTransDate = !this.isTransDateValidity();

    return {
      matchId: parseInt(this.matchId, 10),
      eventType: this.eventType.value,
      liveAwayScore: this.liveAwayScore,
      liveHomeScore: this.liveHomeScore,
      fromTransDate: this.fromDateTime,
      toTransDate: this.toDateTime,
      oddsType: this.oddsType.value,
      oddsValue: this.oddsValue,
      ticketType: this.ticketType.value,
      settledType: this.settledType.value,
      betTypes: betTypes,
      bet: this.bet.value,
      match: null,
      pageIndex: PagingConstant.INDEX_ZERO,
      pageSize: PagingConstant.SIZE_DEFAULT,
      invalidTransDate: invalidTransDate,
      timeType: this.timeType
    };

  }

  resetFilter() {
    this.matchId = '';
    this.preMatchId = '';
    this.isSuccessMatch = false;
    this.fromTransId = '';
    this.toTransId = '';
    this.oddsType.value = 'DEC';
    this.oddsValue = '';
    this.setDateTime();
    this.groupBetTypes = new GroupBetTypesModel([], false);
    this.advancedModeComponent.resetBetTeam();
  }

  changeBetTypes(betTypes: BetType[]) {
    this.allBetTypes = betTypes;
  }

  copyClipboard(text: string) {
    this.clipboardService.copyFromContent(text);
    alert('The Licensee list has been copied to clipboard.');
  }

  public isShowAffectedLicenseeArea(): boolean {
    return this.affectedLicensee.show && this.affectedLicensee.licenseesName?.length > 0 ||
      this.chinaViewLicensee.show && this.chinaViewLicensee.licenseesName?.length > 0 ||
      this.affectedInstantLicensee.show && this.affectedInstantLicensee.licenseesName?.length > 0 ||
      this.cashOutLicensee.show && this.cashOutLicensee.licenseesName?.length > 0;
  }

  public isCorrectFormatOdds(value: string, elementClass: string): boolean {
    if (value === '') {
      this.tooltip.hide();
      return true;
    }

    if (!StaticService.isCorrectFormatMultipleDecimal(value)) {
      this.tooltip.display(elementClass, 'Invalid Odds!');
      return false;
    }
    this.tooltip.hide();

    return true;
  }
}
