import { inject, Injectable } from '@angular/core';
import _ from 'lodash';
import { TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { EventWrongScoreService } from './event-wrong-score.service';
import { RelatedEventService } from './related-event.service';
import { WrongScoreService } from './wrong-score.service';

@Injectable()
export class EditRequestService {
  private readonly relatedEventService = inject(RelatedEventService);
  private readonly wrongScoreService = inject(WrongScoreService);
  private readonly eventWrongScoreService = inject(EventWrongScoreService);

  assignPrimitivePropsEditRequest(mainEvent: WrongScoreModel, primitiveProps: PrimitiveProperty) {
    primitiveProps.actualScore = mainEvent.actualScore;
    primitiveProps.filterBy = mainEvent.filterBy;
    primitiveProps.isShowActualScore = true;
    primitiveProps.isCheckedVar = mainEvent.isCheckedVar;
    primitiveProps.isHighLightVarCheck = !mainEvent.isCheckedVar;
    primitiveProps.isShowRelatedEvents = this.eventWrongScoreService.isHasRelatedEvent(Number(mainEvent.subIssueTypeId));
  }

  getMainWrongScoreModel(wrongScoreModels: WrongScoreModel[]): WrongScoreModel {
    return wrongScoreModels.length === 1 || wrongScoreModels[0].filterBy !== TVSRequestFilterBy.CHECK_TIME
      ? wrongScoreModels[0] : wrongScoreModels.find(x => x.isMainMatch);
  }

  async getAllRelatedEvents(wrongScoreModels: WrongScoreModel[], mainEvent: WrongScoreModel, relatedEvents: ChildMatchModel[],) {
    let allRelatedEvents = [];
    const allChildMatches = await this.relatedEventService.getGetInfoChildMatch(mainEvent.matchId, true, mainEvent.sportType, mainEvent.eventDate.toString());
    relatedEvents.push(...allChildMatches);
    await this.relatedEventService.assignModelsToEvents(allRelatedEvents, wrongScoreModels, relatedEvents);
    allRelatedEvents = _.orderBy(_.uniqBy(allRelatedEvents, x => x.matchId), ['matchCode'], ['asc']);

    return allRelatedEvents;
  }

  async getScoreWrongScoreModels(wrongScoreModels: WrongScoreModel[], matchId: number): Promise<WrongScoreModel[]> {
    const modelScores = await this.wrongScoreService.callApiGetWrongScores(matchId);
    modelScores.forEach(x => {
      const model = wrongScoreModels.find(y => y.scoreId === x.scoreId);
      if (model) {
        model.isActive = x.isActive;
      } else {
        wrongScoreModels.push(_.cloneDeep(x));
      }
    });

    wrongScoreModels = _.orderBy(_.uniqBy(wrongScoreModels, x => x.scoreId), ['scoreId'], ['asc']);
    return modelScores
  }
}
