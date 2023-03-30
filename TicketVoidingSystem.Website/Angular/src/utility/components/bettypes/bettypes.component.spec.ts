import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../tooltip/tooltip.module';
import { BetTypesComponent } from './bettypes.component';

describe('FilterComponent', () => {
  @NgModule({
    declarations: [
      BetTypesComponent
    ],
    imports: [
      ToolTipModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<BetTypesComponent>;

  beforeEach(() => {
    shallow = new Shallow(BetTypesComponent, AppModuleTest);
  });  
  
  it('BetTypesComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
