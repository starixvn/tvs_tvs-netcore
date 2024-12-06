import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { ItemsSelect } from '../../../utility/components/multiple-selection/items-select';

export class ManageProductConstant {
    static SportsBook = [{name: "Basketball", value: "1"},
                {name: "Cricket", value: "2"},
                {name: "E-Sports", value: "3"},
                {name: "Soccer", value: "4"},
                {name: "Other sports", value: "5"}
            ] as Product[];
    static OtherProducts = {name: "Other products", value: "6"} as Product;
    static MainParlay  = {name: "Main Parlay", value: "7"} as Product;

    static initDefaultProperties(): MultipleSelection {
        const multipleSelection = new MultipleSelection();
        multipleSelection.checkAllCheckBoxText = 'All';
        multipleSelection.allItemsCheckedText = 'All';
        multipleSelection.noneItemCheckedText = 'Select options';
        multipleSelection.maxWidth = '170px';
        multipleSelection.numberItemsDisplay = 1;
        return multipleSelection;
      }

    static initMultiSelectProduct(){
        const items: ItemsSelect[] = [];
        const tempSportsBook = [];
        this.SportsBook.forEach(itemSelect => {
            tempSportsBook.push(new ItemsSelect(0, itemSelect.value, itemSelect.name, true, true, true, []));
        })
        items.push(new ItemsSelect(0, "1", "Sports Book", true, true, true, tempSportsBook));        
        items.push(new ItemsSelect(1, this.OtherProducts.value, this.OtherProducts.name, true, true, true, []));
        items.push(new ItemsSelect(2, this.MainParlay.value, this.MainParlay.name, true, true, true, []));
        
        const multipleSelection = this.initDefaultProperties();
        multipleSelection.items = items;

        return multipleSelection;
    }
}

export class Product {
    name: string;
    value: string;
}