import { inject, Injectable } from '@angular/core';
import { GetBetTypesQuery } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ModeType } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { CommonService } from '../../../utility/services/common.service';
import * as _ from 'lodash';

@Injectable()
export class CheckValidateService {
  private readonly commonService = inject(CommonService);

  async checkValidMatch(matchId: string, tooltip: Tooltip): Promise<boolean> {
    if (matchId === '' || matchId === null || _.isUndefined(matchId)) {
      return true;
    }

    if (matchId === '29') {
      return true;
    }

    const query: GetBetTypesQuery = { mode: ModeType.MARK_TICKET, matchId: parseInt(matchId, 10) };
    const data = await this.commonService.getGroupBetTypes(query);

    if (data.result.errorCode === 0) {
      if (data.groupBetTypes.length === 0) {
        tooltip.display('match-id', LABELS.INVALID_MATCH);
        return false;
      };

      return true;
    };
    tooltip.display('match-id', data.result.errorMsg);

    return false;
  }
}
