import { Component, Input} from '@angular/core';
import { AffectedTicketsModel } from '../models/live-game-early-ticket.model';
import { MultipleSelection } from '../../../../utility/components/multiple-selection/multiple-selection';

@Component({
  selector: 'affected-ticket',
  templateUrl: './affected-ticket.component.html',
  styleUrls: ['./affected-ticket.component.scss']
})
export class AffectedTicketComponent {
  @Input() model = new AffectedTicketsModel();
  
  isCollapsed = false;
  filterBetTypes: MultipleSelection;

  public closeClick(): void {
    this.isCollapsed = false;
    this.model.isOpen = false;
  }

  updateSelectedBetTypes(betTypes: string[]) {
    let checkedBetTypes = betTypes.map(i => Number(i));
    this.model.tickets.groups.forEach(group => {
      group.tickets.forEach(y => {
        y.isChecked = checkedBetTypes.includes(y.groupBetTypeId);
      });
      group.isCheckAll = group.tickets.length === group.displayTotalTickets;
    });
  }
  // changeFilter(){
  //   this.model.tickets.groups.forEach(group => {
  //     group.tickets.forEach(y => {
  //       y.isChecked = this.checkedBetTypes.includes(y.groupBetTypeId);
  //     });
  //     group.isCheckAll = group.tickets.length === group.displayTotalTickets;
  //   });
  // }
}
