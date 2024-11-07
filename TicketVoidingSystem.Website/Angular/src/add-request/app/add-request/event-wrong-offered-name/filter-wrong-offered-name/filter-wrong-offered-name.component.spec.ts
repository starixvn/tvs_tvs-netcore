import { Licensee } from '../../../../../utility/components/licensees/licensees.model';
import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';
import { Currency } from '../../../../../utility/models/currency.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { AddRequestStore } from '../../add-request.store';
import { WrongOfferedNameModel } from '../../models/event-wrong-offered-name.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { EventWrongOfferedNameService } from '../services/event-wrong-offered-name.service';
import { FilterWrongOfferedNameService } from '../services/filter-wrong-offered-name.service';
import { ValidationService } from '../services/validation.service';
import { FilterWrongOfferedNameComponent } from './filter-wrong-offered-name.component';
class Helper {
  static readonly fakeWrongOfferedNameModel: WrongOfferedNameModel = {
    currencyIds: '1,2',
    licenseeNames: 'licensee1,licensee2',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    subIssueTypeId: 1
  } as WrongOfferedNameModel;
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

describe('FilterWrongOfferedNameComponent', () => {
  let mockComponent: FilterWrongOfferedNameComponent;
  let mockCommonService: CommonService;
  let mockAddRequestStore: AddRequestStore;
  let mockFilterService: FilterWrongOfferedNameService;
  let validationService: ValidationService;
  let eventWrongOfferedNameService: EventWrongOfferedNameService;

  beforeEach(() => {
    mockCommonService = new CommonService(null);
    mockAddRequestStore = new AddRequestStore();
    mockFilterService = new FilterWrongOfferedNameService(null);
    validationService = new ValidationService(null);
    eventWrongOfferedNameService = new EventWrongOfferedNameService(null, null, null, null, null);
    mockAddRequestStore.changeBlockingUiStatus = jest.fn();
    mockComponent = new FilterWrongOfferedNameComponent(null, mockCommonService, mockAddRequestStore,
      mockFilterService, validationService, eventWrongOfferedNameService);
  });

  it('FilterWrongOfferedNameComponent init should match snapshot', async () => {
    expect(mockComponent).toMatchSnapshot();
  });

  it('ngOnInit should call #renderGroupLicensees and #renderCurrency', async () => {
    mockComponent.renderCurrency = jest.fn();
    mockComponent.renderGroupLicensees = jest.fn();

    await mockComponent.ngOnInit();

    expect(mockComponent.renderCurrency).toHaveBeenCalledTimes(1);
    expect(mockComponent.renderGroupLicensees).toHaveBeenCalledTimes(1);
  });

  it('renderGroupLicensees should call #commonService.getGroupLicensees and #filterService.renderGroupLicensees', async () => {
    const groupLicensees = [{ name: 'licensee1' }, { name: 'licensee2' }];
    const groupLicenseeModel = { name: 'licensee1' };
    mockCommonService.getGroupLicensees = jest.fn().mockReturnValue(groupLicensees);
    mockFilterService.renderGroupLicensees = jest.fn().mockReturnValue(groupLicenseeModel);

    await mockComponent.renderGroupLicensees();

    expect(mockComponent.originalGroupLicensees).toBe(groupLicensees);
    expect(mockComponent.groupLicenseeModel).toBe(groupLicenseeModel);
    expect(mockCommonService.getGroupLicensees).toHaveBeenCalledTimes(1);
    expect(mockFilterService.renderGroupLicensees).toHaveBeenCalledTimes(1);
  });

  it('renderCurrency should call #commonService.getCurrencies and #filterService.renderCurrency', async () => {
    const currencies = [{ currencyCode: 'currency1' }, { currencyCode: 'currency2' }] as Currency[];
    const multipleSelectCurrency = { isCheckAll: true, items: [] } as MultipleSelection;
    mockCommonService.getCurrencies = jest.fn().mockReturnValue(currencies);
    mockFilterService.renderCurrency = jest.fn().mockReturnValue(multipleSelectCurrency);

    await mockComponent.renderCurrency();

    expect(mockComponent.originalCurrencies).toBe(currencies);
    expect(mockComponent.multipleSelectCurrency).toBe(multipleSelectCurrency);
    expect(mockCommonService.getCurrencies).toHaveBeenCalledTimes(1);
    expect(mockFilterService.renderCurrency).toHaveBeenCalledTimes(1);
  });

  it('isValidity should return result from #filterService.isValidity', async () => {
    [true, false].forEach((expected) => {
      mockFilterService.isValidity = jest.fn().mockReturnValue(expected);

      const actual = mockComponent.isValidity();

      expect(actual).toBe(expected);
    });
  });

  it('updateSelectedCurrency should update currencyIds', async () => {
    const selectedItems = ['1', '2'];

    mockComponent.updateSelectedCurrency(selectedItems);

    expect(mockComponent.model.currencyIds).toBe(selectedItems);
  });

  it('updateLicense should update currencyIds', async () => {
    const licensees = [{ name: 'Licensee1' }, { name: 'Licensee2' }] as Licensee[];

    mockComponent.updateLicense(licensees);

    expect(mockComponent.model.licenseeNames[0]).toBe(licensees.map(x => x.name)[0]);
    expect(mockComponent.model.licenseeNames[1]).toBe(licensees.map(x => x.name)[1]);
    expect(mockComponent.model.licenseeNames.length).toBe(licensees.length);
  });

  it('changeFilter should emit changeFilterEvent', async () => {
    mockComponent.changeFilterEvent.emit = jest.fn();
    mockComponent.changeFilter();

    expect(mockComponent.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });
});
