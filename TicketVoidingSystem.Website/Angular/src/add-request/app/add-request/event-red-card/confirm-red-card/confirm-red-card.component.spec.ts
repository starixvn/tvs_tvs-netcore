import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { ConfirmRedCardComponent } from './confirm-red-card.component';
import { ConfirmRedCardModel } from './confirm-red-card.model';

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

  let shallow: Shallow<ConfirmRedCardComponent>;

  beforeEach(() => {
    shallow = new Shallow(ConfirmRedCardComponent, AppModuleTest).dontMock(NgbModule);
  });

  it('ConfirmRedCardComponent should init match snapshot', async () => {
    // Arrange
    const { instance, fixture } = await shallow.render();
    instance.model = new ConfirmRedCardModel();
    fixture.detectChanges();
    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#clickCancel should emit when call #onClickCancel', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        model: new ConfirmRedCardModel()
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
        model: new ConfirmRedCardModel()
      }
    });

    // Action
    instance.onClickOk();

    // Assert
    expect(instance.clickOk.emit).toHaveBeenCalledTimes(1);
  });
});
