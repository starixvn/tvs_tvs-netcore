import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { EventDateFilterComponent } from './event-date-filter.component';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { StaticService } from '../../../../../utility/services/static.service';
import { LABELS } from '../../../../../utility/constants/labels';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import moment from 'moment-timezone';
import { EventEmitter } from '@angular/core';

class Helper {
  static readonly fakeAbnormalAccountModel = {
    fromDate: '2024-03-20',
    toDate: '2024-03-21'
  } as AbnormalAccountModel;
}

describe('EventDateFilterComponent', () => {
  let component: EventDateFilterComponent;
  let fixture: ComponentFixture<EventDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [StaticService]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDateFilterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    const currentMoment = moment.utc().tz('America/Caracas');

    // Act
    component.ngOnInit();

    // Assert
    expect(component.fromDate).toEqual(new NgbDate(currentMoment.year(), currentMoment.month() + 1, currentMoment.date()));
    expect(component.toDate).toEqual(new NgbDate(currentMoment.year(), currentMoment.month() + 1, currentMoment.date()));
  });

  it('should initialize with existing values when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.fromDate).toEqual(new NgbDate(2024, 3, 20));
    expect(component.toDate).toEqual(new NgbDate(2024, 3, 21));
  });

  it('should validate event date when fromDate is before toDate', () => {
    // Arrange
    component.fromDate = new NgbDate(2024, 3, 20);
    component.toDate = new NgbDate(2024, 3, 21);
    component.abnormalAccountModel = new AbnormalAccountModel();

    // Act
    const result = component.isValidEventDate();

    // Assert
    expect(result).toBeTruthy();
    expect(component.abnormalAccountModel.fromDate).toBe('2024/03/20');
    expect(component.abnormalAccountModel.toDate).toBe('2024/03/21');
  });

  it('should validate event date when fromDate is same as toDate', () => {
    // Arrange
    component.fromDate = new NgbDate(2024, 3, 20);
    component.toDate = new NgbDate(2024, 3, 20);
    component.abnormalAccountModel = new AbnormalAccountModel();

    // Act
    const result = component.isValidEventDate();

    // Assert
    expect(result).toBeTruthy();
    expect(component.abnormalAccountModel.fromDate).toBe('2024/03/20');
    expect(component.abnormalAccountModel.toDate).toBe('2024/03/20');
  });

  it('should validate event date when toDate is not set', () => {
    // Arrange
    component.fromDate = new NgbDate(2024, 3, 20);
    component.toDate = null;
    component.abnormalAccountModel = new AbnormalAccountModel();

    // Act
    const result = component.isValidEventDate();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show tooltip when fromDate is after toDate', () => {
    // Arrange
    component.fromDate = new NgbDate(2024, 3, 21);
    component.toDate = new NgbDate(2024, 3, 20);
    component.abnormalAccountModel = new AbnormalAccountModel();
    component.tooltip.display = jest.fn();

    // Act
    const result = component.isValidEventDate();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('to-date', LABELS.INVALID_TO_DATE);
  });

  it('should emit change filter event', () => {
    // Arrange
    component.changeFilterEvent = { emit: jest.fn() } as unknown as EventEmitter<void>;

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });
});
