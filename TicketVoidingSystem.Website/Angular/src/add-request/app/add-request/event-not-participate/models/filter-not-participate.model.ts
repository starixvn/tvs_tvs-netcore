import { MultipleSelection } from "../../../../../utility/components/multiple-selection/multiple-selection";

export class FilterNotParticipateModel {
  betTypeId: number;
  playerIds: string[];
  playerMultipleSelection: MultipleSelection;

  constructor() {
    this.playerIds = [];
  }
}