import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { ConfirmEkoComponent } from './confirm-eko.component';
import { ConfirmEarlyKickOffModel } from './confirm-eko.model';

describe('ConfirmRedCardComponent', () => {
  @NgModule({
    imports: [
      FormsModule,
      NgbModule,
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<ConfirmEkoComponent>;

  beforeEach(() => {
    shallow = new Shallow(ConfirmEkoComponent, AppModuleTest).dontMock(NgbModule);
  });

  it('ConfirmRedCardComponent should init match snapshot', async () => {
    const { instance, fixture } = await shallow.render();
    instance.model = new ConfirmEarlyKickOffModel();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('#clickCancel should emit when call #onClickCancel', async () => {
    const { instance } = await shallow.render({
      bind: {
        model: new ConfirmEarlyKickOffModel()
      }
    });

    instance.onClickCancel();

    expect(instance.clickCancel.emit).toHaveBeenCalledTimes(1);
    expect(instance.model.isOpenDialog).toEqual(false);
  });

  it('#clickOk should emit when call #onClickOk', async () => {
    const { instance } = await shallow.render({
      bind: {
        model: new ConfirmEarlyKickOffModel()
      }
    });
    instance.onClickOk();

    expect(instance.clickOk.emit).toHaveBeenCalledTimes(1);
  });
});
