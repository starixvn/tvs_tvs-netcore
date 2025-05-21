import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueryList, EventEmitter } from '@angular/core';
import { RangeTime } from '../../../../../mark-tickets/app/models/query.model';
import { CheckedBetType } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { BetType, GroupBetType, GroupBetTypesModel } from '../../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { GroupLicensee, GroupLicenseeModel, Licensee } from '../../../../../utility/components/licensees/licensees.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../../../utility/constants/labels';
import '../../../../../utility/extensions/string.extension';
import { Currency } from '../../../../../utility/models/currency.model';
import { FirstTicketTime } from '../../../../../utility/models/match.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { HttpService } from '../../../../../utility/services/http.service';
import { Currencies } from '../filter.model';
import { MatchIdComponent } from './match-id.component';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { AdvancedModeComponent } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { GroupBetTypesComponent } from '../../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';

class Helper {
  static readonly fakeFirstTicketTime: FirstTicketTime = {
    kickOffTime: '2020-03-12 06:59:59.000',
    minTransDate: '2019-08-12 09:35:06.980'
  };

  static readonly fakeCurrency: Currency[] = [
    {
      currencyCode: 'RMB',
      id: 13
    },
    {
      currencyCode: 'CY',
      id: 81
    },
    {
      currencyCode: 'UUS',
      id: 20
    },
    {
      currencyCode: 'AED',
      id: 90
    },
    {
      currencyCode: 'ARS',
      id: 86
    },
    {
      currencyCode: 'AUD',
      id: 9
    }
  ];

  static readonly fakeSelectedCurrency: number[] = [20,90,86,9];

  static readonly fakeCheckedBetType = { id: 7 } as CheckedBetType;

  static getGroupLicensee(): GroupLicensee[] {
    return [new GroupLicensee('China rules', [new Licensee(14, '368Cash', true)], true)];
  }

  static getGroupBetType(): GroupBetType {
    const betType = new BetType(7, '1H Handicap', false, 0, true);
    return new GroupBetType('1H', [betType], true);
  }

  static getGroupBetType216(): GroupBetType {
    const betType = new BetType(216, 'Goal Scorer - Anytime', false, 0, true);
    return new GroupBetType('1H', [betType], true);
  }
}

