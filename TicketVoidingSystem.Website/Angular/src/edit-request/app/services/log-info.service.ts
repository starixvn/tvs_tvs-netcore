import { Injectable } from '@angular/core';
import { GetLogInfoQuery } from '../../../add-request/app/add-request/models/add-request.query';
import { CommonService } from '../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../utility/services/mapping-model-static.service';
import { StaticService } from '../../../utility/services/static.service';
import { LogInfoArg } from '../models/log-info.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { RequestDetailViewModel } from '../request.model';

@Injectable({
  providedIn: 'root'
})

export class LogInfoService {
  constructor(
    private readonly commonService: CommonService
  ) { }

  async getLogInfo(primitiveProperty: PrimitiveProperty, detailViewModel: RequestDetailViewModel): Promise<void> {
    const args = this.createLogInfoArg(primitiveProperty, detailViewModel);
    const checkIssueType = StaticService.checkAllIssueTypes(detailViewModel.request.issueTypeId);
    const logInfoHandlers = [
      { check: checkIssueType.isRedCard, handler: this.getLogInfoRedCard },
      { check: checkIssueType.isWrongScore, handler: this.getLogInfoWrongScore },
      { check: checkIssueType.isDangerAccepted, handler: this.getLogInfoDangerAccepted },
      { check: checkIssueType.isWrongHDP, handler: this.getLogInfoWrongHdp },
      { check: checkIssueType.isWrong1stHDP, handler: this.getLogInfoWrongHdp },
      { check: checkIssueType.isWrongOU, handler: this.getLogInfoWrongOu },
      { check: checkIssueType.isWrong1stOU, handler: this.getLogInfoWrongOu },
      { check: checkIssueType.isWrongOdds, handler: this.getLogInfoWrongOdds },
      { check: checkIssueType.isReducedOver, handler: this.getLogInfoReducedOver },
      { check: checkIssueType.isAbandoned, handler: this.getLogInfoReducedOver },
      { check: checkIssueType.isNotParticipate, handler: this.getLogInfoNotParticipate },
      { check: checkIssueType.isLikelyWrongMarketOffered, handler: this.getLogInfoWrongMarketOffered },
      { check: checkIssueType.isWrongOddsSportsBook, handler: this.getLogInfoWrongOddsSportsBook },
      { check: checkIssueType.isWrongOfferedName, handler: this.getLogInfoWrongOfferedName },
      { check: checkIssueType.isOtherIssues, handler: this.getLogInfoOtherIssues }
    ];

    for (const { check, handler } of logInfoHandlers) {
      if (check) {
        await handler.call(this, args);
        break; // Exit loop after handling the first valid case
      }
    }
  }

