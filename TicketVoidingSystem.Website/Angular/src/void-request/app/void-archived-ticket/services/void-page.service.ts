import { inject, Injectable } from '@angular/core';
import clone from 'lodash/clone';
import { RequestDetailViewModel } from '../../../../add-request-new/models/request-detail.model';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { TicketsService } from '../../services/tickets.service';
import { VoidPageCommonService } from '../../services/void-page-common.service';
import { VoidArchivedTicketModel } from '../models/void-archived-ticket.model';

@Injectable()
export class VoidPageService {
  private readonly commonService = inject(CommonService);
  private readonly ticketsService = inject(TicketsService);
  private readonly voidPageCommonService = inject(VoidPageCommonService);

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.commonService.getIssueTypes();
  }

  async getBasicVoidPageItemsData(issueTypes: IssueTypesModel, requestDetail: RequestDetailViewModel): Promise<VoidArchivedTicketModel> {
    const voidPageItem = new VoidArchivedTicketModel();
    voidPageItem.id = 1;
    voidPageItem.subIssueType = this.getSubIssueTypeModel(requestDetail, issueTypes);
    voidPageItem.displayIssueTypeName = this.voidPageCommonService.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidPageItem.subIssueType, issueTypes);
    voidPageItem.detailViewModel = requestDetail;

    return voidPageItem;
  }

  async loadUnderneathVoidPageItemsData(voidPageItem: VoidArchivedTicketModel, requestDetail: RequestDetailViewModel): Promise<void> {
    const ticketQuery = this.ticketsService.initTicketQuery(requestDetail, voidPageItem.matchModel);
    voidPageItem.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
    voidPageItem.templateValue = this.getTemplateValue(voidPageItem);
    voidPageItem.voidReason = await this.voidPageCommonService.getVoidedReason(voidPageItem.subIssueType.subIssueTypeId, voidPageItem.matchModel?.sportType);
    voidPageItem.licenseeAffectedList = voidPageItem.voidTicketsMini.licenseeAffectedList;
    voidPageItem.licenseeAffectedList = clone(voidPageItem.licenseeAffectedList);
  }

  getTemplateValue(voidPageItem: VoidArchivedTicketModel){
    const templateValue = new TemplateValue();
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;

    return templateValue;
  }

  private getSubIssueTypeId(requestDetail: RequestDetailViewModel) {
    if (StaticService.isArchivedTicket(requestDetail.request.issueTypeId)) {
      return requestDetail.event.subIssueTypeId;
    }
    return StaticService.isAbnormalAccount(requestDetail.request.issueTypeId) ? requestDetail.abnormalAccountModel.subIssueTypeId : null;
  }

  private getSubIssueTypeModel(requestDetail: RequestDetailViewModel, issueTypes: IssueTypesModel): SubIssueType {
    const subIssueTypeId = this.getSubIssueTypeId(requestDetail);
    return issueTypes.subIssueTypes.find(x => x.subIssueTypeId === subIssueTypeId);
  }
}