describe('MatchIdComponent', () => {
  let component: MatchIdComponent;
  let fixture: ComponentFixture<MatchIdComponent>;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        HttpService,
        CommonService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchIdComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    component = fixture.componentInstance;
    
    component.advancedModelComponent = {
      resetBetTeam: jest.fn(),
      validate: jest.fn(),
      getBetTypeModels: jest.fn()
    } as unknown as AdvancedModeComponent;
    
    component.groupBetTypesComponent = {
      validate: jest.fn()
    } as unknown as GroupBetTypesComponent;
    
    component.changeMatch = new EventEmitter<number>();
    jest.spyOn(component.changeMatch, 'emit');
    
    component.tooltip = {
      display: jest.fn()
    } as unknown as Tooltip;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize matchId as empty string', () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(component.model.matchId).toBe('');
    });
  });

  describe('addRangeTimes', () => {
    it('should add new range time and return 2 items', () => {
      // Act
      component.addRangeTimes();

      // Assert
      expect(component.rangeTimes.length).toBe(2);
    });

    it('should not add new range time when range time is invalid', () => {
      // Arrange
      component.rangeTimes = [new RangeTime()];
      component.rangeTimes[0].from = '';
      component.rangeTimes[0].to = '';

      // Act
      component.addRangeTimes();

      // Assert
      expect(component.rangeTimes.length).toBe(2);
    });
  });

  describe('removeRangeTimes', () => {
    it('should remove range time and return 1 item', () => {
      // Arrange
      component.addRangeTimes();

      // Act
      component.removeRangeTimes(1);

      // Assert
      expect(component.rangeTimes.length).toBe(1);
    });
  });

  describe('blurMatchId', () => {
    it('should call expected functions when matchId is valid', async () => {
      // Arrange
      component.model.matchId = '123456';
      component.preMatchId = '';
      component.getGroupBetTypes = jest.fn();
      component.setFromDate = jest.fn();

      // Act
      await component.blurMatchId();

      // Assert
      expect(component.getGroupBetTypes).toHaveBeenCalledTimes(1);
      expect(component.setFromDate).toHaveBeenCalledTimes(1);
      expect(component.advancedModelComponent.resetBetTeam).toHaveBeenCalledTimes(1);
    });

    it('should not call functions when matchId is invalid', async () => {
      // Arrange
      component.model.matchId = undefined;
      component.preMatchId = '';
      component.getGroupBetTypes = jest.fn();
      component.setFromDate = jest.fn();

      // Act
      await component.blurMatchId();

      // Assert
      expect(component.getGroupBetTypes).toHaveBeenCalledTimes(0);
      expect(component.setFromDate).toHaveBeenCalledTimes(0);
      expect(component.advancedModelComponent.resetBetTeam).toHaveBeenCalledTimes(0);
    });
  });

  describe('setFromDate', () => {
    it('should set correct from date', async () => {
      // Arrange
      commonService.getFirstTimeAndKickOffTime = jest.fn().mockImplementation(() => Helper.fakeFirstTicketTime);
      component.model.matchId = '123456';

      // Act
      await component.setFromDate();

      // Assert
      expect(component.rangeTimes[0].from).toBe('2019/08/12 09:35:06.980 AM');
    });

    it('should handle invalid date format', async () => {
      // Arrange
      const firstTicketTime = new FirstTicketTime();
      firstTicketTime.minTransDate = '0050/8/12 09:35:06.970 AM';
      firstTicketTime.kickOffTime = '0050/8/12 09:35:06.980 AM';
      commonService.getFirstTimeAndKickOffTime = jest.fn().mockImplementation(() => firstTicketTime);
      component.eventType.value = '1';
      component.model.matchId = '123456';

      // Act
      await component.setFromDate();

      // Assert
      expect(component.rangeTimes[0].from).toBe('0050/08/12 09:35:06.980 AM');
    });

    it('should handle null currentDate', async () => {
      // Arrange
      const firstTicketTime = new FirstTicketTime();
      firstTicketTime.minTransDate = null;
      firstTicketTime.kickOffTime = null;
      commonService.getFirstTimeAndKickOffTime = jest.fn().mockImplementation(() => firstTicketTime);
      component.eventType.value = '1';
      component.model.matchId = '123456';

      // Act
      await component.setFromDate();

      // Assert
      expect(component.rangeTimes[0].from).toBeDefined();
    });

    it('should handle null firstTime', async () => {
      // Arrange
      commonService.getFirstTimeAndKickOffTime = jest.fn().mockImplementation(() => null);
      component.eventType.value = '1';
      component.model.matchId = '123456';

      // Act
      await component.setFromDate();

      // Assert
      expect(component.rangeTimes[0].from).toBeDefined();
    });

    it('should handle empty matchId', async () => {
      // Arrange
      commonService.getFirstTimeAndKickOffTime = jest.fn().mockImplementation(() => null);
      component.eventType.value = '1';
      component.model.matchId = '';

      // Act
      await component.setFromDate();

      // Assert
      expect(component.rangeTimes[0].from).toBeDefined();
    });
  });

  describe('getGroupBetTypes', () => {
    it('should call handleGroupBetTypes with expected param', async () => {
      // Arrange
      const groupBetTypesModel = new GroupBetTypesModel([Helper.getGroupBetType()], true);
      commonService.getGroupBetTypes = jest.fn().mockImplementation(() => groupBetTypesModel);
      component.model.matchId = '123456';
      component.handleGroupBetTypes = jest.fn();

      // Act
      await component.getGroupBetTypes();

      // Assert
      expect(component.handleGroupBetTypes).toHaveBeenCalledWith(groupBetTypesModel);
    });
  });

  describe('handleGroupBetTypes', () => {
    it('should display tooltip for invalid match when no groupBetTypes', () => {
      // Arrange
      component.handleBetType216 = jest.fn();
      const groupBetTypesModel = new GroupBetTypesModel([], true);
      groupBetTypesModel.result = {
        errorCode: 0,
        errorMsg: ''
      };

      // Act
      component.handleGroupBetTypes(groupBetTypesModel);

      // Assert
      expect(component.tooltip.display).toHaveBeenCalledWith('match-id', LABELS.INVALID_MATCH);
      expect(component.isSuccessMatch).toBe(false);
      expect(component.changeMatch.emit).toHaveBeenCalledTimes(1);
      expect(component.handleBetType216).toHaveBeenCalledTimes(1);
      expect(component.allBetTypes.length).toBe(0);
    });

    it('should display tooltip for invalid match when data has error', () => {
      // Arrange
      component.handleBetType216 = jest.fn();
      const groupBetTypesModel = new GroupBetTypesModel([], true);
      groupBetTypesModel.result = {
        errorCode: 1,
        errorMsg: 'Error!'
      };

      // Act
      component.handleGroupBetTypes(groupBetTypesModel);

      // Assert
      expect(component.tooltip.display).toHaveBeenCalledWith('match-id', 'Error!');
      expect(component.isSuccessMatch).toBe(false);
      expect(component.changeMatch.emit).toHaveBeenCalledTimes(1);
      expect(component.handleBetType216).toHaveBeenCalledTimes(1);
      expect(component.allBetTypes.length).toBe(0);
    });

    it('should handle successful match', () => {
      // Arrange
      component.handleBetType216 = jest.fn();
      const groupBetTypesModel = new GroupBetTypesModel([Helper.getGroupBetType()], true);
      groupBetTypesModel.result = {
        errorCode: 0,
        errorMsg: ''
      };

      // Act
      component.handleGroupBetTypes(groupBetTypesModel);

      // Assert
      expect(component.isSuccessMatch).toBe(true);
      expect(component.changeMatch.emit).toHaveBeenCalledTimes(1);
      expect(component.handleBetType216).toHaveBeenCalledTimes(1);
      expect(component.allBetTypes.length).toBe(1);
    });
  });

  describe('handleBetType216', () => {
    it('should set getPlayerQuery data when betType216 exists', () => {
      // Arrange
      const groupBetTypesModel = new GroupBetTypesModel([Helper.getGroupBetType216()], true);
      component.groupBetTypes = groupBetTypesModel;
      component.model.matchId = '12345';

      // Act
      component.handleBetType216();

      // Assert
      expect(component.getPlayerQuery.matchId).toBe('12345');
      expect(component.getPlayerQuery.betType).toBe('216');
    });

    it('should not set getPlayerQuery data when betType216 does not exist', () => {
      // Arrange
      const groupBetTypesModel = new GroupBetTypesModel([], true);
      component.groupBetTypes = groupBetTypesModel;
      component.model.matchId = '12345';

      // Act
      component.handleBetType216();

      // Assert
      expect(component.getPlayerQuery).toBeUndefined();
    });
  });

  describe('changeBetTypes', () => {
    it('should update allBetTypes correctly', () => {
      // Arrange
      const betType = new BetType(1, 'Handicap', false, 0, true);

      // Act
      component.changeBetTypes([betType]);

      // Assert
      expect(component.allBetTypes.length).toBe(1);
      expect(component.allBetTypes[0]).toEqual(betType);
    });
  });

  describe('changeEventType', () => {
    it('should reset scores data', () => {
      // Arrange
      component.model.liveHomeScore = 1;
      component.model.liveAwayScore = 1;
      component.setFromDate = jest.fn();

      // Act
      component.changeEventType();

      // Assert
      expect(component.setFromDate).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCheckedLicensees', () => {
    it('should return expected licensees', () => {
      // Arrange
      component.groupLicenseeModel = new GroupLicenseeModel(Helper.getGroupLicensee(), true);
      component.groupLicenseeModel.getCheckedLicensees = jest.fn().mockReturnValue([{ name: '368Cash' }]);

      // Act
      const actual = component.getCheckedLicensees();

      // Assert
      expect(actual.length).toBe(1);
      expect(actual[0]).toBe('368Cash');
    });
  });

  describe('checkValidationOfMatch', () => {
    it('should return false and display tooltip when matchid is empty or undefined', () => {
      // Arrange
      component.tooltip.display = jest.fn();
      const testCases = ['', undefined];

      // Act & Assert
      for (const item of testCases) {
        component.model.matchId = item;
        const actual = component.checkValidationOfMatch();
        expect(actual).toBe(false);
        expect(component.tooltip.display).toHaveBeenCalledWith('match-id', LABELS.REQUIRED_MATCHID);
      }
    });

    it('should return false and display tooltip when isSuccessMatch is false', () => {
      // Arrange
      component.model.matchId = '12345';
      component.isSuccessMatch = false;
      component.tooltip.display = jest.fn();

      // Act
      const actual = component.checkValidationOfMatch();

      // Assert
      expect(actual).toBe(false);
      expect(component.tooltip.display).toHaveBeenCalledWith('match-id', LABELS.INVALID_MATCHID);
    });

    it('should return true when validation passes', () => {
      // Arrange
      component.model.matchId = '12345';
      component.isSuccessMatch = true;

      // Act
      const actual = component.checkValidationOfMatch();

      // Assert
      expect(actual).toBe(true);
    });
  });

  describe('checkValidate', () => {
    it('should return false when invalid match', () => {
      // Arrange
      component.checkValidationOfMatch = jest.fn().mockImplementation(() => false);

      // Act
      const actual = component.checkValidate();

      // Assert
      expect(actual).toBe(false);
    });

    it('should return false when invalid betid', () => {
      // Arrange
      component.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
      component.getCheckedLicensees = jest.fn().mockImplementation(() => []);
      component.dateTimeComponents = new QueryList();
      component.tooltip = new Tooltip();
      component.tooltip.display = jest.fn();

      // Act
      const actual = component.checkValidate();

      // Assert
      expect(actual).toBe(false);
    });

    it('should return false when invalid rangeTimes', () => {
      // Arrange
      component.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
      component.checkValidateRangeTime = jest.fn().mockImplementation(() => false);

      // Act
      const actual = component.checkValidate();

      // Assert
      expect(actual).toBe(false);
    });

    it('should return false and display tooltip when no licensees', () => {
      // Arrange
      component.tooltip.display = jest.fn();
      component.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
      component.checkValidateRangeTime = jest.fn().mockImplementation(() => true);
      component.groupLicenseeModel = new GroupLicenseeModel([], true);

      // Act
      const actual = component.checkValidate();

      // Assert
      expect(actual).toBe(false);
      expect(component.tooltip.display).toHaveBeenCalledWith('check-group-licensee', LABELS.EMPTY_LICENSEE);
    });

    it('should return false and display tooltip when no currencies', () => {
      // Arrange
      component.tooltip.display = jest.fn();
      component.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
      component.checkValidateRangeTime = jest.fn().mockImplementation(() => true);
      component.groupLicenseeModel = new GroupLicenseeModel(Helper.getGroupLicensee(), true);
      component.model.currencyIds = '';

      // Act
      const actual = component.checkValidate();

      // Assert
      expect(actual).toBe(false);
      expect(component.tooltip.display).toHaveBeenCalledWith('currencies-id', LABELS.EMPTY_CURRENCY);
    });

    it('should return false when groupBetTypesComponent and advancedModelComponent are invalid', () => {
      // Arrange
      component.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
      component.checkValidateRangeTime = jest.fn().mockImplementation(() => true);
      component.groupLicenseeModel = new GroupLicenseeModel(Helper.getGroupLicensee(), true);
      component.model.currencyIds = '13';
      (component.groupBetTypesComponent.validate as jest.Mock).mockImplementation(() => false);
      (component.advancedModelComponent.validate as jest.Mock).mockImplementation(() => false);

      // Act
      const actual = component.checkValidate();

      // Assert
      expect(actual).toBe(false);
    });

    it('should return true when all validations pass', () => {
      // Arrange
      component.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
      component.checkValidateRangeTime = jest.fn().mockImplementation(() => true);
      component.groupLicenseeModel = new GroupLicenseeModel(Helper.getGroupLicensee(), true);
      component.model.currencyIds = '13';
      (component.groupBetTypesComponent.validate as jest.Mock).mockImplementation(() => true);
      (component.advancedModelComponent.validate as jest.Mock).mockImplementation(() => true);

      // Act
      const actual = component.checkValidate();

      // Assert
      expect(actual).toBe(true);
    });
  });

  describe('getParams', () => {
    it('should return expected GetTicketsQuery', () => {
      // Arrange
      component.groupLicenseeModel = new GroupLicenseeModel(Helper.getGroupLicensee(), true);
      component.eventType.value = '2';
      component.groupBetTypes = new GroupBetTypesModel([Helper.getGroupBetType()], true);
      component.model.liveHomeScore = 2;
      component.model.liveAwayScore = 1;
      component.rangeTimes = [new RangeTime()];
      (component.advancedModelComponent.getBetTypeModels as jest.Mock).mockImplementation(() => [Helper.fakeCheckedBetType]);
      component.getCheckedLicensees = jest.fn().mockReturnValue(['368Cash']);

      // Act
      component.getParams();

      // Assert
      expect(component.model.licenseeNames).toBe('368Cash');
      expect(component.model.liveIndicator).toBe(2);
      expect(component.model.betTypes.length).toBe(1);
      expect(component.model.durations.length).toBe(1);
    });

    it('should handle invalid input values', () => {
      // Arrange
      component.groupLicenseeModel = new GroupLicenseeModel(Helper.getGroupLicensee(), true);
      component.eventType.value = 'a';
      component.groupBetTypes = new GroupBetTypesModel([Helper.getGroupBetType()], true);
      component.rangeTimes = [new RangeTime()];
      component.model.liveHomeScore = null;
      component.model.liveAwayScore = null;
      (component.advancedModelComponent.getBetTypeModels as jest.Mock).mockImplementation(() => [Helper.fakeCheckedBetType]);
      component.getCheckedLicensees = jest.fn().mockReturnValue(['368Cash']);

      // Act
      component.getParams();

      // Assert
      expect(component.model.licenseeNames).toBe('368Cash');
      expect(component.model.liveIndicator).toBeNull();
      expect(component.model.liveHomeScore).toBeNull();
      expect(component.model.liveAwayScore).toBeNull();
    });
  });

  describe('checkValidateRangeTime', () => {
    it('should return false and display tooltip when invalid datetime', () => {
      // Arrange
      component.tooltip.display = jest.fn();
      const rangeTime1 = new RangeTime();
      rangeTime1.from = '2023/08/12 09:35:06.980 AM';
      rangeTime1.to = '2023/08/11 09:35:06.980 AM';
      const rangeTime2 = new RangeTime();
      component.rangeTimes = [rangeTime1, rangeTime2];
      component.dateTimeComponents = new QueryList();

      // Act
      const actual = component.checkValidateRangeTime();

      // Assert
      expect(actual).toBe(false);
      expect(component.tooltip.display).toBeCalledTimes(1);
      expect(component.tooltip.display).toHaveBeenCalledWith('from-date-time0', LABELS.FROM_TIME_MUST_SMALLER_THAN_TO_TIME);
    });

    it('should return true when validation passes', () => {
      // Arrange
      component.rangeTimes = [new RangeTime()];
      component.dateTimeComponents = new QueryList();

      // Act
      const actual = component.checkValidateRangeTime();

      // Assert
      expect(actual).toBe(true);
    });

    it('should return false when dateTimeComponents invalid', () => {
      // Arrange
      component.rangeTimes = [new RangeTime()];
      const dateTimeComponent = {
        validateWithTooltip: jest.fn().mockImplementation(() => false)
      } as any;
      component.dateTimeComponents = new QueryList();
      component.dateTimeComponents.reset([dateTimeComponent]);

      // Act
      const actual = component.checkValidateRangeTime();

      // Assert
      expect(actual).toBe(false);
    });
  });

  describe('updateSelectedCurrency', () => {
    it('should update currencyIds correctly', () => {
      // Arrange
      component.currencies = new Currencies();
      component.currencies.selected = [1,2,3];

      // Act
      component.updateSelectedCurrency();

      // Assert
      expect(component.model.currencyIds).toBe('1,2,3');
    });
  });
});