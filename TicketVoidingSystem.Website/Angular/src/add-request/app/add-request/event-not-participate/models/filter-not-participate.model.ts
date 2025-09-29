import { MultipleSelection } from "../../../../../utility/components/multiple-selection/multiple-selection.model";

export class FilterNotParticipateModel {
  playerId: number;
  betTypeIds: string[];
  betTypeMultipleSelection: MultipleSelection;

  constructor() {
    this.betTypeIds = [];
  }
}