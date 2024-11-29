import { QueryList } from '@angular/core';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { AddRequestStore } from '../../add-request.store';
import { TvDetectionComponent } from '../../components/tv-detection/tv-detection.component';
import { ConfirmAddRequestModel } from '../../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { OthersModel } from '../../others/others.model';
import { PrimitiveProperty } from '../event-red-card.model';
import { FilterTimeAreaComponent } from '../filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRedCardComponent } from '../log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from '../log-info-red-card/log-info-red-card.model';

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
  allEvents: LogInfoRedCard[];
  eventLeagueComponent: EventLeagueComponent;
  tvDetectionComponent: TvDetectionComponent;
  filterTimeAreaComponent: FilterTimeAreaComponent;
  logInfoComponents: QueryList<LogInfoRedCardComponent>;
  confirmRedCard: ConfirmAddRequestModel;
  addRequestStore: AddRequestStore;
}