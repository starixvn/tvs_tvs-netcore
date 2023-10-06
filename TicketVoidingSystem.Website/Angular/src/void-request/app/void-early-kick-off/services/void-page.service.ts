import { Injectable } from '@angular/core';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AppService } from '../../app.service';
import { BasicRequestInfo } from '../../models/basic-request-info.model';
import { TicketsService } from '../../services/tickets.service';
import { TemplateService } from '../../../../utility/components/template-message/template-message/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { VoidPageEarlyKickOffModel } from '../models/void-page-early-kick-off.model';

@Injectable({
  providedIn: 'root'
})
export class VoidPageService {

  constructor(
    private readonly commonService: CommonService,
    private readonly appService: AppService,
    private readonly ticketsService: TicketsService,
    private readonly templateService: TemplateService,
    ) {
  }

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.commonService.getIssueTypes();
  }

  async getBasicVoidMatchesData(issueTypes: IssueTypesModel, requestDetail: RequestDetailViewModel): Promise<VoidPageEarlyKickOffModel[]> {
    const voidMatches: VoidPageEarlyKickOffModel[] = [];
    const basicRequestInfo = this.initBasicRequestInfo(requestDetail);
    for (const element of basicRequestInfo) {
      const voidMatchInfo = new VoidPageEarlyKickOffModel();
      voidMatchInfo.subIssueType = this.getSubIssueTypeModel(element.subIssueTypeId, issueTypes);
      voidMatchInfo.displayIssueTypeName = this.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidMatchInfo.subIssueType, issueTypes);
      voidMatchInfo.matchModel = await this.commonService.getMatch(element.matchId);
      voidMatchInfo.isMainMatch = element.isMainMatch;
      voidMatchInfo.isShowTemplateMessage = false;
      voidMatches.push(voidMatchInfo);
    }

    return voidMatches;
  }

  async loadUnderneathVoidMatchesData(voidMatches: VoidPageEarlyKickOffModel[], requestDetail: RequestDetailViewModel): Promise<void> {
    for (const element of voidMatches) {
      const ticketQuery = this.ticketsService.initTicketQuery(requestDetail, element.matchModel);
      element.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
      element.templateValue = this.getTemplateValue(element);
      element.voidReason = await this.appService.getVoidedReason(element.subIssueType.subIssueTypeId, element.matchModel.sportType);
    }
  }

  public toggleTicketsArea(currentVoidMatch: VoidPageEarlyKickOffModel, allVoidMatches: VoidPageEarlyKickOffModel[]): void {
    const currentIsShowTicketFull = currentVoidMatch.isShowTicketFull;
    const currentIsShowTemplateMessage = currentVoidMatch.isShowTemplateMessage;
    allVoidMatches.forEach(item => {
      item.isShowTemplateMessage = false;
      item.isShowTicketFull = false;
    });
    currentVoidMatch.isShowTicketFull = !currentIsShowTicketFull;
    currentVoidMatch.isShowTemplateMessage = currentIsShowTemplateMessage;
  }

  public toggleTemplateMessageArea(currentVoidMatch: VoidPageEarlyKickOffModel, allVoidMatches: VoidPageEarlyKickOffModel[]): void {
    const currentIsShowTemplateMessage = currentVoidMatch.isShowTemplateMessage;
    const currentIsShowTicketFull = currentVoidMatch.isShowTicketFull;
    allVoidMatches.forEach(item => {
      item.isShowTemplateMessage = false;
      item.isShowTicketFull = false;
    });
    currentVoidMatch.isShowTicketFull = currentIsShowTicketFull;
    currentVoidMatch.isShowTemplateMessage = !currentIsShowTemplateMessage;
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo[] {
      return requestDetail.earlyKickOffModels.map(x => {
        const info: BasicRequestInfo = {
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          isMainMatch: x.isMainMatch,
        };
        return info;
      });
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

  private getTemplateValue(voidMatch: VoidPageEarlyKickOffModel): TemplateValue {
    const templateValue = this.templateService.getTemplateValue(voidMatch.matchModel);
    templateValue.checkSettled = voidMatch.voidTicketsMini.isHasSettledTicket;
    
    return templateValue;
  }
}

