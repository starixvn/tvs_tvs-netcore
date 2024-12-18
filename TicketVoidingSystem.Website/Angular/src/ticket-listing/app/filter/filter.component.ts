import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { default as moment, default as momenttimezone } from 'moment-timezone';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GetBetTypesQuery, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BetTypesVirtualSportComponent } from '../../../utility/components/bettypes-virtualsports/bettypes-virtualsports.component';
import { GroupBetTypeVirtualSport } from '../../../utility/components/bettypes-virtualsports/bettypes-virtualsports.model';
import { BetTypesComponent } from '../../../utility/components/bettypes/bettypes.component';
import { BetTypeModel, BetTypesModel } from '../../../utility/components/bettypes/bettypes.model';
import { BlockUiService } from '../../../utility/components/block-ui/block-ui.service';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ComboParlayConstants } from '../../../utility/constants/combo-parlay.constant';
import { DateTimeFormat, ModeType, Product } from '../../../utility/constants/config';
import { TEXT } from '../../../utility/constants/text';
import { BallSequences } from '../../../utility/models/ball-sequences';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { AppService } from '../app.service';
import { GetSummaryQuery } from '../models/query.model';
import { FilterEvent, Item, Licensee, Type } from './filter.model';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<FilterEvent>();
  @Output() changeMatchEvent = new EventEmitter<string>();
  @ViewChild('groupBetTypesComponent') groupBetTypesComponent: GroupBetTypesComponent;
  @ViewChild('bettypesComponent') betTypesComponent: BetTypesComponent;
  @ViewChild('betTypesVSComponent') betTypesVSComponent: BetTypesVirtualSportComponent;
  @ViewChild('advancedMode') advancedModeComponent: AdvancedModeComponent;
  public query = new GetSummaryQuery();
  tooltip = new Tooltip();
  isShowFilter = true;
  matchId: string;
  preMatchId: string;
  checkMatch: string;
  match: MatchModel;
  sportType: number;
  singleOrSubParlay = 'All';
  isReSettled = false;
  licensees: Licensee[];
  groupBy = new Type();
  ticketType = new Type();
  product = new Type();
  eventType = new Type();
  disabledTransDate = true;
  fromDate: string;
  toDate: string;
  groupBetTypes: GroupBetTypesModel;
  groupsBetTypesVS: GroupBetTypeVirtualSport;
  betTypes: BetTypesModel;
  commonBetTypes: BetTypesModel;
  ballSequences = new BallSequences();
  isMatch3rd: boolean;
  switchMatch3rd: boolean;
  allBetTypes: BetType[];
  comboParlay: MultipleSelection;

  constructor(
    private readonly element: ElementRef,
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly blockUIService: BlockUiService
  ) {
    this.tooltip.element = this.element;
  }

  async ngOnInit() {
    await this.initFilter();
    this.setDateTime();
    this.groupBetTypes = new GroupBetTypesModel([], false);
    this.renderComboParlay();
  }

  renderComboParlay() {
    this.comboParlay = new MultipleSelection();
    this.comboParlay.checkAllCheckBoxText = 'All';
    this.comboParlay.allItemsCheckedText = 'All';
    this.comboParlay.noneItemCheckedText = 'Select options';
    this.comboParlay.maxWidth = '115px';
    this.comboParlay.items = ComboParlayConstants.ComboParlay;
  }

  resetCheckedComboParlay(){
    this.comboParlay.items.forEach(x => x.checked = true);
  }

  setDateTime() {
    const date = new Date(
      momenttimezone()
        .tz('Etc/GMT-8')
        .format('YYYY-MM-DD HH:mm:ss.SSS')
    );
    this.fromDate = moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    this.toDate = moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  async initFilter() {
    await this.getLicensees();
    this.renderGroupBy();
    this.renderTicketType();
    this.renderProduct();
    this.renderEventType();
    await this.getBetTypes();
  }

  async getLicensees() {
    this.query.licenseeId = 0;
    this.licensees = await this.appService.getLicensees();
  }

  renderGroupBy() {
    this.groupBy.items = [];
    this.groupBy.items.push(new Item(0, 'Licensee and Bet type'));
    this.groupBy.items.push(new Item(1, 'Bet type and Licensee'));
    this.query.groupBy = 0;
  }

  renderTicketType() {
    this.ticketType.items = [];
    this.ticketType.items.push(new Item(0, 'All'));
    this.ticketType.items.push(new Item(1, 'Normal Tickets'));
    this.ticketType.items.push(new Item(2, 'SA Tickets'));
    this.query.ticketType = 0;
  }

  renderProduct() {
    this.product.items = [];
    for (const key of Object.keys(Product.DISPLAY)) {
      this.product.items.push(new Item(Product.DISPLAY[key], key));
    }

    this.query.product = 0;
  }

  renderEventType() {
    this.eventType.items = [];
    this.eventType.items.push(new Item(2, 'All'));
    this.eventType.items.push(new Item(0, 'Dead Ball'));
    this.eventType.items.push(new Item(1, 'Live Ball'));
    this.query.eventType = 2;
  }

  async changeProduct(value: number) {
    this.switchMatch3rd = Product.IS_MATCH_3RD.indexOf(this.query.product) > -1;
    this.query.product = value;
    this.isMatch3rd = Product.IS_MATCH_3RD.indexOf(value) > -1;
    this.switchMatch3rd = this.switchMatch3rd !== this.isMatch3rd;
    this.unCheckAffectedTickets()
    if (value !== Product.SPORTS_BOOK) {
      this.disabledTransDate = true;
      this.singleOrSubParlay = 'All';
      this.query.liveAwayScore = null;
      this.query.liveHomeScore = null;
      this.query.eventType = 2;
    } else {
      this.groupBetTypes.isChecked = true;
      this.groupBetTypes.changeCheckedModelToGroup();
    }

    if (Product.STATIC_BETTYPES.indexOf(value) > -1) {
      this.betTypes = this.commonBetTypes;
    }

    if (Product.BET_BUILDER === value) {
      this.betTypes = new BetTypesModel([], false);
    }

    await this.blurMatchId();
  }

  async getBetTypes() {
    const query: GetBetTypesQuery = {
      mode: ModeType.TICKET_LISTING,
      matchId: 0
    };
    this.blockUIService.start();
    const data = await this.commonService.getBetTypes(query);
    this.blockUIService.stop();
    if (data.result.errorCode === 0) {
      this.commonBetTypes = new BetTypesModel(data.betTypes, true);
    }
  }

  async blurMatchId() {
    if (_.isUndefined(this.matchId) || this.matchId === '') {
      this.sportType = 0;
    } else if (this.matchId !== this.preMatchId || this.switchMatch3rd) {
      this.preMatchId = this.matchId;
      await this.getMatchInfo();
    } else if (this.match !== null && this.match !== undefined) {
      await this.checkSportType();
    } else {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
    }
  }

  async getMatchInfo() {
    this.match = await this.appService.getMatchInfo(this.matchId, this.isMatch3rd);
    if (this.match === null) {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
    } else {
      this.sportType = this.match.sportType;
      await this.checkSportType();
    }
  }

  async checkSportType() {
    this.advancedModeComponent?.resetBetTeam();
    if (this.validateProduct()) {
      await this.handleByProduct();
    }
  }

  validateProduct(): boolean {
    const product = this.query.product;
    if (this.isInvalidProduct0(product, this.sportType)
      || this.isInvalidProduct1(product, this.sportType)
      || this.isInvalidProduct2(product, this.sportType)
      || this.isInvalidProduct9(product, this.sportType)
      || this.isInvalidOtherProducts(this.sportType))
      {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
      return false;
    }

    return true;
  }

  private inValidSportTypeVirtualSport(sportType: number){
    return (sportType < 180 || sportType > 186)                         //sportTypes invalid in  Virtual Sports
    && ((sportType < 190 || sportType > 199) && sportType !== 177)      //sportTypes invalid in  Virtual Sports 2
    && (sportType !== 178 && sportType !== 179)                         //sportTypes invalid in  Virtual Sports 3
    && (sportType !== 188)                                              //sportTypes invalid in  Virtual Sports 4
    && (sportType !== 147)                                              //sportTypes invalid in  Virtual Sports 5
    && (sportType !== 134);                                             //sportTypes invalid in  Virtual Sports 6
  }

  private isInvalidProduct0(product: number, sportType: number): boolean {
    return ((product === 0 ) && sportType > 99 && sportType !== 154);
  }

  private isInvalidProduct1(product: number, sportType: number): boolean {
    return (product === 1 && sportType !== 161 && sportType !== 164);
  }

  isInvalidProduct2(product: number, sportType: number): boolean {
    return (product === 2 && this.inValidSportTypeVirtualSport(sportType));
  }

  private isInvalidProduct9(product: number, sportType: number): boolean {
    return (product === 9 && sportType !== 175);
  }

  private isInvalidOtherProducts(sportType: number): boolean {
    return (
      this.isInvalidFirstGroupOtherProducts(sportType) &&
      this.isInvalidSecondGroupOtherProducts(sportType)
    );
  }

  private isInvalidFirstGroupOtherProducts(sportType: number): boolean {
    return (
      sportType > 99 &&
      sportType !== 154 &&
      sportType !== 161 &&
      sportType !== 164 &&
      (sportType < 180 || sportType > 186) &&
      ((sportType < 190 || sportType > 199) && sportType !== 177) &&
      sportType !== 178 && sportType !== 179 &&
      sportType !== 188 && sportType !== 147 && (sportType !== 134)
    );
  }

  private isInvalidSecondGroupOtherProducts(sportType: number): boolean {
    return (
      sportType !== 175
    );
  }

  async handleByProduct() {
    if (Product.GET_BETTYPES.indexOf(this.query.product) > -1) {
      this.groupBetTypes = new GroupBetTypesModel([], false);
      await this.handleBetTypes();
      this.changeMatchEvent.emit(this.matchId);
    }
  }

  isNumber(value: string): boolean {
    return /^\+?(0|[1-9]\d*)$/.test(value);
  }

  async handleBetTypes() {
    const query: GetBetTypesQuery = {
      mode: ModeType.TICKET_LISTING,
      matchId: parseInt(this.matchId, 10)
    };

    if (this.query.product === Product.SPORTS_BOOK) {
      this.handleGroupBetTypesOfSportBook(query);
    }

    if (this.query.product === Product.BET_BUILDER) {
      this.handleBetTypesOfBetBuilder(query);
    }

    if (this.query.product === Product.VIRTUAL_SPORTS) {
      this.handleGroupBetTypesOfVirtualSports(query);
    }
  }

  async handleGroupBetTypesOfSportBook(query: GetBetTypesQuery) {
    this.blockUIService.start();
    const data = await this.commonService.getGroupBetTypes(query);
    this.blockUIService.stop();
    if (data.result.errorCode === 0) {
      this.checkMatch = '';
      if (data.groupBetTypes.length === 0) {
        this.tooltip.display('match-id', TEXT.NO_BETTYPE);
        this.checkMatch = TEXT.NO_BETTYPE;
      }
    } else {
      this.checkMatch = data.result.errorMsg;
      this.tooltip.display('match-id', data.result.errorMsg);
    }

    if (this.query.product === Product.SPORTS_BOOK) {
      const specialGroups = _.filter(data.groupBetTypes, {
        groupName: 'Special'
      });
      if (specialGroups.length > 0) {
        specialGroups[0].betTypes = _.reject(specialGroups[0].betTypes, {
          name: 'System Parlay'
        });
      }
    }

    this.groupBetTypes = new GroupBetTypesModel(data.groupBetTypes, true);
    this.changeBetTypes(this.groupBetTypes.getAllBetType());
  }

  async handleBetTypesOfBetBuilder(query: GetBetTypesQuery) {
    const data = await this.appService.getSelectionTypes(query);
    if (data.length === 0) {
      this.tooltip.display('match-id', TEXT.NO_BETTYPE);
      this.checkMatch = TEXT.NO_BETTYPE;
    }

    const betTypes: BetTypeModel[] = [];
    data.forEach(item => {
      betTypes.push(new BetTypeModel(item.selectionType.toString(), item.selectionName, false, 8, true));
    });
    this.betTypes = new BetTypesModel(betTypes, true);
  }

  async handleGroupBetTypesOfVirtualSports(query: GetBetTypesQuery) {
    this.blockUIService.start();
    const data = await this.getBetTypesVS(query);
    this.blockUIService.stop();
    if (data.result.errorCode === 0) {
      this.checkMatch = '';
      if (data.betTypes.length === 0) {
        this.tooltip.display('match-id', TEXT.NO_BETTYPE);
        this.checkMatch = TEXT.NO_BETTYPE;
      }
    } else {
      this.checkMatch = data.result.errorMsg;
      this.tooltip.display('match-id', data.result.errorMsg);
    }
    this.groupsBetTypesVS = new GroupBetTypeVirtualSport(data.betTypes);
  }
  
  async getBetTypesVS(query: GetBetTypesQuery) {
    this.blockUIService.start();
    const groupsBetTypes = await this.commonService.getBetTypesVirtualSports(query);
    this.blockUIService.stop();

    return groupsBetTypes;
  }

  search() {
    if (this.checkFilterParams() && this.validateProduct() && this.validateBetTypes()) {
      const event: FilterEvent = {
        match: this.match,
        query: this.getParams()
      };
      this.searchEvent.emit(event);
    }
  }

  checkFilterParams(): boolean {
    if (this.matchId === '' || this.matchId === undefined) {
      this.tooltip.display('match-id', TEXT.REQUIRED_MATCHID);
      return false;
    }
    if (!this.isNumber(this.matchId) || this.match === null) {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
      return false;
    }
    if (this.isShowFilterTime() && !this.disabledTransDate && !StaticService.isFromTimeSameOrBeforeToTime(this.fromDate, this.toDate, this.tooltip, 'from-date-time')) {
      return false;
    }
    if (this.isSelectionNotValid()) {
      this.tooltip.display('multiple-selection', TEXT.INVALID_SELECTION);
      return false;
    }
    if (this.isShowAdvancedMode()) {
      return this.advancedModeComponent.validate();
    }

    return true;
  }

  isSelectionNotValid(){
    const selectionSubParlays = this.getSelectionSubParlays(this.singleOrSubParlay, this.comboParlay)
    return this.singleOrSubParlay === "SubParlay" && selectionSubParlays === "";
  }

  validateBetTypes() {
    if (this.query.product === Product.SPORTS_BOOK) {
      if (this.checkMatch === '') {
        return this.groupBetTypesComponent.validate();
      } else {
        this.tooltip.display('match-id', this.checkMatch);
        return false;
      }
    } else if (this.query.product === Product.VIRTUAL_SPORTS && this.groupsBetTypesVS.betTypes.length > 0) {
      return this.betTypesVSComponent.validate();
    } else {
      return this.betTypesComponent.validate();
    }
  }

  getParams(): GetSummaryQuery {
    this.query.matchId = parseInt(this.matchId, 10);
    this.query.ballSequence = this.ballSequences.value.join(',');
    this.query.fromTransDate = this.disabledTransDate ? null : this.fromDate;
    this.query.toTransDate = this.disabledTransDate ? null : this.toDate;
    this.query.singleOrSubParlay = this.singleOrSubParlay;
    this.query.isReSettled = this.isReSettled;
    this.query.selectionSubParlays = this.getSelectionSubParlays(this.singleOrSubParlay, this.comboParlay);

    if (this.query.product === Product.BET_BUILDER) {
      this.query.betTypes = '38';
      this.query.selectionType = this.getCheckedBetTypes();
    } else {
      this.query.betTypes = this.getCheckedBetTypes();
      this.query.selectionType = '';
    }
    if (this.isShowAdvancedMode()) {
      const checkedBetTypes = this.groupBetTypes.getValueCheckedBetTypes();
      const betTeams = this.advancedModeComponent.getBetTypeModels(checkedBetTypes);
      this.query.betTeams = betTeams;
    }
    else{
      this.query.betTeams = undefined;
    }
    return this.query;
  }

  getSelectionSubParlays(bet: string, comboParlay: MultipleSelection) {
    if (bet !== "SubParlay") {
      return "";
    }

    const selectedItems = comboParlay.items
      .filter(item => item.checked)
      .map(item => item.value);

    return selectedItems.join(",");
  }

  getCheckedBetTypes(): string {
    if (this.query.product === Product.SPORTS_BOOK) {
      return this.groupBetTypes.getValueCheckedBetTypes();
    } else if (this.query.product === Product.VIRTUAL_SPORTS) {
      return this.betTypesVSComponent.getCheckedBetTypes().join(',');
    } else {
      return this.betTypes.getCheckedBetTypes().join(',');
    }
  }

  changeBetTypes(betTypes: BetType[]) {
    this.allBetTypes = betTypes;
  }

  isShowCheckboxAffected(): boolean {
    if(this.query.product === Product.SPORTS_BOOK){
        return this.groupBetTypes && this.groupBetTypes.groupBetTypes.length > 0;
    }
    if(this.query.product === Product.BET_BUILDER){
      return this.betTypes && this.betTypes.betTypes.length > 0;
    }

    return false;
  }

  unCheckAffectedTickets(): void {
    this.isReSettled = false;
    this.enableBetTypesAndAdvancedMode();
    this.handleBetTypesAndAdvancedMode();
  }

  private enableGroupBetTypesAndAdvancedMode(): void {
    this.groupBetTypesComponent.isDisabledAllBetTypes = false;
  }

  private enableBetTypesAndAdvancedMode(): void {
    this.betTypesComponent.isDisabledAllBetTypes = false;
  }

  private checkAndDisabledAllBetTypes(): void {
    if(this.query.product === Product.BET_BUILDER){
      if (this.isReSettled) {
        this.betTypesComponent.isDisabledAllBetTypes = true;
        this.betTypes.isChecked = true;
        this.betTypes.betTypes.forEach(x => {
          x.isChecked = true;
        });
      } else {
        this.enableBetTypesAndAdvancedMode();
      }
    }
  }

  private checkAndDisabledAllGroupBetTypes(): void {
    if(this.query.product === Product.SPORTS_BOOK){
      if (this.isReSettled) {
        this.groupBetTypesComponent.isDisabledAllBetTypes = true;
        this.groupBetTypes.isChecked = true;
        this.groupBetTypes.groupBetTypes.forEach(x => {
          x.isChecked = true;
          x.betTypes.forEach(y => y.isChecked = true);
        });
      } else {
        this.enableGroupBetTypesAndAdvancedMode();
      }
    }
  }
  
  public handleBetTypesAndAdvancedMode(): void {
    this.checkAndDisabledAllBetTypes();
    this.checkAndDisabledAllGroupBetTypes();
  }

  isShowAdvancedMode(): boolean {
    return this.query.product === Product.SPORTS_BOOK;
  }

  isShowFilterTime(): boolean {
    return this.query.eventType && this.query.eventType.toString() === '1' && this.query.product === 0;
  }

  isShowSelectionSubParlay(): boolean {
    return this.singleOrSubParlay === "SubParlay";
  }
}
