import { TestBed } from '@angular/core/testing';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { TEXT } from '../../../utility/constants/text';
import { Result } from '../../../utility/models/result';
import { AppService } from '../app.service';
import { AppStore } from '../app.store';
import { FilterModel } from '../filter/filter.model';
import { GetUserModel } from '../models/get-user.model';
import { UserModel } from '../models/user.model';
import { UserService } from './user.service';

class Helper {
  static readonly url = 'http://localhost:60196/';
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
  static readonly fakeResultSuccessful: Result<null> = {
    isSuccessful: true,
    errorCode: 0,
    errorMsg: '',
  };
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 1,
    errorMsg: 'error',
  };
}
describe('UserService', () => {
  let userService: UserService;
  let modalServiceMock: jest.Mocked<ModalService>;;
  let appServiceMock: jest.Mocked<AppService>;;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AppService, useValue: { getUsers: jest.fn(), addUsers: jest.fn(), removeUsers: jest.fn() } },
        { provide: ModalService, useValue: { open: jest.fn(), confirm: jest.fn() } },
      ],
    });

    appServiceMock = TestBed.inject(AppService) as jest.Mocked<AppService>;
    modalServiceMock = TestBed.inject(ModalService) as jest.Mocked<ModalService>;
    userService = TestBed.inject(UserService);
  });

  it('#getUsers should call #appService.getUsers when has not username', async () => {
    appServiceMock.getUsers.mockResolvedValue(Helper.fakeGetUserModel);
    const result = await userService.getUsers(new FilterModel());

    expect(result).toEqual(Helper.fakeGetUserModel);
  });

  it('#getUsers should call #appService.getUsers when has username', async () => {
    const filterModel = new FilterModel();
    filterModel.username = 'name';
    appServiceMock.getUsers.mockResolvedValue(Helper.fakeGetUserModel);
    const result = await userService.getUsers(filterModel);

    expect(result).toEqual(Helper.fakeGetUserModel);
  });

  it('#addUsers should call #appService.addUsers when addUsers successfully', async () => {
    appServiceMock.addUsers.mockResolvedValue(Helper.fakeResultSuccessful);
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    const model = {
      title: 'Add Result',
      message: TEXT.AB_WHITE_LIST_ADDED_SUCCESS,
      type: ModalType.Alert
    };
    await userService.addUsers('aa', [], false);

    expect(modalServiceMock.open).toHaveBeenCalledTimes(1);
    expect(appServiceMock.addUsers).toHaveBeenCalledTimes(1);
    expect(modalServiceMock.open.mock.calls[0][0]).toEqual(model);
    expect(modalServiceMock.open.mock.calls[0][1]).toBeInstanceOf(Function);
    modalServiceMock.open.mock.calls[0][1]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('#addUsers should call #appService.addUsers when addUsers error', async () => {
    appServiceMock.addUsers.mockResolvedValue(Helper.fakeResultError);
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    const model = {
      title: 'Add Result',
      message: TEXT.AB_WHITE_LIST_ADDED_SUCCESS,
      type: ModalType.Error
    };
    await userService.addUsers('aa', [], false);

    expect(modalServiceMock.open).toHaveBeenCalledTimes(1);
    expect(appServiceMock.addUsers).toHaveBeenCalledTimes(1);
    expect(modalServiceMock.open.mock.calls[0][0]).toEqual(model);
    expect(modalServiceMock.open.mock.calls[0][1]).toBeInstanceOf(Function);
    modalServiceMock.open.mock.calls[0][1]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('#removeUsers should call #onYesConfirm', async () => {
    const mockAppStore = new AppStore();
    mockAppStore.changeBlockingUiStatus = jest.fn();
    userService['onYesConfirm'] = jest.fn();
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    const model = {
      title: 'Remove',
      message: 'Are you sure you want to remove the Username(s)?<br>- name',
      type: ModalType.Confirm
    };

    await userService.removeUsers([Helper.fakeUserModel], mockAppStore);

    expect(modalServiceMock.confirm).toHaveBeenCalledTimes(1);
    expect(modalServiceMock.confirm.mock.calls[0][0]).toEqual(model);
    expect(modalServiceMock.confirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(modalServiceMock.confirm.mock.calls[0][2]).toBeInstanceOf(Function);
    modalServiceMock.confirm.mock.calls[0][1]();
    expect(userService['onYesConfirm']).toHaveBeenCalledTimes(1);
    modalServiceMock.confirm.mock.calls[0][2]();
  });

  it('#onYesConfirm should call #appService.removeUsers', async () => {
    const mockAppStore = new AppStore();
    mockAppStore.changeBlockingUiStatus = jest.fn();
    appServiceMock.removeUsers.mockResolvedValue(Helper.fakeResultSuccessful);
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    const model = {
      title: 'Remove',
      message: 'Remove user(s) successfully!',
      type: ModalType.Alert
    };

    await userService['onYesConfirm']('', mockAppStore);

    expect(modalServiceMock.open).toHaveBeenCalledTimes(1);
    expect(appServiceMock.removeUsers).toHaveBeenCalledTimes(1);
    expect(modalServiceMock.open.mock.calls[0][0]).toEqual(model);
    expect(modalServiceMock.open.mock.calls[0][1]).toBeInstanceOf(Function);
    modalServiceMock.open.mock.calls[0][1]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
