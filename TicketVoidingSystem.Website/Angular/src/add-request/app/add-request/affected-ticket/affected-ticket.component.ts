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

  isShowCaretDown = true;
  filterBetTypes: MultipleSelection;
  checkedBetTypes: number[];

  public closeClick(): void {
    this.model.isOpen = false;
  }

  updateSelectedBetTypes(betTypes: string[]) {
    this.checkedBetTypes = betTypes.map(i => Number(i));
  }

  changeFilter(){
    this.model.tickets.groups.forEach(group => {
      group.tickets.forEach(y => {
        y.isChecked = this.checkedBetTypes.includes(y.groupBetTypeId);
      });
      group.isCheckAll = group.tickets.length === group.displayTotalTickets;
    });
  }

  changeShowAffectedBetType(){
    this.isShowCaretDown = !this.isShowCaretDown;
  }
}
