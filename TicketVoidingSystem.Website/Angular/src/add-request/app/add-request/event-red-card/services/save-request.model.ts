import { QueryList } from '@angular/core';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { AddRequestStore } from '../../add-request.store';
import { TvDetectionComponent } from '../../components/tv-detection/tv-detection.component';
import { ConfirmAddRequestModel } from '../../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../../filter/filter.model';
import { OthersModel } from '../../others/others.model';
import { FilterTimeAreaComponent } from '../filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRelatedEventComponent } from '../../components/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../components/log-info-related-event/primitive-property,mdel';

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