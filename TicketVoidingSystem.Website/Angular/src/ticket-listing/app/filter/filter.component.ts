import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import filter from 'lodash/filter';
import isUndefined from 'lodash/isUndefined';
import reject from 'lodash/reject';
import { default as moment } from 'moment-timezone';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GetBetTypesQuery, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BetTypesVirtualSportComponent } from '../../../utility/components/bettypes-virtualsports/bettypes-virtualsports.component';
import { GroupBetTypeVirtualSport } from '../../../utility/components/bettypes-virtualsports/bettypes-virtualsports.model';
import { BetTypesComponent } from '../../../utility/components/bettypes/bettypes.component';
import { BetTypeModel, BetTypesModel } from '../../../utility/components/bettypes/bettypes.model';
import { BlockUiService } from '../../../utility/components/block-ui/block-ui.service';
import { DateFullTimeNewComponent } from '../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ComboParlayConstants } from '../../../utility/constants/combo-parlay.constant';
import { DateTimeFormat, ModeType, Product } from '../../../utility/constants/config';
import { TEXT } from '../../../utility/constants/text';
import { OnlyNumberDirective } from '../../../utility/directives/number.directive';
import { BallSequences } from '../../../utility/models/ball-sequences';
import { MatchModel } from '../../../utility/models/match.model';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';
import { GetSummaryQuery } from '../models/query.model';
import { FilterEvent, Item, Type } from './filter.model';
import { BetTypesService } from '../../../utility/components/bettypes/bettypes.service';
import { GroupBetTypesService } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.service';
import { FilterService } from './filter.service';

