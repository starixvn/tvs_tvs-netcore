import { inject } from '@angular/core';
import _ from 'lodash';
import { GetLogInfoQuery } from '../../../../add-request/app/add-request/models/add-request.query';
import { GetLogInfoModel } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { CommonService } from '../../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../../utility/services/mapping-model-static.service';
import { TicketsService } from '../../services/tickets.service';
import { BasicRequestInfo } from '../models/basic-request-info.model';
import { VoidWrongMarketOfferedModel } from '../models/void-wrong-market-offered.model';
import { TemplateMessageService } from './template-message.service';

export class VoidPageService {
  commonService = inject(CommonService);
  ticketsService = inject(TicketsService);
  templateMessageService = inject(TemplateMessageService);

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.commonService.getIssueTypes();
  }

  async getBasicVoidPageItemsData(issueTypes: IssueTypesModel, requestDetail: RequestDetailViewModel): Promise<VoidWrongMarketOfferedModel[]> {
    const voidPageItems: VoidWrongMarketOfferedModel[] = [];
    const logInfoList = await this.getLogInfo(requestDetail);
    const basicRequestInfo = this.initBasicRequestInfo(requestDetail);
    for (const element of basicRequestInfo) {
      const voidPageItem = new VoidWrongMarketOfferedModel();
      voidPageItem.id = element.id;
      voidPageItem.subIssueType = this.getSubIssueTypeModel(element.subIssueTypeId, issueTypes);
      voidPageItem.displayIssueTypeName = this.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidPageItem.subIssueType, issueTypes);
      voidPageItem.matchModel = await this.commonService.getMatch(element.matchId);
      voidPageItem.isShowTemplateMessage = false;
      voidPageItem.detailViewModel = requestDetail;
      voidPageItem.requestDetailId = element.requestDetailId;
      voidPageItem.logInfoDetail = logInfoList.find(x => x.id === element.id).logInfoDetail;
      voidPageItems.push(voidPageItem);
    }

    return voidPageItems;
  }

  async loadUnderneathVoidPageItemsData(voidPageItems: VoidWrongMarketOfferedModel[], requestDetail: RequestDetailViewModel): Promise<void> {
    for (const item of voidPageItems) {
      const ticketQuery = this.ticketsService.initTicketQuery(requestDetail, item.matchModel, item.requestDetailId);
      item.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
      item.templateValue = this.templateMessageService.getTemplateValue(item, requestDetail);
      item.voidReason = await this.commonService.getVoidedReason(item.subIssueType.subIssueTypeId, item.matchModel.sportType);
      item.isAllLiveTickets = item.voidTicketsMini.isAllLiveTickets;
      item.isAllNonLiveTickets = item.voidTicketsMini.isAllNonLiveTickets;
      item.licenseeAffectedList = item.voidTicketsMini.licenseeAffectedList;
      item.licenseeAffectedList = _.clone(item.licenseeAffectedList);
    }
  }

  private async getLogInfo(requestDetail: RequestDetailViewModel): Promise<GetLogInfoModel[]> {
    const query = new GetLogInfoQuery();
    query.requestId = requestDetail.requestId;
    query.isShowLogOnly = true;
    query.issueTypeId = requestDetail.request.issueTypeId;
    query.wrongMarketOfferedModels = MappingModelStaticService.buildWrongMarketOfferedGetLogInfoModels(requestDetail.wrongMarketOfferedModels);

    const viewModel = await this.commonService.getLogInfo(query);

    return viewModel.getLogInfoModels;
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo[] {
    return requestDetail.wrongMarketOfferedModels.map(x => {
      const info: BasicRequestInfo = {
        id: x.id,
        matchId: x.matchId,
        requestDetailId: x.requestDetailId,
        subIssueTypeId: x.subIssueTypeId
      } as BasicRequestInfo;
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

