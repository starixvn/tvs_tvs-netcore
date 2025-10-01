import { NgSelectMixtureItem } from "./ng-select-mixture-item.model";

export class DefaultValue {
  static readonly maxHeight = '350px';
  static readonly maxWidth = '200px';
  static readonly subfixNumberItemsCheckedText = ' selected';
  static readonly numberItemsDisplay = 1;
  static readonly allItemsCheckedText = '';
  static readonly noneItemCheckedText = 'none ';
  static readonly buttonHeight = '29.5px';
}

export class NgSelectMixtureModel {
  title: string;
  maxHeight: string = DefaultValue.maxHeight;
  maxWidth: string = DefaultValue.maxWidth;
  subfixNumberItemsCheckedText: string = DefaultValue.subfixNumberItemsCheckedText;
  items: NgSelectMixtureItem[] = [];
  isCheckAll: boolean;
  numberItemsDisplay: number = DefaultValue.numberItemsDisplay;
  allItemsCheckedText: string = DefaultValue.allItemsCheckedText;
  noneItemCheckedText: string = DefaultValue.noneItemCheckedText;
  buttonHeight: string = DefaultValue.buttonHeight;
  isShowPlaceHolder: boolean;
}
