import { inject, Injectable } from '@angular/core';
import _ from 'lodash';
import { AcceptType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { MatchModel } from '../../../../../utility/models/match.model';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { TvDetectionModel } from '../../components/tv-detection/tv-detection.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { ConfirmWrongScoreModel } from '../confirm-wrong-score/confirm-wrong-score.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { UpdateConfirmInfoArgs } from '../models/confirm-wrong-score.model';
import { SubIssueTypeRelatedEvent } from '../models/subIssue-type-related-event.model';
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

  updateMainMatch(mainEvent: LogInfoRelatedEvent, selectedMatch: MatchModel) {
    mainEvent.matchId = selectedMatch.matchId;
    mainEvent.eventDate = selectedMatch.eventDate;
    mainEvent.sportType = selectedMatch.sportType;
    mainEvent.parentId = selectedMatch.parentId;
  }

  resetPrimitiveProperty(primitiveProps: PrimitiveProperty, subIssueTypeId: string) {
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
    if (SubIssueTypeRelatedEvent.isSubTypeFilterByAcceptedTime(subIssueTypeId)) {
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
          return { acceptTypeName: "AA", highlightTimeClass: 'highlight-min-aa' };
        }
        case AcceptType.SECOND_ACCEPT: {
          return { acceptTypeName: "SA", highlightTimeClass: 'highlight-min-sa' };

        }
        case AcceptType.PENDING_ACCEPT: {
          return { acceptTypeName: "PA", highlightTimeClass: 'highlight-min-pa' };
        }
      }
    }

    return { acceptTypeName: '', highlightTimeClass: '' };
  }

  updateCheckRelatedEvent(selectedRelatedEvents: ChildMatchModel[], allRelatedEvents: LogInfoRelatedEvent[], relatedEvents: ChildMatchModel[], matchType: number) {
    return allRelatedEvents.filter(x => (selectedRelatedEvents.some(y => y.matchId === x.matchId)
      || relatedEvents.find(y => y.matchId === x.matchId)?.matchType !== matchType));
  }

  private updateWarningConfirm(confirmWrongScoreModel: ConfirmWrongScoreModel, args: UpdateConfirmInfoArgs, actionIdOfFirstTimeAccess: string): void {
    const selectedScores = args.wrongScoreModels.filter(x => x.isChecked);

    confirmWrongScoreModel.warningExcludedScores = [];
    confirmWrongScoreModel.warningRelatedEvents = [];
    if (!args.filter.isVoided) {
      args.relatedEvents.forEach(x => {
        x.messageValidationLogInfo?.forEach(t => {
          if (t.reason.includes(LABELS.NO_VALID_TICKETS_IN_RANGE)) {
            confirmWrongScoreModel.warningRelatedEvents.push(x.eventName);
          }
        });
      });
      args.wrongScoreModels.forEach(y => {
        y.messageValidationLogInfo?.forEach(t => {
          if (t.reason.includes(LABELS.NO_VALID_TICKETS_IN_RANGE)) {
            confirmWrongScoreModel.warningExcludedScores.push(y.wrongScore);
          }
        });
      });
      confirmWrongScoreModel.isHasSettledTicket = this.validationService.isHasWarningSettledTicket(selectedScores, [args.mainEvent, ...args.relatedEvents]);
      confirmWrongScoreModel.isHasWarningForWrongScore = this.validationService.isValidationHasWarningTicket(selectedScores, [args.mainEvent, ...args.relatedEvents]);
      confirmWrongScoreModel.isHasWarningEditTakeNoteRequest = this.validationService.isHasWarningEditTakeNoteRequest(args.isEdit, args.filter.action, actionIdOfFirstTimeAccess);
    }
  }

  updateInfoConfirm(confirmWrongScoreModel: ConfirmWrongScoreModel, args: UpdateConfirmInfoArgs): void {
    this.updateWarningConfirm(confirmWrongScoreModel, args, args.actionIdOfFirstTimeAccess);
    confirmWrongScoreModel.isEditingByAnotherUser = this.validationService.isEditingByAnotherUser(args.isEdit, Number(document.getElementById('body').getAttribute('user-id')), args.userId);
    confirmWrongScoreModel.requestId = args.requestId;
    confirmWrongScoreModel.requestedBy = args.requestedBy;
    confirmWrongScoreModel.issueTypeName = args.issueTypes.issueTypes.find(x => x.issueTypeId.toString() === args.filter.issueTypeId).issueTypeName;
    confirmWrongScoreModel.subIssueTypeName = args.issueTypes.selectedSubIssueTypes.find(x => x.subIssueTypeId.toString() === args.filter.subIssueTypeId).subIssueTypeName;
    confirmWrongScoreModel.isHasAffectedTicketSiteDBDown = args.infoSiteDBDownModel?.siteDBDownInfoJson?.length > 0;
    confirmWrongScoreModel.isOpenDialog = true;
  }
}
