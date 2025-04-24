import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { TvDetectionComponent } from './tv-detection.component';
import { TvDetectionService } from './tv-detection.service';
import { TvDetectionModel } from './tv-detection.model';
import { TvDetectionType } from '../../../../../utility/constants/config';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import moment from 'moment-timezone';

describe('TvDetectionComponent', () => {
  let component: TvDetectionComponent;
  let fixture: ComponentFixture<TvDetectionComponent>;
  let tvDetectionService: TvDetectionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [TvDetectionService]
    }).compileComponents();

    fixture = TestBed.createComponent(TvDetectionComponent);
    tvDetectionService = fixture.debugElement.injector.get(TvDetectionService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when tvDetectionValue is not SLOW or FAST', () => {
    // Arrange
    component.model = new TvDetectionModel();
    component.model.tvDetectionValue = TvDetectionType.NONE;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.isCheckedTvDetection).toBeFalsy();
    expect(component.model.tvDetectionValue).toBe(TvDetectionType.NONE);
  });

  it('should initialize with correct values when tvDetectionValue is SLOW', () => {
    // Arrange
    component.model = new TvDetectionModel();
    component.model.tvDetectionValue = TvDetectionType.SLOW;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.isCheckedTvDetection).toBeTruthy();
  });

  it('should initialize with correct values when tvDetectionValue is FAST', () => {
    // Arrange
    component.model = new TvDetectionModel();
    component.model.tvDetectionValue = TvDetectionType.FAST;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.isCheckedTvDetection).toBeTruthy();
  });

  it('should change tvDetection value when checkbox is checked', () => {
    // Act
    component.changeTvDetection(true);

    // Assert
    expect(component.model.tvDetectionValue).toBe(TvDetectionType.SLOW);
  });

  it('should change tvDetection value when checkbox is unchecked', () => {
    // Act
    component.changeTvDetection(false);

    // Assert
    expect(component.model.tvDetectionValue).toBe(TvDetectionType.NONE);
  });

  it('should initialize default values correctly', () => {
    // Act
    component.initDefaultValues();

    // Assert
    const currentMoment = moment.utc().tz('America/Caracas');
    expect(component.model.serviceAcceptTime).toBe(currentMoment.format(DateTimeFormat.SIMPLE_TIME_FORMAT));
    expect(component.model.actualTime).toBe(currentMoment.format(DateTimeFormat.SIMPLE_TIME_FORMAT));
    expect(component.model.tvDetectionValue).toBe(TvDetectionType.NONE);
    expect(component.model.minuteOffset).toBe('0');
    expect(component.model.secondOffset).toBe('0');
    expect(component.isCheckedTvDetection).toBeFalsy();
  });

  it('should update actual time when minute input is valid', () => {
    // Arrange
    component.model.minuteOffset = '5';
    jest.spyOn(tvDetectionService, 'isValidityMinute').mockReturnValue(true);
    jest.spyOn(tvDetectionService, 'getActualTime').mockReturnValue('12:00:00');
    jest.spyOn(component.actualTimeChange, 'emit');

    // Act
    component.changeMinuteInput();

    // Assert
    expect(tvDetectionService.isValidityMinute).toHaveBeenCalled();
    expect(component.actualTimeChange.emit).toHaveBeenCalledWith('12:00:00');
  });

  it('should update actual time when second input is valid', () => {
    // Arrange
    component.model.secondOffset = '30';
    jest.spyOn(tvDetectionService, 'isValiditySecond').mockReturnValue(true);
    jest.spyOn(tvDetectionService, 'getActualTime').mockReturnValue('12:00:30');
    jest.spyOn(component.actualTimeChange, 'emit');

    // Act
    component.changeSecondInput();

    // Assert
    expect(tvDetectionService.isValiditySecond).toHaveBeenCalled();
    expect(component.actualTimeChange.emit).toHaveBeenCalledWith('12:00:30');
  });

  it('should update actual time when time input is valid', () => {
    // Arrange
    const time = '12:00:00';
    const className = 'test-class';
    jest.spyOn(tvDetectionService, 'isValidityTime').mockReturnValue(true);
    jest.spyOn(tvDetectionService, 'getActualTime').mockReturnValue(time);
    jest.spyOn(component.actualTimeChange, 'emit');

    // Act
    component.changeTimeInput(time, className);

    // Assert
    expect(tvDetectionService.isValidityTime).toHaveBeenCalledWith(time, className, component.tooltip);
    expect(component.actualTimeChange.emit).toHaveBeenCalledWith(time);
  });

  it('should validate model correctly', () => {
    // Arrange
    jest.spyOn(tvDetectionService, 'isValid').mockReturnValue(true);

    // Act
    const result = component.isValid();

    // Assert
    expect(tvDetectionService.isValid).toHaveBeenCalledWith(component.model, component.tooltip);
    expect(result).toBeTruthy();
  });

  it('should update actual time when time is valid', () => {
    // Arrange
    const validTime = '12:00:00';
    jest.spyOn(tvDetectionService, 'getActualTime').mockReturnValue(validTime);
    jest.spyOn(component.actualTimeChange, 'emit');

    // Act
    component.updateActualTime();

    // Assert
    expect(component.actualTimeChange.emit).toHaveBeenCalledWith(validTime);
  });

  it('should not update actual time when time is invalid', () => {
    // Arrange
    const invalidTime = 'invalid-time';
    jest.spyOn(tvDetectionService, 'getActualTime').mockReturnValue(invalidTime);
    jest.spyOn(component.actualTimeChange, 'emit');

    // Act
    component.updateActualTime();

    // Assert
    expect(component.actualTimeChange.emit).not.toHaveBeenCalled();
  });
}); 