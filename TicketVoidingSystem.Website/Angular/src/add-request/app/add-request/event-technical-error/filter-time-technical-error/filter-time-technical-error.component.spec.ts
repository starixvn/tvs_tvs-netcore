import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { FilterTechnicalErrorModel } from '../models/filter-technical-error.model';
import { FilterTimeTechnicalErrorComponent } from './filter-time-technical-error.component';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterTechnicalErrorModel: FilterTechnicalErrorModel = {
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate
  };
}

describe('FilterTimeComponent', () => {
  @NgModule({
    declarations: [
      FilterTimeTechnicalErrorComponent
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterTimeTechnicalErrorComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterTimeTechnicalErrorComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('FilterTimeComponent init should match snapshot', async () => {
    const component = new FilterTimeTechnicalErrorComponent(null);
    component.filterTechnicalErrorModel = Helper.fakeFilterTechnicalErrorModel;

    expect(component).toMatchSnapshot();
  });

  it('#changeFilter should emit #changeFilterEvent', async () => {
    const component = new FilterTimeTechnicalErrorComponent(null);
    component.changeFilterEvent.emit = jest.fn();
    component.changeFilter();

    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });
  it('#emitRefreshEvent should emit #refreshEvent', async () => {
    const component = new FilterTimeTechnicalErrorComponent(null);
    component.refreshEvent.emit = jest.fn();
    component.emitRefreshEvent();

    expect(component.refreshEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isValidDateTime should return true', async () => {
    const component = new FilterTimeTechnicalErrorComponent(null);
    component.filterTechnicalErrorModel = Helper.fakeFilterTechnicalErrorModel;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);

    const result = component.isValidity();

    expect(result).toBe(true);
  });
});