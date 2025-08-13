import { QueryList } from '@angular/core';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { ConfirmAddRequestModel } from '../../../../../component/confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEventComponent } from '../../../../../component/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../../../../component/log-info-related-event/primitive-property.model';
import { OthersModel } from '../../../../../component/others/others.model';
import { TvDetectionComponent } from '../../../../../component/tv-detection/tv-detection.component';
import { AddRequestStore } from '../../../../services/add-request.store';
import { FilterTimeAreaComponent } from '../filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';

export class SaveRequestArg {
  requestId: number;
  userId: number;
  requestedBy: string;
  isEdit: boolean;
  actionIdOfFirstTimeAccess: string;
  filter: FilterModel;
  others: OthersModel;
  primitiveProps: PrimitiveProperty;
  defaultFilterTimeWithAllowance: FilterTimeWithAllowance;
  allEvents: LogInfoRelatedEvent[];
  eventLeagueComponent: EventLeagueComponent;
  tvDetectionComponent: TvDetectionComponent;
  filterTimeAreaComponent: FilterTimeAreaComponent;
  logInfoComponents: QueryList<LogInfoRelatedEventComponent>;
  confirmRedCard: ConfirmAddRequestModel;
  addRequestStore: AddRequestStore;
}