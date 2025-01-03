import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestApiService } from '../../add-request-api.service';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../models/add-related-event-arg.model';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { ValidationService } from './validation.service';
import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';

@Injectable({
  providedIn: 'root'
})
export class RelatedEventService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService,
  ) {}

  async getChildMatches(query: GetChildMatchQuery): Promise<ChildMatchModel[]> {
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
        filter.filterBetType = new FilterBetType(filterWrongOuModel.filterBetType.filterBetIdX, filterWrongOuModel.filterBetType.filterBetIdY, filterWrongOuModel.filterBetType.filterBetTypeId);

        return  {
          matchId: x.matchId,
          matchCode: x.matchCode,
          leagueName: x.leagueName,
          isMainMatch: false,
          eventName: `${x.matchId} - ${x.matchEvent}`,
          filterWrongOu: filter,
          logInfoDetail: null,
          messageValidationLogInfo: null,
          sportType: x.sportType
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
      const query = new GetChildMatchQuery();
      query.issueTypeId = Number(addRelatedEventArg.filter.issueTypeId);
      query.eventDate = addRelatedEventArg.mainEvent.eventDate ? moment(addRelatedEventArg.mainEvent.eventDate).format(DateTimeFormat.SHORT_DATE_FORMAT) : null;
      query.matchId = matchId
      query.isMainMatch = false;
      query.sportType = addRelatedEventArg.mainEvent.sportType;
      
      const models = await this.getChildMatches(query);
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