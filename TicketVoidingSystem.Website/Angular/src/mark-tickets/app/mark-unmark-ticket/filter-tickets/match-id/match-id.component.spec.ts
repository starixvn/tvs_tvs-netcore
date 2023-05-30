import { NgModule, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { RangeTime } from '../../../../../mark-tickets/app/models/query.model';
import { AdvancedModeModule } from '../../../../../utility/components/advanced-mode/advanced-mode.module';
import { CheckedBetType } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { BetType, GroupBetType, GroupBetTypesModel } from '../../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { DateTimeModule } from '../../../../../utility/components/date-time/date-time.module';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { LABELS } from '../../../../../utility/constants/labels';
import '../../../../../utility/extensions/string.extension';
import { FirstTicketTime } from '../../../../../utility/models/match.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { HttpService } from '../../../../../utility/services/http.service';
import { Currencies, Currency } from '../filter.model';
import { LicenseesComponent } from './licensees/licensees.component';
import { GroupLicensee, Licensee } from './licensees/licensees.model';
import { MatchIdComponent } from './match-id.component';
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

  static readonly fakeCheckedBetType: CheckedBetType = {
    id: 7,
    betTeam: '',
    set: '',
    game: '',
    betOption: '',
    value: '',
    valueHdp1: '',
    valueHdp2: '',
    goal: '',
    oddsSpread: '',
    oddsId: '',
    transdesc: ''
  };

  static getGroupLicensee(): GroupLicensee[] {
    return [new GroupLicensee('China rules', [new Licensee(14, '368Cash')])];
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

@NgModule({
  declarations: [MatchIdComponent, LicenseesComponent],
  imports: [
    FormsModule,
    ToolTipModule,
    AdvancedModeModule,
    DateTimeModule,
    NgSelectModule
  ],
  providers: [
    HttpService
  ]
})
class ModuleTest { }

describe.only('MatchIdComponent', () => {
  let shallow: Shallow<MatchIdComponent>;

  beforeEach(() => {
    shallow = new Shallow(MatchIdComponent, ModuleTest)
      .dontMock(DateTimeModule)
      .dontMock(NgbModule);
  });

  it('#ngOnInit should return matchid is empty', async () => {
    const { instance } = await shallow.render();
    instance.ngOnInit();

    expect(instance.model.matchId).toBe('');
  });

  it('#addRangeTimes should return rangeTimes(2 items) correctly', async () => {
    const { instance } = await shallow.render();
    instance.addRangeTimes();

    expect(instance.rangeTimes.length).toBe(2);
  });

  it('#addRangeTimes should return rangeTimes(1 items) correctly', async () => {
    const { instance } = await shallow.render();
    instance.addRangeTimes();

    expect(instance.rangeTimes.length).toBe(2);
  });

  it('#removeRangeTimes should return rangeTimes(1 items) correctly', async () => {
    const { instance } = await shallow.render();
    instance.addRangeTimes();
    instance.removeRangeTimes(1);

    expect(instance.rangeTimes.length).toBe(1);
  });

  it('#removeRangeTimes should return rangeTimes(1 items) correctly when searchByBetId true', async () => {
    const { instance } = await shallow.render();
    instance.addRangeTimes();
    instance.removeRangeTimes(1);

    expect(instance.rangeTimes.length).toBe(1);
  });

  it('#blurMatchId should return call expected function', async () => {
    const { instance } = await shallow.render();
    instance.model.matchId = '123456';
    instance.preMatchId = '';
    instance.getGroupBetTypes = jest.fn();
    instance.setFromDate = jest.fn();
    instance.advancedModelComponent.resetBetTeam = jest.fn();

    await instance.blurMatchId();

    expect(instance.getGroupBetTypes).toHaveBeenCalledTimes(1);
    expect(instance.setFromDate).toHaveBeenCalledTimes(1);
    expect(instance.advancedModelComponent.resetBetTeam).toHaveBeenCalledTimes(1);
  });

  it('#blurMatchId should not call function', async () => {
    const { instance } = await shallow.render();
    instance.model.matchId = undefined;
    instance.preMatchId = '';
    instance.getGroupBetTypes = jest.fn();
    instance.setFromDate = jest.fn();
    instance.advancedModelComponent.resetBetTeam = jest.fn();

    await instance.blurMatchId();

    expect(instance.getGroupBetTypes).toHaveBeenCalledTimes(0);
    expect(instance.setFromDate).toHaveBeenCalledTimes(0);
    expect(instance.advancedModelComponent.resetBetTeam).toHaveBeenCalledTimes(0);
  });

  it('#setFromDate should return expected rangeTimes', async () => {
    const { instance } = await shallow
      .mock(CommonService, {
        getFirstTimeAndKickOffTime: jest.fn().mockImplementation(() => Helper.fakeFirstTicketTime)
      })
      .render();
    instance.model.matchId = '123456';

    await instance.setFromDate();

    expect(instance.rangeTimes[0].from).toBe('2019/08/12 09:35:06.980 AM');
  });

  it('#setFromDate should call #data.setFullYear', async () => {
    const firstTicketTime = new FirstTicketTime();
    firstTicketTime.minTransDate = '0050/8/12 09:35:06.970 AM';
    firstTicketTime.kickOffTime = '0050/8/12 09:35:06.980 AM';
    const { instance } = await shallow
      .mock(CommonService, {
        getFirstTimeAndKickOffTime: jest.fn().mockImplementation(() => firstTicketTime)
      })
      .render();
    instance.eventType.value = '1';
    instance.model.matchId = '123456';

    await instance.setFromDate();

    expect(instance.rangeTimes[0].from).toBe('0050/08/12 09:35:06.980 AM');
  });
  
  it('#setFromDate should update data when currentDate null', async () => {
    const firstTicketTime = new FirstTicketTime();
    firstTicketTime.minTransDate = null;
    firstTicketTime.kickOffTime = null;
    const { instance } = await shallow
      .mock(CommonService, {
        getFirstTimeAndKickOffTime: jest.fn().mockImplementation(() => firstTicketTime)
      })
      .render();
    instance.eventType.value = '1';
    instance.model.matchId = '123456';

    await instance.setFromDate();

    expect(instance.rangeTimes[0].from).toBeDefined();
  });

  it('#setFromDate should update data when firstTime null', async () => {
    const { instance } = await shallow
      .mock(CommonService, {
        getFirstTimeAndKickOffTime: jest.fn().mockImplementation(() => null)
      })
      .render();
    instance.eventType.value = '1';
    instance.model.matchId = '123456';

    await instance.setFromDate();

    expect(instance.rangeTimes[0].from).toBeDefined();
  });

  it('#setFromDate should update data when matchId has not value', async () => {
    const { instance } = await shallow
      .mock(CommonService, {
        getFirstTimeAndKickOffTime: jest.fn().mockImplementation(() => null)
      })
      .render();
    instance.eventType.value = '1';
    instance.model.matchId = '';

    await instance.setFromDate();

    expect(instance.rangeTimes[0].from).toBeDefined();
  });

  it('#getGroupBetTypes should call #handleGroupBetTypes with expected param', async () => {
    const groupBetTypesModel = new GroupBetTypesModel([Helper.getGroupBetType()], true);
    const { instance } = await shallow
      .mock(CommonService, {
        getGroupBetTypes: jest.fn().mockImplementation(() => groupBetTypesModel)
      })
      .render();
    instance.model.matchId = '123456';
    instance.handleGroupBetTypes = jest.fn();

    await instance.getGroupBetTypes();

    expect(instance.handleGroupBetTypes).toHaveBeenCalledWith(groupBetTypesModel);
  });

  it('#handleGroupBetTypes should display tooltip for invalid match when don\'t have any groupBetTypes', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.display = jest.fn();
    instance.handleBetType216 = jest.fn();
    const groupBetTypesModel = new GroupBetTypesModel([], true);
    groupBetTypesModel.result = {
      errorCode: 0,
      errorMsg: ''
    };

    instance.handleGroupBetTypes(groupBetTypesModel);

    expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', LABELS.INVALID_MATCH);
    expect(instance.isSuccessMatch).toBe(false);
    expect(instance.changeMatch.emit).toHaveBeenCalledTimes(1);
    expect(instance.handleBetType216).toHaveBeenCalledTimes(1);
    expect(instance.allBetTypes.length).toBe(0);
  });

  it('#handleGroupBetTypes should display tooltip for invalid match when data have error', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.display = jest.fn();
    instance.handleBetType216 = jest.fn();
    const groupBetTypesModel = new GroupBetTypesModel([], true);
    groupBetTypesModel.result = {
      errorCode: 1,
      errorMsg: 'Error!'
    };

    instance.handleGroupBetTypes(groupBetTypesModel);

    expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', 'Error!');
    expect(instance.isSuccessMatch).toBe(false);
    expect(instance.changeMatch.emit).toHaveBeenCalledTimes(1);
    expect(instance.handleBetType216).toHaveBeenCalledTimes(1);
    expect(instance.allBetTypes.length).toBe(0);
  });

  it('#handleGroupBetTypes should return match successfully', async () => {
    const { instance } = await shallow.render();
    instance.handleBetType216 = jest.fn();
    const groupBetTypesModel = new GroupBetTypesModel([Helper.getGroupBetType()], true);
    groupBetTypesModel.result = {
      errorCode: 0,
      errorMsg: ''
    };

    instance.handleGroupBetTypes(groupBetTypesModel);

    expect(instance.isSuccessMatch).toBe(true);
    expect(instance.changeMatch.emit).toHaveBeenCalledTimes(1);
    expect(instance.handleBetType216).toHaveBeenCalledTimes(1);
    expect(instance.allBetTypes.length).toBe(1);
  });

  it('#handleBetType216 should return getPlayerQuery has data', async () => {
    const { instance } = await shallow.render();
    const groupBetTypesModel = new GroupBetTypesModel([Helper.getGroupBetType216()], true);
    instance.groupBetTypes = groupBetTypesModel;
    instance.model.matchId = '12345';

    instance.handleBetType216();

    expect(instance.getPlayerQuery.matchId).toBe('12345');
    expect(instance.getPlayerQuery.betType).toBe('216');
  });
  
  it('#handleBetType216 should return getPlayerQuery has not data', async () => {
    const { instance } = await shallow.render();
    const groupBetTypesModel = new GroupBetTypesModel([], true);
    instance.groupBetTypes = groupBetTypesModel;
    instance.model.matchId = '12345';
    instance.handleBetType216();

    expect(instance.getPlayerQuery).toBeUndefined();
  });

  it('#changeBetTypes should return expected allBetTypes', async () => {
    const { instance } = await shallow.render();
    const betType = new BetType(1, 'Handicap', false, 0, true);
    instance.changeBetTypes([betType]);

    expect(instance.allBetTypes.length).toBe(1);
    expect(instance.allBetTypes[0]).toEqual(betType);
  });

  it('#changeEventType should return reset data for scores', async () => {
    const { instance } = await shallow.render();
    instance.model.liveHomeScore = 1;
    instance.model.liveAwayScore = 1;
    instance.setFromDate = jest.fn();
    instance.changeEventType();

    expect(instance.setFromDate).toHaveBeenCalledTimes(1);
  });

  it('#getCheckedLicensees should return expected licensees', async () => {
    const { instance } = await shallow.render();
    instance.groupLicensees = Helper.getGroupLicensee();
    const actual = instance.getCheckedLicensees();

    expect(actual.length).toBe(1);
    expect(actual[0]).toBe('368Cash');
  });

  it('#checkValidationOfMatch should return false and display tooltip when matchid is empty or undefined', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.display = jest.fn();
    const testCases = ['', undefined];

    for (const item of testCases) {
      instance.model.matchId = item;
      const actual = instance.checkValidationOfMatch();
      expect(actual).toBe(false);
      expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', LABELS.REQUIRED_MATCHID);
    }
  });

  it('#checkValidationOfMatch should return false and display tooltip when isSuccessMatch is false', async () => {
    const { instance } = await shallow.render();
    instance.model.matchId = '12345';
    instance.isSuccessMatch = false;
    instance.tooltip.display = jest.fn();
    const actual = instance.checkValidationOfMatch();

    expect(actual).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', LABELS.INVALID_MATCHID);
  });

  it('#checkValidationOfMatch should return true', async () => {
    const { instance } = await shallow.render();
    instance.model.matchId = '12345';
    instance.isSuccessMatch = true;
    const actual = instance.checkValidationOfMatch();

    expect(actual).toBe(true);
  });

  it('#checkValidate should return false when invalid match', async () => {
    const { instance } = await shallow.render();
    instance.checkValidationOfMatch = jest.fn().mockImplementation(() => false);
    const actual = instance.checkValidate();

    expect(actual).toBe(false);
  });

  it('#checkValidate should return false when invalid betid', async () => {
    const { instance } = await shallow.render();
    instance.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
    instance.getCheckedLicensees = jest.fn().mockImplementation(() => []);
    instance.dateTimeComponents = new QueryList();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    const actual = instance.checkValidate();

    expect(actual).toBe(false);
  });

  it('#checkValidate should return false when invalid rangeTimes', async () => {
    const { instance } = await shallow.render();
    instance.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
    instance.checkValidateRangeTime = jest.fn().mockImplementation(() => false);
    const actual = instance.checkValidate();

    expect(actual).toBe(false);
  });

  it('#checkValidate should return false and display tooltip when not any licensees', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.display = jest.fn();
    instance.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
    instance.checkValidateRangeTime = jest.fn().mockImplementation(() => true);
    instance.groupLicensees = [];
    const actual = instance.checkValidate();

    expect(actual).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledWith('check-group-licensee', LABELS.EMPTY_LICENSEE);
  });

  it('#checkValidate should return false and display tooltip when not any currencies', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.display = jest.fn();
    instance.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
    instance.checkValidateRangeTime = jest.fn().mockImplementation(() => true);
    instance.groupLicensees = Helper.getGroupLicensee();
    instance.model.currencyIds = '';

    const actual = instance.checkValidate();

    expect(actual).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledWith('currencies-id', LABELS.EMPTY_CURRENCY);
  });

  it('#checkValidate should return false when groupBetTypesComponent and advancedModelComponent is invalid ', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.display = jest.fn();
    instance.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
    instance.checkValidateRangeTime = jest.fn().mockImplementation(() => true);
    instance.groupLicensees = Helper.getGroupLicensee();
    instance.model.currencyIds = '13';
    instance.groupBetTypesComponent.validate = jest.fn().mockImplementation(() => false);
    instance.advancedModelComponent.validate = jest.fn().mockImplementation(() => false);

    const actual = instance.checkValidate();

    expect(actual).toBe(false);
  });

  it('#checkValidate should return true ', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.display = jest.fn();
    instance.checkValidationOfMatch = jest.fn().mockImplementation(() => true);
    instance.checkValidateRangeTime = jest.fn().mockImplementation(() => true);
    instance.groupLicensees = Helper.getGroupLicensee();
    instance.model.currencyIds = '13';
    instance.groupBetTypesComponent.validate = jest.fn().mockImplementation(() => true);
    instance.advancedModelComponent.validate = jest.fn().mockImplementation(() => true);

    const actual = instance.checkValidate();

    expect(actual).toBe(true);
  });

  it('#getParams should return expected GetTicketsQuery ', async () => {
    const { instance } = await shallow.render();
    instance.groupLicensees = Helper.getGroupLicensee();
    instance.eventType.value = '2';
    instance.groupBetTypes = new GroupBetTypesModel([Helper.getGroupBetType()], true);
    instance.model.liveHomeScore = 2;
    instance.model.liveAwayScore = 1;
    instance.rangeTimes = [new RangeTime()];
    instance.advancedModelComponent.getBetTypeModels = jest.fn().mockImplementation(() => [Helper.fakeCheckedBetType]);

    instance.getParams();

    expect(instance.model.licenseeNames).toBe('368Cash');
    expect(instance.model.liveIndicator).toBe(2);
    expect(instance.model.betTypes.length).toBe(1);
    expect(instance.model.durations.length).toBe(1);
  });

  it('#getParams should return expected GetTicketsQuery when input wrong', async () => {
    const { instance } = await shallow.render();
    instance.groupLicensees = Helper.getGroupLicensee();
    instance.eventType.value = 'a';
    instance.groupBetTypes = new GroupBetTypesModel([Helper.getGroupBetType()], true);
    instance.rangeTimes = [new RangeTime()];
    instance.model.liveHomeScore = null;
    instance.model.liveAwayScore = null;
    instance.advancedModelComponent.getBetTypeModels = jest.fn().mockImplementation(() => [Helper.fakeCheckedBetType]);
    instance.getParams();

    expect(instance.model.licenseeNames).toBe('368Cash');
    expect(instance.model.liveIndicator).toBeNull();
    expect(instance.model.liveHomeScore).toBeNull();
    expect(instance.model.liveAwayScore).toBeNull();
  });

  it('#checkValidateRangeTime should return false and display tooltip when invalid datetime', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.display = jest.fn();
    const rangeTime1 = new RangeTime();
    rangeTime1.from = '2023/08/12 09:35:06.980 AM';
    rangeTime1.to = '2023/08/11 09:35:06.980 AM';
    const rangeTime2 = new RangeTime();
    instance.rangeTimes = [rangeTime1, rangeTime2];
    instance.dateTimeComponents = new QueryList();

    const actual = instance.checkValidateRangeTime();

    expect(actual).toBe(false);
    expect(instance.tooltip.display).toBeCalledTimes(1);
    expect(instance.tooltip.display).toHaveBeenCalledWith('from-date-time0', LABELS.FROM_TIME_MUST_SMALLER_THAN_TO_TIME);
  });

  it('#checkValidateRangeTime should return true', async () => {
    const { instance } = await shallow.render();
    instance.rangeTimes = [new RangeTime()];
    instance.dateTimeComponents = new QueryList();
    const actual = instance.checkValidateRangeTime();

    expect(actual).toBe(true);
  });

  it('#checkValidateRangeTime should return false when dateTimeComponents invalid', async () => {
    const { instance } = await shallow.render();
    instance.rangeTimes = [new RangeTime()];

    const dateTimeComponent = new DateFullTimeNewComponent(null);
    dateTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => false);
    instance.dateTimeComponents = new QueryList();
    instance.dateTimeComponents.reset([...instance.dateTimeComponents.toArray(), dateTimeComponent]);
    const actual = instance.checkValidateRangeTime();

    expect(actual).toBe(false);
  });

  it('#updateSelectedCurrency should update currencyIds', async () => {
    const { instance } = await shallow.render();
    instance.currencies = new Currencies();
    instance.currencies.selected = [1,2,3];

    instance.updateSelectedCurrency();

    expect(instance.model.currencyIds).toBe('1,2,3');
  });
});