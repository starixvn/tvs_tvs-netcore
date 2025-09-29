import { Injectable, inject } from '@angular/core';
import { UsernamesComponent } from '../../../utility/components/user-names/user-names.component';
import { TEXT } from '../../../utility/constants/text';
import { AppService } from '../app.service';
import { FilterComponent } from '../filter/filter.component';
import { FilterModel } from '../filter/filter.model';
import { UserNameService } from '../../../utility/components/user-names/user-name.service';

@Injectable()
export class ValidationService {
  private readonly FILTER_SITE_CLASS = 'filter-site-dropdown';
  private readonly FILTER_SUB_TYPE_CLASS = 'sub-type-dropdown';
  private readonly FILTER_VOID_VIP_CLASS = 'void-vip-dropdown';
  private readonly appService = inject(AppService);
  private readonly userNameService = inject(UserNameService);

  async validateUsernames(usernames: string, usernamesComponent: UsernamesComponent): Promise<boolean>{
    if (usernames === '') {
      return usernamesComponent.checkValidItems();
    }
    this.userNameService.resetAllValue(usernamesComponent.groupUsername);
    this.userNameService.updateDuplicatedItems(usernamesComponent.groupUsername, usernames);

    const result = await this.appService.checkUsernames(usernames);
    if (result.invalidUsernames) {
      this.userNameService.updateInvalid(usernamesComponent.groupUsername, result.invalidUsernames);
    }
    if (result.existedUsernames) {
      this.userNameService.updateExisted(usernamesComponent.groupUsername, result.existedUsernames);
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