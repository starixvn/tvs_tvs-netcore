import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { BlockUiDirective } from '../../../utility/components/block-ui/block-ui.directive';
import { ItemsSelect } from '../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { MultipleSelectionComponent } from '../../../utility/components/multiple-selection/multiple-selection.component';
import { StaticService } from '../../../utility/services/static.service';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { TicketsComponent } from '../pool-house-ticket/tickets/tickets.component';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { AffectedTicketService } from './affected-ticket.service';

@Component({
  selector: 'affected-ticket',
  templateUrl: './affected-ticket.component.html',
  styleUrls: ['./affected-ticket.component.scss'],
  standalone: true,
  imports: [MultipleSelectionComponent, TicketsComponent, BlockUiDirective]
})
export class AffectedTicketComponent implements OnChanges {
  @Input() model = new AffectedTicketsModel();
  filterBetTypes: MultipleSelection;
  tickets = new TicketsModel();
  blockBetList: boolean;
  otherTickets = new TicketsModel();
  isShowOtherTickets = true;
  isShowAffectedTickets = true;
  isShowGroupBetTypesCount = true;
  private readonly logAnalysisService = inject(LogAnalysisService);
  private readonly affectedTicketService = inject(AffectedTicketService);

  public async ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && this.model.isOpen) {
      this.blockBetList = true;
      this.tickets = await this.affectedTicketService.getAffectedTickets(this.model.issueTypeId, this.model.logInfoTicketsJson);
      this.otherTickets.groups = _.cloneDeep(this.tickets.groupOtherTickets);
      this.otherTickets.checkAllTickets();

      this.initFilterBetTypes();
      await this.logAnalysisService.writeLogClickLiveGameDetails(`${this.model.issueTypeId}`);
      this.blockBetList = false;
    }
  }

  public closeClick() {
    this.isShowOtherTickets = true;
    this.isShowAffectedTickets = true;
    this.isShowGroupBetTypesCount = true;
    this.model.isOpen = false;
  }

  updateSelectedBetTypes(betTypes: string[]) {
    this.tickets.checkTicketByBetTypesForLGEarlyPopup(betTypes);
  }

  private initFilterBetTypes() {
    if (this.tickets.groups.length > 0) {
      const betTypes = this.tickets.groups.flatMap(group =>
        group.tickets.map(x => {
          const betType = x.isParlay ? x.subBetType : x.betType;
          return new ItemsSelect(0, betType, betType, true, true, true, [])
        })
      );
      const filterBetTypes = StaticService.initDefaultMultipleSelection('280px', 1);
      filterBetTypes.items = _.uniqBy(betTypes, 'text');

      this.filterBetTypes = filterBetTypes;
    }
  }
}
