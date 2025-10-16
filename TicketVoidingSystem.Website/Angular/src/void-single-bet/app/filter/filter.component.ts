import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import moment from 'moment-timezone';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { GetPlayersQuery } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GetBetTypesQuery, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { DateFullTimeNewComponent } from '../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { LicenseeAffectedListComponent } from '../../../utility/components/licensee-affected-list/licensee-affected-list.component';
import { AffectedLicensee } from '../../../utility/components/licensee-affected-list/licensee-affected-list.model';
import { MultipleSelectionComponent } from '../../../utility/components/multiple-selection/multiple-selection.component';
import { PagingConstant } from '../../../utility/components/paging/paging.model';
import { TemplateContent } from '../../../utility/components/template-message/template-message/template.model';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ComboParlayConstants } from '../../../utility/constants/combo-parlay.constant';
import { DateTimeFormat, ModeType } from '../../../utility/constants/config';
import { SportType } from '../../../utility/constants/sport.constant';
import { TEXT } from '../../../utility/constants/text';
import { OnlyNumberDirective } from '../../../utility/directives/number.directive';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { AppService } from '../app.service';
import { GetTicketsQuery } from '../models/query.model';
import { Bet, Item, Type } from './filter.model';
import { FilterService } from './filter.service';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection.model';
import { GroupBetTypesService } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.service';
import { ItemsSelectService } from '../../../utility/components/multiple-selection/items-select.service';

@Component({
  standalone: true,
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [CommonModule, FormsModule, AdvancedModeComponent, GroupBetTypesComponent, DateFullTimeNewComponent,
    MultipleSelectionComponent, LicenseeAffectedListComponent, TooltipComponent, NgSelectModule, OnlyNumberDirective],
  providers: [FilterService]
})
export class FilterComponent implements OnInit {
  @Input() licenseeAffectedList: AffectedLicensee[] = [];
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
  comboParlay: Selection[] = [];
  selectedComboParlay: string[] = [];
  isCheckTime = true;
  private readonly BET_ITEM_SUB_PARLAY = 'Sub Parlay';

  element = inject(ElementRef);
  appService = inject(AppService);
  commonService = inject(CommonService);
  filterService = inject(FilterService);
  groupBetTypesService = inject(GroupBetTypesService);
  itemsSelectService = inject(ItemsSelectService);
  
  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit() {
    await this.initFilter();
  }

  private renderComboParlay() {
    this.comboParlay = ComboParlayConstants.ComboParlay;
    this.selectedComboParlay = [];
  }

  private resetCheckedComboParlay() {
    this.selectedComboParlay = this.comboParlay.map(item => item.value);
  }

  private setDateTime() {
    const date = new Date();
    this.fromDateTime = moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    this.toDateTime = moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  async initFilter() {
    this.setDateTime();
    this.renderComboParlay();
    this.initBet();
    await this.getRemark();
    await this.getIssueTypes();
    this.renderTicketType();
    this.renderEventType();
    this.renderOddsType();
    this.renderSettledType();
    this.renderGroupBetTypesHandler();
    this.renderIssueType();
    this.renderSubIssueType();
  }

  private initBet() {
    this.bet.value = 'All';
    this.changeControlBet(this.bet.value);
  }

  private async getRemark() {
    this.remark = await this.appService.getRemark();
  }

  async getIssueTypes(): Promise<void> {
    const data = await this.commonService.getIssueTypes();
    this.issueTypeModel = this.filterService.updateIssueTypes(data);
  }

  private renderTicketType() {
    this.ticketType.items = [];
    this.ticketType.items.push(new Item('0', 'All'));
    this.ticketType.items.push(new Item('1', 'Normal Tickets'));
    this.ticketType.items.push(new Item('2', 'SA Tickets'));
    this.ticketType.value = '0';
  }

  private renderIssueType(): void {
    if (this.issueTypeModel && this.issueTypeModel.issueTypes) {
      this.issueType.items = this.issueTypeModel.issueTypes.map(({ issueTypeId, issueTypeName }) => ({ value: issueTypeId.toString(), name: issueTypeName }));
      this.issueType.value = this.issueType.items[0].value;
    }
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
    this.handleBetTypeOfBasketball();
    this.updateEventType.emit(this.eventType.value);
  }

  private handleBetTypeOfBasketball(){
    this.filterService.handleBetTypeOfBasketball(this.eventType.value, this.issueType.value, this.subIssueType.value, this.allBetTypes, this.groupBetTypes);
    this.changeBetTypes(this.groupBetTypesService.getAllBetType(this.groupBetTypes.groupBetTypes));
  }

  changeIssueTypeEvent() {
    this.subIssueType.items = this.issueTypeModel.subIssueTypes
      .filter(x => x.issueTypeId.toString() === this.issueType.value)
      .map(({ subIssueTypeId, subIssueTypeName }) => ({ value: subIssueTypeId.toString(), name: subIssueTypeName }));

    //TODO: only remove subtype on UI - feat: 173229
    this.subIssueType.items = this.subIssueType.items.filter(x => x.value !== '27' && x.value !== '39' && x.value !== '41');
    //END

    this.subIssueType.value = this.subIssueType.items[0]?.value;
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
      this.resetCheckedComboParlay();
    } else {
      this.searchParlay = false;
    }
  }

