import { Injectable } from '@angular/core';
import { GetLogInfoQuery } from 'src/add-request/app/add-request/models/add-request.query';
import { GetLogInfoModel } from 'src/add-request/app/add-request/models/get-log-info.model';
import { MappingModelStaticService } from 'src/utility/services/mapping-model-static.service';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateContent, TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/template.service';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AppService } from '../../app.service';
import { CommonPrimitiveProperty } from '../../models/common-primitive-property.model';
import { TicketsService } from '../../services/tickets.service';
import { BasicRequestInfo } from '../models/basic-request-info.model';
import { VoidNotParticipateModel } from '../models/void-page-not-participate.model';
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
  }

  private getTemplateValue(voidPageItem: VoidNotParticipateModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = voidPageItem.matchModel ? this.templateService.getTemplateValue(voidPageItem.matchModel) : new TemplateValue();
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    templateValue.playerName = {
      msgEnglish: requestDetail.messages[0].playerNamesEnglish,
      msgChineseTraditional: requestDetail.messages[0].playerNamesChineseTraditional,
      msgChineseSimplified: requestDetail.messages[0].playerNamesChineseSimplified,
      msgChineseNewSimplified: requestDetail.messages[0].playerNamesChineseSimplified
    } as TemplateContent;

    return templateValue;
  }

  public toggleTicketsArea(voidPageItem: VoidNotParticipateModel): void {
    const currentIsShowTicketFull = voidPageItem.isShowTicketFull;
    const currentIsShowTemplateMessage = voidPageItem.isShowTemplateMessage;
    voidPageItem.isShowTicketFull = !currentIsShowTicketFull;
    voidPageItem.isShowTemplateMessage = currentIsShowTemplateMessage;
  }

  public toggleTemplateMessageArea(voidPageItem: VoidNotParticipateModel): void {
    const currentIsShowTemplateMessage = voidPageItem.isShowTemplateMessage;
    const currentIsShowTicketFull = voidPageItem.isShowTicketFull;
    voidPageItem.isShowTicketFull = currentIsShowTicketFull;
    voidPageItem.isShowTemplateMessage = !currentIsShowTemplateMessage;
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo {
    const basicRequestInfo: BasicRequestInfo = {
      matchId: requestDetail.notParticipateModels[0].matchId,
      subIssueTypeId: requestDetail.notParticipateModels[0].subIssueTypeId,
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

  private async getVoidedReason(voidPageItem: VoidNotParticipateModel): Promise<VoidedReason> {
    return this.appService.getVoidedReason(voidPageItem.subIssueType.subIssueTypeId, voidPageItem.matchModel?.sportType);
  }

  private async getLogInfo(requestDetail: RequestDetailViewModel, primitiveProperty: CommonPrimitiveProperty): Promise<GetLogInfoModel> {
    primitiveProperty.isBlockUI = true;
    const query = new GetLogInfoQuery();
    query.requestId = requestDetail.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = requestDetail.request.issueTypeId;
    query.notParticipateModels = MappingModelStaticService.buidNotParticipateGetLogInfoModel(requestDetail.notParticipateModels);

    const viewModel = await this.commonService.getLogInfo(query);
    primitiveProperty.isBlockUI = false;

    return viewModel.getLogInfoModels[0];
  }
}