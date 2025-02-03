import { CommonModule } from '@angular/common';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsernamesComponent } from '../../../utility/components/user-names/user-names.component';
import { GroupUsername } from '../../../utility/components/user-names/user-names.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { AddUserComponent } from './../add-user/add-user.component';
import { AddUserModel } from './../add-user/add-user.model';
import { AppStore } from './../app.store';
import { UserService } from './../services/user.service';
import { ValidationService } from './../services/validation.service';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let appStore: AppStore;
  let userService: UserService;
  let validationService: ValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        CommonModule,
        FormsModule,
        NgSelectModule,
      ],
      providers: [
        UserService,
        ValidationService,
        AppStore
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    userService = TestBed.inject(UserService);
    validationService = TestBed.inject(ValidationService);
    appStore = TestBed.inject(AppStore);
    appStore.changeBlockingUiStatus = jest.fn();
    component = fixture.componentInstance;
  });

  it('should initialize with default values', () => {
    expect(component.model).toBeInstanceOf(AddUserModel);
    expect(component.selectedSubType).toEqual(undefined);
    expect(component.isVoidVIP).toBeUndefined();
  });

  it('should reset values on ngOnChanges', () => {
    component.ngOnChanges({ 'model': {} as SimpleChange });
    expect(component.selectedSubType).toEqual([]);
    expect(component.isVoidVIP).toBe(false);
  });

  it('should call services correctly on clickSave', async () => {
    const mockUsernamesComponent = new UsernamesComponent(null);
    mockUsernamesComponent.groupUsername = new GroupUsername();
    mockUsernamesComponent.groupUsername.getAllValue = jest.fn().mockReturnValue('testUser');
    component.usernamesComponent = mockUsernamesComponent;
    userService.addUsers = jest.fn();
    validationService.validateUsernames = jest.fn().mockResolvedValue(true);

    await component.clickSave();

    expect(appStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(validationService.validateUsernames).toHaveBeenCalled();
    expect(userService.addUsers).toHaveBeenCalledWith('testUser', undefined, undefined);
  });

  it('should close modal on closeModal', () => {
    component.model.isOpen = true;
    component.closeModal();
    expect(component.model.isOpen).toBe(false);
  });

  it('should validate usernames on afterFocusOutBetIds', async () => {
    const mockUsernamesComponent = new UsernamesComponent(null);
    mockUsernamesComponent.groupUsername = new GroupUsername();
    mockUsernamesComponent.groupUsername.getAllValue = jest.fn().mockReturnValue('testUser');
    component.usernamesComponent = mockUsernamesComponent;
    validationService.validateUsernames = jest.fn().mockResolvedValue(true);

    await component.afterFocusOutBetIds();
    expect(appStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(validationService.validateUsernames).toHaveBeenCalled();
  });
});