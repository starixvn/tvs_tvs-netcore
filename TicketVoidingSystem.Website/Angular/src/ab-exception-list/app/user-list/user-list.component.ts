import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { PagingModel } from '../../../utility/components/paging/paging.model';
import { ABExceptionListLevel, ABExceptionListVoidVIP } from '../../../utility/constants/config';
import { AppStore } from '../app.store';
import { PermissionABExceptionList } from '../models/permission.model';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { PagingComponent } from '../../../utility/components/paging/paging.component';

@Component({
  standalone: true,
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [PagingComponent, FormsModule, CommonModule]
})
export class UserListComponent implements OnChanges {
  @Input() models: UserModel[] = [];
  @Input() permission = new PermissionABExceptionList();
  isBlock: boolean;
  isCheckedAll = false;
  paging = new PagingModel();
  displayedModels: UserModel[] = [];

  userService = inject(UserService);
  abExceptionListStore = inject(AppStore);

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['models']) {
      this.paging.total = this.models.length;
      this.paging.pageSize = 500;
      this.isCheckedAll = this.models.every(x => x.isChecked);
      this.filterDisplayRequests();
    }
  }

  public pagingEvent() {
    this.isCheckedAll = false;
    this.filterDisplayRequests();
  }

  public getLevel(id: string): string {
    return ABExceptionListLevel.MULTIPLE_OPTIONS.find(x => x.value === id).name;
  }

  async removeUsers() {
    const checkedUsers = _.filter(this.displayedModels, { isChecked: true });
    await this.userService.removeUsers(checkedUsers, this.abExceptionListStore);
  }

  public changedCheckAll() {
    this.displayedModels.forEach(item => {
      item.isChecked = this.isCheckedAll;
    });
  }

  public changedCheckItem() {
    this.isCheckedAll = true;
    if (this.displayedModels.some(x => !x.isChecked)) {
      this.isCheckedAll = false;
    }
  }

  public isDisabledRemoveButton(): boolean {
    return this.displayedModels.every(x => !x.isChecked);
  }

  public isShowCheckBoxVoidVIP(voidVIP: string): boolean {
    return voidVIP === ABExceptionListVoidVIP.Yes
      || voidVIP === ABExceptionListVoidVIP.No;
  }

  private filterDisplayRequests() {
    this.displayedModels = _.cloneDeep(this.models.slice(this.paging.begin - 1, this.paging.end));
  }
}
