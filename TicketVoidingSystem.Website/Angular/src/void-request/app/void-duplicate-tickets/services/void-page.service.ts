import { Injectable } from '@angular/core';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/template.service';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AppService } from '../../app.service';
import { TicketsService } from '../../services/tickets.service';
import { BasicRequestInfo } from '../models/basic-request-info.model';
import { VoidPageDuplicateTicketsModel } from '../models/void-page-duplicate-tickets.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class VoidPageService {

  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly ticketsService: TicketsService,
    private readonly templateService: TemplateService,
    private readonly validationService: ValidationService,
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
    voidPageItem.matchModel = this.validationService.isDuplicateTicketsMixParlay(voidPageItem.filterBy)
      ? null : await this.commonService.getMatch(basicRequestInfo.matchId);

    return voidPageItem;
  }

  async loadUnderneathVoidPageItemsData(voidPageItem: VoidPageDuplicateTicketsModel, requestDetail: RequestDetailViewModel): Promise<void> {
    const ticketQuery = this.ticketsService.initTicketQuery(requestDetail);
    voidPageItem.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
    voidPageItem.templateValue = this.getTemplateValue(voidPageItem, requestDetail);
    voidPageItem.voidReason = await this.getVoidedReason(voidPageItem);
  }

  private getTemplateValue(voidPageItem: VoidPageDuplicateTicketsModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = voidPageItem.matchModel ? this.templateService.getTemplateValue(voidPageItem.matchModel) : new TemplateValue();
    templateValue.filterBy = requestDetail.duplicateTicketsModel.filterBy;
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    return templateValue;
  }

  public toggleTicketsArea(voidPageItem: VoidPageDuplicateTicketsModel): void {
    const currentIsShowTicketFull = voidPageItem.isShowTicketFull;
    const currentIsShowTemplateMessage = voidPageItem.isShowTemplateMessage;
    voidPageItem.isShowTicketFull = !currentIsShowTicketFull;
    voidPageItem.isShowTemplateMessage = currentIsShowTemplateMessage;
  }

  public toggleTemplateMessageArea(voidPageItem: VoidPageDuplicateTicketsModel): void {
    const currentIsShowTemplateMessage = voidPageItem.isShowTemplateMessage;
    const currentIsShowTicketFull = voidPageItem.isShowTicketFull;
    voidPageItem.isShowTicketFull = currentIsShowTicketFull;
    voidPageItem.isShowTemplateMessage = !currentIsShowTemplateMessage;
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
    const reason = this.appService.getVoidedReason(voidPageItem.subIssueType.subIssueTypeId, voidPageItem.matchModel?.sportType);
    if (this.validationService.isDuplicateTicketsMixParlay(voidPageItem.filterBy)) {
      return {
        reasonEnglish: `Mix Parlay - ${(await reason).reasonEnglish}`,
        reasonChineseSimplified: `串关 - ${(await reason).reasonChineseSimplified}`
      } as VoidedReason;
    }

    return reason
  }
}