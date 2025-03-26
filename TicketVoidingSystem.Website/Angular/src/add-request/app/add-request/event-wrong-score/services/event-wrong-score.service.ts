import { inject, Injectable } from '@angular/core';
import _ from 'lodash';
import { AcceptType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { MatchModel } from '../../../../../utility/models/match.model';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { TvDetectionModel } from '../../components/tv-detection/tv-detection.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';
import { WrongScoreService } from './wrong-score.service';

@Injectable()
export class EventWrongScoreService {
  private readonly validationService = inject(ValidationService);
  private readonly wrongScoreService = inject(WrongScoreService);

  public async getAllWrongScoreModels(wrongScoreModels: WrongScoreModel[], matchId: number) {
    const allWrongScoreModels = await this.wrongScoreService.callApiGetWrongScores(matchId);
    if (allWrongScoreModels.length > 0) {
      wrongScoreModels.length = 0;
      wrongScoreModels.push(..._.cloneDeep(allWrongScoreModels));
    }

    return allWrongScoreModels;
  }

  updateMainMatch(mainEvent: WrongScoreModel, selectedMatch: MatchModel){
    mainEvent.matchId = selectedMatch.matchId;
    mainEvent.eventDate = selectedMatch.eventDate;
    mainEvent.sportType = selectedMatch.sportType;
  }

  resetPrimitiveProperty(primitiveProps: PrimitiveProperty, subIssueTypeId: string){
    primitiveProps.filterBy = this.getFilterByBaseOnSubIssueType(subIssueTypeId);
    primitiveProps.isCheckedVar = null;
    primitiveProps.isHighLightVarCheck = null;
    primitiveProps.isShowRelatedEvents = false;
  }

  getTvDetectionModel(inputModel: WrongScoreModel): TvDetectionModel {
    return {
      serviceAcceptTime: inputModel.serviceAcceptTime,
      actualTime: inputModel.actualTime,
      tvDetectionValue: inputModel.tvDetectionValue,
      minuteOffset: inputModel.minuteOffset,
      secondOffset: inputModel.secondOffset,
    } as TvDetectionModel;
  }

  public getFilterByBaseOnSubIssueType(subIssueTypeId: string): number {
    if (this.validationService.isSubTypeFilterByAcceptedTime(subIssueTypeId)) {
      return TVSRequestFilterBy.CHECK_TIME;
    } else if (this.validationService.isSubTypeFilterByTransTimeAndAcceptedTime(subIssueTypeId)) {
      return TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME;
    } else {
      return TVSRequestFilterBy.TRANS_TIME;
    }
  }

  getHighlightMinTimeClass(highlightAcceptType: number, minTime?: Date) {
    if (minTime && highlightAcceptType) {
      switch (highlightAcceptType) {
        case AcceptType.AUTO_ACCEPT: {
          return {acceptTypeName: "AA", highlightTimeClass: 'highlight-min-aa'};
        }
        case AcceptType.SECOND_ACCEPT: {
          return {acceptTypeName: "SA", highlightTimeClass: 'highlight-min-sa'};

        }
        case AcceptType.PENDING_ACCEPT: {
          return {acceptTypeName: "PA", highlightTimeClass: 'highlight-min-pa'};
        }
      }
    }

    return {acceptTypeName: '', highlightTimeClass: ''};
  }

  updateCheckRelatedEvent(selectedRelatedEvents: ChildMatchModel[], allRelatedEvents: LogInfoRelatedEvent[], relatedEvents: ChildMatchModel[], matchType: number){
    return allRelatedEvents.filter(x => (selectedRelatedEvents.some(y => y.matchId === x.matchId)
        || relatedEvents.find(y => y.matchId === x.matchId)?.matchType !== matchType));
  }

  isHasRelatedEvent(filterSubTypeId: number): boolean {
    return RelatedEventService.SubIssueTypeMapHasRelatedEvent.has(filterSubTypeId);
  }
}
