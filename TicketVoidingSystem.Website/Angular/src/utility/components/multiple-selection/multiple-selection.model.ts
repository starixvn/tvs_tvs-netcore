import { DefaultSetting } from './default-setting';
import { ItemsSelect } from './items-select';

export class MultipleSelection {
    selectionTitle: string;
    maxHeight: string = DefaultSetting.MAX_HEIGHT;
    maxWidth: string = DefaultSetting.MAX_WIDTH;
    checkAllCheckBoxText: string = DefaultSetting.CHECK_ALL_CHECK_BOX_TEXT;
    allItemsCheckedText: string = DefaultSetting.ALL_ITEMS_CHECKED_TEXT;
    noneItemCheckedText: string = DefaultSetting.NONE_ITEM_CHECKED_TEXT;
    subfixNumberItemsCheckedText: string = DefaultSetting.SUBFIX_NUMBER_ITEMS_CHECKED_TEXT;
    numberItemsDisplay: number = DefaultSetting.NUMBER_ITEMS_DISPLAY;
    noData: string = DefaultSetting.NO_ITEM_TEXT;
    characterValue: string = DefaultSetting.CHARACTER_VALUE;
    characterText: string = DefaultSetting.CHARACTER_TEXT;
    showHeader: boolean = DefaultSetting.SHOW_HEADER;
    items: ItemsSelect[] = [];
    isCheckAll = false;
    buttonHeight: string = DefaultSetting.BUTTON_HEIGHT;
    isShowPlaceHolder = false;
    isDefaultSelectAll = true;
    isDisabled = false;
}
