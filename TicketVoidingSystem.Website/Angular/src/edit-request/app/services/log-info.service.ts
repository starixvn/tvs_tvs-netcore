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
    } else if (this.validationService.isReducedOver(detailViewModel)) {
      await this.getLogInfoReducedOver(args);
    } else if (this.validationService.isNotParticipate(detailViewModel)) {
      await this.getLogInfobuidNotParticipate(args);
    }
  }

  private async getLogInfoRedCard(args: LogInfoArg): Promise<void> {
    args.primitiveProperty.isBlock = true;
    const mainEvent = args.detailViewModel.redCardModels.find(x => x.isMainMatch);
    const query: GetLogInfoQuery = {
      requestId: args.primitiveProperty.requestId,
      matchId: mainEvent.matchId,
      actionId: args.detailViewModel.request.actionId,
      isShowLogOnly: true,
      issueTypeId: args.detailViewModel.request.issueTypeId,
      redCardModels: MappingModelStaticService.buidRedCardGetLogInfoModel(args.detailViewModel.redCardModels),
    };
  
    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.redCardModels.find(y => y.matchId === x.matchId);
      model.logInfoDetail = x.logInfoDetail;
      model.isChecked = true;
    });
    args.primitiveProperty.isBlock = false;
  }

  private async getLogInfoWrongScore(args: LogInfoArg): Promise<void> {
    args.primitiveProperty.isBlock = true;
    const query: GetLogInfoQuery = {
      requestId: args.primitiveProperty.requestId,
      matchId: args.detailViewModel.wrongScoreModels[0].matchId,
      actionId: args.detailViewModel.request.actionId,
      issueTypeId: args.detailViewModel.request.issueTypeId,
      isShowLogOnly: true,
      subIssueTypeId: StaticService.getSubIssueTypeId(args.detailViewModel),
      wrongScoreModels: MappingModelStaticService.buidWrongScoreGetLogInfoModel(args.detailViewModel.wrongScoreModels),
    };
  
    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const wrongScore = args.detailViewModel.wrongScoreModels.find(y => y.scoreId === x.scoreId);
      wrongScore.logInfoDetail = x.logInfoDetail;
    });
    args.primitiveProperty.isBlock = false;
  }
  
  private async getLogInfoDangerAccepted(args: LogInfoArg): Promise<void> {
    args.primitiveProperty.isBlock = true;
    const query: GetLogInfoQuery = {
      requestId: args.primitiveProperty.requestId,
      isShowLogOnly: true,
      actionId: args.detailViewModel.request.actionId,
      issueTypeId: args.detailViewModel.request.issueTypeId,
      dangerAcceptedModels: MappingModelStaticService.buidRedCardGetLogInfoModel(args.detailViewModel.dangerAcceptedModels),
    };
  
    const data = await this.commonService.getLogInfo(query);
    data.getLogInfoModels.forEach(x => {
      const model = args.detailViewModel.dangerAcceptedModels.find(y => y.matchId === x.matchId);
      model.logInfoDetail = x.logInfoDetail;
      model.isChecked = true;
    });
    args.primitiveProperty.isBlock = false;
  }
  
  private async getLogInfoWrongHdp(args: LogInfoArg): Promise<void> {
    args.primitiveProperty.isBlock = true;
    const models = MappingModelStaticService.buidWrongHdpGetLogInfoModel(args.detailViewModel.wrongHdpModels);
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
    args.primitiveProperty.isBlock = false;
  }
  
  private async getLogInfoWrongOu(args: LogInfoArg): Promise<void> {
    args.primitiveProperty.isBlock = true;
    const models = MappingModelStaticService.buidWrongOuGetLogInfoModel(args.detailViewModel.wrongOuModels);
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
    args.primitiveProperty.isBlock = false;
  }

  private async getLogInfoWrongOdds(args: LogInfoArg): Promise<void> {
    args.primitiveProperty.isBlock = true;
    const models = MappingModelStaticService.buidWrongOddsGetLogInfoModel(args.detailViewModel.wrongOddsModels);
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
    args.primitiveProperty.isBlock = false;
  }

  private async getLogInfoReducedOver(args: LogInfoArg): Promise<void> {
    args.primitiveProperty.isBlock = true;
    const models = MappingModelStaticService.buidReducedOverGetLogInfoModel(args.detailViewModel.reducedOverModels);
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
    args.primitiveProperty.isBlock = false;
  }

  private async getLogInfobuidNotParticipate(args: LogInfoArg): Promise<void> {
    args.primitiveProperty.isBlock = true;
    const models = MappingModelStaticService.buidNotParticipateGetLogInfoModel(args.detailViewModel.notParticipateModels);
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
    args.primitiveProperty.isBlock = false;
  }

  private createLogInfoArg(primitiveProperty: PrimitiveProperty, detailViewModel: RequestDetailViewModel): LogInfoArg {
    const args = new LogInfoArg();
    args.primitiveProperty = primitiveProperty;
    args.detailViewModel = detailViewModel;
    
    return args;
  }
}