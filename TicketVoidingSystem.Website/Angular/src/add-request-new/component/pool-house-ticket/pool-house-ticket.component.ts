
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import { BlockUiDirective } from '../../../utility/components/block-ui/block-ui.directive';
import { ItemsSelect } from '../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection.model';
import { MultipleSelectionComponent } from '../../../utility/components/multiple-selection/multiple-selection.component';
import { StaticService } from '../../../utility/services/static.service';
import { GroupBettypesPoolHouseComponent } from './group-bettypes-pool-house/group-bettypes-pool-house.component';
import { GroupBetType, GroupBetTypesModel } from './group-bettypes-pool-house/group-bettypes-pool-house.model';
import { LinkedLogComponent } from './linked-log/linked-log.component';
import { PoolHouseTicketValue } from './pool-house-ticket.constant';
import { PoolHouseTicketsModel, PoolHouseTicketsSection } from './pool-house-ticket.model';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsModel } from './tickets/tickets.model';
import { TicketsService } from './tickets/tickets.service';

@Component({
    selector: 'pool-house-tickets',
    templateUrl: './pool-house-ticket.component.html',
    styleUrls: ['./pool-house-ticket.component.scss'],
    standalone: true,
    imports: [FormsModule, LinkedLogComponent, GroupBettypesPoolHouseComponent, MultipleSelectionComponent,
      TicketsComponent, BlockUiDirective, NgbCollapseModule]
})
export class PoolHouseTicketComponent implements OnChanges {
  @Input() model = new PoolHouseTicketsModel();
  @Output() saveEventOutput = new EventEmitter<PoolHouseTicketsModel>();
  poolHouseTicketsSections: PoolHouseTicketsSection[] = [];
  affectedSection: PoolHouseTicketsSection;
  otherSection: PoolHouseTicketsSection;
  isBlock: boolean;
  blockBetList: boolean;

  private readonly ticketsService = inject(TicketsService);

  public async ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && this.model.isOpen) {
      this.blockBetList = true;
      this.updatePoolHouseTicketModal();
      this.blockBetList = false;
    }
  }

  private updatePoolHouseTicketModal() {
    this.updatePoolHouseTicketSections();
    this.changeCheckBetTypeAndTicket();
  }

  private updatePoolHouseTicketSections() {
    this.poolHouseTicketsSections = [this.getAffectedSection(), this.getOtherSection()];
  }

  public getAffectedSection(): PoolHouseTicketsSection {
    const affectedTickets = this.ticketsService.initData(this.model.affectedTickets);

    this.affectedSection = {
      isAffected: true,
      name: 'Affected Bet Types',
      groupBetTypesModel: new GroupBetTypesModel(this.model.groupBetTypes.filter(x => x.groupName !== 'Others'), true, false),
      tickets: affectedTickets,
      isCollapsed: false
    };

    return this.affectedSection;
  }

  public getOtherSection(): PoolHouseTicketsSection {
    const otherTickets = this.ticketsService.initData(this.model.otherTickets);
    this.ticketsService.checkAllTickets(otherTickets.groups);
    const otherGroupBetTypes = this.model.groupBetTypes.filter(x => x.groupName === 'Others');
    this.otherSection = {
      isAffected: false,
      name: 'Other Bet Types',
      filterBetTypes: this.initFilterBetTypes(otherGroupBetTypes),
      groupBetTypesModel: new GroupBetTypesModel(otherGroupBetTypes, false, true),
      tickets: otherTickets,
      isCollapsed: false
    };

    return this.otherSection;
  }

  private changeCheckBetTypeAndTicket(): void {
    if (this.model.checkedBetTypes === PoolHouseTicketValue.SELECT_ALL_BETTYPE) {
      this.affectedSection.groupBetTypesModel.checkAllBetType();
      this.ticketsService.checkAllTicketsForPoolHousePopup(this.affectedSection.tickets.groups);
    } else {
      this.affectedSection.groupBetTypesModel.checkBetType(this.model.checkedBetTypes.split(',').map(i => Number(i)));
      this.ticketsService.handleCheckTicketByBetTypes(this.affectedSection.tickets.groups, this.model.checkedBetTypes.split(',').map(i => Number(i)));
    }
    this.ticketsService.updateSelectedTickets(this.affectedSection.tickets);
  }

  public changedBetTypes(betTypes: number[]) {
    this.ticketsService.handleCheckTicketByBetTypes(this.affectedSection.tickets.groups, betTypes);
    this.ticketsService.updateSelectedTickets(this.affectedSection.tickets);
  }

  public closeClick(): void {
    this.model.isOpen = false;
  }

  public saveClick() {
    this.model.isOpen = false;
    this.model.checkedBetTypes = this.getCheckedBetTypes();

    this.saveEventOutput.emit(this.model);
  }

  private getCheckedBetTypes(): string {
    const checkedBetTypes = (uniq(flatten(this.affectedSection.groupBetTypesModel.groupBetTypes.map(x => x.betTypes))))
      .filter(x => x.isChecked)
      .map(x => x.id);

    return checkedBetTypes.join(',');
  }

  updateSelectedBetTypes(betTypes: string[]) {
    this.ticketsService.handleCheckTicketByBetTypes(this.otherSection.tickets.groups, betTypes.map(i => Number(i)));
  }

  initFilterBetTypes(groupBetTypes: GroupBetType[]): MultipleSelection {
    const multipleSelection = StaticService.initDefaultMultipleSelection('280px', 1);
    multipleSelection.items = groupBetTypes
      .flatMap(x => x.betTypes)
      .map(x => new ItemsSelect(0, x.id.toString(), x.name, true, true, true, []));

    return multipleSelection;
  }
}
