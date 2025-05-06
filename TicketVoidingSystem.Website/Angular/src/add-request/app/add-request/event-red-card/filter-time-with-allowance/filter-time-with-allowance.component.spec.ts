import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterTimeWithAllowanceComponent } from './filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from './filter-time-with-allowance.model';
import { DateTimeFormat, TimeZone } from '../../../../../utility/constants/config';
import moment from 'moment-timezone';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { ElementRef } from '@angular/core';

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
    component.fromTime = '10:00';
    component.toTime = '11:00';

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
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
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
    component.toTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
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
    component.fromTime = '25:00';
    component.toTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
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
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = currentMoment.add(1, 'hour').format(DateTimeFormat.TIME_FORMAT);
    component.tooltip.element = mockElementRef;
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;
    component.filterTimeWithAllowanceModel.fromDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.fromTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    component.filterTimeWithAllowanceModel.toDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.toTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate invalid time range', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.add(3, 'hours').format(DateTimeFormat.TIME_FORMAT);
    component.toTime = currentMoment.subtract(1, 'hour').format(DateTimeFormat.TIME_FORMAT);
    component.tooltip.element = mockElementRef;
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;
    component.filterTimeWithAllowanceModel.fromDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.fromTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    component.filterTimeWithAllowanceModel.toDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.toTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should calculate duration time correctly', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = currentMoment.add(1, 'hour').format(DateTimeFormat.TIME_FORMAT);
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;
    component.filterTimeWithAllowanceModel.fromDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.fromTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    component.filterTimeWithAllowanceModel.toDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.toTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    // Act
    const duration = component.getDurationTime();

    // Assert
    expect(duration).toBe('60m0s');
  });

  it('should emit change filter time event', () => {
    // Arrange
    const currentMoment = Helper.getCurrentMoment();
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = currentMoment.add(1, 'hour').format(DateTimeFormat.TIME_FORMAT);
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
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = currentMoment.add(1, 'hour').format(DateTimeFormat.TIME_FORMAT);
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
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = currentMoment.add(1, 'hour').format(DateTimeFormat.TIME_FORMAT);
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;
    component.filterTimeWithAllowanceModel.fromDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.fromTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    component.filterTimeWithAllowanceModel.toDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.toTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
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
    component.fromDate = Helper.getCurrentNgbDate();
    component.toDate = Helper.getCurrentNgbDate();
    component.fromTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    component.toTime = currentMoment.add(1, 'hour').format(DateTimeFormat.TIME_FORMAT);
    component.filterTimeWithAllowanceModel = Helper.fakeFilterTimeWithAllowance;
    component.filterTimeWithAllowanceModel.fromDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.fromTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    component.filterTimeWithAllowanceModel.toDateTime = moment(`${currentMoment.format('YYYY-MM-DD')} ${component.toTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
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
