import { inject, Injectable } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import { TVSRequestFilterBy } from '../../../../../../utility/constants/config';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { WrongScoreModel } from '../../../../../models/event-wrong-score.model';
import { ChildMatchModel } from '../../../../../models/related-event.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { SubIssueTypeRelatedEvent } from '../models/subIssue-type-related-event.model';
import { RelatedEventService } from './related-event.service';
import { WrongScoreService } from './wrong-score.service';

@Injectable()
export class EditRequestService {
  private readonly relatedEventService = inject(RelatedEventService);
  private readonly wrongScoreService = inject(WrongScoreService);

  assignPrimitivePropsEditRequest(mainEvent: WrongScoreModel, primitiveProps: PrimitiveProperty) {
    primitiveProps.actualScore = mainEvent.actualScore;
    primitiveProps.filterBy = mainEvent.filterBy;
    primitiveProps.isShowActualScore = true;
    primitiveProps.isCheckedVar = mainEvent.isCheckedVar;
    primitiveProps.isShowRelatedEvents = SubIssueTypeRelatedEvent.isHasRelatedEvent(Number(mainEvent.subIssueTypeId));
  }

  getMainWrongScoreModel(wrongScoreModels: WrongScoreModel[]): WrongScoreModel {
    return wrongScoreModels.length === 1 || wrongScoreModels[0].filterBy !== TVSRequestFilterBy.CHECK_TIME
      ? wrongScoreModels[0] : wrongScoreModels.find(x => x.isMainMatch);
  }

  async getAllRelatedEvents(wrongScoreModels: WrongScoreModel[], mainEvent: LogInfoRelatedEvent, childEvents: ChildMatchModel[]) {
    let relatedEvents = [];
    const allChildMatches = await this.relatedEventService.getGetInfoChildMatch(mainEvent.matchId, true, mainEvent.sportType, mainEvent.eventDate.toString());
    childEvents.push(...allChildMatches);
    await this.relatedEventService.assignModelsToEvents(relatedEvents, wrongScoreModels, childEvents, mainEvent.eventDate);
    relatedEvents = orderBy(uniqBy(relatedEvents, x => x.matchId), ['matchCode'], ['asc']);

    return relatedEvents;
  }

  async getScoreWrongScoreModels(wrongScoreModels: WrongScoreModel[], matchId: number): Promise<WrongScoreModel[]> {
    const modelScores = await this.wrongScoreService.callApiGetWrongScores(matchId);
    modelScores.forEach(x => {
      const model = wrongScoreModels.find(y => y.scoreId === x.scoreId);
      if (model) {
        model.isActive = x.isActive;
      } else {
        wrongScoreModels.push(cloneDeep(x));
      }
    });

    return modelScores;
  }
}
