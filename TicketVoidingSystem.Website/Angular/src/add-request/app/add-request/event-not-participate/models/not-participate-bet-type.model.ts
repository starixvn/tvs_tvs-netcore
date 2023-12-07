import { OddsInfo } from "../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model";

export class NotParticipateBetTypeViewModel {
  notParticipateBetTypes: NotParticipateBetTypeModel[];
  notParticipatePlayers: Player[];
}

export class NotParticipateBetTypeModel {
  betTypeId: number;
  betTypeName: string;
  parentId: number;
  parentName: string;
}

export class Player extends OddsInfo {
  disabled: boolean;
}
