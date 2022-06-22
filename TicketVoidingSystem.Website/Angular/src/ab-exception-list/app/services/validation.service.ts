import { Injectable } from '@angular/core';
import { UsernamesComponent } from '../../../utility/components/user-names/user-names.component';
import { TEXT } from '../../../utility/constants/text';
import { AppService } from '../app.service';
import { FilterComponent } from '../filter/filter.component';
import { FilterModel } from '../filter/filter.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly FILTER_SITE_CLASS = 'filter-site-dropdown';
  private readonly FILTER_SUB_TYPE_CLASS = 'sub-type-dropdown';
  private readonly FILTER_VOID_VIP_CLASS = 'void-vip-dropdown';

  constructor(
    private readonly appService: AppService,
  ) {}

  async validateUsernames(usernames: string, usernamesComponent: UsernamesComponent): Promise<boolean>{
    if (usernames === '') {
      return usernamesComponent.checkValidItems();
    }
    usernamesComponent.groupUsername.resetAllValue();
    usernamesComponent.groupUsername.updateDuplicatedItems(usernames);

    const result = await this.appService.checkUsernames(usernames);
    if (result.invalidUsernames) {
      usernamesComponent.groupUsername.updateInvalid(result.invalidUsernames);
    }
    if (result.existedUsernames) {
      usernamesComponent.groupUsername.updateExisted(result.existedUsernames);
    }
    
    return usernamesComponent.checkValidItems();
  }

  public validateCommonData(filterModel: FilterModel, filterComponent: FilterComponent): boolean {
    if (!filterModel.sites) {
      filterComponent.tooltip.display(this.FILTER_SITE_CLASS, TEXT.REQUIRED_SITE);
      return false;
    }
    if (!filterModel.subTypes) {
      filterComponent.tooltip.display(this.FILTER_SUB_TYPE_CLASS, TEXT.REQUIRED_SUB_TYPE);
      return false;
    }
    if (!filterModel.voidVIP) {
      filterComponent.tooltip.display(this.FILTER_VOID_VIP_CLASS, TEXT.REQUIRED_VOID_VIP);
      return false;
    }

    return true;
  }
}