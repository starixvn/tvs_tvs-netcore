import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../models/add-related-event-arg.model';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class RelatedEventService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService,
  ) {}

  async getChildMatches(mainMatchId: number, filter: FilterModel, isMainMatch: boolean): Promise<ChildMatchModel[]> {
    const query = new GetChildMatchQuery();
    query.issueTypeId = Number(filter.issueTypeId);
    query.eventDate = filter.eventDate;
    query.matchId = mainMatchId;
    query.isMainMatch = isMainMatch;

    return this.addRequestApiService.getChildMatches(query);
  }
  
  updateEvents(models: ChildMatchModel[], defaultFilter: FilterWithHdpModel): LogInfoWrongHdp[] {
    const newEvents = models
      .map(x => {
        const filterWithHdp = new FilterWithHdpModel();
        if (!defaultFilter.filterFromTransTime || !defaultFilter.filterToTransTime) {
          const currentMoment = moment.utc().tz('America/Caracas');
          filterWithHdp.filterFromTransTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
          filterWithHdp.filterToTransTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
        } else {          
          filterWithHdp.filterFromTransTime = defaultFilter.filterFromTransTime;
          filterWithHdp.filterToTransTime = defaultFilter.filterToTransTime; 
        }

        return  {
          matchId: x.matchId,
          matchCode: x.matchCode,
          leagueName: x.leagueName,
          isMainMatch: false,
          eventName: `${x.matchId} - ${x.matchEvent}`,
          filterWithHdp: filterWithHdp,
          logInfoDetail: null,
          messageValidationLogInfo: null,
        } as LogInfoWrongHdp;
      });

      return newEvents;
  }
  
  async addRelatedEventByInput(model: AddRelatedEventArg): Promise<void> {
    if (!model.primitiveProps.inputRelatedMatchId) {
      model.tooltip.display(model.inputMatchIdClass, LABELS.REQUIRED_MATCHID);
    } else {      
      const matchId = Number(model.primitiveProps.inputRelatedMatchId);
      if (!this.validationService.isValidInputRelatedEvent(matchId, model.inputMatchIdClass, model.allEvents, model.tooltip)) {
        return;
      }
      model.primitiveProps.isBlock = true;
      const models = await this.getChildMatches(matchId, model.filter, false);
      if (models.length === 0) {
        model.tooltip.display(model.inputMatchIdClass, LABELS.INVALID_MATCHID);
        model.primitiveProps.isBlock = false;
        return;
      }
      const newEvents = this.updateEvents(models, model.defaultFilterWithHdpModel);
      model.allEvents.push(...newEvents);
      model.allEvents = _.orderBy(_.uniqBy(model.allEvents, x => x.matchId), ['matchCode'], ['asc']);
      model.primitiveProps.isBlock = false;
      model.primitiveProps.isShowRelatedEvents = true;
      model.primitiveProps.inputRelatedMatchId = null;
    }
  }
}