  private async getLogInfoRedCard(args: LogInfoArg): Promise<void> {
    const query: GetLogInfoQuery = {
      requestId: args.primitiveProperty.requestId,
      actionId: args.detailViewModel.request.actionId,
      isShowLogOnly: true,
      issueTypeId: args.detailViewModel.request.issueTypeId,
      redCardModels: MappingModelStaticService.buildRedCardGetLogInfoModel(args.detailViewModel.redCardModels),
    };

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.redCardModels.find(y => y.matchId === x.matchId);
      model.logInfoDetail = x.logInfoDetail;
      model.isChecked = true;
    });
  }

  private async getLogInfoWrongScore(args: LogInfoArg): Promise<void> {
    const query: GetLogInfoQuery = {
      requestId: args.primitiveProperty.requestId,
      actionId: args.detailViewModel.request.actionId,
      issueTypeId: args.detailViewModel.request.issueTypeId,
      isShowLogOnly: true,
      subIssueTypeId: StaticService.getSubIssueTypeId(args.detailViewModel),
      wrongScoreModels: MappingModelStaticService.buildWrongScoreGetLogInfoModel(args.detailViewModel.wrongScoreModels),
    };

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const wrongScore = args.detailViewModel.wrongScoreModels.find(y => y.scoreId === x.scoreId);
      wrongScore.logInfoDetail = x.logInfoDetail;
    });
  }

  private async getLogInfoDangerAccepted(args: LogInfoArg): Promise<void> {
    const query: GetLogInfoQuery = {
      requestId: args.primitiveProperty.requestId,
      isShowLogOnly: true,
      actionId: args.detailViewModel.request.actionId,
      issueTypeId: args.detailViewModel.request.issueTypeId,
      dangerAcceptedModels: MappingModelStaticService.buildRedCardGetLogInfoModel(args.detailViewModel.dangerAcceptedModels),
    };

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.dangerAcceptedModels.find(y => y.matchId === x.matchId);
      model.logInfoDetail = x.logInfoDetail;
      model.isChecked = true;
    });
  }

  private async getLogInfoWrongHdp(args: LogInfoArg): Promise<void> {
    const models = MappingModelStaticService.buildWrongHdpGetLogInfoModel(args.detailViewModel.wrongHdpModels);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.actionId = args.detailViewModel.request.actionId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    if (StaticService.isWrongHDP(args.detailViewModel.request.issueTypeId)) {
      query.wrongHdpModels = models;
    } else {
      query.wrong1stHdpModels = models;
    }

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.wrongHdpModels.find(y => y.matchId === x.matchId);
      model.logInfoDetail = x.logInfoDetail;
      model.isPoolHouseAffected = x.validation.isPoolHouseAffected;
    });
  }

  private async getLogInfoWrongOu(args: LogInfoArg): Promise<void> {
    const models = MappingModelStaticService.buildWrongOuGetLogInfoModel(args.detailViewModel.wrongOuModels);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    if (StaticService.isWrongOU(args.detailViewModel.request.issueTypeId)) {
      query.wrongOuModels = models;
    } else {
      query.wrong1stOuModels = models;
    }

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.wrongOuModels.find(y => y.matchId === x.matchId);
      model.logInfoDetail = x.logInfoDetail;
      model.isPoolHouseAffected = x.validation.isPoolHouseAffected;
    });
  }

  private async getLogInfoWrongOdds(args: LogInfoArg): Promise<void> {
    const models = MappingModelStaticService.buildWrongOddsGetLogInfoModel(args.detailViewModel.wrongOddsModels);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    query.wrongOddsModels = models;

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.wrongOddsModels.find(y => y.matchId === x.matchId);
      model.logInfoDetail = x.logInfoDetail;
      model.isPoolHouseAffected = x.validation.isPoolHouseAffected;
    });
  }

  private async getLogInfoReducedOver(args: LogInfoArg): Promise<void> {
    const models = MappingModelStaticService.buildReducedOverGetLogInfoModel(args.detailViewModel.reducedOverModels);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    query.reducedOverModels = models;

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.reducedOverModels.find(y => y.matchId === x.matchId);
      model.logInfoDetail = x.logInfoDetail;
    });
  }
  private async getLogInfoNotParticipate(args: LogInfoArg): Promise<void> {
    const models = MappingModelStaticService.buildNotParticipateGetLogInfoModel(args.detailViewModel.notParticipateModels);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    query.notParticipateModels = models;

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.notParticipateModels.find(y => y.matchId === x.matchId);
      model.logInfoDetail = x.logInfoDetail;
    });
  }

  private async getLogInfoWrongMarketOffered(args: LogInfoArg): Promise<void> {
    const models = MappingModelStaticService.buildWrongMarketOfferedGetLogInfoModels(args.detailViewModel.wrongMarketOfferedModels);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    query.wrongMarketOfferedModels = models;

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.wrongMarketOfferedModels.find(y => y.id === x.id);
      model.logInfoDetail = x.logInfoDetail;
      model.betTypeCount = x.betTypeCount;
    });
  }

  private async getLogInfoWrongOddsSportsBook(args: LogInfoArg): Promise<void> {
    const models = MappingModelStaticService.buildWrongOddsSportsBookGetLogInfoModel(args.detailViewModel.wrongOddsSportsBookModel);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    query.wrongOddsSportsBookModel = models;

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      args.detailViewModel.wrongOddsSportsBookModel.logInfoDetail = x.logInfoDetail;
    });
  }

  private async getLogInfoWrongOfferedName(args: LogInfoArg): Promise<void> {
    const models = MappingModelStaticService.buildWrongOfferedNameGetLogInfoModel(args.detailViewModel.wrongOfferedNameModel);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    query.wrongOfferedNameModel = models;

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      args.detailViewModel.wrongOfferedNameModel.logInfoDetail = x.logInfoDetail;
    });
  }

  private async getLogInfoOtherIssues(args: LogInfoArg): Promise<void> {
    const models = MappingModelStaticService.buildOtherIssuesGetLogInfoModel(args.detailViewModel.otherIssuesModel);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    query.otherIssuesModel = models;

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      args.detailViewModel.otherIssuesModel.logInfoDetail = x.logInfoDetail;
    });
  }

  private createLogInfoArg(primitiveProperty: PrimitiveProperty, detailViewModel: RequestDetailViewModel): LogInfoArg {
    const args = new LogInfoArg();
    args.primitiveProperty = primitiveProperty;
    args.detailViewModel = detailViewModel;

    return args;
  }
}