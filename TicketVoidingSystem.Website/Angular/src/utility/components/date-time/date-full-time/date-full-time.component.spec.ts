import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../../tooltip/tooltip.module';
import { DateFullTimeComponent } from './date-full-time.component';

describe('FilterComponent', () => {
  @NgModule({
    declarations: [
      DateFullTimeComponent
    ],
    imports: [
      ToolTipModule,
      NgbModule,
      FormsModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<DateFullTimeComponent>;

  beforeEach(() => {
    shallow = new Shallow(DateFullTimeComponent, AppModuleTest);
  });  
  
  it('DateFullTimeComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
