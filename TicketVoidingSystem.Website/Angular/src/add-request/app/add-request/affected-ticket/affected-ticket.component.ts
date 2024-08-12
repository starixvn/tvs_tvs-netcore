import { Component, Input} from '@angular/core';
import * as _ from 'lodash';
import { LiveGameEarlyTicketsModel } from '../models/live-game-early-ticket.model';

@Component({
  selector: 'affected-ticket',
  templateUrl: './affected-ticket.component.html',
  styleUrls: ['./affected-ticket.component.scss']
})
export class AffectedTicketComponent  {
  @Input() model = new LiveGameEarlyTicketsModel();

  isBlock: boolean;
  blockBetList: boolean;

  public closeClick(): void {
    this.model.isOpen = false;
  }
}
