import { inject, Injectable } from '@angular/core';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { GetChildMatchQuery } from '../../../../../models/get-child-match.query';
import { ChildMatchModel } from '../../../../../models/related-event.model';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { AddRelatedEventArg } from '../models/add-related-event-arg.model';
import { FilterBetType, FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { ValidationService } from './validation.service';

@Injectable()
export class RelatedEventService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly validationService = inject(ValidationService);

  async getChildMatches(query: GetChildMatchQuery): Promise<ChildMatchModel[]> {
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
        filterWithHdp.filterBetType = new FilterBetType(defaultFilter.filterBetType.filterBetIdX, defaultFilter.filterBetType.filterBetIdY, defaultFilter.filterBetType.filterBetTypeId);
        return {
          matchId: x.matchId,
          matchCode: x.matchCode,
          leagueName: x.leagueName,
          isMainMatch: false,
          eventName: `${x.matchId} - ${x.matchEvent}`,
          filterWithHdp: filterWithHdp,
          logInfoDetail: null,
          messageValidationLogInfo: null,
          sportType: x.sportType
        } as LogInfoWrongHdp;
      });

    return newEvents;
  }

  async addRelatedEventByInput(model: AddRelatedEventArg): Promise<void> {
    if (!model.primitiveProps.inputRelatedMatchId) {
      model.tooltip.display(model.inputMatchIdClass, TEXT.REQUIRED_MATCHID);
    } else {
      const matchId = Number(model.primitiveProps.inputRelatedMatchId);
      if (!this.validationService.isValidInputRelatedEvent(matchId, model.inputMatchIdClass, model.allEvents, model.tooltip)) {
        return;
      }
      model.primitiveProps.isBlock = true;
      const query = new GetChildMatchQuery();
      query.issueTypeId = Number(model.filter.issueTypeId);
      query.eventDate = model.mainEvent.eventDate ? moment(model.mainEvent.eventDate).format(DateTimeFormat.SHORT_DATE_FORMAT) : null;
      query.matchId = matchId
      query.isMainMatch = false;
      query.sportType = model.mainEvent.sportType;

      const models = await this.getChildMatches(query);
      if (!models || models.length === 0) {
        model.tooltip.display(model.inputMatchIdClass, TEXT.INVALID_MATCHID);
        model.primitiveProps.isBlock = false;
        return;
      }
      const newEvents = this.updateEvents(models, model.defaultFilterWithHdpModel);
      model.allEvents.push(...newEvents);
      model.allEvents = orderBy(uniqBy(model.allEvents, x => x.matchId), ['matchCode'], ['asc']);
      model.primitiveProps.isBlock = false;
      model.primitiveProps.isShowRelatedEvents = true;
      model.primitiveProps.inputRelatedMatchId = null;
      model.primitiveProps.infoSiteDBDownModel = null;
    }
  }
}