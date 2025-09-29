import { inject, Injectable } from "@angular/core";
import { GroupLicensee, GroupLicenseeModel } from "../../../../../../utility/components/licensees/licensees.model";
import { ItemsSelect } from "../../../../../../utility/components/multiple-selection/items-select";
import { MultipleSelection } from "../../../../../../utility/components/multiple-selection/multiple-selection.model";
import { Tooltip } from "../../../../../../utility/components/tooltip/tooltip.model";
import { TEXT } from "../../../../../../utility/constants/text";
import { Currency } from "../../../../../../utility/models/currency.model";
import { StaticService } from "../../../../../../utility/services/static.service";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { FilterWrongOfferedNameModel } from "../models/filter-wrong-offered-name.model";
import { ValidationService } from "./validation.service";
import { LicenseesService } from "../../../../../../utility/components/licensees/licensees.service";
import { MultipleSelectionService } from "../../../../../../utility/components/multiple-selection/multiple-selection.service";

@Injectable()
export class FilterWrongOfferedNameService {
  private readonly FILTER_CURRENCY_DROPDOWN = 'filter-currency-dropdown';
  private readonly GROUP_LICENSEE = 'check-group-licensee';
  private readonly CURRENCY_RMB_ID = 13;
  private readonly validationService = inject(ValidationService);
  private readonly licenseesService = inject(LicenseesService);
  private readonly multipleSelectionService = inject(MultipleSelectionService);
  
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
    this.licenseesService.checkLicenseesByName(groupLicenseeModel, filterWrongOfferedName.licenseeNames);

    return groupLicenseeModel;
  }

  autoCheckLicensees(groups: GroupLicensee[], filterWrongOfferedName: FilterWrongOfferedNameModel, filterRequest: FilterModel): GroupLicenseeModel {
    let groupLicenseesModel: GroupLicenseeModel;

    if (this.validationService.isSubTypeChinese(filterRequest.subIssueTypeId)) {
      groupLicenseesModel = new GroupLicenseeModel(groups, false);
      const groupChinaRules = groupLicenseesModel.groupLicensees.find(x => x.groupName === 'China rules');
      if (groupChinaRules) {
        groupChinaRules.isChecked = true;
        this.licenseesService.checkedGroup(groupChinaRules);
      }
    } else {
      groupLicenseesModel = new GroupLicenseeModel(groups, true);
    }
    filterWrongOfferedName.licenseeNames = this.licenseesService.getCheckedLicensees(groupLicenseesModel.groupLicensees).map(x => x.name);

    return groupLicenseesModel;
  }

  autoCheckCurrency(currencies: Currency[], filterWrongOfferedName: FilterWrongOfferedNameModel, filterRequest: FilterModel): MultipleSelection {
    const items = currencies.map(x => new ItemsSelect(0, x.id.toString(), x.currencyCode,
      this.isAutoCheckedCurrency(x.id, filterRequest.subIssueTypeId), true, true, []));
    const multipleSelectCurrency = this.initMultiSelectCurrency(items);
    filterWrongOfferedName.currencyIds = this.multipleSelectionService.getValueItems(multipleSelectCurrency).split(',');

    return multipleSelectCurrency;
  }

  isValidity(filterWrongOfferedName: FilterWrongOfferedNameModel, tooltip: Tooltip): boolean {
    if (filterWrongOfferedName.currencyIds.length === 0) {
      tooltip.display(this.FILTER_CURRENCY_DROPDOWN, TEXT.SELECT_AT_LEAST_ONE_OPTION);
      return false;
    }

    if (filterWrongOfferedName.licenseeNames.length === 0) {
      tooltip.display(this.GROUP_LICENSEE, TEXT.SELECT_AT_LEAST_ONE_OPTION);
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