import { GroupLicensee, GroupLicenseeModel } from "../../../../../utility/components/licensees/licensees.model";
import { MultipleSelection } from "../../../../../utility/components/multiple-selection/multiple-selection";
import { Tooltip } from "../../../../../utility/components/tooltip/tooltip.model";
import { Currency } from "../../../../../utility/models/currency.model";
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from "../../../../../utility/models/match.model";
import { FilterModel } from "../../filter/filter.model";
import { WrongOfferedNameModel } from '../../models/event-wrong-offered-name.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { FilterWrongOfferedNameService } from "./filter-wrong-offered-name.service";
import { ValidationService } from "./validation.service";

class Helper {
  static readonly fakeWrongOfferedNameModel: WrongOfferedNameModel = {
    currencyIds: '1,2',
    licenseeNames: 'licensee1,licensee2',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    match: new MatchModel(),
    subIssueTypeId: 1
  } as WrongOfferedNameModel;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '26',
    subIssueTypeId: '1',
    action: '5'
  } as FilterModel;
  static readonly fakeLogInfoWrongOfferedName: LogInfoWrongOfferedName = {
    matchId: 1,
    filterWrongOfferedName: new FilterWrongOfferedNameModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
  } as LogInfoWrongOfferedName;
  static readonly fakeFilterWrongOfferedName: FilterWrongOfferedNameModel = {
    currencyIds: [],
    licenseeNames: []
  } as FilterWrongOfferedNameModel;
}

