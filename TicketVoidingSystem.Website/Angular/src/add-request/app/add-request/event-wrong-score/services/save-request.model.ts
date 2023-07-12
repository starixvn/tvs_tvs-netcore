import { Tooltip } from "../../../../../utility/modules/tooltip/tooltip.model";
import { AddRequestStore } from "../../add-request.store";
import { LeagueEventRedCardComponent } from "../../event-red-card/league-event-red-card/league-event-red-card.component";
import { FilterModel } from "../../filter/filter.model";
import { WrongScoreModel } from "../../models/event-wrong-score.model";
import { OthersModel } from "../../others/others.model";
import { PrimitiveProperty } from "../event-wrong-score.model";
import { FilterWrongScoreComponent } from "../filter-wrong-score/filter-wrong-score.component";
import { WrongScoreInfoComponent } from "../wrong-score-info/wrong-score-info.component";

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  isVoided: boolean;
  filter: FilterModel;
  wrongScoreModels: WrongScoreModel[];
  others: OthersModel;
  tooltip: Tooltip;
  primitiveProps: PrimitiveProperty;
  leagueEventWrongScoreComponent: LeagueEventRedCardComponent;
  wrongScoreInfoComponents: WrongScoreInfoComponent[];
  addRequestStore: AddRequestStore;
  filterWrongScoreComponent: FilterWrongScoreComponent;
}