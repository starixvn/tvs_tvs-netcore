import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { ModalComponent } from './modal.component';
import { Modal } from './modal.model';

describe('ModalComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      FormsModule,
      NgbModule,
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<ModalComponent>;

  beforeEach(() => {
    shallow = new Shallow(ModalComponent, AppModuleTest)
    .dontMock(NgbModule)
    .mock(ElementRef, {});
  });

  it('ModalComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render({
      bind: {
        modal: new Modal()
      }
    });
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#confirm should emit #confirmEvent', async () => {
    // Arrange
    const { instance, fixture } = await shallow.render({
      bind: {
        modal: new Modal()
      }
    });
    instance.confirmEvent.emit = jest.fn();
    instance.confirm();

    // Assert
    expect(instance.confirmEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#close should emit #closeEvent', async () => {
    // Arrange
    const { instance, fixture } = await shallow.render({
      bind: {
        modal: new Modal()
      }
    });
    instance.closeEvent.emit = jest.fn();
    instance.close();

    // Assert
    expect(instance.closeEvent.emit).toHaveBeenCalledTimes(1);
  });
});
