import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Shallow } from 'shallow-render';
import { BlockFullUiModule } from '../../utility/modules/block-full-ui/block-full-ui.module';
import { Tooltip } from '../../utility/modules/tooltip/tooltip.model';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AddUserComponent } from './add-user/add-user.component';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppStore } from './app.store';
import { FilterComponent } from './filter/filter.component';
import { GetUserModel } from './models/get-user.model';
import { PermissionABWhiteList } from './models/permission.model';
import { UserModel } from './models/user.model';
import { UserService } from './services/user.service';
import { ValidationService } from './services/validation.service';
import { UserListComponent } from './user-list/user-list.component';

jest.mock('../../utility/services/signal-r.service.native');
class Helper {
  static fakeUsername = 'name';
  static fakePermission: PermissionABWhiteList = {
    abWhiteListHost: true
  };
  static fakeUserModel: UserModel = {
    username: 'name',
    level: '1',
    site: '1,2',
    addedDate: new Date('2020-11-06 00:00:00.000'),
    addedBy: 'zane',
    isChecked: true,
    custId: 123,    
    subTypeName: '',
    isAllowVoidVIP: ''
  };
  static fakeGetUserModel: GetUserModel = {
    users: [Helper.fakeUserModel],
    invalidUsername: ''
  };
}

describe('AppComponent', () => { 
  @NgModule({
    declarations: [
      UserListComponent,
      FilterComponent,
      AddUserComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockFullUiModule
    ],
    providers: [
      UserService,
      AppService,
      SignalRService,
      AppStore
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#AppComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render();

    expect(fixture).toMatchSnapshot();
  });
 
  it('#ngOnInit should call #getPermissionABWhiteList', async () => {
    // Arrange
    const signalRService = new SignalRService();
    const appService = new AppService(null);
    const abWhiteListStore = new AppStore();
    abWhiteListStore.blockingUiStatus.subscribe = jest.fn(); 
    signalRService.initializeConnection = jest.fn();
    appService.getPermissionABWhiteList = jest.fn();

    const mockAppComponent = new AppComponent(appService, null, signalRService, abWhiteListStore, null);

    // Action
    await mockAppComponent.ngOnInit();

    // Assert
    expect(signalRService.initializeConnection).toHaveBeenCalled();
  });
  
  it('#ngOnDestroy should call #unsubscribe', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.blockingUiSubscription = new Subscription();
    instance.blockingUiSubscription.unsubscribe = jest.fn();
    
    // Action
    instance.ngOnDestroy();

    // Assert
    expect(instance.blockingUiSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  it('#showAddUserModal should update isOpen', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    instance.showAddUserModal();

    // Assert
    expect(instance.addUserModel.isOpen).toBeTruthy();
  });
  
  it('#handleSearchEvent should return ', async () => {
    // Arrange
    const fakeInvalidGetUserModel = new GetUserModel();
    fakeInvalidGetUserModel.invalidUsername = Helper.fakeUsername;
    const mockGetUsers = jest.fn().mockImplementation(() => Promise.resolve(fakeInvalidGetUserModel));
    const mockValidateCommonData = jest.fn().mockImplementation(() => false);
    const mockTooltipDisplay = jest.fn();
    const { instance } = await shallow
      .mock(UserService, { getUsers: mockGetUsers })
      .mock(ValidationService, { validateCommonData: mockValidateCommonData })
      .render();
    instance.filterModel.sites = '1,2';
    instance.filterComponent = new FilterComponent(null, null, null);
    instance.filterComponent.tooltip = new Tooltip();
    instance.filterComponent.tooltip.display = mockTooltipDisplay;

    // Action
    await instance.handleSearchEvent();

    // Assert
    expect(mockValidateCommonData).toHaveBeenCalledTimes(1);
  });
  
  it('#handleSearchEvent should update user model', async () => {
    // Arrange
    const mockGetUsers = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeGetUserModel));
    const mockValidateCommonData = jest.fn().mockImplementation(() => true);
    const mockTooltipDisplay = jest.fn();
    const { instance } = await shallow
      .mock(UserService, { getUsers: mockGetUsers })
      .mock(ValidationService, { validateCommonData: mockValidateCommonData })
      .render();
    instance.filterModel.sites = '1,2';
    instance.filterComponent = new FilterComponent(null, null, null);
    instance.filterComponent.tooltip = new Tooltip();
    instance.filterComponent.tooltip.display = mockTooltipDisplay;

    // Action
    await instance.handleSearchEvent();

    // Assert
    expect(mockGetUsers).toHaveBeenCalledTimes(1);
    expect(mockValidateCommonData).toHaveBeenCalledTimes(1);
    expect(instance.userModels).toEqual([Helper.fakeUserModel]);
  });
  
  it('#getUsers should return when has invalid usernames', async () => {
    // Arrange
    const fakeInvalidGetUser = _.cloneDeep(Helper.fakeGetUserModel);
    fakeInvalidGetUser.invalidUsername = '121221'
    const mockGetUsers = jest.fn().mockImplementation(() => Promise.resolve(fakeInvalidGetUser));
    const mockTooltipDisplay = jest.fn();
    const { instance } = await shallow
      .mock(UserService, { getUsers: mockGetUsers })
      .render();
    instance.filterModel.sites = '1,2';
    instance.filterComponent = new FilterComponent(null, null, null);
    instance.filterComponent.tooltip = new Tooltip();
    instance.filterComponent.tooltip.display = mockTooltipDisplay;

    // Action
    await instance.getUsers();

    // Assert
    expect(mockGetUsers).toHaveBeenCalledTimes(1);
  });
});