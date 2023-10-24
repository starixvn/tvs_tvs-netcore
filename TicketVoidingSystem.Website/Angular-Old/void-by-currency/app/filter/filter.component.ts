import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { ItemsSelect } from '../../../external/components/multiple-selection/items-select';
import { MultipleSelect } from '../../../external/components/multiple-selection/multiple-select';
import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { MatchViewModel } from '../../../internal/components/match-detail/match.viewmodel';
import { PagingText } from '../../../internal/components/paging/setting';
import { TEXT } from '../../../internal/shared/text';
import { GetTicketQueryModel } from '../models/query.model';
import { Currency, FilterEvent, GroupLicensee, Item, Licensee, TicketType } from './filter.model';
import { FilterService } from './filter.service';


@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})

export class FilterComponent {
    @Output() searchEvent = new EventEmitter<FilterEvent>();
    @Output() changeMatchEvent = new EventEmitter<string>();
    filterEvent = new FilterEvent();
    tooltip = new Tooltip;
    remark: string;
    isShowFilter = true;
    matchId: string;
    preMatchId: string;
    groupLicensees: GroupLicensee[];
    checkAllLicensee = false;
    currencies = new MultipleSelect();
    ticketType = new TicketType();

    matchDetail: MatchViewModel;

    constructor(
        private readonly element: ElementRef,
        private readonly filterService: FilterService) {
        this.config();
        this.getFilterModel();
    }

    config() {
        this.currencies.items = [];
        this.currencies.checkAllCheckBoxText = 'All';
        this.currencies.allItemsCheckedText = 'All';
        this.currencies.maxWidth = '120px';
        this.tooltip.element = this.element;
    }

    getFilterModel() {
        this.filterService.getFilterModel()
            .subscribe(data => {
                this.remark = data.remark;
                this.renderGroupLicensees(data.groupLicensees);
                this.renderCurrency(data.currencies);
            });
        this.insertTicketType();
    }

    renderGroupLicensees(data: GroupLicensee[]) {
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

    renderCurrency(data: Currency[]) {
        data.forEach(currency => {
            const item = new ItemsSelect(currency.id, currency.id, currency.currencyCode, true, true, true, []);
            this.currencies.items.push(item);
        });
    }

    insertTicketType() {
        this.ticketType.items = [];
        this.ticketType.items.push(new Item('All', 'All'));
        this.ticketType.items.push(new Item('SingleTicket', 'Single Tickets'));
        this.ticketType.items.push(new Item('ParlayTicket', 'Parlay Tickets'));
        this.ticketType.value = 'All';
    }

    blurMatchId() {
        if (this.matchId !== undefined && this.matchId !== this.preMatchId) {
            this.getMatchDetail();
            this.changeMatchEvent.emit(this.matchId);
        }
    }

    changeCheckAllLicensee() {
        this.groupLicensees.forEach(group => {
            group.isChecked = this.checkAllLicensee;
            group.checkedGroup();
        });
    }

    checkAllCheckBox() {
        let isChecked = true;
        this.groupLicensees.forEach(group => {
            if (!group.isChecked) {
                isChecked = false;
            }
        });

        this.checkAllLicensee = isChecked;
    }

    getMatchDetail() {
        this.filterService.getMatchDetail(this.matchId)
            .subscribe(match => {
                this.matchDetail = match;
                this.checkMatch();
            });
        this.preMatchId = this.matchId;
    }

    checkMatch() {
        if (this.matchDetail === null) {
            this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
        }
    }

    searchTicket() {
        if (this.checkValidaitonBeforeSearch()) {
            this.changeFilterQueryModel();
            this.searchEvent.emit(this.filterEvent);
        }
    }

    checkValidaitonBeforeSearch(): boolean {
        if (this.matchId === '' || this.matchId === undefined) {
            this.tooltip.display('match-id', TEXT.REQUIRED_MATCHID);
            return false;
        }
        if (this.matchDetail === null || this.matchDetail === undefined) {
            this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
            return false;
        }
        if (this.getLicensees() === '') {
            this.tooltip.display('check-group-licensee', TEXT.EMPTY_LICENSEE);
            return false;
        }
        if (this.currencies.getValueItems() === '') {
            this.tooltip.display('currencies', TEXT.EMPTY_CURRENCY);
            return false;
        }

        return true;
    }

    changeFilterQueryModel() {
        this.filterEvent.getTicketQueryModel = {
            matchId: parseInt(this.matchId, 10),
            ticketType: this.ticketType.value,
            licenseeNames: this.getLicensees(),
            currencyIds: this.currencies.getValueItems(),
            pageIndex: PagingText.INDEX_ZERO,
            pageSize: PagingText.SIZE_DEFAULT,
            isOutright: this.matchDetail.isOutright
        } as GetTicketQueryModel;

        this.filterEvent.matchDetail = this.matchDetail;
    }

    getLicensees(): string {
        let value = '';
        this.groupLicensees.forEach(group => {
            const groupValue = group.getValue();
            value = groupValue !== '' ?
                value === '' ? groupValue : value + ',' + groupValue
                : value;
        });

        return value;
    }

    resetFilter() {
        this.matchId = '';
        this.resetGroupLicensees();
        this.currencies.checkAllItems(true);
        this.ticketType.value = 'All';
    }

    resetGroupLicensees() {
        this.checkAllLicensee = false;
        this.renderGroupLicensees(this.groupLicensees);
    }
}