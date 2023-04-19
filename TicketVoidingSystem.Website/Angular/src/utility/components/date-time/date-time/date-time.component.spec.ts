import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../../tooltip/tooltip.module';
import { DateTimeComponent } from './date-time.component';

describe('FilterComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      ToolTipModule,
      FormsModule,
      NgbModule,
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<DateTimeComponent>;

  beforeEach(() => {
    shallow = new Shallow(DateTimeComponent, AppModuleTest);
  });  
  
  it('DateTimeComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
