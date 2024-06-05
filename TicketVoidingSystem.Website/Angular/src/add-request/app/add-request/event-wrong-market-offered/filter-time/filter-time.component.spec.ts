import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { DateFullTimeNewComponent } from 'src/utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';
import { FilterTimeComponent } from './filter-time.component';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterWrongMarketOfferedModel: FilterWrongMarketOfferedModel = {
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate
  };
}

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

  it('FilterTimeComponent init should match snapshot', async () => {
    const component = new FilterTimeComponent(null);
    component.filterWrongMarketOfferedModel = Helper.fakeFilterWrongMarketOfferedModel;

    expect(component).toMatchSnapshot();
  });

  it('#changeFilter should emit #changeFilterEvent', async () => {
    const component = new FilterTimeComponent(null);
    component.changeFilterEvent.emit = jest.fn();
    component.changeFilter();

    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });
  it('#emitRefreshEvent should emit #refreshEvent', async () => {
    const component = new FilterTimeComponent(null);
    component.changeFilterEvent.emit = jest.fn();
    component.emitRefreshEvent();

    expect(component.refreshEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isValidDateTime should return true', async () => {
    const component = new FilterTimeComponent(null);
    component.filterWrongMarketOfferedModel = Helper.fakeFilterWrongMarketOfferedModel;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);

    const result = component.isValidity();

    expect(result).toBe(true);
  });
});