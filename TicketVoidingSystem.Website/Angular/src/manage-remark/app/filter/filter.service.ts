import { Injectable } from '@angular/core';
import { FilterModel } from '../models/filter.model';
import moment from 'moment-timezone';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection.model';
import { ActionRemark } from '../constants/action-remark.constant';
import { ItemsSelectService } from '../../../utility/components/multiple-selection/items-select.service';
import { Tooltip } from 'src/utility/components/tooltip/tooltip.model';
import { TEXT } from 'src/utility/constants/text';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  initDefaultFilter(model: FilterModel){
    const date = new Date(moment.utc().tz('America/Caracas').format('YYYY-MM-DD HH:mm:ss.SSS'));
    model.ngbFromDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    model.ngbToDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    model.isExcludeTest = true;
    model.userId = document.getElementById('body').getAttribute('user-id');
    model.createdBy = '0'; // All
    model.createdBySelectList = [{ name: 'All', value: '0' }, { name: '<<<< Me >>>>', value: model.userId }];
    model.actionSelectList = this.initMultiSelectAction();
    model.action = model.actionSelectList.items.map(item => item.value).join(','); // All
  }

  private initMultiSelectAction(): MultipleSelection {
    const multipleSelection = new MultipleSelection();
    multipleSelection.numberItemsDisplay = 2;
    multipleSelection.checkAllCheckBoxText = 'All';
    multipleSelection.noneItemCheckedText = 'Select an option';
    multipleSelection.items = [];
    ActionRemark.ACTION_REMARK.forEach((name, value) => {
      multipleSelection.items.push(ItemsSelectService.initItemsSelect(0, value, name, true, true, true, []));
    });
    return multipleSelection;
  }

  inValidFilter(model: FilterModel, tooltip: Tooltip): boolean {
    if(model.searchBy !== "0" && this.inValidRemarkId(model.remarkId, tooltip)) {
      return true;
    }
    
    return model.searchBy === "0" && this.inValidSearchByMatchId(model, tooltip);
  }

  private inValidRemarkId(remarkId: number, tooltip: Tooltip): boolean {
    if(!remarkId) {
      tooltip.display('remark-id', TEXT.INPUT_REMARK_ID);
      return true;
    }
    return false;
  }

  private inValidSearchByMatchId(model: FilterModel, tooltip: Tooltip): boolean {
    if(!model.action || model.action === "") {
      tooltip.display('action', TEXT.REQUIRED_FIELD);
      return true;
    }
    return false;
  }
}
