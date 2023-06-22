import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
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
  let modalService: ModalService;
  let appService: AppService;

  beforeEach(() => {
    modalService = new ModalService(new NgbModalConfig(null), null, null);
    appService = new AppService(null);
    userService = new UserService(appService, modalService);
  });

  it('#getUsers should call #appService.getUsers when has not username', async () => {
    // Arrange
    appService.getUsers = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeGetUserModel));
    const mockUserService = new UserService(appService, null);

    // action
    const result = await mockUserService.getUsers(new FilterModel());

    // Assert
    expect(result).toEqual(Helper.fakeGetUserModel);
  });

  it('#getUsers should call #appService.getUsers when has username', async () => {
    // Arrange
    const filterModel = new FilterModel();
    filterModel.username = 'name';
    appService.getUsers = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeGetUserModel));
    const mockUserService = new UserService(appService, null);

    // action
    const result = await mockUserService.getUsers(filterModel);

    // Assert
    expect(result).toEqual(Helper.fakeGetUserModel);
  });

  it('#addUsers should call #appService.addUsers when addUsers successfully', async () => {
    // Arrange
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => {});
    const spyAppServiceAddUsers = jest.spyOn(appService, 'addUsers').mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    const model = {
      title: 'Add Result',
      message: TEXT.AB_WHITE_LIST_ADDED_SUCCESS,
      type: ModalType.Alert
    };
    // action
    await userService.addUsers('aa', [], false);

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyAppServiceAddUsers).toHaveBeenCalledTimes(1);

    expect(spyModalServiceConfirm.mock.calls[0][0]).toEqual(model);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('#addUsers should call #appService.addUsers when addUsers error', async () => {
    // Arrange
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => {});
    const spyAppServiceAddUsers = jest.spyOn(appService, 'addUsers').mockImplementation(() => Promise.resolve(Helper.fakeResultError));
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    const model = {
      title: 'Add Result',
      message: TEXT.AB_WHITE_LIST_ADDED_SUCCESS,
      type: ModalType.Error
    };
    // action
    await userService.addUsers('aa', [], false);

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyAppServiceAddUsers).toHaveBeenCalledTimes(1);

    expect(spyModalServiceConfirm.mock.calls[0][0]).toEqual(model);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('#removeUsers should call #onYesConfirm', async () => {
    // Arrange
    const mockAppStore = new AppStore();
    mockAppStore.changeBlockingUiStatus = jest.fn();
    const spyModalServiceConfirm = jest.spyOn(modalService, 'confirm').mockImplementation(() => {});
    const mockUserService = new UserService(appService, modalService);
    mockUserService['onYesConfirm'] = jest.fn();

    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    const model = {
      title: 'Remove',
      message: 'Are you sure you want to remove the Username(s)?<br>- name',
      type: ModalType.Confirm
    };

    // action
    await mockUserService.removeUsers([Helper.fakeUserModel], mockAppStore);

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);

    expect(spyModalServiceConfirm.mock.calls[0][0]).toEqual(model);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(spyModalServiceConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    expect(mockUserService['onYesConfirm']).toHaveBeenCalledTimes(1);

    spyModalServiceConfirm.mock.calls[0][2]();
  });

  it('#onYesConfirm should call #appService.removeUsers', async () => {
    // Arrange
    const mockAppStore = new AppStore();
    mockAppStore.changeBlockingUiStatus = jest.fn();
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => {});
    const spyAppServiceRemoveUsers = jest.spyOn(appService, 'removeUsers').mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    const model = {
      title: 'Remove',
      message: 'Remove user(s) successfully!',
      type: ModalType.Alert
    };
    // action
    await userService['onYesConfirm']('', mockAppStore);

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyAppServiceRemoveUsers).toHaveBeenCalledTimes(1);

    expect(spyModalServiceConfirm.mock.calls[0][0]).toEqual(model);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
