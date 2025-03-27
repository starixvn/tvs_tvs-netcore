import { QueryList } from '@angular/core';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { AddRequestStore } from '../../add-request.store';
import { LogInfoRelatedEventComponent } from '../../components/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../components/log-info-related-event/primitive-property.model';
import { TvDetectionComponent } from '../../components/tv-detection/tv-detection.component';
import { FilterTimeAreaComponent } from '../../event-red-card/filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { OthersModel } from '../../others/others.model';
import { ConfirmDangerAcceptedModel } from '../confirm-danger-accepted/confirm-danger-accepted.model';
import { PrimitiveProperty } from '../../components/log-info-related-event/primitive-property.model';

export class SaveRequestArg {
  requestId: number;
  userId: number;
  requestedBy: string;
  isEdit: boolean;
  actionIdOfFirstTimeAccess: string;
  filter: FilterModel;
  issueTypes: IssueTypes;
  others: OthersModel;
  primitiveProps: PrimitiveProperty;
  defaultFilterTimeWithAllowance: FilterTimeWithAllowance;
  allEvents: LogInfoRelatedEvent[];
  eventLeagueComponent: EventLeagueComponent;
  tvDetectionComponent: TvDetectionComponent;
  filterTimeAreaComponent: FilterTimeAreaComponent;
  logInfoComponents: QueryList<LogInfoRelatedEventComponent>;
  confirmDangerAccepted: ConfirmDangerAcceptedModel;
  addRequestStore: AddRequestStore;
}