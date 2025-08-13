import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { DateTimeFormat, TimeZone } from '../../../../../../utility/constants/config';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { AddRequestStore } from '../../../../services/add-request.store';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterTimeAreaComponent } from './filter-time-area.component';

class Helper {
  static getFakeFilterTimeWithAllowance(): FilterTimeWithAllowance {
    const model = new FilterTimeWithAllowance();
    model.fromDateTime = moment.utc().tz(TimeZone.AMERICA_CARACAS).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.toDateTime = moment.utc().tz(TimeZone.AMERICA_CARACAS).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.aaTime = 0;
    model.paTime = 0;
    model.saTime = 0;
    return model;
  }

  static getCurrentMoment() {
    return moment.utc().tz(TimeZone.AMERICA_CARACAS);
  }

  static getCurrentNgbDate() {
    const currentMoment = this.getCurrentMoment();
    return new NgbDate(currentMoment.year(), currentMoment.month() + 1, currentMoment.date());
  }
}

describe('FilterTimeAreaComponent', () => {
  let component: FilterTimeAreaComponent;
  let fixture: ComponentFixture<FilterTimeAreaComponent>;
  let addRequestStore: AddRequestStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTimeAreaComponent);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.filterTimeWithAllowanceModel = Helper.getFakeFilterTimeWithAllowance();
    component.isDisabled = false;
    component.isEdit = false;
    component.isVoided = false;
    component.filterBy = 1;
    component.tvDetectionValue = 1;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.isMainMatch).toBeTruthy();
    expect(component.tooltip).toBeDefined();
  });

  it('should validate filter time correctly', () => {
    // Arrange
    component.filterTimeWithAllowanceComponent = {
      isValid: jest.fn().mockReturnValue(true)
    } as any;

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
    expect(component.filterTimeWithAllowanceComponent.isValid).toHaveBeenCalled();
  });

  it('should emit filter changes correctly', () => {
    // Arrange
    component.filterBy = 1;
    component.filterByChange = {
      emit: jest.fn()
    } as any;
    component.changeFilterEvent = {
      emit: jest.fn()
    } as any;

    // Act
    component.emitAfterChangeFilterEvent();

    // Assert
    expect(component.filterByChange.emit).toHaveBeenCalledWith(1);
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should handle subscription cleanup on destroy', () => {
    // Arrange
    const mockSubscription = {
      unsubscribe: jest.fn()
    };
    component.changeActionWaitingToManualSubscription = mockSubscription as any;

    // Act
    component.ngOnDestroy();

    // Assert
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should handle action waiting to manual edit page changes', () => {
    // Arrange
    component.filterTimeWithAllowanceComponent = {
      clearTimeWhenChangeActionWaitingToManualVoid: jest.fn()
    } as any;

    // Mock BehaviorSubject
    const mockSubject = new BehaviorSubject<boolean>(false);
    jest.spyOn(addRequestStore, 'getChangeActionWaitingToManualEditPageSubject', 'get').mockReturnValue(mockSubject);

    // Act
    component.ngOnInit();
    mockSubject.next(true);

    // Assert
    expect(component.filterTimeWithAllowanceComponent.clearTimeWhenChangeActionWaitingToManualVoid).toHaveBeenCalled();
  });
});
