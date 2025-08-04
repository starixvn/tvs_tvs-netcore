import { Selection, Item } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';

export class HdpFilterBetType {
  name: string;
  selections: Selection[] = [];
  issueType: number;
  betType: string;
  value: string;
  isChecked: boolean;
  inputs: Item[] = [];
}