import { inject, Injectable } from '@angular/core';
import { CheckboxType, MatchIdConstant } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AbnormalBetModel } from '../../models/abnormal-bet.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { ConfirmAbnormalBetComponent } from '../confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from '../confirm-abnormal-bet/confirm-abnormal-bet.model';
import { SaveRequestArg } from './save-request.model';

@Injectable()
export class SaveRequestService {
  private readonly addRequestService = inject(AddRequestService);

  async executeSave(args: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(args);
    await this.addRequestService.executeSaveRequest(args.isEdit, args.requestId, query, args.addRequestStore);
  }

  private initAddRequestQuery(args: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.unMarkTransIds = args.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = args.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.removeTransIds = args.primitiveProps.transInfoAddRequestModel?.removeTransIds;
    query.issueTypeId = args.filter.issueTypeId;
    query.subIssueTypeId = args.filter.subIssueTypeId;

    query.actionId = args.filter.action;
    query.isTest = args.filter.isTest;
    query.isVoided = args.filter.isVoided;
    query.matchId = this.isAbnormalBetMixOrSystemParlay(args) ? MatchIdConstant.Parlay : null;
    query.abnormalBetInfo = this.createAbnormalBetModel(args);

    query.mistakenBy = this.isAbnormalBetMixOrSystemParlay(args) ? null : args.others.mistakenBy;
    query.operatorsList = this.isAbnormalBetMixOrSystemParlay(args) ? null : args.others.operatorsList;
    query.provider = this.isAbnormalBetMixOrSystemParlay(args) ? null : args.others.provider;
    query.source = this.isAbnormalBetMixOrSystemParlay(args) ? null : args.others.source;
    query.decidedBy = args.others.decidedBy;
    query.remark = args.others.remark;
    query.transInfoJson = args.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.siteDBDownInfoJson = args.siteDBDownInfoJson;

    return query;
  }

  private getTransIdsForSaveRequest(confirmAbnormalBetModel: ConfirmAbnormalBetModel, confirmAbnormalBetComponent: ConfirmAbnormalBetComponent, transIds: string): string {
    let transIdsList = transIds.split(',');
    if (confirmAbnormalBetModel.ticketsOfCustomerClass4K && confirmAbnormalBetComponent.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K]) {
      transIdsList = transIdsList.filter(x => !(confirmAbnormalBetModel.ticketsOfCustomerClass4K).split(',').includes(x));
    }
    if (confirmAbnormalBetModel.ticketsOfCustomerClass201 && confirmAbnormalBetComponent.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201]) {
      transIdsList = transIdsList.filter(x => !(confirmAbnormalBetModel.ticketsOfCustomerClass201).split(',').includes(x));
    }
    if (confirmAbnormalBetModel.ticketsOfCreditCashService && confirmAbnormalBetComponent.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE]) {
      transIdsList = transIdsList.filter(x => !(confirmAbnormalBetModel.ticketsOfCreditCashService).split(',').includes(x));
    }
    if (confirmAbnormalBetComponent.isMarkTicketSiteDbDown) {
      transIdsList = transIdsList.filter(x => !(confirmAbnormalBetModel.ticketsOfSiteDBDown).split(',').includes(x));
    }
    if (confirmAbnormalBetModel.ticketsOfSiteDBDown) {
      transIdsList = transIdsList.filter(x => !(confirmAbnormalBetModel.ticketsOfSiteDBDown).split(',').includes(x));
    }
    return transIdsList.join(',');
  }

  private isAbnormalBetMixOrSystemParlay(args: SaveRequestArg): boolean {
    return StaticService.isAbnormalBet(args.filter.issueTypeId) && StaticService.isFilterByMixOrSystemParlay(args.abnormalBetModel.filterBy);
  }

  private createAbnormalBetModel(args: SaveRequestArg): AbnormalBetModel {
    const model = args.abnormalBetModel;
    model.transIds = this.getTransIdsForSaveRequest(args.confirmAbnormalBetModel, args.confirmAbnormalBetComponent, args.abnormalBetModel.transIds);
    model.isConfirmCalculator = args.confirmAbnormalBetComponent.isConfirmCalculator;
    model.subIssueTypeName = args.filter.subIssueTypes
      ? args.filter.subIssueTypes.find(x => x.subIssueTypeId.toString() === args.filter.subIssueTypeId).subIssueTypeName : null;

    return model;
  }
}
