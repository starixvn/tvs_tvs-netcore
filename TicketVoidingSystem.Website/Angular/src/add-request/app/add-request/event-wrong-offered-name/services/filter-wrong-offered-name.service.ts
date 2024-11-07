import { Injectable } from "@angular/core";
import { GroupLicensee, GroupLicenseeModel } from "../../../../../utility/components/licensees/licensees.model";
import { ItemsSelect } from "../../../../../utility/components/multiple-selection/items-select";
import { MultipleSelection } from "../../../../../utility/components/multiple-selection/multiple-selection";
import { Tooltip } from "../../../../../utility/components/tooltip/tooltip.model";
import { TEXT } from "../../../../../utility/constants/text";
import { Currency } from "../../../../../utility/models/currency.model";
import { StaticService } from "../../../../../utility/services/static.service";
import { FilterModel } from "../../filter/filter.model";
import { FilterWrongOfferedNameModel } from "../models/filter-wrong-offered-name.model";
import { ValidationService } from "./validation.service";

@Injectable({
  providedIn: 'root'
})
export class FilterWrongOfferedNameService {
  constructor(private readonly validationService: ValidationService) {
  }
  private readonly FILTER_CURRENCY_DROPDOWN = 'filter-currency-dropdown';
  private readonly GROUP_LICENSEE = 'check-group-licensee';
  private readonly CURRENCY_RMB_ID = 13;

  renderGroupLicensees(isEdit: boolean, originalGroupLicensees: GroupLicensee[], filterWrongOfferedName: FilterWrongOfferedNameModel, filterRequest: FilterModel): GroupLicenseeModel {
    return isEdit
      ? this.renderGroupLicenseesWhenEditRequest(originalGroupLicensees, filterWrongOfferedName)
      : this.autoCheckLicensees(originalGroupLicensees, filterWrongOfferedName, filterRequest);
  }

  renderCurrency(isEdit: boolean, originalCurrencies: Currency[], filterWrongOfferedName: FilterWrongOfferedNameModel, filterRequest: FilterModel): MultipleSelection {
    return isEdit
      ? this.initMultiSelectCurrencyWhenEditRequest(originalCurrencies, filterWrongOfferedName)
      : this.autoCheckCurrency(originalCurrencies, filterWrongOfferedName, filterRequest);
  }

  renderGroupLicenseesWhenEditRequest(originalGroupLicensees: GroupLicensee[], filterWrongOfferedName: FilterWrongOfferedNameModel): GroupLicenseeModel {
    const groupLicenseeModel = new GroupLicenseeModel(originalGroupLicensees, false);
    groupLicenseeModel.checkLicenseesByName(filterWrongOfferedName.licenseeNames);

    return groupLicenseeModel;
  }

  autoCheckLicensees(groups: GroupLicensee[], filterWrongOfferedName: FilterWrongOfferedNameModel, filterRequest: FilterModel): GroupLicenseeModel {
    let groupLicenseesModel = new GroupLicenseeModel(groups, true);
    if (this.validationService.isSubTypeChinese(filterRequest.subIssueTypeId)) {
      const model = new GroupLicenseeModel(groups, false);
      const groupChinaRules = model.groupLicensees.find(x => x.groupName === 'China rules');
      if (groupChinaRules) {
        groupChinaRules.isChecked = true;
        groupChinaRules.checkedGroup();
      }

      groupLicenseesModel = model;
    }
    filterWrongOfferedName.licenseeNames = groupLicenseesModel.getCheckedLicensees().map(x => x.name);

    return groupLicenseesModel;
  }

  autoCheckCurrency(currencies: Currency[], filterWrongOfferedName: FilterWrongOfferedNameModel, filterRequest: FilterModel): MultipleSelection {
    const items = currencies.map(x => new ItemsSelect(0, x.id.toString(), x.currencyCode,
      this.isAutoCheckedCurrency(x.id, filterRequest.subIssueTypeId), true, true, []));
    const multipleSelectCurrency = this.initMultiSelectCurrency(items);
    filterWrongOfferedName.currencyIds = multipleSelectCurrency.getValueItems().split(',');

    return multipleSelectCurrency;
  }

  isValidity(filterWrongOfferedName: FilterWrongOfferedNameModel, tooltip: Tooltip): boolean {
    if (filterWrongOfferedName.currencyIds.length === 0) {
      tooltip.display(this.FILTER_CURRENCY_DROPDOWN, TEXT.EMPTY_SELECT);
      return false;
    }

    if (filterWrongOfferedName.licenseeNames.length === 0) {
      tooltip.display(this.GROUP_LICENSEE, TEXT.EMPTY_SELECT);
      return false;
    }

    return true;
  }

  private initMultiSelectCurrencyWhenEditRequest(originalCurrencies: Currency[], filterWrongOfferedName: FilterWrongOfferedNameModel): MultipleSelection {
    const items = originalCurrencies.map(currency => new ItemsSelect(0, currency.id.toString(), currency.currencyCode,
      filterWrongOfferedName.currencyIds.includes(currency.id.toString()), true, true, []));

    return this.initMultiSelectCurrency(items);
  }

  private initMultiSelectCurrency(items: ItemsSelect[]): MultipleSelection {
    const selection = StaticService.initDefaultMultipleSelection('170px', 1);
    selection.items = items;

    return selection;
  }

  private isAutoCheckedCurrency(currencyId: number, subIssueTypeId: string): boolean {
    return this.validationService.isSubTypeChinese(subIssueTypeId) ? currencyId === this.CURRENCY_RMB_ID : currencyId !== this.CURRENCY_RMB_ID;
  }
}