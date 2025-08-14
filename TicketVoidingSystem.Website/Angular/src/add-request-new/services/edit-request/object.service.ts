import { Injectable } from '@angular/core';
import { TVSRequestFilterBy } from '../../../utility/constants/config';
import { StaticService } from '../../../utility/services/static.service';
import { FilterModel } from '../../component/filter/filter.model';
import { MapEventArg } from '../../models/edit/map-event.model';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { RequestDetailViewModel } from '../../models/request-detail.model';
import { RequestModel } from '../../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {
  mapRequestModel(requestModel: RequestModel, detailViewModel: RequestDetailViewModel, primitiveProperty: PrimitiveProperty) {
    this.mapFilter(requestModel, detailViewModel);
    this.mapEvent(this.createMapEventArg(requestModel, detailViewModel, primitiveProperty));
    this.mapOthers(requestModel, detailViewModel);
  }

  getPrimitiveProperty(detailViewModel: RequestDetailViewModel, requestId: number): PrimitiveProperty {
    const primitiveProperty = new PrimitiveProperty();
    primitiveProperty.userId = detailViewModel.request.userId;
    primitiveProperty.requestedBy = detailViewModel.request.requestedBy;
    primitiveProperty.sportType = detailViewModel.request.sportType;
    primitiveProperty.requestId = requestId;
    primitiveProperty.actionIdOfFirstTimeAccess = detailViewModel.request.actionId.toString();

    return primitiveProperty;
  }

  private mapFilter(requestModel: RequestModel, detailViewModel: RequestDetailViewModel) {
    requestModel.filter = {
      action: detailViewModel.request.actionId.toString(),
      subIssueTypeId: StaticService.getSubIssueTypeId(detailViewModel).toString(),
      isTest: detailViewModel.request.isTest,
      isVoided: detailViewModel.request.isVoided,
      issueTypeId: detailViewModel.request.issueTypeId.toString(),
      isAbnormal: this.isAbnormalArchivedTicket(detailViewModel)
    } as FilterModel;
  }

  private isAbnormalArchivedTicket(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isArchivedTicket(detailViewModel.request.issueTypeId) && detailViewModel.event.filterBy === TVSRequestFilterBy.ABNORMAL;
  }

  getMainMatchIdWrongScore(detailViewModel: RequestDetailViewModel): number {
    return detailViewModel.wrongScoreModels[0].filterBy === TVSRequestFilterBy.CHECK_TIME
      ? detailViewModel.wrongScoreModels.find(x => x.isMainMatch).matchId : detailViewModel.wrongScoreModels[0].matchId;
  }
  private mapEvent(args: MapEventArg) { // NOSONAR
    const checkIssueType = StaticService.checkAllIssueTypes(args.detailViewModel.request.issueTypeId);
    if (checkIssueType.isWrongScore) {
      args.requestModel.wrongScoreModels = args.detailViewModel.wrongScoreModels;
      args.primitiveProperty.matchId = this.getMainMatchIdWrongScore(args.detailViewModel);
    } else if (checkIssueType.isDangerAccepted) {
      args.requestModel.dangerAcceptedModels = args.detailViewModel.dangerAcceptedModels;
      args.primitiveProperty.matchId = args.detailViewModel.dangerAcceptedModels.find(x => x.isMainMatch).matchId;
    } else if (checkIssueType.isRedCard) {
      args.requestModel.redCardModel = args.detailViewModel.redCardModels;
      args.primitiveProperty.matchId = args.detailViewModel.redCardModels.find(x => x.isMainMatch).matchId;
    } else if (checkIssueType.isAbnormalBet) {
      args.requestModel.abnormalBetModel = args.detailViewModel.abnormalBetModel;
    } else if (checkIssueType.isArchivedTicket) {
      args.requestModel.eventTicket14Model = { transIds: args.detailViewModel.event.transIds };
    } else if (checkIssueType.isWrongHDP || checkIssueType.isWrong1stHDP) {
      args.requestModel.wrongHdpModels = args.detailViewModel.wrongHdpModels;
      args.primitiveProperty.matchId = args.detailViewModel.wrongHdpModels.find(x => x.isMainMatch).matchId;
    } else if (checkIssueType.isWrongOU || checkIssueType.isWrong1stOU) {
      args.requestModel.wrongOuModels = args.detailViewModel.wrongOuModels;
      args.primitiveProperty.matchId = args.detailViewModel.wrongOuModels.find(x => x.isMainMatch).matchId;
    } else if (checkIssueType.isWrongOdds) {
      args.requestModel.wrongOddsModels = args.detailViewModel.wrongOddsModels;
      args.primitiveProperty.matchId = args.detailViewModel.wrongOddsModels[0].matchId;
    } else if (checkIssueType.isReducedOver || checkIssueType.isAbandoned) {
      args.requestModel.reducedOverModels = args.detailViewModel.reducedOverModels;
      args.primitiveProperty.matchId = args.detailViewModel.reducedOverModels[0].matchId;
    } else if (checkIssueType.isNotParticipate) {
      args.requestModel.notParticipateModels = args.detailViewModel.notParticipateModels;
      args.primitiveProperty.matchId = args.detailViewModel.notParticipateModels[0].matchId;
    } else if (checkIssueType.isDuplicateTickets) {
      args.requestModel.duplicateTicketsModel = args.detailViewModel.duplicateTicketsModel;
      args.primitiveProperty.matchId = args.detailViewModel.duplicateTicketsModel.matchId;
    } else if (checkIssueType.isAbnormalAccount) {
      args.requestModel.abnormalAccountModel = args.detailViewModel.abnormalAccountModel;
    } else if (checkIssueType.isEarlyKickOff || checkIssueType.isWrongKickOff) {
      args.requestModel.earlyKickOffModels = args.detailViewModel.earlyKickOffModels;
      args.primitiveProperty.matchId = args.detailViewModel.earlyKickOffModels.find(x => x.isMainMatch).matchId;
    } else if (checkIssueType.isRecoverTicket) {
      args.requestModel.recoverTicketModel = args.detailViewModel.recoverTicketModel;
    } else if (checkIssueType.isWrongMarketOffered) {
      args.requestModel.wrongMarketOfferedModels = args.detailViewModel.wrongMarketOfferedModels;
    } else if (checkIssueType.isWrongOddsSportsBook) {
      args.requestModel.wrongOddsSportsBookModel = args.detailViewModel.wrongOddsSportsBookModel;
    } else if (checkIssueType.isWrongOfferedName) {
      args.requestModel.wrongOfferedNameModel = args.detailViewModel.wrongOfferedNameModel;
    } else if (checkIssueType.isOtherIssues || checkIssueType.isMatchEarlyCompleted) {
      args.requestModel.otherIssuesModel = args.detailViewModel.otherIssuesModel;
    } else if (checkIssueType.isTechnicalError) {
      args.requestModel.technicalErrorModel = args.detailViewModel.technicalErrorModel;
    }
  }

  private mapOthers(requestModel: RequestModel, detailViewModel: RequestDetailViewModel) {
    requestModel.others = {
      mistakenBy: detailViewModel.request.mistakenBy,
      decidedBy: detailViewModel.request.decidedBy,
      operatorsList: detailViewModel.request.operators,
      provider: detailViewModel.request.provider,
      source: detailViewModel.request.source,
      remark: detailViewModel.request.remark
    };
  }

  private createMapEventArg(requestModel: RequestModel, detailViewModel: RequestDetailViewModel, primitiveProperty: PrimitiveProperty): MapEventArg {
    const args = new MapEventArg();
    args.primitiveProperty = primitiveProperty;
    args.requestModel = requestModel;
    args.detailViewModel = detailViewModel;

    return args;
  }
}