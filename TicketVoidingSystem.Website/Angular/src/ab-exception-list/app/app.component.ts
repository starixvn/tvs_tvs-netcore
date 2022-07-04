import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Tooltip } from '../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../utility/constants/labels';
import { Selection } from '../../utility/models/selection.model';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AddUserModel } from './add-user/add-user.model';
import { AppService } from './app.service';
import { AppStore } from './app.store';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './filter/filter.model';
import { PermissionABExceptionList } from './models/permission.model';
import { UserModel } from './models/user.model';
import { UserService } from './services/user.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppStore]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('filterComponent') filterComponent: FilterComponent;

  title = 'Home / AB Exception List';
  filterModel = new FilterModel();
  userModels: UserModel[] = [];
  tooltip = new Tooltip();
  addUserModel = new AddUserModel();
  permission = new PermissionABExceptionList();
  subTypeSelection: Selection[] = [];
  isBlockingUi = false;
  blockingUiSubscription: Subscription;
  private readonly FILTER_USERNAME_CLASS = 'username-txt';

  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly signalRService: SignalRService,
    private readonly abExceptionListStore: AppStore,
    private readonly validationService: ValidationService,
  ) { }

  async ngOnInit() {
    this.blockingUiSubscription = this.abExceptionListStore.blockingUiStatus.subscribe(status => {
      this.isBlockingUi = status;
    });

    this.signalRService.initializeConnection();
    this.permission = await this.appService.getPermissionABExceptionList();
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
      this.filterComponent.tooltip.display(this.FILTER_USERNAME_CLASS, LABELS.INVALID_USERNAME);
      this.userModels = [];
      this.isBlockingUi = false;
      return;
    }
    this.userModels = getUserModel.users;
    this.isBlockingUi = false;
  }
}
