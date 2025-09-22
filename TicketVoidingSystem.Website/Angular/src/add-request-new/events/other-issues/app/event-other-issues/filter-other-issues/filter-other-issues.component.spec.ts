import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { CheckAddPermissionService } from '../../../../../services/check-permission.service';
import { FilterOtherIssuesModel } from '../models/filter-other-isssues.model';
import { ValidationService } from '../services/validation.service';
import { FilterOtherIssuesComponent } from './filter-other-issues.component';

class Helper {
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;

  static readonly fakeFilterOtherIssuesModel = {
    fromDateTime: new Date(),
    toDateTime: new Date(),
    matchId: 123,
    severity: 1
  } as unknown as FilterOtherIssuesModel;
}

describe('FilterOtherIssuesComponent', () => {
  let component: FilterOtherIssuesComponent;
  let fixture: ComponentFixture<FilterOtherIssuesComponent>;
  let validationService: ValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        CheckAddPermissionService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterOtherIssuesComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.model = Helper.fakeFilterOtherIssuesModel;
    component.filterModel = Helper.fakeFilterModel;
    component.isEdit = false;
    component.matchId = 123;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.model).toBeDefined();
    expect(component.filterModel).toBeDefined();
    expect(component.isEdit).toBeFalsy();
    expect(component.matchId).toBe(123);
  });

  it('should emit change filter event', () => {
    // Arrange
    const spy = jest.spyOn(component.changeFilterEvent, 'emit');

    // Act
    component.changeFilter();

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('should validate time range correctly', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    component.model = Helper.fakeFilterOtherIssuesModel;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeTruthy();
    expect(component.fromTimeComponent.validateWithTooltip).toHaveBeenCalled();
    expect(component.toTimeComponent.validateWithTooltip).toHaveBeenCalled();
    expect(validationService.isFromTimeSameOrBeforeToTime).toHaveBeenCalledWith(component.model, component.tooltip);
  });

  it('should return false when from time validation fails', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(false)
    } as any;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false when to time validation fails', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(false)
    } as any;

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false when time range validation fails', () => {
    // Arrange
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    component.model = Helper.fakeFilterOtherIssuesModel;
    jest.spyOn(validationService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(false);

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should emit refresh event', () => {
    // Arrange
    const spy = jest.spyOn(component.refreshEvent, 'emit');

    // Act
    component.emitRefreshEvent();

    // Assert
    expect(spy).toHaveBeenCalled();
  });
});
