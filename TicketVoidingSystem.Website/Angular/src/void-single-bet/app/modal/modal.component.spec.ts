import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { Modal } from './modal';
import { ModalComponent } from './modal.component';

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
});
