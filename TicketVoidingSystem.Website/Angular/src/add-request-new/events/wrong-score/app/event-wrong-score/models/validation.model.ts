import { EventLeagueComponent } from "../../../../../../utility/components/event-league/event-league.component";
import { Tooltip } from "../../../../../../utility/components/tooltip/tooltip.model";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { TvDetectionComponent } from "../../../../../component/tv-detection/tv-detection.component";
import { FilterTimeWithAllowance } from "../../../../../events/red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model";
import { WrongScoreModel } from "../../../../../models/event-wrong-score.model";
import { AddRequestStore } from '../../../../../services/add-request.store';
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
  leagueEventWrongScoreComponent: EventLeagueComponent;
  wrongScoreInfoComponents: WrongScoreInfoComponent[];
  addRequestStore: AddRequestStore;
  filterWrongScoreComponent: FilterWrongScoreComponent;
  tvDetectionComponent: TvDetectionComponent;
  relatedEvents?: LogInfoRelatedEvent[];
  defaultFilterTimeWithAllowance: FilterTimeWithAllowance;
  mainEvent?: LogInfoRelatedEvent;
  isMarkTicketSiteDbDown: boolean;
}

export class ValidationBusinessRuleOutput {
  isValid: boolean;
  transInfo: string;
}
