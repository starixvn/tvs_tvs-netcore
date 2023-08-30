import { QueryList } from '@angular/core';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { OthersModel } from '../../others/others.model';
import { ConfirmRedCardModel } from '../confirm-red-card/confirm-red-card.model';
import { PrimitiveProperty } from '../event-red-card.model';
import { FilterTimeAreaComponent } from '../filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { LeagueEventRedCardComponent } from '../league-event-red-card/league-event-red-card.component';
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
  leagueEventRedCardComponent: LeagueEventRedCardComponent;
  filterTimeAreaComponent: FilterTimeAreaComponent;
  logInfoComponents: QueryList<LogInfoRedCardComponent>;
  confirmRedCard: ConfirmRedCardModel;
  addRequestStore: AddRequestStore;
}