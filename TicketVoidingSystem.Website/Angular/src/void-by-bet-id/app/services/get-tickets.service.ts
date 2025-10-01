import { inject, Injectable } from '@angular/core';
import { TicketsViewModel } from '../model/get-tickets.query';
import moment from 'moment-timezone';
import { TicketsService } from '../../../utility/components/tickets/tickets.service';
import { GroupModel } from "../../../utility/components/tickets/group.model";
import { GroupService } from '../../../utility/components/tickets/group.service';

@Injectable()
export class GetTicketsService {
  private readonly groupService = inject(GroupService);

  initData(baseModel: TicketsViewModel, data: TicketsViewModel) {
    if (!data) {
      return;
    }
    const TIME_FORMAT = 'hh:mm:ss A';
    baseModel.singleCount = data.singleCount;
    baseModel.parlayCount = data.parlayCount;
    baseModel.fromTransTime = data.fromTransTime;
    baseModel.toTransTime = data.toTransTime;
    baseModel.strFromTime = moment(new Date(baseModel.fromTransTime)).format(TIME_FORMAT);
    baseModel.strToTime = moment(new Date(baseModel.toTransTime)).format(TIME_FORMAT);
    baseModel.invalidTransIds = data.invalidTransIds;
    baseModel.movedTransIds = data.movedTransIds;
    baseModel.matchId = data.matchId;
    baseModel.licenseesName = data.licenseesName;
    baseModel.totalItems = data.totalItems;

    baseModel.groups = [];
    if (data.groups) {
      data.groups.forEach(item => {
        const group = this.groupService.initGroup(item.name, item.tickets);
        baseModel.groups.push(group);
      });
      baseModel.iconCheckBox = TicketsService.updateIconCheckBox(baseModel.groups);
      this.checkedSpecialTicket(baseModel.groups);
    }
  }

  private checkedSpecialTicket(groups: GroupModel[]) {
    groups.forEach(group => {
      if (group.tickets) {
        group.tickets.forEach(ticket => {
          ticket.isChecked = !this.isGroupSpecial(group.name) && !ticket.isDisable;
        });
      }
      group.isCheckAll = GroupService.setIsCheckAll(group.tickets);
    });
  }

  private isGroupSpecial(groupName: string): boolean {
    const groupSpecial = ['betfair', 'parlay', 'phone betting'];
    return groupSpecial.some(x => groupName.toLowerCase().includes(x.toLowerCase()));
  }
}
