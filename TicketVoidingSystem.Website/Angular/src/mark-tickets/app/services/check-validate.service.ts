import { Injectable } from '@angular/core';
import { CommonService } from '../../../utility/services/common.service';
import { LABELS } from '../../../utility/constants/labels';
import { GetLogsQuery } from '../models/query.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { GetBetTypesQuery } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { ModeType } from '../../../utility/constants/config';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CheckValidateService {

  constructor(
    private readonly commonService: CommonService, 
    ) { }

    async checkValidMatch(matchId: string, tooltip: Tooltip): Promise<boolean> {
      if (matchId === '' || matchId === null || _.isUndefined(matchId)) {
        return true;
      }
  
      if (matchId === '29') {
        return true;
      }
  
      const query: GetBetTypesQuery = { mode: ModeType.SPORT_BOOK, matchId: parseInt(matchId, 10) };
      const data = await this.commonService.getGroupBetTypes(query);
  
      if (data.result.errorCode === 0) {
        if (data.groupBetTypes.length === 0) {
          tooltip.display('match-id', LABELS.INVALID_MATCH);
          return false;
        } else {
          return true;
        }
      } else {
        tooltip.display('match-id', data.result.errorMsg);
        return false;
      }
    }
}
