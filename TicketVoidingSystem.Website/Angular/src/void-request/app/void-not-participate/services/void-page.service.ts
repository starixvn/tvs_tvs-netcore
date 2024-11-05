import { Injectable } from '@angular/core';
import _ from 'lodash';
import { GetLogInfoQuery } from '../../../../add-request/app/add-request/models/add-request.query';
import { GetLogInfoModel } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { CommonService } from '../../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../../utility/services/mapping-model-static.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AppService } from '../../app.service';
import { CommonPrimitiveProperty } from '../../models/common-primitive-property.model';
import { TicketsService } from '../../services/tickets.service';
import { BasicRequestInfo } from '../models/basic-request-info.model';
import { VoidNotParticipateModel } from '../models/void-page-not-participate.model';
import { TemplateMessageService } from './template-message.service';

@Injectable({
  providedIn: 'root'
})
export class VoidPageService {

  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly ticketsService: TicketsService,
    private readonly templateMessageService: TemplateMessageService
  ) {
  }

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.commonService.getIssueTypes();
  }

  async getBasicVoidPageItemsData(issueTypes: IssueTypesModel, requestDetail: RequestDetailViewModel, primitiveProperty: CommonPrimitiveProperty): Promise<VoidNotParticipateModel> {
    const basicRequestInfo = this.initBasicRequestInfo(requestDetail);
    const voidPageItem = new VoidNotParticipateModel();
    voidPageItem.subIssueType = this.getSubIssueTypeModel(basicRequestInfo.subIssueTypeId, issueTypes);
    voidPageItem.displayIssueTypeName = this.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidPageItem.subIssueType, issueTypes);
    voidPageItem.detailViewModel = requestDetail;
    voidPageItem.matchModel = await this.commonService.getMatch(basicRequestInfo.matchId);
    voidPageItem.logInfoDetail = (await this.getLogInfo(requestDetail, primitiveProperty)).logInfoDetail;

    return voidPageItem;
  }

  async loadUnderneathVoidPageItemsData(voidPageItem: VoidNotParticipateModel, requestDetail: RequestDetailViewModel): Promise<void> {
    const ticketQuery = this.ticketsService.initTicketQuery(requestDetail, voidPageItem.matchModel);
    voidPageItem.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
    voidPageItem.templateValue = this.templateMessageService.getTemplateValue(voidPageItem, requestDetail);
    voidPageItem.voidReason = await this.getVoidedReason(voidPageItem);
    voidPageItem.licenseeAffectedList = voidPageItem.voidTicketsMini.licenseeAffectedList;
    voidPageItem.licenseeAffectedList = _.clone(voidPageItem.licenseeAffectedList);
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo {
    if (StaticService.isNotParticipate(requestDetail.request.issueTypeId)) {
      const basicRequestInfo: BasicRequestInfo = {
        matchId: requestDetail.notParticipateModels[0].matchId,
        subIssueTypeId: requestDetail.notParticipateModels[0].subIssueTypeId,
      };

      return basicRequestInfo;
    }

    if (StaticService.isLikelyWrongMarketOffered(requestDetail.request.issueTypeId)) {
      return {
        matchId: requestDetail.wrongMarketOfferedModel.matchId,
        subIssueTypeId: requestDetail.wrongMarketOfferedModel.subIssueTypeId
      } as BasicRequestInfo;
    }

    if (StaticService.isWrongOddsSportsBook(requestDetail.request.issueTypeId)) {
      return {
        matchId: requestDetail.wrongOddsSportsBookModel.matchId,
        subIssueTypeId: requestDetail.wrongOddsSportsBookModel.subIssueTypeId
      } as BasicRequestInfo;
    }

    if (StaticService.isOtherIssues(requestDetail.request.issueTypeId)) {
      return {
        matchId: requestDetail.otherIssuesModel.matchId,
        subIssueTypeId: requestDetail.otherIssuesModel.subIssueTypeId
      } as BasicRequestInfo;
    }
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

  private async getVoidedReason(voidPageItem: VoidNotParticipateModel): Promise<VoidedReason> {
    return this.commonService.getVoidedReason(voidPageItem.subIssueType.subIssueTypeId, voidPageItem.matchModel?.sportType);
  }

  private async getLogInfo(requestDetail: RequestDetailViewModel, primitiveProperty: CommonPrimitiveProperty): Promise<GetLogInfoModel> {
    primitiveProperty.isBlockUI = true;
    const query = new GetLogInfoQuery();
    query.requestId = requestDetail.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = requestDetail.request.issueTypeId;

    if (StaticService.isNotParticipate(requestDetail.request.issueTypeId)) {
      query.notParticipateModels = MappingModelStaticService.buildNotParticipateGetLogInfoModel(requestDetail.notParticipateModels);
    }

    if (StaticService.isLikelyWrongMarketOffered(requestDetail.request.issueTypeId)) {
      query.wrongMarketOfferedModel = MappingModelStaticService.buildWrongMarketOfferedGetLogInfoModel(requestDetail.wrongMarketOfferedModel);
    }

    if (StaticService.isWrongOddsSportsBook(requestDetail.request.issueTypeId)) {
      query.wrongOddsSportsBookModel = MappingModelStaticService.buildWrongOddsSportsBookGetLogInfoModel(requestDetail.wrongOddsSportsBookModel);
    }

    if (StaticService.isOtherIssues(requestDetail.request.issueTypeId)) {
      query.otherIssuesModel = MappingModelStaticService.buildOtherIssuesGetLogInfoModel(requestDetail.otherIssuesModel);
    }

    const viewModel = await this.commonService.getLogInfo(query);
    primitiveProperty.isBlockUI = false;

    return viewModel.getLogInfoModels[0];
  }
}