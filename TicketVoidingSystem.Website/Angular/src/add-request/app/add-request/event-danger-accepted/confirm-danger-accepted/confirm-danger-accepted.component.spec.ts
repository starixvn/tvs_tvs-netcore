import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { ConfirmDangerAcceptedComponent } from './confirm-danger-accepted.component';
import { ConfirmDangerAcceptedModel } from './confirm-danger-accepted.model';

describe('ConfirmRedCardComponent', () => {
  @NgModule({
    declarations: [],
    imports: [      
      FormsModule,
      NgbModule,
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<ConfirmDangerAcceptedComponent>;

  beforeEach(() => {
    shallow = new Shallow(ConfirmDangerAcceptedComponent, AppModuleTest).dontMock(NgbModule);
  });

  it('ConfirmRedCardComponent should init match snapshot', async () => {
    // Arrange
    const { instance, fixture } = await shallow.render();
    instance.model = new ConfirmDangerAcceptedModel();
    fixture.detectChanges();
    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#clickCancel should emit when call #onClickCancel', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        model: new ConfirmDangerAcceptedModel()
      }
    });

    // Action
    instance.onClickCancel();

    // Assert
    expect(instance.clickCancel.emit).toHaveBeenCalledTimes(1);
    expect(instance.model.isOpenDialog).toEqual(false);
  });
  
  it('#clickOk should emit when call #onClickOk', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        model: new ConfirmDangerAcceptedModel()
      }
    });

    // Action
    instance.onClickOk();

    // Assert
    expect(instance.clickOk.emit).toHaveBeenCalledTimes(1);
  });
});
