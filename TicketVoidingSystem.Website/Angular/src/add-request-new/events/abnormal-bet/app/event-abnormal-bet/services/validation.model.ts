import { BetIdsComponent } from '../../../../../../utility/components/bet-ids/bet-ids.component';
import { InfoSiteDBDownModel } from '../../../../../component/info-site-db-down/info-site-db-down.model';
import { AbnormalBetModel } from '../../../../../models/abnormal-bet.model';
import { PermissionAddRequest } from '../../../../../models/permission-add-request.model';
import { TransInfoAddRequestModel } from '../../../../../models/trans-info-add-request.model';
import { ConfirmAbnormalBetComponent } from '../confirm-abnormal-bet/confirm-abnormal-bet.component';
import { AbnormalBetTicketViewModel, PrimitiveProperty, ValidationAbnormalBet } from '../event-abnormal-bet.model';

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
  warningModel: ValidationAbnormalBet;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  abnormalBetTicketRequests: AbnormalBetTicketViewModel[];
  infoSiteDBDownModel: InfoSiteDBDownModel;
}