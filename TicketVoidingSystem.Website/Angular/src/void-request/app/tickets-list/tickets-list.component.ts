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
    this.title = StaticService.getTitleVoidTicket(this.issueTypeId?.toString(), this.model.totalSingle, this.model.totalParlay,
      this.model.totalCancelCashOut, this.model.strFromTime, this.model.strToTime);
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
}
