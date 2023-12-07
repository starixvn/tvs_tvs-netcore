import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../tooltip/tooltip.module';
import { UsernamesComponent } from './user-names.component';

describe('UsernamesComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      ToolTipModule,
      NgbModule,
      FormsModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<UsernamesComponent>;

  beforeEach(() => {
    shallow = new Shallow(UsernamesComponent, AppModuleTest)
    .dontMock(NgbModule)
    .mock(ElementRef, {});
  });

  it('UsernamesComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
