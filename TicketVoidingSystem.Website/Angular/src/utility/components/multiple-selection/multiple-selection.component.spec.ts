import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../tooltip/tooltip.module';
import { MultipleSelection } from './multiple-selection';
import { MultipleSelectionComponent } from './multiple-selection.component';

describe('MultipleSelectionComponent', () => {
  @NgModule({
    declarations: [
      MultipleSelectionComponent
    ],
    imports: [
      ToolTipModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<MultipleSelectionComponent>;

  beforeEach(() => {
    shallow = new Shallow(MultipleSelectionComponent, AppModuleTest);
  });  
  
  it('MultipleSelectionComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render({
      bind: {
        multipleSelect: new MultipleSelection()
      }
    });
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
