import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { BlockFullUiComponent } from '../../utility/components/block-full-ui/block-full-ui.component';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { Tooltip } from '../../utility/components/tooltip/tooltip.model';
import { TEXT} from '../../utility/constants/text';
import { Selection } from '../../utility/models/selection.model';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AddUserComponent } from './add-user/add-user.component';
import { AddUserModel } from './add-user/add-user.model';
import { AppService } from './app.service';
import { AppStore } from './app.store';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './filter/filter.model';
import { PermissionABExceptionList } from './models/permission.model';
import { UserModel } from './models/user.model';
import { UserService } from './services/user.service';
import { ValidationService } from './services/validation.service';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FilterComponent, UserListComponent, AddUserComponent, MenuBarComponent, BlockFullUiComponent, FormsModule, CommonModule],
  providers: [UserService, SignalRService, AppStore, ValidationService, AppService]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('filterComponent') filterComponent: FilterComponent;
  private readonly FILTER_USERNAME_CLASS = 'username-txt';
  title = 'Home / AB Exception List';
  filterModel = new FilterModel();
  userModels: UserModel[] = [];
  tooltip = new Tooltip();
  addUserModel = new AddUserModel();
  permission = new PermissionABExceptionList();
  subTypeSelection: Selection[] = [];
  isBlockingUi = false;
  blockingUiSubscription: Subscription;

  appService = inject(AppService);
  userService = inject(UserService);
  signalRService = inject(SignalRService);
  abExceptionListStore = inject(AppStore);
  validationService = inject(ValidationService);

  async ngOnInit() {
    this.blockingUiSubscription = this.abExceptionListStore.blockingUiStatus.subscribe(status => {
      this.isBlockingUi = status;
    });

    this.permission = await this.appService.getPermissionABExceptionList();
    await this.signalRService.initializeConnection();
  }

  ngOnDestroy(): void {
    this.blockingUiSubscription?.unsubscribe();
  }

  showAddUserModal() {
    this.addUserModel.isOpen = true;
    this.addUserModel = _.clone(this.addUserModel);
  }

  async handleSearchEvent(): Promise<void> {
    const isValid = this.validationService.validateCommonData(this.filterModel, this.filterComponent);
    if (!isValid) {
      return;
    }

    await this.getUsers();
  }

  async getUsers(): Promise<void> {
    this.isBlockingUi = true;
    const getUserModel = await this.userService.getUsers(this.filterModel);
    if (getUserModel.invalidUsername) {
      this.filterComponent.tooltip.display(this.FILTER_USERNAME_CLASS, TEXT.INVALID_USERNAME);
      this.userModels = [];
      this.isBlockingUi = false;
      return;
    }
    this.userModels = getUserModel.users;
    this.isBlockingUi = false;
  }
}