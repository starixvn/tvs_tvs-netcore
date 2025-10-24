import { inject } from '@angular/core';
import clone from 'lodash/clone';
import sumBy from 'lodash/sumBy';
import { GetLogInfoQuery } from '../../../../add-request-new/models/add-request.query';
import { GetLogInfoModel } from '../../../../add-request-new/models/get-log-info.model';
import { RequestDetailViewModel } from '../../../../add-request-new/models/request-detail.model';
import { TVSRequestFilterBy } from '../../../../utility/constants/config';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { CommonService } from '../../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../../utility/services/mapping-model-static.service';
import { StaticService } from '../../../../utility/services/static.service';
import { BasicRequestInfo } from '../../models/basic-request-info.model';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { VoidMatch } from '../../models/void-match.model';
import { TicketsService } from '../../services/tickets.service';
import { TemplateMessageService } from './template-message.service';

export class VoidPageService {
  commonService = inject(CommonService);
  ticketsService = inject(TicketsService);
  templateMessageService = inject(TemplateMessageService);

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
      voidMatchInfo.id = element.id;
      voidMatchInfo.detailViewModel = requestDetail;
      voidMatchInfo.subIssueType = this.getSubIssueTypeModel(element.subIssueTypeId, issueTypes);
      voidMatchInfo.displayIssueTypeName = this.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidMatchInfo.subIssueType, issueTypes);
      voidMatchInfo.matchModel = await this.commonService.getMatch(element.matchId);
      voidMatchInfo.logInfoDetail = logInfoList.find(x => x.logInfoDetail.matchId === element.matchId).logInfoDetail;
      voidMatchInfo.logInfoDetail.wrongMarket = element.wrongMarket;
      voidMatchInfo.logInfoDetail.actualMarket = element.actualMarket;
      voidMatchInfo.hdpValue = element.hdpValue;
      voidMatchInfo.isCheckedVar = element.isCheckedVar;
      voidMatchInfo.isMainMatch = element.isMainMatch;
      voidMatchInfo.filterFavoriteType = element.filterFavoriteType;
      voidMatchInfo.wrongOU = element.wrongOU;
      voidMatchInfo.favoriteValue = element.favoriteValue;
      voidMatchInfo.correctOddsHomeOver = element.correctOddsHomeOver;
      voidMatchInfo.correctOddsAwayUnder = element.correctOddsAwayUnder;
      voidMatchInfo.actualScore = element.actualScore;
      voidMatchInfo.wrongScore = element.wrongScore;
      voidMatchInfo.filterBy = element.filterBy;
      voidMatchInfo.subIssueTypeId = element.subIssueTypeId;
      voidMatches.push(voidMatchInfo);
    }
    this.updateLogIfWrongScore(logInfoList, requestDetail, voidMatches);

    return voidMatches;
  }

  private updateLogIfWrongScore(logInfoList: GetLogInfoModel[], requestDetail: RequestDetailViewModel, voidMatches: VoidMatch[]): void {
    if (!StaticService.isWrongScore(requestDetail.request.issueTypeId.toString())) {
      return;
    }

    requestDetail.wrongScoreModels.forEach(x => {
      x.logInfoDetail = logInfoList.find(y => y.logInfoDetail.matchId === x.matchId && y.scoreId === x.scoreId).logInfoDetail;
    });
    if (requestDetail.wrongScoreModels[0].filterBy !== TVSRequestFilterBy.CHECK_TIME) {
      voidMatches[0].logInfoDetail.singleCount = sumBy(requestDetail.wrongScoreModels.filter(x => x.logInfoDetail), x => x.logInfoDetail.singleCount);
      voidMatches[0].logInfoDetail.mainParlayCount = sumBy(requestDetail.wrongScoreModels.filter(x => x.logInfoDetail), x => x.logInfoDetail.mainParlayCount);
      voidMatches[0].logInfoDetail.cancelCashOutCount = sumBy(requestDetail.wrongScoreModels.filter(x => x.logInfoDetail), x => x.logInfoDetail.cancelCashOutCount);
      voidMatches[0].logInfoDetail.voidFromTime = requestDetail.wrongScoreModels.find(x => x.logInfoDetail).logInfoDetail.voidFromTime;
      voidMatches[0].logInfoDetail.voidToTime = requestDetail.wrongScoreModels.findLast(x => x.logInfoDetail).logInfoDetail.voidToTime;
      voidMatches[0].logInfoDetail.liveScores = null;
    }
  }

  async loadUnderneathVoidMatchesData(voidMatches: VoidMatch[], requestDetail: RequestDetailViewModel): Promise<void> {
    for (const element of voidMatches) {
      const ticketQuery = this.ticketsService.initTicketQuery(requestDetail, element.matchModel);
      element.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
      element.isAllLiveTickets = element.voidTicketsMini.isAllLiveTickets;
      element.isAllNonLiveTickets = element.voidTicketsMini.isAllNonLiveTickets;
      element.isCheckedEarlyEvent = false;
      element.templateValue = this.templateMessageService.getTemplateValue(element, requestDetail);
      element.templateValue.numberOfSubType = element.matchModel.numberOfSubType;
      element.voidReason = await this.commonService.getVoidedReason(element.subIssueType.subIssueTypeId, element.matchModel.sportType);
      element.licenseeAffectedList = element.voidTicketsMini.licenseeAffectedList;
      element.licenseeAffectedList = clone(element.licenseeAffectedList);
    }
  }

  private async getAllLogInfo(requestDetail: RequestDetailViewModel, primitiveProperty: PrimitiveProperty): Promise<GetLogInfoModel[]> {
    primitiveProperty.isBlockUI = true;
    const query = new GetLogInfoQuery();
    query.requestId = requestDetail.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = requestDetail.request.issueTypeId;

    if (StaticService.isDangerAccepted(requestDetail.request.issueTypeId.toString())) {
      query.dangerAcceptedModels = MappingModelStaticService.buildRedCardGetLogInfoModel(requestDetail.dangerAcceptedModels);
    }

    if (StaticService.isWrongHDP(requestDetail.request.issueTypeId.toString())) {
      query.wrongHdpModels = MappingModelStaticService.buildWrongHdpGetLogInfoModel(requestDetail.wrongHdpModels);
    }

    if (StaticService.isWrong1stHDP(requestDetail.request.issueTypeId.toString())) {
      query.wrong1stHdpModels = MappingModelStaticService.buildWrongHdpGetLogInfoModel(requestDetail.wrongHdpModels);
    }

    if (StaticService.isWrongOU(requestDetail.request.issueTypeId.toString())) {
      query.wrongOuModels = MappingModelStaticService.buildWrongOuGetLogInfoModel(requestDetail.wrongOuModels);
    }

    if (StaticService.isWrong1stOU(requestDetail.request.issueTypeId.toString())) {
      query.wrong1stOuModels = MappingModelStaticService.buildWrongOuGetLogInfoModel(requestDetail.wrongOuModels);
    }

    if (StaticService.isRedCard(requestDetail.request.issueTypeId.toString())) {
      query.redCardModels = MappingModelStaticService.buildRedCardGetLogInfoModel(requestDetail.redCardModels);
    }

    if (StaticService.isWrongOdds(requestDetail.request.issueTypeId.toString())) {
      query.wrongOddsModels = MappingModelStaticService.buildWrongOddsGetLogInfoModel(requestDetail.wrongOddsModels);
    }

    if (StaticService.isWrongScore(requestDetail.request.issueTypeId.toString())) {
      query.wrongScoreModels = MappingModelStaticService.buildWrongScoreGetLogInfoModel(requestDetail.wrongScoreModels);
    }

    const viewModel = await this.commonService.getLogInfo(query);
    primitiveProperty.isBlockUI = false;

    return viewModel.getLogInfoModels;
  }

  private initBasicRequestInfo(issueTypeId: string, requestDetail: RequestDetailViewModel): BasicRequestInfo[] {
    if (StaticService.isDangerAccepted(issueTypeId)) {
      return requestDetail.dangerAcceptedModels.map((x, index) => {
        const info: BasicRequestInfo = {
          id: index + 1,
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          isMainMatch: x.isMainMatch,
          isCheckedVar: x.isCheckedVar
        };
        return info;
      });
    }

    if (StaticService.isWrongHDP(issueTypeId) || StaticService.isWrong1stHDP(issueTypeId)) {
      return requestDetail.wrongHdpModels.map((x, index) => {
        const info: BasicRequestInfo = {
          id: index + 1,
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
      return requestDetail.wrongOuModels.map((x, index) => {
        const info: BasicRequestInfo = {
          id: index + 1,
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          wrongMarket: x.wrongMarket,
          actualMarket: x.actualMarket,
          isMainMatch: x.isMainMatch,
        };

        return info;
      });
    }

    if (StaticService.isRedCard(issueTypeId)) {
      return requestDetail.redCardModels.map((x, index) => {
        const info: BasicRequestInfo = {
          id: index + 1,
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          isMainMatch: x.isMainMatch,
          isCheckedVar: x.isCheckedVar
        };
        return info;
      });
    }

    if (StaticService.isWrongOdds(issueTypeId)) {
      return requestDetail.wrongOddsModels.map((x, index) => {
        const info: BasicRequestInfo = {
          id: index + 1,
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          filterFavoriteType: x.filterFavoriteType,
          wrongOU: x.wrongOU,
          favoriteValue: x.favoriteValue,
          correctOddsHomeOver: x.correctOddsHomeOver,
          correctOddsAwayUnder: x.correctOddsAwayUnder
        };
        return info;
      });
    }

    if (StaticService.isWrongScore(issueTypeId)) {
      const voidMatchWrongScoreModels = requestDetail.wrongScoreModels[0].filterBy !== TVSRequestFilterBy.CHECK_TIME
        ? [requestDetail.wrongScoreModels[0]]
        : requestDetail.wrongScoreModels;
      return voidMatchWrongScoreModels.map((x, index) => {
        const info: BasicRequestInfo = {
          id: index + 1,
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          isMainMatch: x.isMainMatch,
          filterBy: x.filterBy,
          actualScore: x.actualScore,
          wrongScore: x.wrongScore,
          isCheckedVar: x.isCheckedVar
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

