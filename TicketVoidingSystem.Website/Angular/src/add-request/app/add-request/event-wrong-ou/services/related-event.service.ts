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
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class RelatedEventService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService,
  ) {}

  async getChildMatches(mainMatchId: number, filterModel: FilterModel, isMainMatch: boolean): Promise<ChildMatchModel[]> {
    const query = new GetChildMatchQuery();
    query.issueTypeId = Number(filterModel.issueTypeId);
    query.eventDate = filterModel.eventDate;
    query.matchId = mainMatchId;
    query.isMainMatch = isMainMatch;

    return this.addRequestApiService.getChildMatches(query);
  }
  
  updateEvents(models: ChildMatchModel[], filterWrongOuModel: FilterWrongOuModel): LogInfoWrongOu[] {
    const newEvents = models
      .map(x => {
        const filter = new FilterWrongOuModel();     
        if (!filterWrongOuModel.filterFromTransTime || !filterWrongOuModel.filterToTransTime) {
          const currentMoment = moment.utc().tz('America/Caracas');
          filter.filterFromTransTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
          filter.filterToTransTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
        } else {          
          filter.filterFromTransTime = filterWrongOuModel.filterFromTransTime;
          filter.filterToTransTime = filterWrongOuModel.filterToTransTime; 
        }

        return  {
          matchId: x.matchId,
          matchCode: x.matchCode,
          leagueName: x.leagueName,
          isMainMatch: false,
          eventName: `${x.matchId} - ${x.matchEvent}`,
          filterWrongOu: filter,
          logInfoDetail: null,
          messageValidationLogInfo: null,
        } as LogInfoWrongOu;
      });

      return newEvents;
  }
  
  async addRelatedEventByInput(addRelatedEventArg: AddRelatedEventArg): Promise<void> {
    if (!addRelatedEventArg.primitiveProps.inputRelatedMatchId) {
      addRelatedEventArg.tooltip.display(addRelatedEventArg.inputMatchIdClass, LABELS.REQUIRED_MATCHID);
    } else {      
      const matchId = Number(addRelatedEventArg.primitiveProps.inputRelatedMatchId);
      if (!this.validationService.isValidInputRelatedEvent(matchId, addRelatedEventArg.inputMatchIdClass, addRelatedEventArg.allEvents, addRelatedEventArg.tooltip)) {
        return;
      }
      addRelatedEventArg.primitiveProps.isBlock = true;
      const models = await this.getChildMatches(matchId, addRelatedEventArg.filter, false);
      if (models.length === 0) {
        addRelatedEventArg.tooltip.display(addRelatedEventArg.inputMatchIdClass, LABELS.INVALID_MATCHID);
        addRelatedEventArg.primitiveProps.isBlock = false;
        return;
      }
      const newEvents = this.updateEvents(models, addRelatedEventArg.defaultFilterWrongOuModel);
      addRelatedEventArg.allEvents.push(...newEvents);
      addRelatedEventArg.allEvents = _.orderBy(_.uniqBy(addRelatedEventArg.allEvents, x => x.matchId), ['matchCode'], ['asc']);
      addRelatedEventArg.primitiveProps.isBlock = false;
      addRelatedEventArg.primitiveProps.isShowRelatedEvents = true;
      addRelatedEventArg.primitiveProps.inputRelatedMatchId = null;
    }
  }
}