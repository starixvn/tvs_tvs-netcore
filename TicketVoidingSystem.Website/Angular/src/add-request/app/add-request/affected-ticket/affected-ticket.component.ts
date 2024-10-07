import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BetTypeAddRequest } from 'src/utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { ItemsSelect } from 'src/utility/components/multiple-selection/items-select';
import { StaticService } from 'src/utility/services/static.service';
import { MultipleSelection } from '../../../../utility/components/multiple-selection/multiple-selection';
import { AddRequestApiService } from '../add-request-api.service';
import { AffectedTicketsModel, LogInfoTicketsQuery } from '../models/live-game-early-ticket.model';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';

@Component({
  selector: 'affected-ticket',
  templateUrl: './affected-ticket.component.html',
  styleUrls: ['./affected-ticket.component.scss']
})
export class AffectedTicketComponent implements OnChanges {
  @Input() model = new AffectedTicketsModel();
  isCollapsed = false;
  filterBetTypes: MultipleSelection;
  tickets = new TicketsModel();
  blockBetList: boolean;

  constructor( private readonly addRequestApiService: AddRequestApiService ){}

  public async ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && this.model.isOpen) {
      this.blockBetList = true;
      this.initFilterBetTypes(this.model.checkedBetTypes);
      await this.updateAffectedTickets();
      this.blockBetList = false;
    }
  }

  public closeClick() {
    this.isCollapsed = false;
    this.model.isOpen = false;
  }

  updateSelectedBetTypes(betTypes: string[]) {
    this.tickets.checkTicketByBetTypesForLGEarlyPopup(betTypes.map(i => Number(i)));
  }

  public async updateAffectedTickets(){
    if (this.model.logInfoTicketsJson) {
      const query: LogInfoTicketsQuery = {
        logInfoTicketsJson: this.model.logInfoTicketsJson,
        issueTypeId: this.model.issueTypeId
      };
      const ticketsLogInfo = await this.addRequestApiService.GetLogInfoTickets(query);
      this.tickets.initData(ticketsLogInfo);
      this.tickets.groups[0].name = null;
    } else {
      this.tickets = new TicketsModel();
    }
  }

  private initFilterBetTypes(betTypes: BetTypeAddRequest[]) {
    if (this.model.checkedBetTypes) {
      const filterBetTypes = StaticService.initDefaultMultipleSelection('280px', 1);
      filterBetTypes.items = betTypes.map(x => new ItemsSelect(0, x.id.toString(), x.name, true, true, true, []));

      this.filterBetTypes = filterBetTypes;
    }
  }
}
