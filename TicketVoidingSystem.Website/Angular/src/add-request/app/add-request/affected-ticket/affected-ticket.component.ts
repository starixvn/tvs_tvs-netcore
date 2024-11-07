import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { ItemsSelect } from '../../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../../utility/components/multiple-selection/multiple-selection';
import { StaticService } from '../../../../utility/services/static.service';
import { AffectedTicketsModel } from '../models/live-game-early-ticket.model';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { LogAnalysisService } from '../services/log-analysis.service';
import { AffectedTicketService } from './affected-ticket.service';

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

  constructor(
    private readonly logAnalysisService: LogAnalysisService,
    private readonly affectedTicketService: AffectedTicketService
  ) { }

  public async ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && this.model.isOpen) {
      this.blockBetList = true;
      this.tickets = await this.affectedTicketService.getAffectedTickets(this.model.issueTypeId, this.model.logInfoTicketsJson);
      this.initFilterBetTypes();
      await this.logAnalysisService.writeLogClickLiveGameDetails(`${this.model.issueTypeId}`);
      this.blockBetList = false;
    }
  }

  public closeClick() {
    this.isCollapsed = false;
    this.model.isOpen = false;
  }

  updateSelectedBetTypes(betTypes: string[]) {
    this.tickets.checkTicketByBetTypesForLGEarlyPopup(betTypes);
  }

  private initFilterBetTypes() {
    if (this.tickets.groups.length > 0) {
      const betTypes = this.tickets.groups.flatMap(group =>
        group.tickets.map(x => new ItemsSelect(0, x.betType, x.betType, true, true, true, []))
      );
      const filterBetTypes = StaticService.initDefaultMultipleSelection('280px', 1);
      filterBetTypes.items = _.uniqBy(betTypes, 'text');

      this.filterBetTypes = filterBetTypes;
    }
  }
}
