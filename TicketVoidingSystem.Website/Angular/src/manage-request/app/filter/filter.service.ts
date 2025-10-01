import { ManageProductConstant } from './manage-product.constant';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection.model';
import { ItemsSelect } from '../../../utility/components/multiple-selection/items-select';
import { ItemsSelectService } from '../../../utility/components/multiple-selection/items-select.service';

export class FilterService {
    static initDefaultProperties(): MultipleSelection {
        const multipleSelection = new MultipleSelection();
        multipleSelection.checkAllCheckBoxText = 'All';
        multipleSelection.allItemsCheckedText = 'All';
        multipleSelection.noneItemCheckedText = 'Select options';
        multipleSelection.maxWidth = '170px';
        multipleSelection.numberItemsDisplay = 1;

        return multipleSelection;
    }
  
    static initMultiSelectProduct(): MultipleSelection{
        const items: ItemsSelect[] = [];
        const tempSportsBook = [];
        ManageProductConstant.SportsBook.forEach(itemSelect => {
            tempSportsBook.push(ItemsSelectService.initItemsSelect(0, itemSelect.value, itemSelect.name, true, true, true, []));
        })
        items.push(ItemsSelectService.initItemsSelect(0, "00", "Sportsbook", true, true, true, tempSportsBook));        
        items.push(ItemsSelectService.initItemsSelect(1, ManageProductConstant.OtherProducts.value, ManageProductConstant.OtherProducts.name, true, true, true, []));
        items.push(ItemsSelectService.initItemsSelect(2, ManageProductConstant.MainParlay.value, ManageProductConstant.MainParlay.name, true, true, true, []));
        
        const multipleSelection = this.initDefaultProperties();
        multipleSelection.items = items;
  
        return multipleSelection;
      }
}