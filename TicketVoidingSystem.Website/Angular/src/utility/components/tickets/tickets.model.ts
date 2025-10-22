import { AffectedLicensee } from '../licensee-affected-list/licensee-affected-list.model';
import { PagingModel } from '../paging/paging.model';
import { Message } from '../template-message/messages/message';
import { GroupModel } from './group.model';

enum IconCheckBox {
    none = 0,
    any = 1,
    all = 2
}

export class TicketsModel {
    id: string;
    totalItems: number;
    singleCount: number;
    parlayCount: number;
    fromTransTime: Date;
    toTransTime: Date;
    fromCheckTime: Date;
    toCheckTime: Date;
    strFromTime: string;
    strToTime: string;
    licenseeAffectedList: AffectedLicensee[];
    betTypeNameReplaceMessage: Message;
    smallestMapTicket: string;
    inning: string;
    groups: Array<GroupModel>;
    pagingModel: PagingModel;
    iconCheckBox: IconCheckBox;
    iconCheckBoxTop: string;
}