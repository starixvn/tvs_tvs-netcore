import { Injectable } from '@angular/core';
import { GetLogInfoQuery } from '../../../../add-request/app/add-request/models/add-request.query';
import { GetLogInfoModel } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { CommonService } from '../../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../../utility/services/mapping-model-static.service';
import { AppService } from '../../app.service';
import { BasicRequestInfo } from '../../models/basic-request-info.model';
import { VoidMatch } from '../../models/void-match.model';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { TicketsService } from '../../services/tickets.service';
import { TemplateMessageService } from './template-message.service';

@Injectable({
  providedIn: 'root'
})
export class VoidPageService {

  constructor(
    private readonly commonService: CommonService,
    private readonly appService: AppService,
    private readonly ticketsService: TicketsService,
    private readonly templateMessageService: TemplateMessageService) {
  }

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.commonService.getIssueTypes();
  }

  async getBasicVoidMatchesData(issueTypes: IssueTypesModel, requestDetail: RequestDetailViewModel, primitiveProperty: PrimitiveProperty): Promise<VoidMatch[]> {
    const voidMatches: VoidMatch[] = [];
    const logInfoList = await this.getAllLogInfo(requestDetail, primitiveProperty);
    const basicRequestInfo = this.initBasicRequestInfo(requestDetail);
    for (const element of basicRequestInfo) {
      const voidMatchInfo = new VoidMatch();
      voidMatchInfo.subIssueType = this.getSubIssueTypeModel(element.subIssueTypeId, issueTypes);
      voidMatchInfo.displayIssueTypeName = this.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidMatchInfo.subIssueType,
        issueTypes);
      voidMatchInfo.matchModel = await this.commonService.getMatch(element.matchId);
      voidMatchInfo.logInfoDetail = logInfoList.find(x => x.logInfoDetail.matchId === element.matchId).logInfoDetail;
      voidMatchInfo.isCheckedVar = element.isCheckedVar;
      voidMatchInfo.isMainMatch = element.isMainMatch;
      voidMatchInfo.isPoolHouseAffected = false;
      voidMatches.push(voidMatchInfo);
    }

    return voidMatches;
  }

  async loadUnderneathVoidMatchesData(voidMatches: VoidMatch[], requestDetail: RequestDetailViewModel): Promise<void> {
    for (const element of voidMatches) {
      const ticketQuery = this.ticketsService.initTicketQuery(requestDetail, element.matchModel);
      element.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
      element.templateValue = this.templateMessageService.getTemplateValue(element, requestDetail);
      element.voidReason = await this.appService.getVoidedReason(element.subIssueType.subIssueTypeId, element.matchModel.sportType);
    }
  }

  public toggleTicketsArea(currentVoidMatch: VoidMatch, allVoidMatches: VoidMatch[]): void {
    const currentIsShowTicketFull = currentVoidMatch.isShowTicketFull;
    const currentIsShowTemplateMessage = currentVoidMatch.isShowTemplateMessage;
    allVoidMatches.forEach(item => {
      item.isShowTemplateMessage = false;
      item.isShowTicketFull = false;
    });
    currentVoidMatch.isShowTicketFull = !currentIsShowTicketFull;
    currentVoidMatch.isShowTemplateMessage = currentIsShowTemplateMessage;
  }

  public toggleTemplateMessageArea(currentVoidMatch: VoidMatch, allVoidMatches: VoidMatch[]): void {
    const currentIsShowTemplateMessage = currentVoidMatch.isShowTemplateMessage;
    const currentIsShowTicketFull = currentVoidMatch.isShowTicketFull;
    allVoidMatches.forEach(item => {
      item.isShowTemplateMessage = false;
      item.isShowTicketFull = false;
    });
    currentVoidMatch.isShowTicketFull = currentIsShowTicketFull;
    currentVoidMatch.isShowTemplateMessage = !currentIsShowTemplateMessage;
  }

  private async getAllLogInfo(requestDetail: RequestDetailViewModel, primitiveProperty: PrimitiveProperty): Promise<GetLogInfoModel[]> {
    primitiveProperty.isBlockUI = true;
    const query: GetLogInfoQuery = {
      requestId: requestDetail.requestId,
      isShowLogOnly: true,
      issueTypeId: requestDetail.request.issueTypeId,
      matchId: requestDetail.redCardModels[0].matchId,
      redCardModels: MappingModelStaticService.buidRedCardGetLogInfoModel(requestDetail.redCardModels),
    };
    
    const viewModel = await this.commonService.getLogInfo(query);
    primitiveProperty.isBlockUI = false;

    return viewModel.getLogInfoModels;
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo[] {
      return requestDetail.redCardModels.map(x => {
        const info: BasicRequestInfo = {
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          isMainMatch: x.isMainMatch,
          isCheckedVar: x.isCheckedVar
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
}

