import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterWrongOfferedNameComponent } from './filter-wrong-offered-name.component';
import { ValidationService } from '../services/validation.service';
import { FilterWrongOfferedNameService } from '../services/filter-wrong-offered-name.service';
import { CommonService } from '../../../../../../utility/services/common.service';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { MatchModel } from '../../../../../../utility/models/match.model';
import { SimpleChange } from '@angular/core';
import { GroupLicensee, GroupLicenseeModel, Licensee } from '../../../../../../utility/components/licensees/licensees.model';
import { Currency } from '../../../../../../utility/models/currency.model';
import { MultipleSelection } from '../../../../../../utility/components/multiple-selection/multiple-selection';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { CheckAddPermissionService } from '../../../../../services/check-permission.service';
import { EventWrongOfferedNameService } from '../services/event-wrong-offered-name.service';
import { AffectedTicketService } from '../../../../../component/affected-ticket/affected-ticket.service';

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

  static readonly fakeFilterWrongOfferedNameModel = new FilterWrongOfferedNameModel();
  
  static readonly fakeMatchModel = new MatchModel();

  static readonly fakeGroupLicensees: GroupLicensee[] = [
    {
      name: 'Test Licensee 1',
      isChecked: false
    },
    {
      name: 'Test Licensee 2',
      isChecked: false
    }
  ] as unknown as GroupLicensee[];

  static readonly fakeCurrencies: Currency[] = [
    {
      id: '1',
      name: 'USD',
      isChecked: false
    },
    {
      id: '2',
      name: 'EUR',
      isChecked: false
    }
  ] as unknown as Currency[];
}

describe('FilterWrongOfferedNameComponent', () => {
  let component: FilterWrongOfferedNameComponent;
  let fixture: ComponentFixture<FilterWrongOfferedNameComponent>;
  let validationService: ValidationService;
  let filterService: FilterWrongOfferedNameService;
  let commonService: CommonService;
  let addRequestStore: AddRequestStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        FilterWrongOfferedNameService,
        CommonService,
        AddRequestStore,
        CheckAddPermissionService,
        EventWrongOfferedNameService,
        AffectedTicketService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterWrongOfferedNameComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    filterService = fixture.debugElement.injector.get(FilterWrongOfferedNameService);
    commonService = fixture.debugElement.injector.get(CommonService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.model).toBeInstanceOf(FilterWrongOfferedNameModel);
    expect(component.filterModel).toBeInstanceOf(FilterModel);
    expect(component.groupLicenseeModel).toBeInstanceOf(GroupLicenseeModel);
    expect(component.multipleSelectCurrency).toBeInstanceOf(MultipleSelection);
    expect(component.tooltip).toBeInstanceOf(Tooltip);
  });

  it('should handle filter model changes', () => {
    // Arrange
    component.filterModel = Helper.fakeFilterModel;
    component.originalGroupLicensees = Helper.fakeGroupLicensees;
    component.originalCurrencies = Helper.fakeCurrencies;
    filterService.autoCheckLicensees = jest.fn().mockReturnValue(new GroupLicenseeModel([], false));
    filterService.autoCheckCurrency = jest.fn().mockReturnValue(new MultipleSelection());
    component.changeFilterEvent.emit = jest.fn();

    // Act
    component.ngOnChanges({
      filterModel: {
        currentValue: Helper.fakeFilterModel,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(filterService.autoCheckLicensees).toHaveBeenCalled();
    expect(filterService.autoCheckCurrency).toHaveBeenCalled();
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should initialize data on ngOnInit', async () => {
    // Arrange
    component.isEdit = false;
    addRequestStore.changeBlockingUiStatus = jest.fn();
    commonService.getGroupLicensees = jest.fn().mockResolvedValue(Helper.fakeGroupLicensees);
    commonService.getCurrencies = jest.fn().mockResolvedValue(Helper.fakeCurrencies);
    filterService.renderGroupLicensees = jest.fn().mockReturnValue(new GroupLicenseeModel([], false));
    filterService.renderCurrency = jest.fn().mockReturnValue(new MultipleSelection());

    // Act
    await component.ngOnInit();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
    expect(commonService.getGroupLicensees).toHaveBeenCalled();
    expect(commonService.getCurrencies).toHaveBeenCalled();
    expect(filterService.renderGroupLicensees).toHaveBeenCalled();
    expect(filterService.renderCurrency).toHaveBeenCalled();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
  });

  it('should update selected currency', () => {
    // Arrange
    const selectedItems = ['1', '2'];

    // Act
    component.updateSelectedCurrency(selectedItems);

    // Assert
    expect(component.model.currencyIds).toEqual(selectedItems);
  });

  it('should update license', () => {
    // Arrange
    const licensees = [
      { name: 'Licensee 1' },
      { name: 'Licensee 2' }
    ] as Licensee[];

    // Act
    component.updateLicense(licensees);

    // Assert
    expect(component.model.licenseeNames).toEqual(['Licensee 1', 'Licensee 2']);
  });

  it('should emit change filter event', () => {
    // Arrange
    component.changeFilterEvent.emit = jest.fn();

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should check if sub type is Chinese', () => {
    // Arrange
    component.filterModel = Helper.fakeFilterModel;
    validationService.isSubTypeChinese = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isSubTypeChinese();

    // Assert
    expect(validationService.isSubTypeChinese).toHaveBeenCalledWith(Helper.fakeFilterModel.subIssueTypeId);
    expect(result).toBeTruthy();
  });

  it('should check validity', () => {
    // Arrange
    filterService.isValidity = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isValidity();

    // Assert
    expect(filterService.isValidity).toHaveBeenCalledWith(component.model, component.tooltip);
    expect(result).toBeTruthy();
  });
});
