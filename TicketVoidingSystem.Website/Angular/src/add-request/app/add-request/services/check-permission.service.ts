import { inject, Injectable } from '@angular/core';
import { TVSRequestActionType } from '../../../../utility/constants/config';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { PopupService } from './popup.service';

@Injectable()
export class CheckAddPermissionService {
  private readonly popupService = inject(PopupService);

  public isAccountHasAddRequestPermission(currentActionId: string, isHasInstantlySettledTicket: boolean,
    isHasSettledTicket: boolean, permission: PermissionAddRequest): boolean {
    if (currentActionId === TVSRequestActionType.TAKE_NOTE_ID.toString()) {
      return true;
    }

    const missingPermissionArrays: string[] = [];
    if (isHasInstantlySettledTicket && !(permission.isAddInstantlySettledTickets || permission.isAddSettledTickets)) {
      missingPermissionArrays.push('instantly settled ticket');
    }

    if (isHasSettledTicket && !permission.isAddSettledTickets) {
      missingPermissionArrays.push('settled ticket');
    }

    if (missingPermissionArrays.length > 0) {
      const errorText = `Your account does not have permission to add ${missingPermissionArrays.join(', ')}. Please change account to add request.`;

      this.popupService.showPermissionError(errorText);
      return false;
    }

    return true;
  }
}
