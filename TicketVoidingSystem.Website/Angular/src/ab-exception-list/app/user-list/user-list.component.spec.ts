import { ElementRef, NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { PagingModule } from '../../../utility/components/paging/paging.module';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { AppStore } from '../app.store';
import { PermissionABExceptionList } from '../models/permission.model';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserListComponent } from './user-list.component';

class Helper {
  static fakePermission: PermissionABExceptionList = {
    abExceptionListHost: true
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
}

describe('UserListComponent', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      PagingModule
    ],
    providers: [
      UserService,
      AppStore   
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<UserListComponent>;

  beforeEach(() => {
    shallow = new Shallow(UserListComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#UserListComponent init should match snapshot', async () => {
    const { fixture } = await shallow
      .render({
        bind: {
          models: [Helper.fakeUserModel],
          permission: Helper.fakePermission
        }
      });

    expect(fixture).toMatchSnapshot();
  });
  
 
  it('#ngOnChanges should call #filterDisplayRequests', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          models: [Helper.fakeUserModel],
          permission: Helper.fakePermission
        }
      });
    const changes = {
      'models': new SimpleChange([Helper.fakeUserModel], [Helper.fakeUserModel], true)
    };
    instance.paging = new PagingModel();
    instance['filterDisplayRequests'] = jest.fn();

    // Action
    instance.ngOnChanges(changes);

    // Assert
    expect(instance.paging.total).toBe(1);
    expect(instance['filterDisplayRequests']).toHaveBeenCalledTimes(1);
  });
  
  it('#ngOnChanges should not call #filterDisplayRequests', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          models: [Helper.fakeUserModel],
          permission: Helper.fakePermission
        }
      });
    instance['filterDisplayRequests'] = jest.fn();

    // Action
    instance.ngOnChanges({});

    // Assert
    expect(instance['filterDisplayRequests']).toHaveBeenCalledTimes(0);
  });

  it('#pagingEvent should update correct model', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          models: [Helper.fakeUserModel],
          permission: Helper.fakePermission
        }
      });
    instance['filterDisplayRequests'] = jest.fn();

    // Action
    instance.pagingEvent();

    // Assert
    expect(instance['filterDisplayRequests']).toHaveBeenCalledTimes(1);
  });
  
  it('#getLevel should update correct model', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          models: [Helper.fakeUserModel],
          permission: Helper.fakePermission
        }
      });

    // Action
    const result = instance.getLevel('0');

    // Assert
    expect(result).toBe('All');
  });
  
  it('#removeUsers should call #userService.removeUsers', async () => {
    // Arrange
    const mockRemoveUsers = jest.fn().mockImplementation();
    const { instance } = await shallow
      .mock(UserService, { removeUsers: mockRemoveUsers })
      .render({
        bind: {
          models: [Helper.fakeUserModel],
          permission: Helper.fakePermission
        }
      });

    // Action
    await instance.removeUsers();

    // Assert
    expect(mockRemoveUsers).toHaveBeenCalledTimes(1);
  });
  
  it('#changedCheckAll should update correct model', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          models: [Helper.fakeUserModel],
          permission: Helper.fakePermission
        }
      });
    const isCheckList = [true, false];

    isCheckList.forEach(item => {
      instance.isCheckedAll = item;

      // Action
      instance.changedCheckAll();

      // Assert
      expect(instance.displayedModels.every(x => x.isChecked)).toBe(item);
    });
  });
  
  it('#changedCheckItem should update correct model when at least row unchecked', async () => {
    // Arrange
    const fakeUserModel = _.clone(Helper.fakeUserModel);
    fakeUserModel.isChecked = false;
    const { instance } = await shallow
      .render({
        bind: {
          models: [fakeUserModel],
          permission: Helper.fakePermission
        }
      });

    // Action
    instance.changedCheckItem();

    // Assert
    expect(instance.isCheckedAll).toBe(false);
  });
  
  it('#changedCheckItem should update correct model when all row unchecked', async () => {
    // Arrange
    const fakeUserModel = _.clone(Helper.fakeUserModel);
    fakeUserModel.isChecked = true;
    const { instance } = await shallow
      .render({
        bind: {
          models: [fakeUserModel],
          permission: Helper.fakePermission
        }
      });

    // Action
    instance.changedCheckItem();

    // Assert
    expect(instance.isCheckedAll).toBe(true);
  });
  
  it('#isDisabledRemoveButton should return false when at least row checked', async () => {
    // Arrange
    const fakeUserModel = _.clone(Helper.fakeUserModel);
    fakeUserModel.isChecked = true;
    const { instance } = await shallow
      .render({
        bind: {
          models: [fakeUserModel],
          permission: Helper.fakePermission
        }
      });

    // Action
    const result = instance.isDisabledRemoveButton();

    // Assert
    expect(result).toBe(false);
  });
  
  it('#isDisabledRemoveButton should return true when all row unchecked', async () => {
    // Arrange
    const fakeUserModel = _.clone(Helper.fakeUserModel);
    fakeUserModel.isChecked = false;
    const { instance } = await shallow
      .render({
        bind: {
          models: [fakeUserModel],
          permission: Helper.fakePermission
        }
      });

    // Action
    const result = instance.isDisabledRemoveButton();

    // Assert
    expect(result).toBe(true);
  });
  
  it('#filterDisplayRequests should update correct model', async () => {
    // Arrange
    const fakeUserModel = _.clone(Helper.fakeUserModel);
    fakeUserModel.isChecked = false;
    const { instance } = await shallow
      .render({
        bind: {
          models: [fakeUserModel],
          permission: Helper.fakePermission
        }
      });
    instance.paging = new PagingModel();
    instance.paging.total = 1;

    // Action
    instance['filterDisplayRequests']();

    // Assert
    expect(instance.displayedModels.length).toBe(1);
  });
});