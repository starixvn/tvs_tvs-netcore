import { Injectable } from '@angular/core';
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
  public isLikelyAbnormalBet(detailViewModel: RequestDetailViewModel): boolean {
    return this.isAbnormalBet(detailViewModel) || this.isAbnormalBetRealMember(detailViewModel);
  }

  /* istanbul ignore next */
  private isAbnormalBet(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isAbnormalBet(detailViewModel.request.issueTypeId.toString());
  }

  /* istanbul ignore next */
  private isAbnormalBetRealMember(detailViewModel: RequestDetailViewModel): boolean {
    return StaticService.isAbnormalBetRealMember(detailViewModel.request.issueTypeId.toString());
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
}