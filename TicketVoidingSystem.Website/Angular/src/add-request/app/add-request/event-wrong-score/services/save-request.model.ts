import { EventLeagueComponent } from "../../../../../utility/components/event-league/event-league.component";
import { Tooltip } from "../../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../../add-request.store";
import { TvDetectionComponent } from "../../components/tv-detection/tv-detection.component";
import { TvDetectionModel } from "../../components/tv-detection/tv-detection.model";
import { FilterModel } from "../../filter/filter.model";
import { IssueTypes } from "../../filter/issue-types.model";
import { WrongScoreModel } from "../../models/event-wrong-score.model";
import { OthersModel } from "../../others/others.model";
import { PrimitiveProperty } from "../event-wrong-score.model";
import { FilterWrongScoreComponent } from "../filter-wrong-score/filter-wrong-score.component";
import { WrongScoreInfoComponent } from "../wrong-score-info/wrong-score-info.component";
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterTimeWithAllowance } from "../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model";

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  isVoided: boolean;
  filter: FilterModel;
  wrongScoreModels: WrongScoreModel[];
  others: OthersModel;
  tooltip: Tooltip;
  issueTypes: IssueTypes;
  primitiveProps: PrimitiveProperty;
  leagueEventWrongScoreComponent: EventLeagueComponent;
  wrongScoreInfoComponents: WrongScoreInfoComponent[];
  addRequestStore: AddRequestStore;
  filterWrongScoreComponent: FilterWrongScoreComponent;
  tvDetectionComponent: TvDetectionComponent;
  tvDetectionModel: TvDetectionModel;
  allSelectedEvents: LogInfoRelatedEvent[];
  defaultFilterTimeWithAllowance: FilterTimeWithAllowance;
  ;
}