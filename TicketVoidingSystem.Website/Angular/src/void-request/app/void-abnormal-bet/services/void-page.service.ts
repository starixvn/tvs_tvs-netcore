import { inject } from '@angular/core';
import _ from 'lodash';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { CommonService } from '../../../../utility/services/common.service';
import { TicketsService } from '../../services/tickets.service';
import { VoidPageCommonService } from '../../services/void-page-common.service';
import { BasicRequestInfo } from '../models/basic-request-info.model';
import { VoidAbnormalBetModel } from '../models/void-abnormal-bet.model';

export class VoidPageService {
  commonService = inject(CommonService);
  ticketsService = inject(TicketsService);
  templateService = inject(TemplateService);
  voidPageCommonService = inject(VoidPageCommonService);

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.commonService.getIssueTypes();
  }

  async getBasicVoidPageItemsData(issueTypes: IssueTypesModel, requestDetail: RequestDetailViewModel): Promise<VoidAbnormalBetModel[]> {
    const voidPageItems: VoidAbnormalBetModel[] = [];
    const basicRequestInfos = this.initBasicRequestInfo(requestDetail);
    for (const element of basicRequestInfos) {
      const voidPageItem = new VoidAbnormalBetModel();
      voidPageItem.id = element.id;
      voidPageItem.subIssueType = this.getSubIssueTypeModel(element.subIssueTypeId, issueTypes);
      voidPageItem.displayIssueTypeName = this.voidPageCommonService.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidPageItem.subIssueType, issueTypes);
      voidPageItem.detailViewModel = requestDetail;
      voidPageItem.matchModel = element.matchId > 0 ? await this.commonService.getMatch(element.matchId) : null;

      voidPageItems.push(voidPageItem);
    }

    return voidPageItems;
  }

  async loadUnderneathVoidPageItemsData(voidPageItems: VoidAbnormalBetModel[], requestDetail: RequestDetailViewModel): Promise<void> {
    for (const element of voidPageItems) {
      const ticketQuery = this.ticketsService.initTicketQuery(requestDetail, element.matchModel);
      element.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
      element.templateValue = this.getTemplateValue(element, requestDetail);
      element.voidReason = await this.commonService.getVoidedReason(element.subIssueType.subIssueTypeId, element.matchModel ? element.matchModel.sportType : 0);
      element.licenseeAffectedList = element.voidTicketsMini.licenseeAffectedList;
      element.licenseeAffectedList = _.clone(element.licenseeAffectedList);
    }
  }

  private getTemplateValue(voidPageItem: VoidAbnormalBetModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = voidPageItem.matchModel ? this.templateService.initializeTemplateValue(voidPageItem.matchModel) : new TemplateValue();
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    templateValue.filterBy = requestDetail.abnormalBetModel.filterBy;

    return templateValue;
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo[] {
    return requestDetail.abnormalBetModel.matches.map((x, index) => {
      const model: BasicRequestInfo = {
        id: index + 1,
        matchId: x.matchId,
        subIssueTypeId: requestDetail.abnormalBetModel.subIssueTypeId
      };

      return model;
    });
  }

  private getSubIssueTypeModel(subIssueTypeId: number, issueTypes: IssueTypesModel): SubIssueType {
    return issueTypes.subIssueTypes.find(x => x.subIssueTypeId === subIssueTypeId);
  }
}