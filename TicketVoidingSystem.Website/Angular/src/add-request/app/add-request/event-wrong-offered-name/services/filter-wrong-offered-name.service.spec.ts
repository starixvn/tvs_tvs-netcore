import { TestBed } from '@angular/core/testing';
import { FilterWrongOfferedNameService } from './filter-wrong-offered-name.service';
import { GroupLicensee, GroupLicenseeModel } from '../../../../../utility/components/licensees/licensees.model';
import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { Currency } from '../../../../../utility/models/currency.model';
import { FilterModel } from '../../filter/filter.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { ValidationService } from './validation.service';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { ItemsSelect } from '../../../../../utility/components/multiple-selection/items-select';
import { ElementRef } from '@angular/core';

describe('FilterWrongOfferedNameService', () => {
  let service: FilterWrongOfferedNameService;
  let validationService: ValidationService;
  let tooltip: Tooltip;

  const mockGroupLicensees = [
    {
      groupName: 'Group 1',
      licensees: [
        { id: 1, name: 'Licensee 1', isChecked: false },
        { id: 2, name: 'Licensee 2', isChecked: false }
      ],
      isChecked: false,
      isCollapse: false,
      checkedGroup: () => {},
      checkedLicensee: () => {}
    },
    {
      groupName: 'China rules',
      licensees: [
        { id: 3, name: 'Licensee 3', isChecked: false },
        { id: 4, name: 'Licensee 4', isChecked: false }
      ],
      isChecked: false,
      isCollapse: false,
      checkedGroup: () => {},
      checkedLicensee: () => {}
    }
  ] as GroupLicensee[];

  const mockCurrencies: Currency[] = [
    { id: 1, currencyCode: 'USD' },
    { id: 13, currencyCode: 'RMB' }
  ];

  const mockFilterWrongOfferedName = {
    currencyIds: [],
    licenseeNames: [],
    wrongName: '',
    actualName: '',
    wrongNameT: '',
    actualNameT: '',
    wrongNameS: '',
    actualNameS: '',
    wrongNameId: 0,
    actualNameId: 0
  } as FilterWrongOfferedNameModel;

  const mockFilterRequest = {
    subIssueTypeId: '1',
    action: '',
    isTest: false,
    isAbnormal: false,
    isVoided: false,
    actions: []
  } as FilterModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        FilterWrongOfferedNameService,
        ValidationService,
        {
          provide: Tooltip,
          useValue: {
            element: { nativeElement: document.createElement('div') } as ElementRef
          }
        },
        CheckAddPermissionService
      ]
    });
    service = TestBed.inject(FilterWrongOfferedNameService);
    validationService = TestBed.inject(ValidationService);
    tooltip = TestBed.inject(Tooltip);
    tooltip.display = jest.fn();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('renderGroupLicensees', () => {
    it('should call renderGroupLicenseesWhenEditRequest when isEdit is true', () => {
      const result = service.renderGroupLicensees(true, mockGroupLicensees, mockFilterWrongOfferedName, mockFilterRequest);
      expect(result).toBeInstanceOf(GroupLicenseeModel);
    });

    it('should call autoCheckLicensees when isEdit is false', () => {
      const result = service.renderGroupLicensees(false, mockGroupLicensees, mockFilterWrongOfferedName, mockFilterRequest);
      expect(result).toBeInstanceOf(GroupLicenseeModel);
    });
  });

  describe('renderCurrency', () => {
    it('should call initMultiSelectCurrencyWhenEditRequest when isEdit is true', () => {
      const result = service.renderCurrency(true, mockCurrencies, mockFilterWrongOfferedName, mockFilterRequest);
      expect(result).toBeInstanceOf(MultipleSelection);
    });

    it('should call autoCheckCurrency when isEdit is false', () => {
      const result = service.renderCurrency(false, mockCurrencies, mockFilterWrongOfferedName, mockFilterRequest);
      expect(result).toBeInstanceOf(MultipleSelection);
    });
  });

  describe('isValidity', () => {
    it('should return false when currencyIds is empty', () => {
      const filterWrongOfferedName = { ...mockFilterWrongOfferedName, currencyIds: [] };
      const result = service.isValidity(filterWrongOfferedName, tooltip);
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalled();
    });

    it('should return false when licenseeNames is empty', () => {
      const filterWrongOfferedName = { ...mockFilterWrongOfferedName, currencyIds: ['1'], licenseeNames: [] };
      const result = service.isValidity(filterWrongOfferedName, tooltip);
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalled();
    });

    it('should return true when both currencyIds and licenseeNames are not empty', () => {
      const filterWrongOfferedName = {
        ...mockFilterWrongOfferedName,
        currencyIds: ['1'],
        licenseeNames: ['Licensee 1']
      };
      const result = service.isValidity(filterWrongOfferedName, tooltip);
      expect(result).toBeTruthy();
      expect(tooltip.display).not.toHaveBeenCalled();
    });
  });

  describe('autoCheckLicensees', () => {
    it('should check China rules group when subIssueTypeId is Chinese', () => {
      const filterRequest = { ...mockFilterRequest, subIssueTypeId: 'CHINESE' };
      jest.spyOn(validationService, 'isSubTypeChinese').mockReturnValue(true);
      
      const result = service.autoCheckLicensees(mockGroupLicensees, mockFilterWrongOfferedName, filterRequest);
      const chinaRulesGroup = result.groupLicensees.find(x => x.groupName === 'China rules');
      
      expect(chinaRulesGroup?.isChecked).toBeTruthy();
      expect(validationService.isSubTypeChinese).toHaveBeenCalledWith('CHINESE');
    });

    it('should not check China rules group when subIssueTypeId is not Chinese', () => {
      jest.spyOn(validationService, 'isSubTypeChinese').mockReturnValue(false);
      
      const result = service.autoCheckLicensees(mockGroupLicensees, mockFilterWrongOfferedName, mockFilterRequest);
      const chinaRulesGroup = result.groupLicensees.find(x => x.groupName === 'China rules');
      
      expect(chinaRulesGroup?.isChecked).toBeTruthy();
      expect(validationService.isSubTypeChinese).toHaveBeenCalledWith('1');
    });
  });

  describe('autoCheckCurrency', () => {
    it('should check RMB when subIssueTypeId is Chinese', () => {
      const filterRequest = { ...mockFilterRequest, subIssueTypeId: 'CHINESE' };
      jest.spyOn(validationService, 'isSubTypeChinese').mockReturnValue(true);
      
      const result = service.autoCheckCurrency(mockCurrencies, mockFilterWrongOfferedName, filterRequest);
      const rmbItem = result.items.find(x => x.value === '13') as ItemsSelect;
      
      expect(rmbItem?.checked).toBeTruthy();
      expect(validationService.isSubTypeChinese).toHaveBeenCalledWith('CHINESE');
    });

    it('should check non-RMB currencies when subIssueTypeId is not Chinese', () => {
      jest.spyOn(validationService, 'isSubTypeChinese').mockReturnValue(false);
      
      const result = service.autoCheckCurrency(mockCurrencies, mockFilterWrongOfferedName, mockFilterRequest);
      const usdItem = result.items.find(x => x.value === '1') as ItemsSelect;
      const rmbItem = result.items.find(x => x.value === '13') as ItemsSelect;
      
      expect(usdItem?.checked).toBeTruthy();
      expect(rmbItem?.checked).toBeFalsy();
      expect(validationService.isSubTypeChinese).toHaveBeenCalledWith('1');
    });
  });
});
