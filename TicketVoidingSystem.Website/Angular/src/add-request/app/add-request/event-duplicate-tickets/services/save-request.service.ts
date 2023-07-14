import { Injectable } from '@angular/core';
import { AbnormalFilterBy } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable({
  providedIn: 'root'
})
export class SaveRequestService {

  constructor(
    private readonly addRequestService: AddRequestService,
  ) { }

  async executeSave(args: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(args);
    await this.addRequestService.executeSaveRequest(args.isEdit, args.requestId, query, args.addRequestStore);
  }

  private initAddRequestQuery(args: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.unMarkTransIds = args.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = args.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.removeTransIds = args.primitiveProps.transInfoAddRequestModel?.removeTransIds;
    query.isHasUusTickets = args.primitiveProps.isHasUusTickets;
    //query.transIds = this.getTransIdsForSaveRequest(args.confirmAbnormalBetModel, args.confirmAbnormalBetComponent, args.transIds);
    query.issueTypeId = args.filter.issueTypeId;
    query.subIssueTypeId = args.filter.subIssueTypeId;
    query.subIssueTypeName = args.filter.subIssueTypes ? args.filter.subIssueTypes.find(x => x.subIssueTypeId.toString() === query.subIssueTypeId).subIssueTypeName : null;


    query.actionId = args.filter.action;
    query.isTest = args.filter.isTest;
    query.isVoided = args.filter.isVoided;
    query.filterBy = args.filterBy;
    query.sportType = this.isAbnormalBetMixParlay(args) ? null : args.leagueEventAbnormalComponent.selectedSportTypeId;
    query.matchId = this.isAbnormalBetMixParlay(args) ? 29 : args.leagueEventAbnormalComponent.selectedMatchId;
    //query.isConfirmCalculator = args.confirmAbnormalBetComponent.isConfirmCalculator;

    query.mistakenBy = this.isAbnormalBetMixParlay(args) ? null : args.others.mistakenBy;
    query.operatorsList = this.isAbnormalBetMixParlay(args) ? null : args.others.operatorsList;
    query.provider = this.isAbnormalBetMixParlay(args) ? null : args.others.provider;
    query.source = this.isAbnormalBetMixParlay(args) ? null : args.others.source;
    query.decidedBy = args.others.decidedBy;
    query.remark = args.others.remark;
    query.transInfoJson = args.primitiveProps.transInfoAddRequestModel?.transInfoJson;

    // query.listBetteam = args.confirmAbnormalBetModel.listBetteam;
    // query.listBettype = args.confirmAbnormalBetModel.listBettype;

    return query;
  }

  // private getTransIdsForSaveRequest(confirmAbnormalBetModel: ConfirmAbnormalBetModel, confirmAbnormalBetComponent: ConfirmAbnormalBetComponent, transIds: string): string {
  //   let transIdsList = transIds.split(',');
  //   if (confirmAbnormalBetModel.ticketsOfCustomerClass4K && confirmAbnormalBetComponent.isRemoveCustomerClass4K) {
  //     transIdsList = transIdsList.filter(x => !(confirmAbnormalBetModel.ticketsOfCustomerClass4K).split(',').includes(x));
  //   }
  //   if (confirmAbnormalBetModel.ticketsOfCustomerClass201 && confirmAbnormalBetComponent.isRemoveCustomerClass201) {
  //     transIdsList = transIdsList.filter(x => !(confirmAbnormalBetModel.ticketsOfCustomerClass201).split(',').includes(x));
  //   }
  //   return transIdsList.join(',');
  // }

  private isAbnormalBetMixParlay(args: SaveRequestArg): boolean {
    return StaticService.isAbnormalBet(args.filter.issueTypeId) && args.filterBy === AbnormalFilterBy.MIX_PARLAY;
  }
}