describe('FilterWrongOfferedNameService', () => {
  let mockValidationService: ValidationService;
  let mockService: FilterWrongOfferedNameService;

  beforeEach(() => {
    mockValidationService = new ValidationService(null);
    mockService = new FilterWrongOfferedNameService(mockValidationService);
  });

  it('renderGroupLicensees should call #renderGroupLicenseesWhenEditRequest', async () => {
    const groupLicenseeModel = new GroupLicenseeModel([], false);
    mockService.renderGroupLicenseesWhenEditRequest = jest.fn().mockReturnValue(groupLicenseeModel);

    const actual = mockService.renderGroupLicensees(true, [], Helper.fakeFilterWrongOfferedName, Helper.fakeFilterModel);

    expect(mockService.renderGroupLicenseesWhenEditRequest).toHaveBeenCalledTimes(1);
    expect(actual).toEqual(groupLicenseeModel);
  });

  it('renderGroupLicensees should call #autoCheckLicensees', async () => {
    const groupLicenseeModel = new GroupLicenseeModel([], false);
    mockService.autoCheckLicensees = jest.fn().mockReturnValue(groupLicenseeModel);

    const actual = mockService.renderGroupLicensees(false, [], Helper.fakeFilterWrongOfferedName, Helper.fakeFilterModel);

    expect(mockService.autoCheckLicensees).toHaveBeenCalledTimes(1);
    expect(actual).toEqual(groupLicenseeModel);
  });

  it('renderCurrency should call #initMultiSelectCurrencyWhenEditRequest', async () => {
    const multipleSelection = new MultipleSelection();
    mockService['initMultiSelectCurrencyWhenEditRequest'] = jest.fn().mockReturnValue(multipleSelection);

    const actual = mockService.renderCurrency(true, [], Helper.fakeFilterWrongOfferedName, Helper.fakeFilterModel);

    expect(mockService['initMultiSelectCurrencyWhenEditRequest']).toHaveBeenCalledTimes(1);
    expect(actual).toEqual(multipleSelection);
  });

  it('renderCurrency should call #autoCheckCurrency', async () => {
    const multipleSelection = new MultipleSelection();
    mockService.autoCheckCurrency = jest.fn().mockReturnValue(multipleSelection);

    const actual = mockService.renderCurrency(false, [], Helper.fakeFilterWrongOfferedName, Helper.fakeFilterModel);

    expect(mockService.autoCheckCurrency).toHaveBeenCalledTimes(1);
    expect(actual).toEqual(multipleSelection);
  });

  it('renderGroupLicenseesWhenEditRequest should return GroupLicenseeModel', async () => {
    const filter = new FilterWrongOfferedNameModel();
    filter.licenseeNames = ['licensee1'];
    const originalGroupLicensees = [{ groupName: 'group1', licensees: [{ name: 'licensee1' }] }] as GroupLicensee[];
    const groupLicenseeModel = new GroupLicenseeModel(originalGroupLicensees, false);
    groupLicenseeModel.checkLicenseesByName(filter.licenseeNames);

    const actual = mockService.renderGroupLicenseesWhenEditRequest(originalGroupLicensees, filter);

    expect(actual).toEqual(groupLicenseeModel);
  });

  it('autoCheckLicensees should return GroupLicenseeModel with check all licensees group "China rules" only', async () => {
    const filterRequest = { subIssueTypeId: '127' } as FilterModel;
    const filter = new FilterWrongOfferedNameModel();
    const originalGroupLicensees = [
      { groupName: 'China rules', licensees: [{ name: 'licensee1' }] },
      { groupName: 'Vietnam rules', licensees: [{ name: 'licensee2' }] }
    ] as GroupLicensee[];
    const groupLicenseeModel = new GroupLicenseeModel(originalGroupLicensees, false);
    groupLicenseeModel.checkLicenseesByName(filter.licenseeNames);
    mockValidationService.isSubTypeChinese = jest.fn().mockReturnValue(true);

    const actual = mockService.autoCheckLicensees(originalGroupLicensees, filter, filterRequest);

    expect(actual.groupLicensees.find(x => x.groupName === 'China rules').licensees.every(x => x.isChecked)).toBeTruthy();
    expect(actual.groupLicensees.find(x => x.groupName === 'Vietnam rules').licensees.every(x => x.isChecked)).toBeFalsy();
  });

  it('autoCheckLicensees should return GroupLicenseeModel with check all licensees', async () => {
    const filterRequest = { subIssueTypeId: '1' } as FilterModel;
    const filter = new FilterWrongOfferedNameModel();
    const originalGroupLicensees = [
      { groupName: 'Manila rules', licensees: [{ name: 'licensee1' }] },
      { groupName: 'Laos rules', licensees: [{ name: 'licensee2' }] }
    ] as GroupLicensee[];
    const groupLicenseeModel = new GroupLicenseeModel(originalGroupLicensees, false);
    groupLicenseeModel.checkLicenseesByName(filter.licenseeNames);
    mockValidationService.isSubTypeChinese = jest.fn().mockReturnValue(false);

    const actual = mockService.autoCheckLicensees(originalGroupLicensees, filter, filterRequest);

    expect(actual.groupLicensees.find(x => x.groupName === 'Manila rules').licensees.every(x => x.isChecked)).toBeTruthy();
    expect(actual.groupLicensees.find(x => x.groupName === 'Laos rules').licensees.every(x => x.isChecked)).toBeTruthy();
  });

  it('autoCheckCurrency should call #isAutoCheckedCurrency & checked all currencies', async () => {
    const filterRequest = { subIssueTypeId: '127' } as FilterModel;
    const filter = new FilterWrongOfferedNameModel();
    const originalCurrencies = [
      { currencyCode: 'Code1', id: 1 },
      { currencyCode: 'Code2', id: 2 },
    ] as Currency[];
    mockService['isAutoCheckedCurrency'] = jest.fn().mockReturnValue(true);

    const actual = mockService.autoCheckCurrency(originalCurrencies, filter, filterRequest);

    expect(mockService['isAutoCheckedCurrency']).toHaveBeenCalledTimes(originalCurrencies.length);
    expect(actual.items.every(x => x.checked)).toBeTruthy();
  });

  it('isValidity should return false when currencyIds = []', async () => {
    const filter = new FilterWrongOfferedNameModel();
    const tooltip = new Tooltip();
    filter.currencyIds = [];
    tooltip.display = jest.fn();

    const actual = mockService.isValidity(filter, tooltip);

    expect(tooltip.display).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('isValidity should return false when licenseeNames = []', async () => {
    const filter = new FilterWrongOfferedNameModel();
    const tooltip = new Tooltip();
    filter.currencyIds = ['1', '2'];
    filter.licenseeNames = [];
    tooltip.display = jest.fn();

    const actual = mockService.isValidity(filter, tooltip);

    expect(tooltip.display).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('isValidity should return true', async () => {
    const filter = new FilterWrongOfferedNameModel();
    const tooltip = new Tooltip();
    filter.currencyIds = ['1', '2'];
    filter.licenseeNames = ['1', '2'];

    const actual = mockService.isValidity(filter, tooltip);

    expect(actual).toBeTruthy();
  });

  it('initMultiSelectCurrencyWhenEditRequest should call #initMultiSelectCurrency', async () => {
    const filter = new FilterWrongOfferedNameModel();
    const multipleSelectCurrency = new MultipleSelection();
    const originalCurrencies = [
      { currencyCode: 'Code1', id: 1 },
      { currencyCode: 'Code2', id: 2 },
    ] as Currency[];
    filter.currencyIds = ['1', '2'];
    mockService['initMultiSelectCurrency'] = jest.fn().mockReturnValue(multipleSelectCurrency);
    const actual = mockService['initMultiSelectCurrencyWhenEditRequest'](originalCurrencies, filter);

    expect(mockService['initMultiSelectCurrency']).toHaveBeenCalledTimes(1);
    expect(actual).toEqual(multipleSelectCurrency);
  });

  it('isAutoCheckedCurrency should call #validationService.isSubTypeChinese and return true', async () => {
    [
      { isSubTypeChinese: true, currencyId: 13, expected: true },
      { isSubTypeChinese: true, currencyId: 1, expected: false },
      { isSubTypeChinese: false, currencyId: 13, expected: false },
      { isSubTypeChinese: false, currencyId: 1, expected: true }
    ].forEach(item => {
      mockValidationService.isSubTypeChinese = jest.fn().mockReturnValue(item.isSubTypeChinese);
      const actual = mockService['isAutoCheckedCurrency'](item.currencyId, '1');

      expect(mockValidationService.isSubTypeChinese).toHaveBeenCalledTimes(1);
      expect(actual).toBe(item.expected);
    });
  });
});
