export class ReducedOverBetType {
  betTypeId: number;
  betTypeName: string;
  isHasOverWicket: boolean;
  isHasPlayer: boolean;
  isHasRuns: boolean;
  parentId: number;
  items: ReducedOverBetType[];
}

export class GroupReducedOverBetType extends ReducedOverBetType {
  items: ReducedOverBetType[];
}