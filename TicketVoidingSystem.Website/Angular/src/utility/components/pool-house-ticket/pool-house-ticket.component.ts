import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { PagingModel } from '../../components/paging/paging/paging.model';
import { PoolHouseTicketValue } from '../../constants/config';
import { GroupBetTypesModel } from './group-bettypes-pool-house/group-bettypes-pool-house.model';
import { GetPoolHouseTicketQuery, PoolHouseTicketsModel } from './pool-house-ticket.model';
import { TicketsModel } from './tickets/tickets.model';

@Component({
  selector: 'pool-house-tickets',
  templateUrl: './pool-house-ticket.component.html',
  styleUrls: ['./pool-house-ticket.component.scss']
})
export class PoolHouseTicketComponent implements OnChanges {
  @Input() model = new PoolHouseTicketsModel();
  @Output() saveEventOuput = new EventEmitter<PoolHouseTicketsModel>();
  @Output() pagingEventOuput = new EventEmitter<GetPoolHouseTicketQuery>();

  affectedGroupBetTypesModel: GroupBetTypesModel;
  othersGroupBetTypesModel: GroupBetTypesModel;

  tickets = new TicketsModel();
  paging = new PagingModel();
  isBlock: boolean;
  blockBetList: boolean;

  public async ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && this.model.isOpen) {
      this.blockBetList = true;
      this.updatePoolHouseTicketModal();
      this.blockBetList = false;
    }
  }

  private updatePoolHouseTicketModal() {
    this.model.linkedLogsViewModel.poolHouseLinkedLogsData.forEach(x => {
      x.isShow = this.checkCanShowGroupLinkedLog(x.groupName);
    });
    this.paging.total = this.model.tickets.totalParlay + this.model.tickets.totalSingle;
    this.affectedGroupBetTypesModel = new GroupBetTypesModel(this.model.groupBetTypes.filter(x => x.groupName !== 'Others'), true, 'Affected Bet Types', false);
    this.othersGroupBetTypesModel = new GroupBetTypesModel(this.model.groupBetTypes.filter(x => x.groupName === 'Others'), false, 'Others Bet Types', true);
    this.tickets.initData(this.model.tickets);
    this.changeCheckBetTypeAndTicket();
  }

  public async pagingEvent(): Promise<void> {
    this.model.query.pageIndex = this.paging.page - 1;
    this.model.query.pageSize = this.paging.pageSize;
    this.model.checkedBetTypes = this.getCheckedBetTypes();
    this.pagingEventOuput.emit(this.model.query);
  }

  private changeCheckBetTypeAndTicket(): void {
    if (this.model.checkedBetTypes === PoolHouseTicketValue.SELECT_ALL_BETTYPE) {
      this.affectedGroupBetTypesModel.checkAllBetType();
      this.tickets.checkAllTickets();
    } else {
      this.affectedGroupBetTypesModel.checkBetType(this.model.checkedBetTypes.split(',').map(i => Number(i)));
      this.tickets.handlecheckTicketByBetTypes(this.model.checkedBetTypes.split(',').map(i => Number(i)));
    }
    this.tickets.updateSelectedTickets();
  }

  public changedBetTypes(betTypes: number[]) {
    this.tickets.handlecheckTicketByBetTypes(betTypes);
    this.tickets.updateSelectedTickets();
  }

  public closeClick(): void {
    this.model.isOpen = false;
  }

  public saveClick() {
    this.model.isOpen = false;
    this.model.checkedBetTypes = this.getCheckedBetTypes();

    this.saveEventOuput.emit(this.model);
  }

  private getCheckedBetTypes(): string {
    const checkedBetTypes = (_.uniq(_.flatten(this.affectedGroupBetTypesModel.groupBetTypes.map(x => x.betTypes))))
      .filter(x => x.isChecked)
      .map(x => x.id);

    return checkedBetTypes.join(',');
  }

  public isHideLinkedLog(): boolean {
    return this.model.isAffectedGroupAIO && (this.model.isAffectedGroup1X2 || this.model.isAffectedGroup1H1X2);
  }

  private checkCanShowGroupLinkedLog(groupName: string): boolean {
    if (groupName === '1X2') {
      return !this.model.isAffectedGroup1X2;
    } else if (groupName === '1H 1X2') {
      return !this.model.isAffectedGroup1H1X2;
    } else if (groupName === 'AIO') {
      return !this.model.isAffectedGroupAIO;
    }

    return false;
  }
}
