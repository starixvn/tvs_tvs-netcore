import { Injectable } from '@angular/core';
import { TicketsModel } from './tickets.model';
import { IconCheckBox } from '../../../utility/constants/config';
import { GroupModel } from './group-tickets.model';
import moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class TicketListService {
  initData(baseModel: TicketsModel, data: TicketsModel) {
    baseModel.total = data.total;
    baseModel.totalSingle = data.totalSingle;
    baseModel.totalParlay = data.totalParlay;
    baseModel.totalCancelCashOut = data.totalCancelCashOut;
    baseModel.fromTime = data.fromTime;
    baseModel.toTime = data.toTime;
    baseModel.fromDate = data.fromDate;
    baseModel.toDate = data.toDate;
    baseModel.strFromTime = moment(new Date(data.fromTime)).format('hh:mm:ss A');
    baseModel.strToTime = moment(new Date(data.toTime)).format('hh:mm:ss A');
    this.mapGroups(baseModel, data.groups);
    baseModel.changeIconCheckBox();

    baseModel.singleTickets = data.singleTickets;
    baseModel.cancelCashOutTickets = data.cancelCashOutTickets;
    baseModel.parlayTickets = data.parlayTickets;
    baseModel.cricketTickets = data.cricketTickets;
    baseModel.uncheckedTransIds = data.uncheckedTransIds;
    baseModel.betTypes = data.betTypes;
    baseModel.checkPermissionTickets = data.checkPermissionTickets;
    baseModel.allCancelCashOutTickets = data.allCancelCashOutTickets;
    baseModel.isHasSettledTicket = data.isHasSettledTicket;
    baseModel.isAllLiveTickets = data.isAllLiveTickets;
    baseModel.isAllNonLiveTickets = data.isAllNonLiveTickets;
    baseModel.groupPHAffected = data.groupPHAffected;
    baseModel.betTypeNameReplaceMessage = data.betTypeNameReplaceMessage;
    baseModel.groupBetTypeId = data.groupBetTypeId;
  }

  private mapGroups(baseModel: TicketsModel, groups: Array<GroupModel>) {
    baseModel.groups = [];
    groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets, item.displayTotalTickets);
      baseModel.groups.push(group);
    });
  }

  checkGroups(baseModel: TicketsModel) {
    if (baseModel.groups.length > 0) {
      if (baseModel.iconCheckBox !== IconCheckBox.none) {
        baseModel.groups.forEach(group => {
          group.isCheckAll = false;
          group.checkAllTickets();
        });
        baseModel.iconCheckBox = IconCheckBox.none;
      } else {
        baseModel.groups.forEach(group => {
          group.isCheckAll = !group.isDisabled;
          group.checkAllTickets();
        });
        baseModel.iconCheckBox = IconCheckBox.all;
      }
    }
  }
}
