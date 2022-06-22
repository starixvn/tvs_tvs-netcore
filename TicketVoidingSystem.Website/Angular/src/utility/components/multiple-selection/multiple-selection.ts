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
    isCheckAll: boolean;

    // constructor() {
    //     this.items = [];
    // }

    getValueItems() {
        let value = '';
        this.items.forEach(item => {
            const valueItem = item.getValueChildsChecked();
            if (valueItem !== '') {
                value = value === '' ?
                    valueItem : value + ',' + valueItem;
            }
        });

        return value.toString().replace(/,/g, this.characterValue);
    }

    getDisplayedItems() {
        const maxNumberItems = this.numberItemsDisplay;
        let countChecked = 0;
        let count = 0;
        let text = '';

        this.items.forEach(item => {
            countChecked += item.countChildsChecked();
            count += item.countChilds;
            const textItems = item.getTextChildsChecked();
            if (textItems !== '') {
                text = text === '' ?
                    textItems : text + ',' + textItems;
            }
        });
        text = text.replace(/,/g, this.characterText);
        const textDisplay =
            count === countChecked ? this.allItemsCheckedText :
                countChecked === 0 ? this.noneItemCheckedText :
                    countChecked > maxNumberItems ? `${countChecked}` + this.subfixNumberItemsCheckedText :
                        text;

        return textDisplay;
    }

    checkAllItems(isChecked: boolean) {
        this.items.forEach(item => {
            item.checked = isChecked;
            item.checkChilds();
        });
        this.selectionTitle = this.getDisplayedItems();
    }
}