import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { BaseTicketsListComponent } from '../../../utility/components/base-tickets-list/base-tickets-list.component';
import { StaticService } from '../../../utility/services/static.service';
import { TicketsModel } from './tickets.model';

@Component({
  selector: 'tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})
export class TicketsListComponent extends BaseTicketsListComponent<TicketsModel> implements OnInit, OnChanges {
  @Input() issueTypeId = 0;
  @Input() isDisableCheckbox = false;

  title = '';

  constructor(readonly element: ElementRef) {
    super(element);
  }

  ngOnChanges() {
    this.initTitle();
  }

  ngOnInit() {
    this.clickBody();
  }

  changeTickets() {
    this.ticketsChange.emit(this.model.getNumberOfCheckedTickets());
    this.showWarningBetTradeTicket();
  }

  showWarningBetTradeTicket() {
    if (this.model.groups.length > 0) {
      const lastGroup = this.model.groups.length - 1;
      const lastedGroup = this.model.groups[lastGroup];
      const lastedTicket = lastedGroup.tickets[lastedGroup.tickets.length - 1];
      this.showMessageBetTrade = lastedTicket.member.toLowerCase().indexOf('bettrade') !== -1 && lastedTicket.isChecked;
    }
  }

  initTitle() {
    this.title = `(Single Count: ${this.model.totalSingle}, Parlay Count: ${this.model.totalParlay}, Cancel CO: ${this.model.totalCancelCashOut})`;
    if (!StaticService.isAbnormalAccount(this.issueTypeId?.toString())) {
      this.title = `Void Time: ${this.model.strFromTime} - ${this.model.strToTime} ${this.title}`;
    }
  }
}
