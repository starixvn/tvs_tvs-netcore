import { CommonModule } from '@angular/common';
import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild, inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiDirective } from '../../../../utility/components/block-ui/block-ui.directive';
import { GroupLicenseeModel } from '../../../../utility/components/licensees/licensees.model';
import { PagingConstant } from '../../../../utility/components/paging/paging.model';
import { Selection } from '../../../../utility/models/selection.model';
import { CommonService } from '../../../../utility/services/common.service';
import { GetTicketsQuery } from '../../models/query.model';
import { Currencies, FilterSearchBy } from './filter.model';
import { MatchIdComponent } from './match-id/match-id.component';
import { NumberItemService } from '../../../../utility/components/bet-ids/number-item.service';

@Component({
  standalone: true,
  selector: 'filter-tickets',
  templateUrl: './filter-tickets.component.html',
  styleUrls: ['./filter-tickets.component.scss'],
  imports: [CommonModule, FormsModule, MatchIdComponent, NgSelectModule, BlockUiDirective, BetIdsComponent],
})
export class FilterTicketsComponent implements OnInit, OnChanges {
  @ViewChild('matchId') matchIdComponent: MatchIdComponent;
  @ViewChild('betIds') betIdsComponent: BetIdsComponent;

  @Input() status: string;
  @Output() searchEvent = new EventEmitter<GetTicketsQuery>();
  @Output() changeSearch = new EventEmitter();
  @Output() changeMatchInfo = new EventEmitter();
  @Input() isExternalUrl: boolean;

  private readonly commonService = inject(CommonService);
  private readonly elementRef = inject(ElementRef);
  private readonly numberItemService = inject(NumberItemService);

  model = new GetTicketsQuery();
  searchBy = new FilterSearchBy();
  currencies = new Currencies();
  groupLicenseeModel = new GroupLicenseeModel([], false);
  isBlock: boolean;
  markedByOptions: Selection[];
  moveBetNgbDate: NgbDate;

  async ngOnInit() {
    await this.initData();
    await this.initCurrency();
    await this.renderGroupLicensees();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.changeTab();
    }
  }

  async initData() {
    await this.getBalanceUp();
    const userName = document?.getElementById('body')?.getAttribute('user-id');
    this.markedByOptions = [{name: '<<<< Me >>>>', value: userName}, {name: 'All', value: '0'}];
    this.model.markedBy = this.markedByOptions[0].value;
    if (this.isExternalUrl) {
      this.searchBy.value = '2';
      this.search();
    }
  }

  async getBalanceUp() {
    const balanceUp = await this.commonService.getBalanceUpZoneManila();
    if (balanceUp) {
      const moveBetDay = new Date(balanceUp.moveBetsDay);
      this.moveBetNgbDate = new NgbDate(moveBetDay.getFullYear(), moveBetDay.getMonth() + 1, moveBetDay.getDate() + 1);
    }
  }

  async initCurrency() {
    this.currencies.items = await this.commonService.getCurrencies();
    if (this.currencies.items && this.currencies.items.length > 0) {
      this.currencies.items.forEach(x => x.group = 'All');
      this.currencies.selected = this.currencies.items.map(x => x.id);
      this.model.currencyIds = this.currencies.selected.join(',');
    } else {
      this.currencies.items = [];
      this.currencies.selected = [];
      this.model.currencyIds = '';
    }
  }

  changeTab() {
    const allMarkedTicketsOption = 2;
    this.searchBy.items[allMarkedTicketsOption].hidden = this.status !== '1';
    if (this.searchBy.value === '2' && this.status === '0') {
      this.changeSearchBy('0');
      this.elementRef.nativeElement.querySelector('#inlineRadio-0').checked = true;
    }
  }

  async renderGroupLicensees() {
    const data = await this.commonService.getGroupLicensees();
    if (data && data.length > 0) {
      this.groupLicenseeModel = new GroupLicenseeModel(data, true);
    } else {
      this.groupLicenseeModel = new GroupLicenseeModel([], true);
    }
  }

  changeSearchBy(value: string) {
    this.searchBy.value = value;
    this.model.matchId = '';
    this.changeSearch.emit();
  }

  search() {
    if (this.checkValidate()) {
      const query = this.getParams();
      this.searchEvent.emit(query);
    }
  }

  checkValidate(): boolean {
    if (this.searchBy.value === FilterSearchBy.MATCH_ID) {
      return this.matchIdComponent.checkValidate();
    } else if (this.searchBy.value === FilterSearchBy.BET_IDS) {
      this.numberItemService.resetAllItemsToValid(this.betIdsComponent.groupNumber);
      return this.betIdsComponent.isHasBetId();
    }

    return true;
  }

  getParams(): GetTicketsQuery {
    let result = new GetTicketsQuery();
    if (this.searchBy.value === FilterSearchBy.MATCH_ID) {
      result = this.matchIdComponent.getParams();
    } else if (this.searchBy.value === FilterSearchBy.BET_IDS) {
      result.transIds = this.betIdsComponent.getAllBetIds();
    }
    result.markedBy = this.model.markedBy;
    result.status = this.status;
    result.searchBy = this.searchBy.value;
    result.pageIndex = PagingConstant.INDEX_ZERO;
    result.pageSize = PagingConstant.SIZE_DEFAULT;

    return result;
  }

  clearBetId() {
    this.betIdsComponent.clearBetId();
  }

  blockComponent(isBlock: boolean): void {
    this.isBlock = isBlock;
  }

  changeMatch(): void {
    this.changeMatchInfo.emit();
  }
}
