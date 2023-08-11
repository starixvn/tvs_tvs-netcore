import { QueryList } from '@angular/core';
import { AddRequestStore } from '../../add-request.store';
import { PrimitiveProperty } from '../../event-red-card/event-red-card.model';
import { FilterTimeAreaComponent } from '../../event-red-card/filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { LeagueEventRedCardComponent } from '../../event-red-card/league-event-red-card/league-event-red-card.component';
import { LogInfoRedCardComponent } from '../../event-red-card/log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from '../../event-red-card/log-info-red-card/log-info-red-card.model';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { OthersModel } from '../../others/others.model';
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
  allEvents: LogInfoRedCard[];
  leagueEventDangerAcceptedComponent: LeagueEventRedCardComponent;
  filterTimeAreaComponent: FilterTimeAreaComponent;
  logInfoComponents: QueryList<LogInfoRedCardComponent>;
  confirmDangerAccepted: ConfirmDangerAcceptedModel;
  addRequestStore: AddRequestStore;
}