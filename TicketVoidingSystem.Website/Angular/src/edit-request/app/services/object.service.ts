import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { AbnormalBetModel } from '../../../add-request/app/add-request/models/abnormal-bet.model';
import { RequestModel } from '../../../add-request/app/add-request/models/request.model';
import { StaticService } from '../../../utility/services/static.service';
import { MapEventArg } from '../models/map-event.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { RequestDetailViewModel } from '../request.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})

export class ObjectService {
  constructor(private readonly validationService: ValidationService) { }

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
    const eventDate = StaticService.getEventDate(detailViewModel);
    requestModel.filter = {
      sportType: detailViewModel.request.sportType,
      eventDate: eventDate ? moment(eventDate).format('YYYY/M/D') : null,
      action: detailViewModel.request.actionId.toString(),
      subIssueTypeId: StaticService.getSubIssueTypeId(detailViewModel).toString(),
      isTest: detailViewModel.request.isTest,
      isVoided: detailViewModel.request.isVoided,
      issueTypeId: detailViewModel.request.issueTypeId.toString(),
      isAbnormal: this.validationService.isAbnormalArchivedTicket(detailViewModel)
    };
  }

  private mapEvent(args: MapEventArg) { // NOSONAR
    if (this.validationService.isWrongScore(args.detailViewModel)) {
      args.requestModel.wrongScoreModels = args.detailViewModel.wrongScoreModels;
      args.primitiveProperty.matchId = args.detailViewModel.wrongScoreModels[0].matchId;
    } else if (this.validationService.isDangerAccepted(args.detailViewModel)) {
      args.requestModel.dangerAcceptedModels = args.detailViewModel.dangerAcceptedModels;
      args.primitiveProperty.matchId = args.detailViewModel.dangerAcceptedModels.find(x => x.isMainMatch).matchId;
    } else if (this.validationService.isRedCard(args.detailViewModel)) {
      args.requestModel.redCardModel = args.detailViewModel.redCardModels;
      args.primitiveProperty.matchId = args.detailViewModel.redCardModels.find(x => x.isMainMatch).matchId;
    } else if (this.validationService.isLikelyAbnormalBet(args.detailViewModel)) {
      args.requestModel.abnormalBetModel = this.createEventForAbnormalBet(args.detailViewModel);
      args.primitiveProperty.matchId = args.requestModel.abnormalBetModel.matchId;
    } else if (this.validationService.isArchivedTicket(args.detailViewModel)) {
      args.requestModel.eventTicket14Model = { transIds: args.detailViewModel.event.transIds };
    } else if (this.validationService.isWrongHdp(args.detailViewModel) || this.validationService.isWrong1stHdp(args.detailViewModel)) {
      args.requestModel.wrongHdpModels = args.detailViewModel.wrongHdpModels;
      args.primitiveProperty.matchId = args.detailViewModel.wrongHdpModels.find(x => x.isMainMatch).matchId;
    } else if (this.validationService.isWrongOu(args.detailViewModel) || this.validationService.isWrong1stOu(args.detailViewModel)) {
      args.requestModel.wrongOuModels = args.detailViewModel.wrongOuModels;
      args.primitiveProperty.matchId = args.detailViewModel.wrongOuModels.find(x => x.isMainMatch).matchId;
    } else if (this.validationService.isWrongOdds(args.detailViewModel)) {
      args.requestModel.wrongOddsModels = args.detailViewModel.wrongOddsModels;
      args.primitiveProperty.matchId = args.detailViewModel.wrongOddsModels[0].matchId;
    } else if (this.validationService.isReducedOver(args.detailViewModel)) {
      args.requestModel.reducedOverModels = args.detailViewModel.reducedOverModels;
      args.primitiveProperty.matchId = args.detailViewModel.reducedOverModels[0].matchId;
    } else if (this.validationService.isNotParticipate(args.detailViewModel)) {
      args.requestModel.notParticipateModels = args.detailViewModel.notParticipateModels;
      args.primitiveProperty.matchId = args.detailViewModel.notParticipateModels[0].matchId;
    } else if (this.validationService.isDuplicateTickets(args.detailViewModel)) {
      args.requestModel.duplicateTicketsModel = args.detailViewModel.duplicateTicketsModel;
      args.primitiveProperty.matchId = args.detailViewModel.duplicateTicketsModel.matchId;
    } else if (this.validationService.isAbnormalAccount(args.detailViewModel)) {
      args.requestModel.abnormalAccountModel = args.detailViewModel.abnormalAccountModel;
    } else if (this.validationService.isEarlyKickOfOrWrongKickOff(args.detailViewModel)) {
      args.requestModel.earlyKickOffModels = args.detailViewModel.earlyKickOffModels;
      args.primitiveProperty.matchId = args.detailViewModel.earlyKickOffModels.find(x => x.isMainMatch).matchId;
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

  private createEventForAbnormalBet(detailViewModel: RequestDetailViewModel): AbnormalBetModel {
    const abModel = new AbnormalBetModel();
    abModel.matchId = detailViewModel.event.matchId;
    abModel.transIds = detailViewModel.event.transIds;
    abModel.filterBy = detailViewModel.event.filterBy;
    return abModel;
  }
}