import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Shallow } from 'shallow-render';
import { UsernamesComponent } from '../../../utility/components/user-names/user-names.component';
import { GroupUsername } from '../../../utility/components/user-names/user-names.model';
import { BlockFullUiModule } from '../../../utility/modules/block-full-ui/block-full-ui.module';
import { AppStore } from '../app.store';
import { UserService } from '../services/user.service';
import { ValidationService } from '../services/validation.service';
import { AddUserComponent } from './add-user.component';
import { AddUserModel } from './add-user.model';
class Helper {
  static fakeAddUserModel: AddUserModel = {
    isOpen: true,    
  };
}

describe('AddUserComponent', () => { 
  @NgModule({
    declarations: [
      UsernamesComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockFullUiModule,
      NgSelectModule,
      NgMultiSelectDropDownModule
    ],
    providers: [
      ValidationService,
      UserService,
      AppStore
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AddUserComponent>;

  beforeEach(() => {
    shallow = new Shallow(AddUserComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#AddUserComponent init should match snapshot', async () => {
    const { fixture } = await shallow
      .render({
        bind: {
          model: Helper.fakeAddUserModel
        }
      });

    expect(fixture).toMatchSnapshot();
  });

  it('#clickSave should call #addUsers', async () => {
    // Arrange
    const mockChangeBlockingUiStatus = jest.fn();
    const mockValidateUsernames = jest.fn().mockImplementation(() => Promise.resolve(true));
    const mockAddUsers = jest.fn().mockImplementation();
    const { instance } = await shallow
      .mock(AppStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
      .mock(ValidationService, { validateUsernames: mockValidateUsernames })
      .mock(UserService, { addUsers: mockAddUsers })
      .render({
        bind: {
          model: Helper.fakeAddUserModel
        }
      });
    instance.usernamesComponent = new UsernamesComponent(null);
    instance.usernamesComponent.groupUsername = new GroupUsername();
    instance.usernamesComponent.groupUsername.getAllValue = jest.fn();

    // Action
    await instance.clickSave();

    // Assert
    expect(mockValidateUsernames).toHaveBeenCalledTimes(1);
    expect(mockAddUsers).toHaveBeenCalledTimes(1);
  });
  
  it('#clickSave should not call #addUsers', async () => {
    // Arrange
    const mockChangeBlockingUiStatus = jest.fn();
    const mockValidateUsernames = jest.fn().mockImplementation(() => Promise.resolve(false));
    const mockAddUsers = jest.fn().mockImplementation();
    const { instance } = await shallow
      .mock(AppStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
      .mock(ValidationService, { validateUsernames: mockValidateUsernames })
      .mock(UserService, { addUsers: mockAddUsers })
      .render({
        bind: {
          model: Helper.fakeAddUserModel
        }
      });    
    instance.usernamesComponent = new UsernamesComponent(null);
    instance.usernamesComponent.groupUsername = new GroupUsername();
    instance.usernamesComponent.groupUsername.getAllValue = jest.fn();

    // Action
    await instance.clickSave();

    // Assert
    expect(mockValidateUsernames).toHaveBeenCalledTimes(1);
    expect(mockAddUsers).toHaveBeenCalledTimes(0);
  });
  
  it('#clickSave should not call #addUsers', async () => {
    // Arrange
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
      .mock(AppStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
      .render({
        bind: {
          model: Helper.fakeAddUserModel
        }
      });

    // Action
    instance.closeModal();

    // Assert
    expect(Helper.fakeAddUserModel.isOpen).toBe(false);
  });
  
  it('#ngOnChanges should not update data', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeAddUserModel
        }
      });
    instance.isVoidVIP = true;

    // Action
    instance.ngOnChanges({});

    // Assert
    expect(instance.isVoidVIP).toBeTruthy();
  });
});