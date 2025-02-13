import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BlockFullUiComponent } from '../../utility/components/block-full-ui/block-full-ui.component';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { Tooltip } from '../../utility/components/tooltip/tooltip.model';
import { TestingModule } from '../../utility/modules/testing.module';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AddUserComponent } from './add-user/add-user.component';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppStore } from './app.store';
import { FilterComponent } from './filter/filter.component';
import { GetUserModel } from './models/get-user.model';
import { UserService } from './services/user.service';
import { ValidationService } from './services/validation.service';
import { UserListComponent } from './user-list/user-list.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let appService: AppService;
  let signalRService: SignalRService;
  let userService: UserService;
  let validationService: ValidationService;
  let appStore: AppStore;
  let blockingUiStatusSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        BlockFullUiComponent,
        MenuBarComponent,
        AddUserComponent,
        FilterComponent,
        UserListComponent,
        ToastrModule.forRoot()
      ],
      providers: [
        AppService,
        AppStore,
        SignalRService,
        UserService,
        ValidationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    appService = fixture.debugElement.injector.get(AppService);
    signalRService = fixture.debugElement.injector.get(SignalRService);
    userService = fixture.debugElement.injector.get(UserService);
    appStore = fixture.debugElement.injector.get(AppStore);
    validationService = fixture.debugElement.injector.get(ValidationService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to blockingUiStatus on init', async () => {
    blockingUiStatusSubject = new BehaviorSubject<boolean>(false);
    Object.defineProperty(appStore, 'blockingUiStatus', {
      get: () => blockingUiStatusSubject.asObservable(),
    });
    appService.getPermissionABExceptionList = jest.fn().mockResolvedValue('mockedPermission');
    signalRService.initializeConnection = jest.fn();

    await component.ngOnInit();

    blockingUiStatusSubject.next(true);
    expect(component.isBlockingUi).toBe(true);
    expect(appService.getPermissionABExceptionList).toHaveBeenCalled();
    expect(signalRService.initializeConnection).toHaveBeenCalled();
    expect(component.permission).toBe('mockedPermission');
  });

  it('should unsubscribe from blockingUiStatus on destroy', () => {
    component.blockingUiSubscription = {} as Subscription;
    component.blockingUiSubscription.unsubscribe = jest.fn();
    component.ngOnDestroy();

    expect(component.blockingUiSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should open add user modal', () => {
    component.showAddUserModal();
    expect(component.addUserModel.isOpen).toBe(true);
  });

  it('should handle search event', async () => {
    jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
    const getUsersSpy = jest.spyOn(component, 'getUsers').mockResolvedValue();

    await component.handleSearchEvent();

    expect(validationService.validateCommonData).toHaveBeenCalledWith(component.filterModel, component.filterComponent);
    expect(getUsersSpy).toHaveBeenCalled();
  });

  it('should not handle search event if validation fails', async () => {
    validationService.validateCommonData = jest.fn().mockImplementation(() => false);
    validationService.validateUsernames = jest.fn().mockResolvedValue(true);
    component.getUsers = jest.fn();
    await component.handleSearchEvent();

    expect(validationService.validateCommonData).toHaveBeenCalledWith(component.filterModel, component.filterComponent);
    expect(component.getUsers).not.toHaveBeenCalled();
  });

  it('should get users and call filterComponent.tooltip.display', async () => {
    jest.spyOn(userService, 'getUsers').mockResolvedValue({ invalidUsername: 'test' } as GetUserModel );
    component.filterComponent = TestBed.createComponent(FilterComponent).componentInstance;
    component.filterComponent.tooltip = new Tooltip();
    component.filterComponent.tooltip.display = jest.fn();

    await component.getUsers();

    expect(component.filterComponent.tooltip.display).toHaveBeenCalledTimes(1);
    expect(userService.getUsers).toHaveBeenCalledWith(component.filterModel);
  });

  it('should get users and do not call filterComponent.tooltip.display', async () => {
    jest.spyOn(userService, 'getUsers').mockResolvedValue({} as GetUserModel );
    component.filterComponent = TestBed.createComponent(FilterComponent).componentInstance;
    component.filterComponent.tooltip = new Tooltip();
    component.filterComponent.tooltip.display = jest.fn();

    await component.getUsers();

    expect(component.filterComponent.tooltip.display).not.toHaveBeenCalled();
    expect(userService.getUsers).toHaveBeenCalledWith(component.filterModel);
  });
});