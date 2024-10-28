import { Injectable } from '@angular/core';
import _ from 'lodash';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { AbnormalFilterBy } from '../../../../utility/constants/config';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AppService } from '../../app.service';
import { TicketsService } from '../../services/tickets.service';
import { BasicRequestInfo } from '../models/basic-request-info.model';
import { VoidPageDuplicateTicketsModel } from '../models/void-page-duplicate-tickets.model';

@Injectable({
  providedIn: 'root'
})
export class VoidPageService {

  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly ticketsService: TicketsService,
    private readonly templateService: TemplateService
  ) {
  }

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.commonService.getIssueTypes();
  }

  async getBasicVoidPageItemsData(issueTypes: IssueTypesModel, requestDetail: RequestDetailViewModel): Promise<VoidPageDuplicateTicketsModel> {
    const basicRequestInfo = this.initBasicRequestInfo(requestDetail);
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.subIssueType = this.getSubIssueTypeModel(basicRequestInfo.subIssueTypeId, issueTypes);
    voidPageItem.displayIssueTypeName = this.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidPageItem.subIssueType, issueTypes);
    voidPageItem.filterBy = basicRequestInfo.filterBy;
    voidPageItem.detailViewModel = requestDetail;
    voidPageItem.matchModel = this.isDuplicateTicketsMixParlay(voidPageItem.filterBy)
      ? null : await this.commonService.getMatch(basicRequestInfo.matchId);

    return voidPageItem;
  }

  async loadUnderneathVoidPageItemsData(voidPageItem: VoidPageDuplicateTicketsModel, requestDetail: RequestDetailViewModel): Promise<void> {
    const ticketQuery = this.ticketsService.initTicketQuery(requestDetail);
    voidPageItem.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
    voidPageItem.templateValue = this.getTemplateValue(voidPageItem, requestDetail);
    voidPageItem.voidReason = await this.getVoidedReason(voidPageItem);
    voidPageItem.licenseeAffectedList = voidPageItem.voidTicketsMini.licenseeAffectedList;
    voidPageItem.licenseeAffectedList = _.clone(voidPageItem.licenseeAffectedList);
  }

  private getTemplateValue(voidPageItem: VoidPageDuplicateTicketsModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = voidPageItem.matchModel ? this.templateService.initializeTemplateValue(voidPageItem.matchModel) : new TemplateValue();
    templateValue.filterBy = requestDetail.duplicateTicketsModel.filterBy;
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    templateValue.groupPHAffected = voidPageItem.voidTicketsMini.groupPHAffected;
    return templateValue;
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo {
    const basicRequestInfo: BasicRequestInfo = {
      matchId: requestDetail.duplicateTicketsModel.matchId,
      subIssueTypeId: requestDetail.duplicateTicketsModel.subIssueTypeId,
      filterBy: requestDetail.duplicateTicketsModel.filterBy
    };

    return basicRequestInfo;
  }

  private getSubIssueTypeModel(subIssueTypeId: number, issueTypes: IssueTypesModel): SubIssueType {
    return issueTypes.subIssueTypes.find(x => x.subIssueTypeId === subIssueTypeId);
  }

  private getDisplayIssueTypeName(issueTypeId: number, subIssueTypeModel: SubIssueType, issueTypes: IssueTypesModel): string {
    const currentIssueType = issueTypes.issueTypes.find(x => x.issueTypeId === issueTypeId);
    const displayName = currentIssueType.issueTypeName === subIssueTypeModel.subIssueTypeName ? currentIssueType.issueTypeName
      : `${currentIssueType.issueTypeName} - ${subIssueTypeModel.subIssueTypeName}`;

    return displayName;
  }

  private async getVoidedReason(voidPageItem: VoidPageDuplicateTicketsModel): Promise<VoidedReason> {
    const reason = await this.commonService.getVoidedReason(voidPageItem.subIssueType.subIssueTypeId, voidPageItem.matchModel?.sportType);
    if (this.isDuplicateTicketsMixParlay(voidPageItem.filterBy)) {
      return {
        reasonEnglish: `Mix Parlay - ${reason.reasonEnglish}`,
        reasonChineseSimplified: `串关 - ${reason.reasonChineseSimplified}`
      } as VoidedReason;
    }

    return reason
  }

  private isDuplicateTicketsMixParlay(filterBy: number): boolean {
    return filterBy === AbnormalFilterBy.MIX_PARLAY;
  }
}