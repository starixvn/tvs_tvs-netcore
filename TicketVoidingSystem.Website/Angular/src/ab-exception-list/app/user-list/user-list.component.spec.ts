import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagingComponent } from '../../../utility/components/paging/paging.component';
import { ABExceptionListLevel, ABExceptionListVoidVIP } from '../../../utility/constants/config';
import { TestingModule } from '../../../utility/modules/testing.module';
import { AppStore } from '../app.store';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: UserService;
  let appStore: AppStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        UserListComponent,
        PagingComponent,
      ],
      providers: [
        UserService,
        AppStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    userService = fixture.debugElement.injector.get(UserService);
    appStore = fixture.debugElement.injector.get(AppStore);
    component = fixture.componentInstance;
  });

  it('should call removeUsers when remove button is clicked', async () => {
    const mockUser = new UserModel();
    mockUser.isChecked = true;
    component.displayedModels = [mockUser];
    userService.removeUsers = jest.fn().mockImplementation();

    await component.removeUsers();
    expect(userService.removeUsers).toHaveBeenCalledWith([mockUser], appStore);
  });

  it('should update displayedModels on models change', () => {
    const models = [new UserModel(), new UserModel()];
    component.models = models;
    component.ngOnChanges({ 'models': {} as SimpleChange });

    expect(component.paging.total).toBe(2);
    expect(component.displayedModels.length).toBe(2);
  });

  it('should check if all items are checked when isCheckedAll is true', () => {
    const models = [new UserModel(), new UserModel()];
    models[0].isChecked = true;
    models[1].isChecked = true;
    component.models = models;
    component.ngOnChanges({ 'models': {} as SimpleChange });

    expect(component.isCheckedAll).toBe(true);
  });

  it('should call changedCheckAll to update all checkboxes', () => {
    const models = [new UserModel(), new UserModel()];
    component.displayedModels = models;
    component.isCheckedAll = true;
    component.changedCheckAll();

    expect(component.displayedModels.every(x => x.isChecked)).toBe(true);
  });

  it('should call changedCheckItem to update isCheckedAll to false', () => {
    const models = [new UserModel(), new UserModel()];
    component.displayedModels = models;
    component.isCheckedAll = true;

    component.changedCheckItem();

    expect(component.isCheckedAll).toBe(false);
  });

  it('should return true for isDisabledRemoveButton when no user is checked', () => {
    const models = [new UserModel(), new UserModel()];
    component.displayedModels = models;
    expect(component.isDisabledRemoveButton()).toBe(true);
  });

  it('should return the correct level name based on id', () => {
    const result = component.getLevel(ABExceptionListLevel.Super);
    expect(result).toBe('Super');
  });

  it('should call isShowCheckBoxVoidVIP to return expected', () => {
    [
      { isVoidvip: null, expected: false },
      { isVoidvip: ABExceptionListVoidVIP.Yes, expected: true },
      { isVoidvip: ABExceptionListVoidVIP.No, expected: true }
    ].forEach(testCase => {
      const result = component.isShowCheckBoxVoidVIP(testCase.isVoidvip);
      expect(result).toBe(testCase.expected);
    });
  });

  it('should filter displayed models correctly', () => {
    const models = [new UserModel(), new UserModel(), new UserModel()];
    component.models = models;
    component.paging.pageSize = 2;
    component.paging.total = 3;
    component.pagingEvent();

    expect(component.displayedModels.length).toBe(2);
  });
});
