import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { CommonService } from '../../../utility/services/common.service';
import { MenuBarComponent } from './menu-bar.component';

describe('FilterComponent', () => {
  @NgModule({
    declarations: [
      MenuBarComponent
    ],
    imports: [
    ],
    providers: [
      CommonService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<MenuBarComponent>;

  beforeEach(() => {
    shallow = new Shallow(MenuBarComponent, AppModuleTest);
  });  
  
  it('MenuBarComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
