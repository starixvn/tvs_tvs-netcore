import { inject } from '@angular/core';
import _ from 'lodash';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { BasicRequestInfo } from '../../models/basic-request-info.model';
import { TicketsService } from '../../services/tickets.service';
import { VoidPageEarlyKickOffModel } from '../models/void-page-early-kick-off.model';
import { TemplateMessageService } from './template-message.service';

export class VoidPageService {
  commonService = inject(CommonService);
  ticketsService = inject(TicketsService);
  templateMessageService = inject(TemplateMessageService);

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.commonService.getIssueTypes();
  }

  async getBasicVoidPageItemsData(issueTypes: IssueTypesModel, requestDetail: RequestDetailViewModel): Promise<VoidPageEarlyKickOffModel[]> {
    const voidMatches: VoidPageEarlyKickOffModel[] = [];
    const basicRequestInfo = this.initBasicRequestInfo(requestDetail);
    for (const element of basicRequestInfo) {
      const voidMatchInfo = new VoidPageEarlyKickOffModel();
      voidMatchInfo.id = element.id;
      voidMatchInfo.subIssueType = this.getSubIssueTypeModel(element.subIssueTypeId, issueTypes);
      voidMatchInfo.displayIssueTypeName = this.getDisplayIssueTypeName(requestDetail.request.issueTypeId, voidMatchInfo.subIssueType, issueTypes);
      voidMatchInfo.matchModel = await this.commonService.getMatch(element.matchId);
      voidMatchInfo.isMainMatch = element.isMainMatch;
      voidMatchInfo.isShowTemplateMessage = false;
      voidMatchInfo.detailViewModel = requestDetail;
      voidMatches.push(voidMatchInfo);
    }

    return voidMatches;
  }

  async loadUnderneathVoidPageItemsData(voidMatches: VoidPageEarlyKickOffModel[], requestDetail: RequestDetailViewModel): Promise<void> {
    for (const element of voidMatches) {
      const ticketQuery = this.ticketsService.initTicketQuery(requestDetail, element.matchModel);
      element.voidTicketsMini = await this.ticketsService.getVoidTicketsMini(ticketQuery);
      element.templateValue = this.templateMessageService.getTemplateValue(element, requestDetail);
      element.voidReason = await this.commonService.getVoidedReason(element.subIssueType.subIssueTypeId, element.matchModel.sportType);
      element.licenseeAffectedList = element.voidTicketsMini.licenseeAffectedList;
      element.licenseeAffectedList = _.clone(element.licenseeAffectedList);
    }
  }

  private initBasicRequestInfo(requestDetail: RequestDetailViewModel): BasicRequestInfo[] {
    if (StaticService.isEarlyKickOff(requestDetail.request.issueTypeId) || StaticService.isWrongKickOff(requestDetail.request.issueTypeId)) {
      return requestDetail.earlyKickOffModels.map((x, index) => {
        const info: BasicRequestInfo = {
          id: index + 1,
          matchId: x.matchId,
          subIssueTypeId: x.subIssueTypeId,
          isMainMatch: x.isMainMatch,
        };
        return info;
      });
    }

    if (StaticService.isWrongOfferedName(requestDetail.request.issueTypeId)) {
      return [{
        id: 1,
        matchId: requestDetail.wrongOfferedNameModel.matchId,
        subIssueTypeId: requestDetail.wrongOfferedNameModel.subIssueTypeId
      }] as BasicRequestInfo[];
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

