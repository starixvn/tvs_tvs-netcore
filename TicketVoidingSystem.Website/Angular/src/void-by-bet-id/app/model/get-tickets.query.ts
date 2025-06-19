import { TicketsModel } from "../../../utility/components/tickets/tickets.model";
import { GroupModel } from "../../../utility/components/tickets/group.model";
import moment from "moment";

export class GetTicketsQuery {
    transIds = '';
    abnormalBetType = '0';
    includeMainParlay = false;
}

export class TicketsViewModel extends TicketsModel {
    invalidTransIds: string;
    movedTransIds: string;
    matchId: number;
    licenseesName: string;
    
    initData(data: TicketsViewModel) {
        if(!data){
            return;
        }
        const TIME_FORMAT = 'hh:mm:ss A';
        this.singleCount = data.singleCount;
        this.parlayCount = data.parlayCount;
        this.fromTransTime = data.fromTransTime;
        this.toTransTime = data.toTransTime;
        this.strFromTime = moment(new Date(this.fromTransTime)).format(TIME_FORMAT);
        this.strToTime = moment(new Date(this.toTransTime)).format(TIME_FORMAT);
        this.invalidTransIds = data.invalidTransIds;
        this.movedTransIds = data.movedTransIds;
        this.matchId = data.matchId;
        this.licenseesName = data.licenseesName;
        this.totalItems = data.totalItems;

        this.groups = [];
        data.groups.forEach(item => {
            const group = new GroupModel(item.name, item.tickets);
            this.groups.push(group);
          });
        this.changeIconCheckBox();
    }   
}
