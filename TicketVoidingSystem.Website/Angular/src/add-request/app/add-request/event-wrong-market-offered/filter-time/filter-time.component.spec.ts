import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { FilterTimeComponent } from './filter-time.component';

describe('FilterTimeComponent', () => {
  @NgModule({
    declarations: [
      FilterTimeComponent
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterTimeComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterTimeComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#changeFilter should emit #changeFilterEvent', async () => {
    const component = new FilterTimeComponent(null);
    component.changeFilterEvent.emit = jest.fn();
    component.changeFilter();

    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });
  it('#emitRefreshEvent should emit #refreshEvent', async () => {
    const component = new FilterTimeComponent(null);
    component.refreshEvent.emit = jest.fn();
    component.emitRefreshEvent();

    expect(component.refreshEvent.emit).toHaveBeenCalledTimes(1);
  });
});