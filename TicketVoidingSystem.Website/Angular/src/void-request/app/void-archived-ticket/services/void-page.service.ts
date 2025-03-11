import { inject, Injectable } from '@angular/core';
import _ from 'lodash';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { CommonPrimitiveProperty } from '../../models/common-primitive-property.model';
import { TicketsService } from '../../services/tickets.service';
import { VoidPageCommonService } from '../../services/void-page-common.service';
import { BasicRequestInfo } from '../models/basic-request-info.model';
import { VoidArchivedTicketModel } from '../models/void-archived-ticket.model';
import { TemplateMessageService } from './template-message.service';

@Injectable()
export class VoidPageService {
  commonService = inject(CommonService);
  ticketsService = inject(TicketsService);
  voidPageCommonService = inject(VoidPageCommonService);
  templateMessageService = inject(TemplateMessageService);

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.commonService.getIssueTypes();
  }

  async getBasicVoidPageItemsData(issueTypes: IssueTypesModel, requestDetail: RequestDetailViewModel, primitiveProperty: CommonPrimitiveProperty): Promise<VoidArchivedTicketModel> {
    const basicRequestInfo = this.initBasicRequestInfo(requestDetail);
    const voidPageItem = new VoidArchivedTicketModel();
    voidPageItem.id = basicRequestInfo.id;
    voidPageItem.subIssueType = this.getSubIssueTypeModel(basicRequestInfo.subIssueTypeId, issueTypes);
    voidPageItem.displayIssueTypeName = this.voidPageCommonService.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidPageItem.subIssueType, issueTypes);
    voidPageItem.detailViewModel = requestDetail;

    return voidPageItem;
  }

  async loadUnderneathVoidPageItemsData(voidPageItem: VoidArchivedTicketModel, requestDetail: RequestDetailViewModel): Promise<void> {
    const ticketQuery = this.ticketsService.initTicketQuery(requestDetail, voidPageItem.matchModel);
    voidPageItem.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
    voidPageItem.templateValue = this.templateMessageService.getTemplateValue(voidPageItem, requestDetail);
    voidPageItem.voidReason = await this.voidPageCommonService.getVoidedReason(voidPageItem.subIssueType.subIssueTypeId, voidPageItem.matchModel?.sportType);
    voidPageItem.licenseeAffectedList = voidPageItem.voidTicketsMini.licenseeAffectedList;
    voidPageItem.licenseeAffectedList = _.clone(voidPageItem.licenseeAffectedList);
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo {
    if (StaticService.isArchivedTicket(requestDetail.request.issueTypeId)) {
      return {
        id: 1,
        subIssueTypeId: requestDetail.event.subIssueTypeId
      } as BasicRequestInfo;
    }
    if (StaticService.isAbnormalAccount(requestDetail.request.issueTypeId)) {
      return {
        id: 1,
        subIssueTypeId: requestDetail.abnormalAccountModel.subIssueTypeId
      } as BasicRequestInfo;
    }

    return null;
  }

  private getSubIssueTypeModel(subIssueTypeId: number, issueTypes: IssueTypesModel): SubIssueType {
    return issueTypes.subIssueTypes.find(x => x.subIssueTypeId === subIssueTypeId);
  }
}