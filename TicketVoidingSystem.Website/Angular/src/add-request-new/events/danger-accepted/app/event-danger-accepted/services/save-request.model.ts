import { QueryList } from '@angular/core';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { IssueTypes } from '../../../../../component/filter/issue-types.model';
import { LogInfoRelatedEventComponent } from '../../../../../component/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../../../../component/log-info-related-event/primitive-property.model';
import { OthersModel } from '../../../../../component/others/others.model';
import { TvDetectionComponent } from '../../../../../component/tv-detection/tv-detection.component';
import { FilterTimeAreaComponent } from '../../../../red-card/app/event-red-card/filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from '../../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { AddRequestStore } from '../../../../services/add-request.store';
import { ConfirmDangerAcceptedModel } from '../confirm-danger-accepted/confirm-danger-accepted.model';

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