@Component({
  standalone: true,
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [CommonModule, FormsModule, NgSelectModule, AdvancedModeComponent, GroupBetTypesComponent,
    BetTypesComponent, BetTypesVirtualSportComponent, DateFullTimeNewComponent, TooltipComponent, OnlyNumberDirective],
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
  licenseeSelectList: { id: number, name: string }[] = [];
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
  comboParlay: Selection[] = [];
  selectedComboParlay: string[] = [];

  element = inject(ElementRef);
  appService = inject(AppService);
  commonService = inject(CommonService);
  blockUIService = inject(BlockUiService);
  appComponent = inject(AppComponent);
  betTypesService = inject(BetTypesService);
  groupBetTypesService = inject(GroupBetTypesService);
  filterService = inject(FilterService);

  async ngOnInit() {
    this.tooltip.element = this.element;
    await this.initFilter();
    this.setDateTime();
    this.groupBetTypes = new GroupBetTypesModel();
    this.renderComboParlay();
  }

  renderComboParlay() {
    this.comboParlay = ComboParlayConstants.ComboParlay;
    this.selectedComboParlay = [];
  }

  resetCheckedComboParlay() {
    this.selectedComboParlay = this.comboParlay.map(item => item.value);
  }

  setDateTime() {
    const date = new Date(
      moment()
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
    this.licenseeSelectList = await this.filterService.getLicenseeSelectList();
    this.query.licenseeId = 0;
  }

  renderGroupBy() {
    this.groupBy.items = [
      new Item(0, 'Licensee and Bet type'),
      new Item(1, 'Bet type and Licensee')
    ];
    this.query.groupBy = this.groupBy.items[0].value;
  }

  renderTicketType() {
    this.ticketType.items = [
      new Item(0, 'All'),
      new Item(1, 'Normal Tickets'),
      new Item(2, 'SA Tickets')
    ];
    this.query.ticketType = this.ticketType.items[0].value;
  }

  renderProduct() {
    this.product.items = [];
    Product.PRODUCT_LIST.forEach(p => {
      this.product.items.push(new Item(p.id, p.name));
    });

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
    if (!this.filterService.isSportsBookOrHybridParlay(value)) {
      this.disabledTransDate = true;
      this.singleOrSubParlay = 'All';
      this.query.liveAwayScore = null;
      this.query.liveHomeScore = null;
      this.query.eventType = 2;
    } else {
      this.groupBetTypes.isChecked = true;
      this.groupBetTypesService.changeCheckedModelToGroup(this.groupBetTypes);
    }

    if (Product.STATIC_BETTYPES.indexOf(value) > -1) {
      this.betTypes = this.commonBetTypes;
    }

    if (this.filterService.isBetBuilder(value)) {
      this.betTypes = new BetTypesModel();
    }

    await this.blurMatchId();
  }

  async getBetTypes() {
    const mode = this.query.product === Product.HYBRID_PARLAY ? ModeType.HYBRID_PARLAY : ModeType.TICKET_LISTING;
    const query: GetBetTypesQuery = {
      mode: mode,
      matchId: 0
    };
    this.blockUIService.start();
    const data = await this.commonService.getBetTypes(query);
    this.blockUIService.stop();
    if (data.result.errorCode === 0) {
      this.commonBetTypes = this.betTypesService.initBetTypesModel(data.betTypes, true);
    }
  }

  async blurMatchId() {
    if (isUndefined(this.matchId) || this.matchId === '') {
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
    if(this.filterService.invalidProduct(product, this.sportType)) {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
      return false;
    }

    return true;
  }
  
  async handleByProduct() {
    if (Product.GET_BETTYPES.indexOf(this.query.product) > -1) {
      this.groupBetTypes = new GroupBetTypesModel();
      await this.handleBetTypes();
      this.changeMatchEvent.emit(this.matchId);
    }
  }

  async handleBetTypes() {
    const mode = this.query.product === Product.HYBRID_PARLAY ? ModeType.HYBRID_PARLAY : ModeType.TICKET_LISTING;
    const query: GetBetTypesQuery = {
      mode: mode,
      matchId: parseInt(this.matchId, 10)
    };

    if (this.filterService.isSportsBookOrHybridParlay(this.query.product)) {
      this.handleGroupBetTypesOfSportBook(query);
    }

    if (this.filterService.isBetBuilder(this.query.product)) {
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

    if (this.filterService.isSportsBookOrHybridParlay(this.query.product)) {
      const specialGroups = filter(data.groupBetTypes, {
        groupName: 'Special'
      });
      if (specialGroups.length > 0) {
        specialGroups[0].betTypes = reject(specialGroups[0].betTypes, {
          name: 'System Parlay'
        });
      }
    }

    this.groupBetTypes = this.groupBetTypesService.initGroupBetTypesModel(data.groupBetTypes, true);
    this.changeBetTypes(this.groupBetTypesService.getAllBetType(this.groupBetTypes.groupBetTypes));
  }

  async handleBetTypesOfBetBuilder(query: GetBetTypesQuery) {
    const data = await this.appService.getSelectionTypes(query);
    if (data.length === 0) {
      this.tooltip.display('match-id', TEXT.NO_BETTYPE);
      this.checkMatch = TEXT.NO_BETTYPE;
    }

    const betTypes: BetTypeModel[] = [];
    data.forEach(item => {
      betTypes.push(this.betTypesService.initBetTypeModel(item.selectionType.toString(), item.selectionName, false, this.query.product, true));
    });
    this.betTypes = this.betTypesService.initBetTypesModel(betTypes, true);
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
      this.writeSearchLog();
    }
  }

  writeSearchLog() {
    const productName = Product.PRODUCT_LIST.find(p => p.id === this.query.product)?.note;
    this.appComponent.logAccessAction(productName);
  }

  checkFilterParams(): boolean {
    if(this.filterService.invalidMatch(this.matchId, this.match, this.tooltip)) {
      return false;
    }
    if (this.isShowFilterTime() && !this.disabledTransDate && !StaticService.isFromTimeSameOrBeforeToTime(this.fromDate, this.toDate, this.tooltip, 'from-date-time')) {
      return false;
    }
    if (this.filterService.isSelectionNotValid(this.singleOrSubParlay, this.selectedComboParlay)) {
      this.tooltip.display('selection-dropdown-sub-parlay', TEXT.SELECT_AT_LEAST_ONE_OPTION);
      return false;
    }
    if (this.isShowAdvancedMode()) {
      return this.advancedModeComponent.validate();
    }

    return true;
  }

  validateBetTypes() {
    if (this.filterService.isSportsBookOrHybridParlay(this.query.product)) {
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

  updateDisabledTransDate() {
    this.disabledTransDate = !this.disabledTransDate;
  }

  getParams(): GetSummaryQuery {
    this.query.matchId = parseInt(this.matchId, 10);
    this.query.ballSequence = this.ballSequences.value.join(',');
    this.query.fromTransDate = this.disabledTransDate ? null : this.fromDate;
    this.query.toTransDate = this.disabledTransDate ? null : this.toDate;
    this.query.singleOrSubParlay = this.singleOrSubParlay;
    this.query.isReSettled = this.isReSettled;
    this.query.selectionSubParlays = this.filterService.getSelectionSubParlays(this.singleOrSubParlay, this.selectedComboParlay);

    if (this.filterService.isBetBuilder(this.query.product)) {
      this.query.betTypes = '38';
      this.query.selectionType = this.getCheckedBetTypes();
    } else {
      this.query.betTypes = this.getCheckedBetTypes();
      this.query.selectionType = '';
    }
    if (this.isShowAdvancedMode()) {
      const checkedBetTypes = this.groupBetTypesService.getValueCheckedBetTypes(this.groupBetTypes.groupBetTypes);
      const betTeams = this.advancedModeComponent.getBetTypeModels(checkedBetTypes);
      this.query.betTeams = betTeams;
    }
    else {
      this.query.betTeams = undefined;
    }
    return this.query;
  }

  private getCheckedBetTypes(): string {
    if (this.filterService.isSportsBookOrHybridParlay(this.query.product)) {
      return this.groupBetTypesService.getValueCheckedBetTypes(this.groupBetTypes.groupBetTypes);
    } else if (this.query.product === Product.VIRTUAL_SPORTS) {
      return this.betTypesVSComponent.getCheckedBetTypes().join(',');
    } else {
      return this.betTypesService.getCheckedBetTypes(this.betTypes.betTypes).join(',');
    }
  }

  changeBetTypes(betTypes: BetType[]) {
    this.allBetTypes = betTypes;
  }

  isShowCheckboxAffected(): boolean {
    return this.filterService.isShowCheckboxAffected(this.query.product, this.groupBetTypes, this.betTypes);
  }

  unCheckAffectedTickets(): void {
    this.isReSettled = false;
    this.filterService.enableBetTypesAndAdvancedMode(this.betTypesComponent);
    this.handleBetTypesAndAdvancedMode();
  }

  handleBetTypesAndAdvancedMode(): void {
    this.filterService.checkAndDisabledAllBetTypes(this.query.product, this.isReSettled, this.betTypesComponent, this.betTypes);
    this.filterService.checkAndDisabledAllGroupBetTypes(this.query.product, this.isReSettled, this.groupBetTypesComponent, this.groupBetTypes);
  }

  isShowAdvancedMode(): boolean {
    return this.filterService.isSportsBookOrHybridParlay(this.query.product);
  }

  isShowFilterTime(): boolean {
    return this.query.eventType && this.query.eventType.toString() === '1' && this.query.product === 0;
  }

  isShowSelectionSubParlay(): boolean {
    return this.singleOrSubParlay === "SubParlay";
  }

  changeBallSequenceItem() {
    this.ballSequences.isChecked = true;
    this.ballSequences.value = [];
    this.ballSequences.items.forEach(item => {
      if (item.isChecked) {
        this.ballSequences.value.push(item.value);
      } else {
        this.ballSequences.isChecked = false;
      }
    });
  }

  changeBallSequenceAll() {
    this.ballSequences.items.forEach(item => item.isChecked = this.ballSequences.isChecked);
    this.ballSequences.value = this.ballSequences.isChecked ? [1, 2, 3] : [];
  }
}

