import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { AddRequestStore } from '../../add-request.store';
import { FilterTimeWithAllowanceComponent } from '../filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterTimeAreaComponent } from './filter-time-area.component';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeFilterTimeWithAllowance: FilterTimeWithAllowance = {
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime,
    aaTime: 1,
    paTime: 1,
    saTime: 1,
  };
}

describe('FilterTimeAreaComponent', () => { 
  @NgModule({
    declarations: [
      FilterTimeWithAllowanceComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule
    ],
    providers: [  
      AddRequestStore 
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterTimeAreaComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterTimeAreaComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#ngOnInit should be call #getChangeActionWaitingToManualEditPageSubject.subscribe when edit request', async () => {
    // Arrange
    const addRequestStore = new AddRequestStore();
    addRequestStore.getChangeActionWaitingToManualEditPageSubject.subscribe = jest.fn();
    const component = new FilterTimeAreaComponent(null, addRequestStore);
    component.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    component.filterTimeWithAllowanceComponent.clearTimeWhenChangeActionWaitingToManualVoid = jest.fn();
    component.isEdit = true;

    // Action
    component.ngOnInit();

    // Assert
    expect(component.isEdit).toBeTruthy();
  });
  
  it('#isValid should return true', async () => {
    // Arrange
    const component = new FilterTimeAreaComponent(null, null);
    component.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    component.filterTimeWithAllowanceComponent.isValid = jest.fn().mockImplementation(() => true);
    component.isEdit = true;

    // Action
    const actual = component.isValid();

    // Assert
    expect(actual).toBeTruthy();
  });
  
  it('#isValid should return false', async () => {
    // Arrange
    const component = new FilterTimeAreaComponent(null, null);
    component.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    component.filterTimeWithAllowanceComponent.isValid = jest.fn().mockImplementation(() => false);

    // Action
    const actual = component.isValid();

    // Assert
    expect(actual).toEqual(false);
  });

  it('#filterByChange should emit when call #emitAfterChangeFilterEvent', async () => {
    // Arrange
    const component = new FilterTimeAreaComponent(null, null);
    component.filterBy = TVSRequestFilterBy.CHECK_TIME;
    component.filterByChange.emit = jest.fn();
    component.changeFilterEvent.emit = jest.fn();
    
    // Action
    component.emitAfterChangeFilterEvent();

    // Assert
    expect(component.filterByChange.emit).toHaveBeenCalledTimes(1);
    expect(component.filterByChange.emit).toHaveBeenCalledWith(TVSRequestFilterBy.CHECK_TIME);
    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });
  
  it('#ngOnDestroy should call #unsubscribe', async () => {
    // Arrange
    const component = new FilterTimeAreaComponent(null, null);
    component.changeActionWaitingToManualSubscription = new Subscription();
    component.changeActionWaitingToManualSubscription.unsubscribe = jest.fn();
    
    // Action
    component.ngOnDestroy();

    // Assert
    expect(component.changeActionWaitingToManualSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  it('#ngOnDestroy not call #unsubscribe', async () => {
    // Arrange
    const component = new FilterTimeAreaComponent(null, null);
    component.changeActionWaitingToManualSubscription = null;
    
    // Action
    component.ngOnDestroy();

    // Assert
    expect(component.changeActionWaitingToManualSubscription).toBeNull();
  });
});