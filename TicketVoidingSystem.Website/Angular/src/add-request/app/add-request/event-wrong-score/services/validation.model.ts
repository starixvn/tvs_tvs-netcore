import { Tooltip } from "../../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../../add-request.store";
import { LeagueEventRedCardComponent } from "../../event-red-card/league-event-red-card/league-event-red-card.component";
import { FilterModel } from "../../filter/filter.model";
import { WrongScoreModel } from "../../models/event-wrong-score.model";
import { PrimitiveProperty } from "../event-wrong-score.model";
import { FilterWrongScoreComponent } from "../filter-wrong-score/filter-wrong-score.component";
import { WrongScoreInfoComponent } from "../wrong-score-info/wrong-score-info.component";

export class ValidationBusinessRuleArgs {
  requestId?: number;
  isEdit: boolean;
  filter: FilterModel;
  wrongScoreModels: WrongScoreModel[];
  tooltip: Tooltip;
  primitiveProps: PrimitiveProperty;
  leagueEventWrongScoreComponent: LeagueEventRedCardComponent;
  wrongScoreInfoComponents: WrongScoreInfoComponent[];
  addRequestStore: AddRequestStore;
  filterWrongScoreComponent: FilterWrongScoreComponent;
}

export class ValidationBusinessRuleOutput {
  isValid: boolean;
  transInfo: string;
}
