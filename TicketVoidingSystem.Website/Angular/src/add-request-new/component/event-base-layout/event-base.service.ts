import { inject, Injectable } from '@angular/core';
import { NotParticipateModel } from 'src/add-request-new/models/event-not-participate.model';
import { OtherIssuesModel } from 'src/add-request-new/models/event-other-issues.model';
import { ReducedOverModel } from 'src/add-request-new/models/event-reduced-over.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { CommonService } from '../../../utility/services/common.service';
import { IssueTypes } from '../../component/filter/issue-types.model';
import { RedCardModel } from '../../models/event-red-card.model';
import { TechnicalErrorModel } from '../../models/event-technical-error.model';
import { EventTicket14Model } from '../../models/event-ticket-14.model';
import { WrongHdpModel } from '../../models/event-wrong-hdp.model';
import { WrongOddsSportsBookModel } from '../../models/event-wrong-odds-sports-book.model';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { WrongOuModel } from '../../models/event-wrong-ou.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { RequestModel } from '../../models/request.model';
import { ModelType } from '../../types/model-type.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { AbnormalBetModel } from '../../models/abnormal-bet.model';
import { DuplicateTicketsModel } from '../../models/event-duplicate-tickets.model';
import { RecoverTicketModel } from '../../models/recover-ticket.model';
import { EarlyKickOffModel } from '../../models/event-eko.model';
import { WrongOfferedNameModel } from '../../models/event-wrong-offered-name.model';
import { WrongMarketOfferedModel } from '../../models/event-wrong-market-offered.model';

@Injectable({
  providedIn: 'root'
})
export class EventBaseService {
  commonService = inject(CommonService);

  // Type-safe mapping with generic function & return specific type
  private readonly issueTypeModelMapping: Record<string, (model: RequestModel) => ModelType> = {
    [IssueTypeConstant.WRONG_HDP]: (model: RequestModel): WrongHdpModel[] => model.wrongHdpModels,
    [IssueTypeConstant.WRONG_1ST_HDP]: (model: RequestModel): WrongHdpModel[] => model.wrongHdpModels,
    [IssueTypeConstant.ARCHIVED_TICKET]: (model: RequestModel): EventTicket14Model => model.eventTicket14Model,
    [IssueTypeConstant.WRONG_SCORE]: (model: RequestModel): WrongScoreModel[] => model.wrongScoreModels,
    [IssueTypeConstant.DANGER_ACCEPTED]: (model: RequestModel): RedCardModel[] => model.dangerAcceptedModels,
    [IssueTypeConstant.RED_CARD]: (model: RequestModel): RedCardModel[] => model.redCardModel,
    [IssueTypeConstant.TECHNICAL_ERROR]: (model: RequestModel): TechnicalErrorModel => model.technicalErrorModel,
    [IssueTypeConstant.WRONG_ODDS]: (model: RequestModel): WrongOddsModel[] => model.wrongOddsModels,
    [IssueTypeConstant.WRONG_OU]: (model: RequestModel): WrongOuModel[] => model.wrongOuModels,
    [IssueTypeConstant.WRONG_1ST_OU]: (model: RequestModel): WrongOuModel[] => model.wrongOuModels,
    [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK]: (model: RequestModel): WrongOddsSportsBookModel => model.wrongOddsSportsBookModel,
    [IssueTypeConstant.EARLY_KICK_OFF]: (model: RequestModel): EarlyKickOffModel[] => model.earlyKickOffModels,
    [IssueTypeConstant.WRONG_KICK_OFF]: (model: RequestModel): EarlyKickOffModel[] => model.earlyKickOffModels,
    [IssueTypeConstant.WRONG_OFFERED_NAME]: (model: RequestModel): WrongOfferedNameModel => model.wrongOfferedNameModel,
    [IssueTypeConstant.OTHER_ISSUES]: (model: RequestModel): OtherIssuesModel => model.otherIssuesModel,
    [IssueTypeConstant.NOT_PARTICIPATE]: (model: RequestModel): NotParticipateModel[] => model.notParticipateModels,
    [IssueTypeConstant.REDUCED_OVER]: (model: RequestModel): ReducedOverModel[] => model.reducedOverModels,
    [IssueTypeConstant.WRONG_MARKET_OFFERED]: (model: RequestModel): WrongMarketOfferedModel[] => model.wrongMarketOfferedModels,
    [IssueTypeConstant.ABNORMAL_ACCOUNT]: (model: RequestModel): AbnormalAccountModel => model.abnormalAccountModel,
    [IssueTypeConstant.ABNORMAL_BET]: (model: RequestModel): AbnormalBetModel => model.abnormalBetModel,
    [IssueTypeConstant.DUPLICATE_TICKETS]: (model: RequestModel): DuplicateTicketsModel => model.duplicateTicketsModel,
    [IssueTypeConstant.RECOVER_TICKET]: (model: RequestModel): RecoverTicketModel => model.recoverTicketModel,
  };

  backToAccessDeniedPage() {
    window.location.assign(`Home/AccessDenied`);
  }

  backToManagePage(): void {
    window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  async getSubIssueTypes(issueTypeId: number): Promise<IssueTypes> {
    const data = await this.commonService.getIssueTypes();

    return {
      issueTypes: data.issueTypes?.filter(x => x.issueTypeId === issueTypeId) ?? [],
      subIssueTypes: data.subIssueTypes?.filter(x => x.issueTypeId === issueTypeId) ?? [],
    } as IssueTypes;
  }

  // Method with specific return type instead of unknown
  getEventModelByIssueType(issueTypeId: string, model: RequestModel): ModelType {
    const modelGetter = this.issueTypeModelMapping[issueTypeId];
    return modelGetter ? modelGetter(model) : model.eventTicket14Model;
  }
}