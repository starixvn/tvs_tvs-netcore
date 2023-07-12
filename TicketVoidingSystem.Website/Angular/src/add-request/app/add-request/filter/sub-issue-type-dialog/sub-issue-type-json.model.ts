export class Category {
  categoryName: string;
  isShowCategoryName: boolean;
  isCollapse: boolean;
  groups: GroupButton[];
}

export class GroupButton {
  name: string;
  iconClass: string;
  buttonSelectHomeAway: Button[];
  buttonSelectAll:  Button[];
  aa: string;
  pa: string;
  sa: string;
  description: string[];
}

export class Button {
  name: string;
  subIssueTypeId: number;
  btnClass?: string;
}