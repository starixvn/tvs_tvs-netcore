import { Component, Input, OnInit } from '@angular/core';
import { TicketTableViewModel } from './ticket-table.model';

@Component({
  selector: 'ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})
export class TicketTableComponent implements OnInit {
  @Input() model = new TicketTableViewModel();
  @Input() isBlock: boolean;

  public ngOnInit() {
    //this.clickBody();
  }

  isShowNoData(): boolean {
    return this.model.groups === undefined ||
      this.model.groups.length === 0 ||
      this.model.groups === null ||
      this.model.groups.every(group => group.displayTotalTickets === 0);
  }
}