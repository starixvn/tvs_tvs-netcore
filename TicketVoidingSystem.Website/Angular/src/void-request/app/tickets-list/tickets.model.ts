import * as moment from 'moment-timezone';
import { BetID } from '../../../utility/models/bet-id.model';
import { CommonTicketsModel } from '../../../utility/models/common.tickets.model';
import { GroupModel } from './group-tickets.model';


enum IconCheckBox {
  none = 0,
  any = 1,
  all = 2
}

export class TicketsModel extends CommonTicketsModel<GroupModel> {
  total: number;
  totalSingle: number;
  totalParlay: number;
  totalCancelCashOut: number;
  fromTime: Date;
  toTime: Date;
  fromDate: Date;
  toDate: Date;
  strFromTime: string;
  strToTime: string;
  singleTickets: BetID[];
  parlayTickets: BetID[];
  cancelCashOutTickets: BetID[];
  cricketTickets: BetID[];
  uncheckedTransIds: string[];
  licenseesName: string;
  instantLicenseesName: string;
  chinaViewLicenseesName: string;
  cashOutLicenseesName: string;
  betTypes: string;
  isHasSettledTicket: boolean;
  isAllLiveTickets: boolean;
  isHasAioMessage: boolean;
  checkPermissionTickets: BetID[];
  allCancelCashOutTickets: BetID[];

  initData(data: TicketsModel) {
    this.total = data.total;
    this.totalSingle = data.totalSingle;
    this.totalParlay = data.totalParlay;
    this.totalCancelCashOut = data.totalCancelCashOut;
    this.fromTime = data.fromTime;
    this.toTime = data.toTime;
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.strFromTime = moment(new Date(data.fromTime)).format('hh:mm:ss A');
    this.strToTime = moment(new Date(data.toTime)).format('hh:mm:ss A');
    this.mapGroups(data.groups);
    this.changeIconCheckBox();

    this.singleTickets = data.singleTickets;
    this.cancelCashOutTickets = data.cancelCashOutTickets;
    this.parlayTickets = data.parlayTickets;
    this.cricketTickets = data.cricketTickets;
    this.uncheckedTransIds = data.uncheckedTransIds;
    this.betTypes = data.betTypes;
    this.checkPermissionTickets = data.checkPermissionTickets;
    this.allCancelCashOutTickets = data.allCancelCashOutTickets;
    this.isHasAioMessage = data.isHasAioMessage;
    this.isHasSettledTicket = data.isHasSettledTicket;
    this.isAllLiveTickets = data.isAllLiveTickets;
  }

  mapGroups(groups: Array<GroupModel>) {
    this.groups = [];
    groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets, item.displayTotalTickets);
      this.groups.push(group);
    });
  }

  checkGroups() {
    if (this.groups.length > 0) {
      if (this.iconCheckBox !== IconCheckBox.none) {
        this.groups.forEach(group => {
          group.isCheckAll = false;
          group.checkAllTickets();
        });
        this.iconCheckBox = IconCheckBox.none;
      } else {
        this.groups.forEach(group => {
          group.isCheckAll = !group.isDisabled;
          group.checkAllTickets();
        });
        this.iconCheckBox = IconCheckBox.all;
      }
    }
  }
}