  async blurMatchId() {
    if (this.matchId !== undefined && this.matchId !== this.preMatchId) {
      this.groupBetTypes = new GroupBetTypesModel();
      this.advancedModeComponent.resetBetTeam();
      if (StaticService.isNumber(this.matchId)) {
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
    this.groupBetTypes = this.groupBetTypesService.initGroupBetTypesModel(data.groupBetTypes, false);
    const temp = [];
    data.groupBetTypes.forEach(group => {
      temp.push(ItemsSelectService.initItemsSelect(0, group.groupName, group.groupName, true, true, true, []));
    });
    this.groupBetTypesHandler.items = temp;
    this.allBetTypes = this.groupBetTypesService.getAllBetType(this.groupBetTypes.groupBetTypes);
    this.handleBetType216();
    this.handleBetTypeOfBasketball();
  }

  displayGroupBetTypes(groups: string[]) {
    this.groupBetTypesComponent.displayGroup(groups);
  }

  private handleBetType216() {
    if (this.groupBetTypesService.hasBetType(this.groupBetTypes.groupBetTypes, 216)) {
      this.getPlayerQuery = new GetPlayersQuery(this.matchId, '216');
    }
  }

  async search() {
    this.isViewLogInfoOnly = false;
    if (this.checkFilterParams()) {
      this.getTicketsQuery = this.getParams();
      this.playerNamesSelected = this.filterService.getPlayerNamesSelected(this.getTicketsQuery.betTypes, this.advancedModeComponent.oddsInfo);
      this.searchEvent.emit(this.getTicketsQuery);
    }
  }

  async viewLogInfo() {
    this.isViewLogInfoOnly = true;
    if (this.checkFilterParams()) {
      this.getTicketsQuery = this.getParams();
      this.viewLogInfoEvent.emit(this.getTicketsQuery);
    }
  }

  checkFilterParams(): boolean {
    if(this.filterService.inValidMatch(this.matchId, this.isSuccessMatch, this.tooltip)){
      return false;
    }
    if (this.oddsValue && !this.isCorrectFormatOdds(this.oddsValue, 'odds-input')) {
      return false;
    }
    if (!this.filterService.isTransDateValidity(this.fromTimeComponent, this.toTimeComponent, this.fromDateTime, this.toDateTime, this.tooltip)) {
      return false;
    }
    if (this.filterService.isSelectionNotValid(this.bet.value, this.selectedComboParlay)) {
      this.tooltip.display('selection-dropdown-sub-parlay', TEXT.SELECT_AT_LEAST_ONE_OPTION);
      return false;
    }
    return this.groupBetTypesComponent.validate() && this.advancedModeComponent.validate();
  }

  getParams(): GetTicketsQuery {
    const checkedBetTypes = this.groupBetTypesService.getValueCheckedBetTypes(this.groupBetTypes.groupBetTypes);
    const betTypes = this.advancedModeComponent.getBetTypeModels(checkedBetTypes);
    const invalidTransDate = !this.filterService.isTransDateValidity(this.fromTimeComponent, this.toTimeComponent, this.fromDateTime, this.toDateTime, this.tooltip);

    return {
      matchId: parseInt(this.matchId, 10),
      eventType: this.eventType.value,
      liveAwayScore: this.liveAwayScore,
      liveHomeScore: this.liveHomeScore,
      fromTransDate: this.isCheckTime ? this.fromDateTime : null,
      toTransDate: this.isCheckTime ? this.toDateTime : null,
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
      timeType: this.timeType,
      selectionSubParlays: this.filterService.getSelectionSubParlays(this.bet.value, this.selectedComboParlay),
      isCheckTime: this.isCheckTime
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
    this.groupBetTypes = new GroupBetTypesModel();
    this.advancedModeComponent.resetBetTeam();
    this.licenseeAffectedList = [];
  }

  changeBetTypes(betTypes: BetType[]) {
    this.allBetTypes = betTypes;
  }

  public isCorrectFormatOdds(value: string, elementClass: string): boolean {
    if (value === '') {
      this.tooltip.hide();
      return true;
    }

    return StaticService.isCorrectFormatMultipleDecimal(value, elementClass, this.tooltip, 'Invalid Odds!');
  }

  isShowSelectionSubParlay(): boolean {
    return this.bet.value === this.BET_ITEM_SUB_PARLAY;
  }
}
