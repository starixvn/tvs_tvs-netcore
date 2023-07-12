import { MultipleSelection } from "../../../../../utility/modules/multiple-selection/multiple-selection";
import { NgSelectMixtureModel } from "../../../../../utility/modules/ng-select-mixture/ng-select-mixture.model";

export class FilterReducedOverModel {
  betTypeIds: string[];
  wicketOver: string;
  playerIds: string[];
  runs: string;
  live: boolean;
  nonLive: boolean;
  betTypeNgSelectMixtureModel: NgSelectMixtureModel;
  playerMultipleSelection: MultipleSelection;

  constructor() {
    this.betTypeIds = [];
    this.playerIds = [];
  }
}