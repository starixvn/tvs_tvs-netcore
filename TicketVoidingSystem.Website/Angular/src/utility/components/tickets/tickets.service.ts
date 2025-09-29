import { ElementRef, inject, Injectable } from '@angular/core';
import { GroupModel } from './group.model';
import { IconCheckBox } from '../../constants/config';
import { BetID } from '../../models/bet-id.model';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  groupService = inject(GroupService);

  getCheckedBetIds(groups: GroupModel[]): string {
    return groups?.flatMap(group => this.groupService.getEnableTickets(group.tickets)).map(x => x.transId).join(',') ?? '';
  }

  getNumberOfCheckedTickets(groups: GroupModel[]): number {
    return groups.reduce((count, group) => count + this.groupService.getCheckedTickets(group.tickets).length, 0);
  }


  isAllItemsChecked(groups: GroupModel[]): boolean {
    return groups?.every(group => group.tickets.every(ticket => ticket.isChecked)) ?? false;
  }

  checkSettledTickets(groups: GroupModel[]): boolean {
    return groups?.some(group => this.groupService.checkSettledTickets(group.tickets)) ?? false;
  }

  checkGroups(groups: GroupModel[], iconCheckBox: IconCheckBox) {
    if (groups.length > 0) {
      const isAllUnchecked = iconCheckBox !== IconCheckBox.none;

      groups.forEach(group => {
        group.isCheckAll = isAllUnchecked ? false : !group.isDisabled;
        this.groupService.checkAllTickets(group);
      });

      return isAllUnchecked ? IconCheckBox.none : IconCheckBox.all;
    }
    
     return iconCheckBox;
  }

  checkAllGroupsDropDown(groups: GroupModel[], iconCheckBox: IconCheckBox) {
    const isCheckingAll = iconCheckBox !== IconCheckBox.all;

    groups.forEach(group => {
      group.isCheckAll = isCheckingAll ? !group.isDisabled : false;
      this.groupService.checkAllTickets(group);
    });

    return isCheckingAll ? IconCheckBox.all : IconCheckBox.none;
  }

  getTicketSold(groups: GroupModel[]): string {
    const soldTickets = groups
      .map(group => this.groupService.getTicketSold(group.tickets))
      .filter(ticketSold => ticketSold !== '');

    return soldTickets.join(',') + this.getLastedSoldId(groups);
  }

  private getLastedSoldId(groups: GroupModel[]): string {
    const lastGroup = groups.length - 1;
    const lastedGroup = groups[lastGroup];
    const lastedTicket = lastedGroup.tickets[lastedGroup.tickets.length - 1];
    return lastedTicket.member.toLowerCase().indexOf('bettrade') !== -1 && lastedTicket.isChecked ?
      `,${lastedTicket.soldId}` : '';
  }

  static updateIconCheckBox(groups: GroupModel[]): IconCheckBox {
    const numberTickets = groups.reduce((count, group) => count + group.tickets.length, 0);
    const numberTicketsChecked = groups.reduce((count, group) => count + group.tickets.filter(ticket => ticket.isChecked).length, 0);

    return numberTickets === 0 ? IconCheckBox.none :
      numberTickets === numberTicketsChecked ? IconCheckBox.all :
        numberTicketsChecked > 0 ? IconCheckBox.any : IconCheckBox.none;
  }

  getTicketCricket(groups: GroupModel[]): BetID[] {
    return groups.flatMap(group => this.groupService.getTicketCricket(group.tickets));
  }

  getAllTicket(groups: GroupModel[]): BetID[] {
    return groups.flatMap(group => this.groupService.getTickets(group.tickets));
  }

  getTicketEnable(groups: GroupModel[]): BetID[] {
    return groups.flatMap(group => this.groupService.getEnableTickets(group.tickets));
  }

  updatePositionListCheckGroup(element: ElementRef) {
    const className = 'list-check-groups-input';
    const targetElement = element.nativeElement.getElementsByClassName(className);
    const top = targetElement[0].offsetParent.offsetTop * 1 + targetElement[0].offsetHeight * 1;
    return `${top}px`;
  }
}
