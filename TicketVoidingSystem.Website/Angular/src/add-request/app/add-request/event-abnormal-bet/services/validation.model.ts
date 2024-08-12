import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { AbnormalBetModel } from '../../models/abnormal-bet.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { ConfirmAbnormalBetComponent } from '../confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from '../confirm-abnormal-bet/confirm-abnormal-bet.model';
import { AbnormalBetTicketViewModel, PrimitiveProperty } from '../event-abnormal-bet.model';

export class ValidationBusinessRuleArgs {
  requestId?: number;
  actionId: string;
  betIdsComponent: BetIdsComponent;
  confirmAbnormalBetComponent?: ConfirmAbnormalBetComponent;
  permission: PermissionAddRequest;
  issueTypeId: string;
  abnormalBetModel: AbnormalBetModel;
  primitiveProps: PrimitiveProperty;
  isValidateFromConfirmPopup: boolean;
}

export class ValidationBusinessRuleOutput {
  isValid: boolean;
  warningModel: ConfirmAbnormalBetModel;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  abnormalBetTicketRequests: AbnormalBetTicketViewModel[];
}