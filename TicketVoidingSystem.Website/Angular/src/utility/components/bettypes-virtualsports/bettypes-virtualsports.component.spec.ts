import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../tooltip/tooltip.module';
import { BetTypesVirtualSportComponent } from './bettypes-virtualsports.component';

describe('FilterComponent', () => {
  @NgModule({
    declarations: [
      BetTypesVirtualSportComponent
    ],
    imports: [
      ToolTipModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<BetTypesVirtualSportComponent>;

  beforeEach(() => {
    shallow = new Shallow(BetTypesVirtualSportComponent, AppModuleTest);
  });  
  
  it('BetTypesVirtualSportComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
