import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { ValidationService } from '../services/validation.service';
import { FilterWrongOddsComponent } from './filter-wrong-odds.component';
import { CalculateOddsService } from '../services/calculate-odds.service';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterWrongOddsModel: FilterWrongOddsModel = {
    filterFromTransTime: Helper.fromDate,
    filterToTransTime: Helper.toDate,
    favoriteValue: '1',
    filterFavoriteType: 'h',
    liveIndicator: 1,
    spread: '0.2',
    maxBet: 0,
    allowanceRate: '20',
    correctOddsHomeOver: '0.8',
    correctOddsAwayUnder: '0.9',
    fromOddsNotVoidHomeOver: '0.65',
    toOddsNotVoidHomeOver: '0.85',
    fromOddsNotVoidAwayUnder: '0.5',
    toOddsNotVoidAwayUnder: '0.9',
    maxBetAndSpreadInfo: []
  };
}

describe('FilterWrongOddsComponent', () => {
  let component: FilterWrongOddsComponent;
  let calculateOddsService: CalculateOddsService;
  let validationService: ValidationService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    component = new FilterWrongOddsComponent(null, null, null);
    expect(component).toBeTruthy();
  });

  it('#changeFilter should emit #changeFilterEvent', async () => {
    const fakeEventChangeFilterEvent = jest.fn().mockReturnValue(false); 
    component = new FilterWrongOddsComponent(null, null, null);
    component.changeFilterEvent.emit = fakeEventChangeFilterEvent;
    component.changeFilter();

    expect(fakeEventChangeFilterEvent).toHaveBeenCalledTimes(1);
  });

  it('#getDurationTime should return expected', async () => {
    component = new FilterWrongOddsComponent(null, null, null);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);

    const actual = component.getDurationTime();

    expect(actual).toBe('4320m0s');
  });

  it('#isCorrectFormatSingleDecimal should return true', async () => {
    component = new FilterWrongOddsComponent(null, null, null);
    component.filterWrongOddsModel = new FilterWrongOddsModel();

    const actual = component.isCorrectFormatSingleDecimal('1', '');

    expect(actual).toBeTruthy();
  });

  it('#isSubTypeOuOr1stOu should return true', async () => {
    const mockIsSubTypeOuOr1stOu = jest.fn().mockImplementation(() => true);
    validationService = new ValidationService();
    validationService.isSubTypeOuOr1stOu = mockIsSubTypeOuOr1stOu;
    component = new FilterWrongOddsComponent(null, validationService, null);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;

    const actual = component['isSubTypeOuOr1stOu']();

    expect(mockIsSubTypeOuOr1stOu).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#isValid should return true', async () => {
    component = new FilterWrongOddsComponent(null, null, null);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    component['isValidDateTime'] = jest.fn().mockImplementation(() => true);
    component['isValidFilter'] = jest.fn().mockImplementation(() => true);
    const actual = component.isValid();

    expect(actual).toBeTruthy();
  });

  it('#isValidFilter should return true', async () => {
    const mockIsValidFilterWrongOdds = jest.fn().mockImplementation(() => true);
    validationService = new ValidationService();
    validationService.isValidFilterWrongOdds = mockIsValidFilterWrongOdds;
    component = new FilterWrongOddsComponent(null, validationService, null);
    const actual = component['isValidFilter']();

    expect(mockIsValidFilterWrongOdds).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#isValidDateTime should return true', async () => {
    const mockIsFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => true);
    validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = mockIsFromTimeSameOrBeforeToTime;
    component = new FilterWrongOddsComponent(null, validationService, null);
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    const actual = component['isValidDateTime']();

    expect(mockIsFromTimeSameOrBeforeToTime).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#isValidFilterCorrectOdds should return true', async () => {
    const mockFunction = jest.fn().mockImplementation(() => true);
    validationService = new ValidationService();
    validationService.isValidFilterCorrectOdds = mockFunction;
    component = new FilterWrongOddsComponent(null, validationService, null);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    
    const actual = component.isValidFilterCorrectOdds();

    expect(actual).toBeTruthy();
  });

  it('#changeCorrectOdds not validFilterCorrectOdds should update correctOddsAwayUnder is Empty', async () => {
    calculateOddsService = new CalculateOddsService(null);
    const mockUpdateCorrectOddsAwayUnder = jest.fn();
    calculateOddsService.updateCorrectOddsAwayUnder = mockUpdateCorrectOddsAwayUnder;
    component = new FilterWrongOddsComponent(null, null, calculateOddsService);
    component['isValidFilterCorrectOdds'] = jest.fn().mockReturnValue(false);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    component.filterWrongOddsModel.correctOddsAwayUnder = "0.9";
    component.changeCorrectOdds();

    expect(component.filterWrongOddsModel.correctOddsAwayUnder).toBe('');
    expect(mockUpdateCorrectOddsAwayUnder).toHaveBeenCalledTimes(0);
  });

  it('#changeCorrectOdds validFilterCorrectOdds should called updateCorrectOddsAwayUnder', async () => {
    calculateOddsService = new CalculateOddsService(null);
    const mockUpdateCorrectOddsAwayUnder = jest.fn();
    calculateOddsService.updateCorrectOddsAwayUnder = mockUpdateCorrectOddsAwayUnder;
    component = new FilterWrongOddsComponent(null, null, calculateOddsService);
    component['isValidFilterCorrectOdds'] = jest.fn().mockReturnValue(true);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    component.changeCorrectOdds();

    expect(mockUpdateCorrectOddsAwayUnder).toHaveBeenCalledTimes(1);
  });
 
  it('#isValidSpread should return true', async () => {
    const mockIsValidSpread = jest.fn().mockReturnValue(true);
    validationService = new ValidationService();
    validationService.isValidSpread = mockIsValidSpread;
    component = new FilterWrongOddsComponent(null, validationService, null);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    const actual = component['isValidSpread']();

    expect(mockIsValidSpread).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#changeSpread isValidSpread should updateAllowanceRate and updateCorrectOddsAwayUnder', async () => {
    const mockUpdateAllowanceRate = jest.fn();
    const mockUpdateCorrectOddsAwayUnder = jest.fn();
    calculateOddsService = new CalculateOddsService(null);
    calculateOddsService.updateAllowanceRate = mockUpdateAllowanceRate;
    calculateOddsService.updateCorrectOddsAwayUnder = mockUpdateCorrectOddsAwayUnder;
    component = new FilterWrongOddsComponent(null, null, calculateOddsService);
    component.isValidSpread = jest.fn().mockReturnValue(true);

    component.changeSpread();

    expect(mockUpdateAllowanceRate).toHaveBeenCalledTimes(1);
    expect(mockUpdateCorrectOddsAwayUnder).toHaveBeenCalledTimes(1);
  });
});