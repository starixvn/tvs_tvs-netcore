import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { ConfirmAbnormalAccountComponent } from './confirm-abnormal-account.component';
import { ConfirmAbnormalAccountModel } from './confirm-abnormal-account.model';

class Helper {
  static readonly fakeConfirmAbnormalAccountModel: ConfirmAbnormalAccountModel = {
    isOpenDialog: true,
    isHasWarningTicketsExistedInRequest: true,
    isHasWarningEditTakeNoteRequest: false,    
    isEditingByAnotherUser: false,
    requestId: 1,
    requestedBy: '',
    numberOfTicketsExistedInRequest: 1,
  };
}

describe('ConfirmAbnormalAccountComponent', () => {
  @NgModule({
    imports: [
      FormsModule,
      NgbModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<ConfirmAbnormalAccountComponent>;

  beforeEach(() => {
    shallow = new Shallow(ConfirmAbnormalAccountComponent, AppModuleTest).dontMock(NgbModule);
  });
  
  it('ConfirmAbnormalAccountComponent should init match snapshot', async () => {
    const { fixture } = await shallow.render({
      bind: {
        model: Helper.fakeConfirmAbnormalAccountModel
      }
    });
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('#closeClick should close popup and emit action close', async () => {
    const { instance } = await shallow.render({
      bind: {
        model: Helper.fakeConfirmAbnormalAccountModel
      }
    });

    instance.closeClick();

    expect(instance.close.emit).toHaveBeenCalledTimes(1);
    expect(instance.model.isOpenDialog).toEqual(false);
  });

  it('#saveClick should close popup and emit action save', async () => {
    const { instance } = await shallow.render({
      bind: {
        model: Helper.fakeConfirmAbnormalAccountModel
      }
    });

    instance.saveClick();

    expect(instance.save.emit).toHaveBeenCalledTimes(1);
    expect(instance.model.isOpenDialog).toEqual(false);
  });
});
