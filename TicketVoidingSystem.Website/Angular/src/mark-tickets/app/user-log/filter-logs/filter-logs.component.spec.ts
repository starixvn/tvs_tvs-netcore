import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupBetTypesModel } from '../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { Selection } from '../../../../utility/models/selection.model';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { CommonService } from '../../../../utility/services/common.service';
import { GetLogsQuery } from '../../models/query.model';
import { CheckValidateService } from '../../services/check-validate.service';
import { FilterLogsComponent } from './filter-logs.component';
import { FilterAction, FilterDate } from './filter-logs.model';

class Helper {
  static readonly matchIdSelector = 'input.match-id';
  static readonly filterActionList: Selection[] = [
    { name: 'Mark(Manual)', value: '90500', group: 'All' },
    { name: 'Mark(Auto)', value: '90508', group: 'All' },
    { name: 'Mark(V.Winning)', value: '90509', group: 'All' },
    { name: 'Unmark(Manual)', value: '90501', group: 'All' },
    { name: 'Unmark(Auto)', value: '90510', group: 'All' },
    { name: 'Unmark All', value: '90502', group: 'All' }
  ];

  static getFakeErrorGroupBetTypesModel(): GroupBetTypesModel {
    const model = new GroupBetTypesModel([], null);
    model.result = { errorCode: 1, errorMsg: 'errorABC' };
    return model;
  }
}

describe('FilterLogsComponent', () => {
  let component: FilterLogsComponent;
  let fixture: ComponentFixture<FilterLogsComponent>;
  let checkValidateService: CheckValidateService;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        FormsModule,
        NgbModule,
        NgSelectModule
      ],
      providers: [
        CheckValidateService,
        CommonService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterLogsComponent);
    checkValidateService = fixture.debugElement.injector.get(CheckValidateService);
    commonService = fixture.debugElement.injector.get(CommonService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange & Act
    fixture.detectChanges();

    // Assert
    expect(component.model).toStrictEqual(new GetLogsQuery());
    expect(component.action).toStrictEqual(new FilterAction());
    expect(component.tooltip.element).toBeInstanceOf(ElementRef);
    expect(component.isSuccessMatch).toBe(true);
    expect(component.selectedActions).toStrictEqual(['90500', '90508', '90501', '90511', '90502', '90504']);
    
    const date = new Date();
    expect(component.date.ngbFromDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    expect(component.date.ngbToDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    expect(component.minDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate() - 7));
  });

  it('should update model.matchId when match id input value changes', () => {
    // Arrange
    fixture.detectChanges();
    const matchId = '1222';
    const matchIdInput = fixture.debugElement.query(By.css(Helper.matchIdSelector));

    // Act
    matchIdInput.nativeElement.value = matchId;
    matchIdInput.triggerEventHandler('input', { target: matchIdInput.nativeElement });

    // Assert
    expect(component.model.matchId).toBe(matchId);
  });

  it('should call checkValidMatch and not display tooltip when matchId input blur', async () => {
    // Arrange
    const mockGetGroupBetTypes = jest.fn();
    const matchIdInput = fixture.debugElement.query(By.css(Helper.matchIdSelector));
    const spyCheckValidMatch = jest.spyOn(component, 'checkValidMatch');
    jest.spyOn(commonService, 'getGroupBetTypes').mockImplementation(mockGetGroupBetTypes);

    // Act
    matchIdInput.nativeElement.value = '';
    matchIdInput.triggerEventHandler('input', { target: matchIdInput.nativeElement });
    matchIdInput.triggerEventHandler('blur', {});

    // Assert
    expect(spyCheckValidMatch).toHaveBeenCalledTimes(1);
    expect(mockGetGroupBetTypes).not.toHaveBeenCalled();
    expect(component.isSuccessMatch).toBe(true);
  });

  it('should emit searchEvent when search is called with valid match', async () => {
    // Arrange
    component.model = new GetLogsQuery();
    component.action = new FilterAction();
    fixture.detectChanges();
    
    const spyGetParams = jest.spyOn(component as any, 'getParams');
    const spyEmit = jest.spyOn(component.searchEvent, 'emit');
    component.isSuccessMatch = true;
    
    // Khởi tạo date
    const date = new Date();
    component.date.ngbFromDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    component.date.ngbToDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

    // Act
    await component.search();

    // Assert
    expect(spyGetParams).toHaveBeenCalledTimes(1);
    expect(spyEmit).toHaveBeenCalledTimes(1);
  });

  it('should display tooltip when search is called with invalid match', async () => {
    // Arrange
    component.model = new GetLogsQuery();
    component.action = new FilterAction();
    component.selectedActions = [];
    component.tooltip.display = jest.fn();
    
    const date = new Date();
    component.date.ngbFromDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    component.date.ngbToDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    checkValidateService.checkValidMatch = jest.fn().mockResolvedValue(false);

    // Act
    await component.search();

    // Assert
    expect(component.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('should update isSuccessMatch to true when checkValidMatch is called with valid match', async () => {
    // Arrange
    component.model.matchId = '29';
    jest.spyOn(checkValidateService, 'checkValidMatch').mockResolvedValue(true);

    // Act
    await component.checkValidMatch();

    // Assert
    expect(component.isSuccessMatch).toBeTruthy();
  });

  it('should return correct params when getParams is called', () => {
    // Arrange
    const expected = new GetLogsQuery();
    expected.logActionIds = '';
    expected.logDateFrom = '2021/12/3';
    expected.logDateTo = '2021/12/5';
    expected.pageIndex = 0;
    expected.pageSize = 3000;

    component.model = new GetLogsQuery();
    component.date = new FilterDate();
    component.date.ngbFromDate = new NgbDate(2021, 12, 3);
    component.date.ngbToDate = new NgbDate(2021, 12, 5);
    component.selectedActions = [];

    // Act
    const actual = component['getParams']();

    // Assert
    expect(actual).toStrictEqual(expected);
  });
});