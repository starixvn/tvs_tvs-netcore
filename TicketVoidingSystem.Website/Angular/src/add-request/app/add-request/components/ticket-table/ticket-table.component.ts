import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import bigDecimal from 'js-big-decimal';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { SanitizeHtmlPipe } from '../../../../../utility/pipes/sanitize-html.pipe';
import { TicketTableViewModel } from './ticket-table.model';

@Component({
    selector: 'ticket-table',
    templateUrl: './ticket-table.component.html',
    styleUrls: ['./ticket-table.component.scss'],
    standalone: true,
    imports: [BlockUiModule, FormsModule, SanitizeHtmlPipe, CommonModule]
})
export class TicketTableComponent {
  @Input() model = new TicketTableViewModel();
  @Input() isBlock: boolean;
  @Output() changeWinlost = new EventEmitter<bigDecimal>();

  isShowNoData(): boolean {
    return this.model.groups === undefined ||
      this.model.groups.length === 0 ||
      this.model.groups === null ||
      this.model.groups.every(group => group.displayTotalTickets === 0);
  }

  changeWinlostCheckedTicket() {
    const checkedTickets = this.model.getAllCheckedTickets();
    this.changeWinlost.emit(checkedTickets.reduce((sum, current) => new bigDecimal(this.convertStringWithCommaToNumber(current.winLoss)).add(sum), new bigDecimal(0)));
  }

  private convertStringWithCommaToNumber(value: string): number {
    return parseFloat(value.replace(/,/g, ''));
  }
}