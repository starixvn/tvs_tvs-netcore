import { Injectable } from '@angular/core';
import { GetLogInfoQuery } from '../../../add-request/app/add-request/models/add-request.query';
import { CommonService } from '../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../utility/services/mapping-model-static.service';
import { StaticService } from '../../../utility/services/static.service';
import { LogInfoArg } from '../models/log-info.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { RequestDetailViewModel } from '../request.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})

export class LogInfoService {
  constructor(
    private readonly commonService: CommonService,
    private readonly validationService: ValidationService
  ) { }

  async getLogInfo(primitiveProperty: PrimitiveProperty, detailViewModel: RequestDetailViewModel): Promise<void> {
    const args = this.createLogInfoArg(primitiveProperty, detailViewModel);
    if (this.validationService.isRedCard(detailViewModel)) {
      await this.getLogInfoRedCard(args);
    } else if (this.validationService.isWrongScore(detailViewModel)) {
      await this.getLogInfoWrongScore(args);
    } else if (this.validationService.isDangerAccepted(detailViewModel)) {
      await this.getLogInfoDangerAccepted(args);
    } else if (this.validationService.isWrongHdp(detailViewModel) || this.validationService.isWrong1stHdp(detailViewModel)) {
      await this.getLogInfoWrongHdp(args);
    } else if (this.validationService.isWrongOu(detailViewModel) || this.validationService.isWrong1stOu(detailViewModel)) {
      await this.getLogInfoWrongOu(args);
    } else if (this.validationService.isWrongOdds(detailViewModel)) {
      await this.getLogInfoWrongOdds(args);
    } else if (this.validationService.isReducedOver(detailViewModel) || this.validationService.isAbandoned(detailViewModel)) {
      await this.getLogInfoReducedOver(args);
    } else if (this.validationService.isNotParticipate(detailViewModel)) {
      await this.getLogInfoNotParticipate(args);
    } else if (this.validationService.isLikelyWrongMarketOffered(detailViewModel)) {
      await this.getLogInfoWrongMarketOffered(args);
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
    if (this.validationService.isWrongHdp(args.detailViewModel)) {
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
    if (this.validationService.isWrongOu(args.detailViewModel)) {
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
    const models = MappingModelStaticService.buildWrongMarketOfferedGetLogInfoModel(args.detailViewModel.wrongMarketOfferedModel);
    const query = new GetLogInfoQuery();
    query.requestId = args.primitiveProperty.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = args.detailViewModel.request.issueTypeId;
    query.actionId = args.detailViewModel.request.actionId;
    query.wrongMarketOfferedModel = models;

    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      args.detailViewModel.wrongMarketOfferedModel.logInfoDetail = x.logInfoDetail;
      args.detailViewModel.wrongMarketOfferedModel.betTypeCount = x.betTypeCount;
    });
  }

  private createLogInfoArg(primitiveProperty: PrimitiveProperty, detailViewModel: RequestDetailViewModel): LogInfoArg {
    const args = new LogInfoArg();
    args.primitiveProperty = primitiveProperty;
    args.detailViewModel = detailViewModel;

    return args;
  }
}