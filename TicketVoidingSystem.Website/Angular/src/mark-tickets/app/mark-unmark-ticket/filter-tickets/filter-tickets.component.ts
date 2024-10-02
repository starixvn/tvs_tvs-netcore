import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { PagingConstant } from '../../../../utility/components/paging/paging/paging.model';
import { Selection } from '../../../../utility/models/selection.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AppService } from '../../app.service';
import { GetTicketsQuery } from '../../models/query.model';
import { Currencies, FilterSearchBy } from './filter.model';
import { GroupLicensee, Licensee } from './match-id/licensees/licensees.model';
import { MatchIdComponent } from './match-id/match-id.component';

@Component({
  selector: 'filter-tickets',
  templateUrl: './filter-tickets.component.html',
  styleUrls: ['./filter-tickets.component.scss']
})
export class FilterTicketsComponent implements OnInit, OnChanges {
  @ViewChild('matchId') matchIdComponent: MatchIdComponent;
  @ViewChild('betIds') betIdsComponent: BetIdsComponent;

  @Input() status: string;
  @Output() searchEvent = new EventEmitter<GetTicketsQuery>();
  @Output() changeSearch = new EventEmitter();
  @Output() changeMatchInfo = new EventEmitter();
  @Input() isExternalUrl: boolean;

  model = new GetTicketsQuery();
  searchBy = new FilterSearchBy();
  currencies = new Currencies();
  groupLicensees: GroupLicensee[] = [];
  isBlock: boolean;
  markedByOptions: Selection[];

  moveBetNgbDate: NgbDate;

  constructor(
    private readonly commonService: CommonService,
    private readonly appService: AppService,
    private readonly elementRef: ElementRef
  ) { }

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
    const balanceUp = await this.commonService.getBalanceUpZoneManila();
    const moveBetDay = new Date(balanceUp.moveBetsDay);
    this.moveBetNgbDate = new NgbDate(moveBetDay.getFullYear(), moveBetDay.getMonth() + 1, moveBetDay.getDate() + 1);
    const userName = document.getElementById('body').getAttribute('user-id');
    this.markedByOptions = [{name: '<<<< Me >>>>', value: userName}, {name: 'All', value: '0'}];
    this.model.markedBy = this.markedByOptions[0].value;
    if (this.isExternalUrl) {
      this.searchBy.value = '2';
      this.search();
    }
  }

  async initCurrency() {
    this.currencies.items = await this.appService.getCurrencies();
    this.currencies.items.forEach(x => x.group = 'All');
    this.currencies.selected = this.currencies.items.map(x => x.id);
    this.model.currencyIds = this.currencies.selected.join(',');
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
    const data = await this.appService.getGroupLicensees();
    this.groupLicensees = [];
    data.forEach(group => {
      const licensees = new Array<Licensee>();
      group.licensees.forEach(licensee => {
        const item = new Licensee(licensee.id, licensee.name);
        licensees.push(item);
      });
      this.groupLicensees.push(new GroupLicensee(group.groupName, licensees));
    });
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
    } else if (this.searchBy.value === FilterSearchBy.BETIDS) {
      this.betIdsComponent.groupNumber.resetAllItemsToValid();
      return this.betIdsComponent.isHasBetId();
    }

    return true;
  }

  getParams(): GetTicketsQuery {
    let result = new GetTicketsQuery();
    if (this.searchBy.value === FilterSearchBy.MATCH_ID) {
      result = this.matchIdComponent.getParams();
    } else if (this.searchBy.value === FilterSearchBy.BETIDS) {
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
