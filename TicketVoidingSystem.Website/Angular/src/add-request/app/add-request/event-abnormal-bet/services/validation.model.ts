import { PermissionManage } from '../../../../../manage-request/app/models/permission-manage.model';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { ConfirmAbnormalBetComponent } from '../confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from '../confirm-abnormal-bet/confirm-abnormal-bet.model';
import { PrimitiveProperty, AbnormalBetTicketViewModel } from '../event-abnormal-bet.model';
import { LeagueEventAbnormalComponent } from '../league-event-abnormal/league-event-abnormal.component';

export class ValidationBusinessRuleArgs {
  requestId?: number;
  actionId: string;
  betIdsComponent: BetIdsComponent;
  leagueEventAbnormalComponent: LeagueEventAbnormalComponent;
  confirmAbnormalBetComponent?: ConfirmAbnormalBetComponent;
  permission: PermissionManage;
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