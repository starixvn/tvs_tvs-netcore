import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { ConfirmAbnormalBetComponent } from '../confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from '../confirm-abnormal-bet/confirm-abnormal-bet.model';
import { AbnormalBetTicketViewModel, PrimitiveProperty } from '../event-abnormal-bet.model';
import { LeagueEventAbnormalComponent } from '../league-event-abnormal/league-event-abnormal.component';

export class ValidationBusinessRuleArgs {
  requestId?: number;
  actionId: string;
  betIdsComponent: BetIdsComponent;
  leagueEventAbnormalComponent: LeagueEventAbnormalComponent;
  confirmAbnormalBetComponent?: ConfirmAbnormalBetComponent;
  permission: PermissionAddRequest;
  issueTypeId: string;
  subIssueTypeId: string;
  filterBy: number;
  primitiveProps: PrimitiveProperty;
  isValidateFromConfirmPopup: boolean;
}

export class ValidationBusinessRuleOutput {
  isValid: boolean;
  warningModel: ConfirmAbnormalBetModel;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  abnormalBetTicketRequests: AbnormalBetTicketViewModel[];
}