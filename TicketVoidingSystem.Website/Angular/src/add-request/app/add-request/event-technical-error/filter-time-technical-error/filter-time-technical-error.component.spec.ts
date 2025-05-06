import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterTimeTechnicalErrorComponent } from './filter-time-technical-error.component';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterTechnicalErrorModel } from '../models/filter-technical-error.model';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';

describe('FilterTimeTechnicalErrorComponent', () => {
  let component: FilterTimeTechnicalErrorComponent;
  let fixture: ComponentFixture<FilterTimeTechnicalErrorComponent>;
  let staticService: StaticService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [StaticService]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTimeTechnicalErrorComponent);
    staticService = fixture.debugElement.injector.get(StaticService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.filterTechnicalErrorModel).toBeInstanceOf(FilterTechnicalErrorModel);
    expect(component.isVoided).toBeUndefined();
  });

  it('should emit changeFilterEvent when changeFilter is called', () => {
    // Arrange
    component.changeFilterEvent.emit = jest.fn();

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should emit refreshEvent when emitRefreshEvent is called', () => {
    // Arrange
    component.refreshEvent.emit = jest.fn();

    // Act
    component.emitRefreshEvent();

    // Assert
    expect(component.refreshEvent.emit).toHaveBeenCalled();
  });

  it('should validate time range correctly', () => {
    // Arrange
    const fromTime = '2024-01-01T10:00:00';
    const toTime = '2024-01-01T11:00:00';
    component.filterTechnicalErrorModel.fromDateTime = fromTime;
    component.filterTechnicalErrorModel.toDateTime = toTime;
    component.fromTimeComponent = {
      validateWithTooltip: () => true
    } as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: () => true
    } as DateFullTimeNewComponent;
    StaticService.isFromTimeSameOrBeforeToTime = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeTruthy();
    expect(StaticService.isFromTimeSameOrBeforeToTime).toHaveBeenCalledWith(
      fromTime,
      toTime,
      component.tooltip,
      'from-date-time'
    );
  });

  it('should return false when from time validation fails', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: () => false
    } as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: () => true
    } as DateFullTimeNewComponent;

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false when to time validation fails', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: () => true
    } as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: () => false
    } as DateFullTimeNewComponent;

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false when time range is invalid', () => {
    // Arrange
    const fromTime = '2024-01-01T12:00:00';
    const toTime = '2024-01-01T11:00:00';
    component.filterTechnicalErrorModel.fromDateTime = fromTime;
    component.filterTechnicalErrorModel.toDateTime = toTime;
    component.fromTimeComponent = {
      validateWithTooltip: () => true
    } as DateFullTimeNewComponent;
    component.toTimeComponent = {
      validateWithTooltip: () => true
    } as DateFullTimeNewComponent;
    StaticService.isFromTimeSameOrBeforeToTime = jest.fn().mockReturnValue(false);

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeFalsy();
  });
});
