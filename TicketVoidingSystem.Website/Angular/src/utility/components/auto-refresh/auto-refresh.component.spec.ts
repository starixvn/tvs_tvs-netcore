import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../tooltip/tooltip.module';
import { AutoRefreshComponent } from './auto-refresh.component';

describe('AutoRefreshComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      ToolTipModule,
      NgSelectModule,
      FormsModule,
      NgbModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AutoRefreshComponent>;

  beforeEach(() => {
    shallow = new Shallow(AutoRefreshComponent, AppModuleTest)
    .dontMock(NgbModule)
    .mock(ElementRef, {});
  });  
  
  it('AutoRefreshComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
