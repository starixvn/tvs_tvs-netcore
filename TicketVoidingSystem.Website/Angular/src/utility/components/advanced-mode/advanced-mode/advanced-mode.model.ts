import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';

export class Item {
  index: number;
  name: string;
  value: string;
  flag: boolean;
  isChecked: boolean;
  xmlAttribute: string;
  isMultiple: boolean;

  constructor(index: number, name: string, value: string, flag: boolean, xmlAttribute: string, isMultiple: boolean) {
    this.index = index;
    this.name = name;
    this.value = value;
    this.flag = flag;
    this.isChecked = false;
    this.xmlAttribute = xmlAttribute;
    this.isMultiple = isMultiple;
  }
}

export class Selection {
  name: string;
  value: string;
  items: Selection[];
  isMultiple: boolean;
  xmlAttribute: string;
  multiSelection: MultiSelection;
  isCanSelectMapFromOutside: boolean;
  isCanSelectRoundFromOutside: boolean;
  isCanSelectQuarterFromOutside: boolean;
  isCanSelectSetFromOutside: boolean;
  isCanSelectGameFromOutside: boolean;
  isCanSelectInningFromOutside: boolean;
}

export class MultiSelection {
  name: string;
  value: string;
  xmlAttribute: string;
  multipleSelect: MultipleSelection;
  type: string;
}

export class BetTeamResult {
  betTeam: string;
  set: string;
  game: string;
  betOption: string;
  value: string;
  valueHdp1: string;
  valueHdp2: string;
  goal: string;
  oddsSpread: string;
  oddsId: string;
  transdesc: string;
  virtualHead: string;
  performance: string;
  playerAndOdds: string;
}

export class CheckedBetType extends BetTeamResult {
  id: number;
}

export class BetTeam {
  index: number;
  name: string;
  value: string;
  type: number;
  betTypes: string;
  selections: Selection[];
  multiSelection: MultiSelection;
  multiSelectionList: MultiSelection[];
  items: Item[];
  inputs: Item[];
  checkedBetTypes: string[];
  isChecked: boolean;
  isShowMultiSelectionList: boolean;
}

export class GetPlayersQuery {
  matchId: string;
  betType: string;

  constructor(matchId: string, betType: string) {
    this.matchId = matchId;
    this.betType = betType;
  }
}

export class GetOddsInfoQuery {
  matchId: string;
  betTypes: string;
}

export class Player {
  oddsInfo: string;
  betChoice: string;
}

export class OddsInfo {
  betTypeId: number;
  oddsId: string;
  playerId: number;
  playerName: string;
  betChoice: string;
  playNamesChineseTraditional: string;
  playNamesChineseSimplified: string;
  oddsInfo: string;
  performance: string;
}
