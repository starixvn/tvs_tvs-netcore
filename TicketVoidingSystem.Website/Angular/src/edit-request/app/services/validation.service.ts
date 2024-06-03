import { Injectable } from '@angular/core';
import { TVSRequestFilterBy } from '../../../utility/constants/config';
import { StaticService } from '../../../utility/services/static.service';
import { RequestDetailViewModel } from '../request.model';

@Injectable({
  providedIn: 'root'
})

export class ValidationService {

  /* istanbul ignore next */
  public isRedCard(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isRedCard(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isWrongScore(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isWrongScore(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isDangerAccepted(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isDangerAccepted(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isWrongHdp(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isWrongHDP(detailViewModel.request.issueTypeId.toString());
  }
  
  /* istanbul ignore next */
  public isWrong1stHdp(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isWrong1stHDP(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isWrongOu(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isWrongOU(detailViewModel.request.issueTypeId.toString());
  }
  
  /* istanbul ignore next */
  public isWrong1stOu(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isWrong1stOU(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isArchivedTicket(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isArchivedTicket(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isAbnormalBet(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isAbnormalBet(detailViewModel.request.issueTypeId.toString());
  }
  
  /* istanbul ignore next */
  public isAbnormalAccount(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isAbnormalAccount(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isWrongOdds(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isWrongOdds(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isReducedOver(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isReducedOver(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isAbandoned(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isAbandoned(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isNotParticipate(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isNotParticipate(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isDuplicateTickets(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isDuplicateTickets(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isEarlyKickOfOrWrongKickOff(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isEarlyKickOff(detailViewModel.request.issueTypeId.toString())
    || StaticService.isWrongKickOff(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isAbnormalArchivedTicket(detailViewModel: RequestDetailViewModel): boolean {
    return this.isArchivedTicket(detailViewModel) && detailViewModel.event.filterBy === TVSRequestFilterBy.ABNORMAL;
  }

  /* istanbul ignore next */
  public isRecoverTicket(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isRecoverTicket(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  public isLikelyWrongMarketOffered(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isLikelyWrongMarketOffered(detailViewModel.request.issueTypeId.toString());
  }
}