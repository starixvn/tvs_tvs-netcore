import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketTableModel, TicketTableViewModel } from './ticket-table.model';

@Component({
  selector: 'ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})
export class TicketTableComponent implements OnInit {
  @Input() model = new TicketTableViewModel();
  @Input() isBlock: boolean;
  @Output() changeTicket = new EventEmitter<TicketTableModel>();
  @Output() changeGroup = new EventEmitter<number>();
  @Output() changeGroupTicketTable = new EventEmitter();

  public ngOnInit() {
    //this.clickBody();
  }

  isShowNoData(): boolean {
    return this.model.groups === undefined ||
      this.model.groups.length === 0 ||
      this.model.groups === null ||
      this.model.groups.every(group => group.displayTotalTickets === 0);
  }

  handleChangeTicket(ticket: TicketTableModel) {
    this.changeTicket.emit(ticket);
  }

  handleChangeGroup(groupId: number) {
    this.changeGroup.emit(groupId);
  }

  handleChangeGroupTicketTable() {
    this.changeGroupTicketTable.emit();
  }
}