import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TimeZone } from '../../../../../../utility/constants/config';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterTimeWithAllowanceComponent } from './filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from './filter-time-with-allowance.model';

class Helper {
  static readonly fakeFilterTimeWithAllowance: FilterTimeWithAllowance = {
    fromDateTime: moment.utc().tz(TimeZone.AMERICA_CARACAS).format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    toDateTime: moment.utc().tz(TimeZone.AMERICA_CARACAS).format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    aaTime: null,
    paTime: null,
    saTime: null
  };

  static getCurrentMoment() {
    return moment.utc().tz(TimeZone.AMERICA_CARACAS);
  }

  static getCurrentNgbDate() {
    const currentMoment = this.getCurrentMoment();
    return new NgbDate(currentMoment.year(), currentMoment.month() + 1, currentMoment.date());
  }

  static getValidTimeFormat() {
    return moment.utc().tz(TimeZone.AMERICA_CARACAS).format(DateTimeFormat.TIME_FORMAT);
  }
}

describe('FilterTimeWithAllowanceComponent', () => {
  let component: FilterTimeWithAllowanceComponent;
  let fixture: ComponentFixture<FilterTimeWithAllowanceComponent>;
  let mockElementRef: ElementRef;

  beforeEach(async () => {
    mockElementRef = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTimeWithAllowanceComponent);
    component = fixture.componentInstance;
    component.filterTimeWithAllowanceModel = new FilterTimeWithAllowance();
    component.tooltip = new Tooltip();
    component.tooltip.element = mockElementRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    component.isUseInLogInfo = false;
    component.filterTimeWithAllowanceModel = new FilterTimeWithAllowance();

    // Act
    component.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(component.isShowInputFromDate).toBeTruthy();
    expect(component.isShowInputToDate).toBeTruthy();
    expect(component.fromTime).toBeDefined();
    expect(component.toTime).toBeDefined();
    expect(component.fromDate).toBeDefined();
    expect(component.toDate).toBeDefined();
  });

  it('should initialize with existing values when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;

    // Act
    component.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(component.fromDate).toBeDefined();
    expect(component.toDate).toBeDefined();
    expect(component.fromTime).toBeDefined();
    expect(component.toTime).toBeDefined();
  });

  it('should clear time when change action waiting to manual void', () => {
    // Arrange
    component.fromTime = '10:00:00.000 AM';
    component.toTime = '11:00:00.000 AM';

    // Act
    component.clearTimeWhenChangeActionWaitingToManualVoid();

    // Assert
    expect(component.fromTime).toBe('');
    expect(component.toTime).toBe('');
  });

  it('should validate from time correctly', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    component.fromDate = Helper.getCurrentNgbDate();
    component.fromTime = Helper.getValidTimeFormat();
    component.tooltip.element = mockElementRef;
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;

    // Act
    const result = component.isFromTimeValid();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate to time correctly', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    component.toDate = Helper.getCurrentNgbDate();
    component.toTime = Helper.getValidTimeFormat();
    component.tooltip.element = mockElementRef;
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;

    // Act
    const result = component.isToTimeValid();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate invalid time format', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = '25:00:00.000 AM';
    component.toTime = Helper.getValidTimeFormat();
    component.tooltip.element = mockElementRef;
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;

    // Act
    const fromTimeResult = component.isFromTimeValid();
    const toTimeResult = component.isToTimeValid();

    // Assert
    expect(fromTimeResult).toBeFalsy();
    expect(toTimeResult).toBeTruthy();
  });

  it('should validate time range correctly', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    const toMoment = moment(currentMoment).add(1, 'hour');
    component.fromDate = Helper.getCurrentNgbDate();
    if (toMoment.date() !== currentMoment.date()) {
      component.toDate = new NgbDate(toMoment.year(), toMoment.month() + 1, toMoment.date());
    } else {
      component.toDate = Helper.getCurrentNgbDate();
    }
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = toMoment.format(DateTimeFormat.TIME_FORMAT);
    component.tooltip.element = mockElementRef;
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate invalid time range', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    const fromMoment = moment(currentMoment).add(3, 'hours');
    const toMoment = moment(currentMoment).add(1, 'hour');
    if (fromMoment.date() !== currentMoment.date()) {
      component.fromDate = new NgbDate(fromMoment.year(), fromMoment.month() + 1, fromMoment.date());
    } else {
      component.fromDate = Helper.getCurrentNgbDate();
    }
    if (toMoment.date() !== currentMoment.date()) {
      component.toDate = new NgbDate(toMoment.year(), toMoment.month() + 1, toMoment.date());
    } else {
      component.toDate = Helper.getCurrentNgbDate();
    }
    component.fromTime = fromMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = toMoment.format(DateTimeFormat.TIME_FORMAT);
    component.tooltip.element = mockElementRef;
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should calculate duration time correctly', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    const toMoment = moment(currentMoment).add(1, 'hour');
    component.fromDate = Helper.getCurrentNgbDate();
    if (toMoment.date() !== currentMoment.date()) {
      component.toDate = new NgbDate(toMoment.year(), toMoment.month() + 1, toMoment.date());
    } else {
      component.toDate = Helper.getCurrentNgbDate();
    }
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = toMoment.format(DateTimeFormat.TIME_FORMAT);
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;

    // Act
    const duration = component.getDurationTime();

    // Assert
    expect(duration).toBe('60m0s');
  });

  it('should emit change filter time event', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    const toMoment = moment(currentMoment).add(1, 'hour');
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = toMoment.format(DateTimeFormat.TIME_FORMAT);
    component.changeFilterTimeEvent = {
      emit: jest.fn()
    } as any;
    component.changeAllowanceSettingTimeEvent = {
      emit: jest.fn()
    } as any;

    // Act
    component.changeFilterDateTime();

    // Assert
    expect(component.changeFilterTimeEvent.emit).toHaveBeenCalled();
    expect(component.changeAllowanceSettingTimeEvent.emit).toHaveBeenCalled();
  });

  it('should clear setting time when use in log info', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    const toMoment = moment(currentMoment).add(1, 'hour');
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = toMoment.format(DateTimeFormat.TIME_FORMAT);
    component.isUseInLogInfo = true;
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;
    component.filterTimeWithAllowanceModel.aaTime = 10;
    component.filterTimeWithAllowanceModel.paTime = 20;
    component.filterTimeWithAllowanceModel.saTime = 30;

    // Act
    component.changeFilterDateTime();

    // Assert
    expect(component.filterTimeWithAllowanceModel.aaTime).toBeNull();
    expect(component.filterTimeWithAllowanceModel.paTime).toBeNull();
    expect(component.filterTimeWithAllowanceModel.saTime).toBeNull();
  });

  it('should validate setting time correctly', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    const toMoment = moment(currentMoment).add(1, 'hour');
    component.fromDate = Helper.getCurrentNgbDate();
    if (toMoment.date() !== currentMoment.date()) {
      component.toDate = new NgbDate(toMoment.year(), toMoment.month() + 1, toMoment.date());
    } else {
      component.toDate = Helper.getCurrentNgbDate();
    }
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = toMoment.format(DateTimeFormat.TIME_FORMAT);
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;
    component.filterTimeWithAllowanceModel.aaTime = 10;
    component.filterTimeWithAllowanceModel.paTime = 20;
    component.filterTimeWithAllowanceModel.saTime = 30;
    component.tooltip.element = mockElementRef;

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate invalid setting time', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    const toMoment = moment(currentMoment).add(1, 'hour');
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = toMoment.format(DateTimeFormat.TIME_FORMAT);
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;
    component.filterTimeWithAllowanceModel.aaTime = 10;
    component.filterTimeWithAllowanceModel.paTime = null;
    component.filterTimeWithAllowanceModel.saTime = 30;
    component.tooltip.element = mockElementRef;

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });
});
