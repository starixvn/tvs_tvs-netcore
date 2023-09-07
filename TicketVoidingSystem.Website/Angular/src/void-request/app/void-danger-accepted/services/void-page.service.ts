import { Injectable } from '@angular/core';
import { GetLogInfoQuery } from '../../../../add-request/app/add-request/models/add-request.query';
import { GetLogInfoModel } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { CommonService } from '../../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../../utility/services/mapping-model-static.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AppService } from '../../app.service';
import { BasicRequestInfo } from '../../models/basic-request-info.model';
import { VoidMatch } from '../../models/void-match.model';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { TemplateMessageService } from './template-message.service';
import { TicketsService } from './tickets.service';

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
    const issueTypeId = requestDetail.request.issueTypeId.toString();
    const basicRequestInfo = this.initBasicRequestInfo(issueTypeId, requestDetail);
    for (const element of basicRequestInfo) {
      const voidMatchInfo = new VoidMatch();
      voidMatchInfo.subIssueType = this.getSubIssueTypeModel(element.subIssueTypeId, issueTypes);
      voidMatchInfo.displayIssueTypeName = this.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidMatchInfo.subIssueType,
        issueTypes);
      voidMatchInfo.matchModel = await this.commonService.getMatch(element.matchId);
      voidMatchInfo.logInfoDetail = logInfoList.find(x => x.logInfoDetail.matchId === element.matchId).logInfoDetail;
      voidMatchInfo.wrongMarket = element.wrongMarket;
      voidMatchInfo.actualMarket = element.actualMarket;
      voidMatchInfo.hdpValue = element.hdpValue;
      voidMatchInfo.isCheckedVar = element.isCheckedVar;
      voidMatchInfo.isMainMatch = element.isMainMatch;
      voidMatchInfo.isPoolHouseAffected = logInfoList.find(x => x.logInfoDetail.matchId === element.matchId).validation.isPoolHouseAffected;
      voidMatches.push(voidMatchInfo);
    }

    return voidMatches;
  }

  async loadUnderneathVoidMatchesData(voidMatches: VoidMatch[], requestDetail: RequestDetailViewModel): Promise<void> {
    for (const element of voidMatches) {
      const ticketQuery = this.ticketsService.initTicketQuery(element.matchModel, requestDetail);
      element.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
      element.isAllLiveTickets = element.voidTicketsMini.isAllLiveTickets;
      element.isCheckedEarlyEvent = false;
      element.templateValue = this.templateMessageService.getTemplateValue(element, requestDetail);
      element.templateValue.numberOfCorner = element.matchModel.numberOfCorner;
      const sportTypeId = StaticService.isAbnormalAccount(requestDetail.request.issueTypeId.toString()) ? 0 : element.matchModel.sportType;
      element.voidReason = await this.appService.getVoidedReason(element.subIssueType.subIssueTypeId, sportTypeId);
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
    const query = new GetLogInfoQuery();
    query.requestId = requestDetail.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = requestDetail.request.issueTypeId;

    if (StaticService.isDangerAccepted(requestDetail.request.issueTypeId.toString())) {
      query.dangerAcceptedModels = MappingModelStaticService.buidRedCardGetLogInfoModel(requestDetail.dangerAcceptedModels);
    }

    if (StaticService.isWrongHDP(requestDetail.request.issueTypeId.toString())) {
      query.wrongHdpModels = MappingModelStaticService.buidWrongHdpGetLogInfoModel(requestDetail.wrongHdpModels);
    }

    if (StaticService.isWrong1stHDP(requestDetail.request.issueTypeId.toString())) {
      query.wrong1stHdpModels = MappingModelStaticService.buidWrongHdpGetLogInfoModel(requestDetail.wrongHdpModels);
    }

    if (StaticService.isWrongOU(requestDetail.request.issueTypeId.toString())) {
      query.wrongOuModels = MappingModelStaticService.buidWrongOuGetLogInfoModel(requestDetail.wrongOuModels);
    }

    if (StaticService.isWrong1stOU(requestDetail.request.issueTypeId.toString())) {
      query.wrong1stOuModels = MappingModelStaticService.buidWrongOuGetLogInfoModel(requestDetail.wrongOuModels);
    }

    const viewModel = await this.commonService.getLogInfo(query);
    primitiveProperty.isBlockUI = false;

    return viewModel.getLogInfoModels;
  }

  private initBasicRequestInfo(issueTypeId: string, requestDetail: RequestDetailViewModel): BasicRequestInfo[] {
    if (StaticService.isDangerAccepted(issueTypeId)) {
      return requestDetail.dangerAcceptedModels.map(x => {
        const info: BasicRequestInfo = {
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          isMainMatch: x.isMainMatch,
          isCheckedVar: x.isCheckedVar
        };
        return info;
      });
    }

    if (StaticService.isWrongHDP(issueTypeId) || StaticService.isWrong1stHDP(issueTypeId)) {
      return requestDetail.wrongHdpModels.map(x => {
        const info: BasicRequestInfo = {
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          wrongMarket: x.homeFavorite ?? x.awayFavorite,
          actualMarket: x.actualMarket,
          hdpValue: x.hdpValue,
          isMainMatch: x.isMainMatch
        };

        return info;
      });
    }

    if (StaticService.isWrongOU(issueTypeId) || StaticService.isWrong1stOU(issueTypeId)) {
      return requestDetail.wrongOuModels.map(x => {
        const info: BasicRequestInfo = {
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          wrongMarket: x.wrongMarket,
          actualMarket: x.actualMarket,
          isMainMatch: x.isMainMatch,
        };

        return info;
      });
    }

    return [];
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

