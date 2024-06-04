import { Injectable } from '@angular/core';
import _ from 'lodash';
import { GetLogInfoQuery } from '../../../../add-request/app/add-request/models/add-request.query';
import { GetLogInfoModel } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateContent, TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/template.service';
import { EventType } from '../../../../utility/constants/sport.constant';
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
    voidPageItem.templateValue = this.getTemplateValue(voidPageItem, requestDetail);
    voidPageItem.voidReason = await this.getVoidedReason(voidPageItem);
    voidPageItem.licenseeAffectedList = voidPageItem.voidTicketsMini.licenseeAffectedList;
    voidPageItem.licenseeAffectedList = _.clone(voidPageItem.licenseeAffectedList);
  }

  private getTemplateValue(voidPageItem: VoidNotParticipateModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = voidPageItem.matchModel ? this.templateService.getTemplateValue(voidPageItem.matchModel) : new TemplateValue();
    templateValue.groupPHAffected = voidPageItem.voidTicketsMini.groupPHAffected;
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    templateValue.eventType = voidPageItem.voidTicketsMini.isAllLiveTickets ? EventType.LIVE : null;
    if (StaticService.isNotParticipate(requestDetail.request.issueTypeId.toString())) {
      templateValue.playerName = {
        msgEnglish: requestDetail.playerNames[0].playerNamesEnglish,
        msgChineseTraditional: requestDetail.playerNames[0].playerNamesChineseTraditional,
        msgChineseSimplified: requestDetail.playerNames[0].playerNamesChineseSimplified,
        msgChineseNewSimplified: requestDetail.playerNames[0].playerNamesChineseSimplified
      } as TemplateContent;
    }

    if (StaticService.isLikelyWrongMarketOffered(requestDetail.request.issueTypeId.toString())) {
      templateValue.isCheckedSpecialBetType = true;
      templateValue.betTypeNameReplaceMessage = voidPageItem.voidTicketsMini.betTypeNameReplaceMessage;      
    }

    return templateValue;
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo {
    if (StaticService.isNotParticipate(requestDetail.request.issueTypeId.toString())) {
      const basicRequestInfo: BasicRequestInfo = {
        matchId: requestDetail.notParticipateModels[0].matchId,
        subIssueTypeId: requestDetail.notParticipateModels[0].subIssueTypeId,
      };

      return basicRequestInfo;
    }

    if (StaticService.isLikelyWrongMarketOffered(requestDetail.request.issueTypeId.toString())) {
      return {
        matchId: requestDetail.wrongMarketOfferedModel.matchId,
        subIssueTypeId: requestDetail.wrongMarketOfferedModel.subIssueTypeId
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
    return this.appService.getVoidedReason(voidPageItem.subIssueType.subIssueTypeId, voidPageItem.matchModel?.sportType);
  }

  private async getLogInfo(requestDetail: RequestDetailViewModel, primitiveProperty: CommonPrimitiveProperty): Promise<GetLogInfoModel> {
    primitiveProperty.isBlockUI = true;
    const query = new GetLogInfoQuery();
    query.requestId = requestDetail.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = requestDetail.request.issueTypeId;

    if (StaticService.isNotParticipate(requestDetail.request.issueTypeId.toString())) {
      query.notParticipateModels = MappingModelStaticService.buildNotParticipateGetLogInfoModel(requestDetail.notParticipateModels);
    }

    if (StaticService.isLikelyWrongMarketOffered(requestDetail.request.issueTypeId.toString())) {
       query.wrongMarketOfferedModel = MappingModelStaticService.buildWrongMarketOfferedGetLogInfoModel(requestDetail.wrongMarketOfferedModel);
    }

    const viewModel = await this.commonService.getLogInfo(query);
    primitiveProperty.isBlockUI = false;

    return viewModel.getLogInfoModels[0];
  }
}