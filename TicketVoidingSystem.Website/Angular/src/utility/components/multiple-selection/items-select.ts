export class ItemsSelect {
  id: number;
  value: string;
  text: string;
  checked: boolean;
  expanded: boolean;
  enable: boolean;
  items: ItemsSelect[] = [];
  countChilds: number;
}
