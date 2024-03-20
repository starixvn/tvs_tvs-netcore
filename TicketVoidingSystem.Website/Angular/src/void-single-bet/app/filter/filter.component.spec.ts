import { NgModule, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import { Shallow } from 'shallow-render';
import { AdvancedModeModule } from '../../../utility/components/advanced-mode/advanced-mode.module';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { GetPlayersQuery, OddsInfo, CheckedBetType } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { AdvancedModeService } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.service';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GroupBetType, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { DateFullTimeNewComponent } from '../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { DateTimeModule } from '../../../utility/components/date-time/date-time.module';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SportType } from '../../../utility/constants/sport.constant';
import { SubIssueTypeConstant } from '../../../utility/constants/sub-issue-type.constant';
import { TEXT } from '../../../utility/constants/text';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonService } from '../../../utility/services/common.service';
import { HttpService } from '../../../utility/services/http.service';
import { AppService } from '../app.service';
import { AffectedLicensee } from '../models/affected-licensee.model';
import { GetTicketsQuery } from '../models/query.model';
import { FilterComponent } from './filter.component';
import { Type } from './filter.model';
import { ComboParlayConstants } from '../../../utility/constants/combo-parlay.constant';

class Helper {
  static readonly matchIdSelector = '.match-id';
  static readonly fromBetSelector = '.from-bet-id';
  static readonly toBetSelector = '.to-bet-id';
  static readonly byTimeSelector = 'input[type=checkbox]';
  static readonly transTimeDateSelector = '.trans-time input[type=radio]';
  static readonly checkTimeDateSelector = '.check-time input[type=radio]';
  static readonly dateTimeSelector = 'date-full-time';
  static readonly betTypeSelector = '.control-bet input[type=radio]';
  static readonly searchButtonSelector = '.search input[type=button]';
  static readonly ticketTypeSelector = '.ticket-type select';
  static readonly eventTypeSelector = '.event-type select';
  static readonly settledTypeSelector = '.settled-type select';
  static readonly advancedModeSelector = 'advanced-mode div.advanced-mode';
  static getFakeRemark(): string[] {
    return [
      'You can void "Settled" or "Unsettled" tickets.',
      'You can void "Instantly Settled" tickets settled by Instant Settlement during live time.'
    ];
  }

  static getFakeGroupBetTypes(): GroupBetTypesModel {
    const groupBetType: GroupBetType[] = [
      new GroupBetType('1H', [new BetType(15, '1H 1X2', false, 0, true)], true),
      new GroupBetType('FT', [new BetType(4, 'Correct Score', false, 0, true)], true),
    ];
    const data = new GroupBetTypesModel(groupBetType, true);
    data.result = {
      errorCode: 0,
      errorMsg: ''
    };
    return data;
  }

  static getFakeAffectedLicensee(): AffectedLicensee {
    return {
      licenseesName: 'abc',
      show: true
    };
  }

  static getFakeAffectedLicenseeWithNameIsNull(): AffectedLicensee {
    return {
      licenseesName: null,
      show: true
    };
  }

  static readonly fakeIssueTypeList: IssueType[] = [
    { issueTypeId: 1, issueTypeName: 'Danger Accepted' },
    { issueTypeId: 11, issueTypeName: 'Abnormal Bet' },
    { issueTypeId: 8, issueTypeName: 'Early Kick Off' },
    { issueTypeId: 9, issueTypeName: 'Wrong Kick Off Time' }
  ];
  static readonly fakeSubIssueTypeList: SubIssueType[] = [
    {
      subIssueTypeId: 1,
      issueTypeId: 1,
      subIssueTypeName: 'Goal',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 2,
      issueTypeId: 1,
      subIssueTypeName: 'Corner',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    },
    {
      subIssueTypeId: 12,
      issueTypeId: 8,
      subIssueTypeName: 'Non Live',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 14,
      issueTypeId: 9,
      subIssueTypeName: 'Wrong Kick Off Time',
      subIssueTypeNameCS: ''
    }
  ];
  static readonly fakeIssueTypesModel: IssueTypesModel = {
    issueTypes: Helper.fakeIssueTypeList,
    subIssueTypes: Helper.fakeSubIssueTypeList
  };
}

describe('FilterComponent', () => {
  @NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      DateTimeModule,
      AdvancedModeModule,
      ToolTipModule
    ],
    providers: [
      AppService,
      HttpService,
      CommonService,
      ElementRef
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {})
      .mock(AppService, { getRemark: jest.fn().mockImplementation(() => Helper.getFakeRemark()) })
      .mock(AdvancedModeComponent,
        {
          resetBetTeam: jest.fn(),
          renderBetTeams: jest.fn(),
          renderMapAndRound: jest.fn()
        });
  });

  it('FilterComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('Should display tooltip when blur match with matchid is text', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.matchId = 'abcd';
    instance.tooltip.display = jest.fn();

    // Action
    await instance.blurMatchId();

    // Assert
    expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', TEXT.INVALID_MATCHID);
  });

  it('Should return expected model both advanced mode and groupbettypes when input valid matchid', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(AppService, { getGroupBetTypes: jest.fn().mockImplementation(() => Helper.getFakeGroupBetTypes()) })
      .render();
    instance.getMatchInfo = jest.fn();
    instance.getGroupBetTypes = jest.fn();
    instance.matchId = '12345';

    // Action
    await instance.blurMatchId();

    // Assert
    expect(instance.getMatchInfo).toHaveBeenCalledTimes(1);
    expect(instance.getGroupBetTypes).toHaveBeenCalledTimes(1);
  });

  it('Should call #getParams when click search button', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.checkFilterParams = jest.fn().mockImplementation(() => true);
    instance.getParams = jest.fn();
    instance.setPlayerNamesSelected = jest.fn();

    // Action
    await instance.search();

    // Assert
    expect(instance.getParams).toHaveBeenCalled();
  });

  it('#searchEvent should emit with expected model when #search', async () => {
    // Arrange
    const expectedQuery = new GetTicketsQuery();
    expectedQuery.matchId = 12345;
    expectedQuery.eventType = '2';
    expectedQuery.ticketType = '0';
    expectedQuery.settledType = 'All';
    const { fixture, instance } = await shallow.render();
    fixture.detectChanges();
    instance.matchId = '12345';
    instance.groupBetTypes = new GroupBetTypesModel(Helper.getFakeGroupBetTypes().groupBetTypes, false);
    instance.checkFilterParams = jest.fn().mockImplementation(() => true);
    instance.getParams = jest.fn().mockImplementation(() => expectedQuery);
    instance.searchEvent.emit = jest.fn();
    instance.setPlayerNamesSelected = jest.fn();

    // Action
    await instance.search();

    // Assert
    expect(instance.searchEvent.emit).toHaveBeenCalled();
    expect(instance.getTicketsQuery.matchId).toBe(12345);
    expect(instance.getTicketsQuery.eventType).toBe('2');
    expect(instance.getTicketsQuery.ticketType).toBe('0');
    expect(instance.getTicketsQuery.settledType).toBe('All');
  });

  it('#checkFilterParams should return false', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = true;
    const testCases = [
      {
        matchid: null, isSuccessMatch: false, oddsValue: '1', element: 'match-id', messages: TEXT.REQUIRED_MATCHID
      },
      {
        matchid: '12345', isSuccessMatch: false, oddsValue: '1', element: 'match-id', messages: TEXT.INVALID_MATCHID
      },
      {
        matchid: '12345', isSuccessMatch: true, oddsValue: '1', element: 'match-id', messages: TEXT.INVALID_MATCHID
      },
    ];
    instance.tooltip.display = jest.fn();
    instance.isCorrectFormatOdds = jest.fn().mockImplementation(() => false);
    instance['isTransDateValidity'] = jest.fn().mockImplementation(() => false);

    // Action and Assert
    for (const item of testCases) {
      instance.matchId = item.matchid;
      instance.isSuccessMatch = item.isSuccessMatch;
      actualResult = instance.checkFilterParams();
      expect(actualResult).toBe(false);
    }
  });

  it('#checkFilterParams should return false when isSelectionNotValid', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = true;
    const testCases = [
      {
        matchid: '12345', isSuccessMatch: true, oddsValue: '1', element: 'match-id', messages: TEXT.INVALID_MATCHID
      },
    ];
    instance.tooltip.display = jest.fn();
    instance.isCorrectFormatOdds = jest.fn().mockImplementation(() => false);
    instance['isTransDateValidity'] = jest.fn().mockReturnValue(() => false);
    instance.isSelectionNotValid = jest.fn().mockReturnValue(true);

    // Action and Assert
    for (const item of testCases) {
      instance.matchId = item.matchid;
      instance.isSuccessMatch = item.isSuccessMatch;
      actualResult = instance.checkFilterParams();
      expect(actualResult).toBe(false);
    }
  });

  it('isSelectionNotValid should return true', async () => {
    // Arrange
    const { instance } = await shallow.render();

    instance.getSelectionSubParlays = jest.fn().mockReturnValue('');
    instance.bet.value = "Sub Parlay";

    // Action
    const actual = instance.isSelectionNotValid();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('isSelectionNotValid should return false when bet is not Sub Parlay', async () => {
    // Arrange
    const { instance } = await shallow.render();

    instance.getSelectionSubParlays = jest.fn().mockReturnValue('');
    instance.bet.value = "All";

    // Action
    const actual = instance.isSelectionNotValid();

    // Assert
    expect(actual).toBeFalsy();
  });

  it('isSelectionNotValid should return false when selectionSubParlays has value', async () => {
    // Arrange
    const { instance } = await shallow.render();

    instance.getSelectionSubParlays = jest.fn().mockReturnValue('1');
    instance.bet.value = "Sub Parlay";

    // Action
    const actual = instance.isSelectionNotValid();

    // Assert
    expect(actual).toBeFalsy();
  });

  it('getPlayerValueSelectedFromBetTypeQuery should return expected', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let betTypes: CheckedBetType[] = [{
      id: 9680,
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
      transdesc: '123,321',
      virtualHead: ''
    },
    {
      id: 9682,
      betTeam: '789',
      set: '',
      game: '',
      betOption: '',
      value: '',
      valueHdp1: '',
      valueHdp2: '',
      goal: '',
      oddsSpread: '',
      oddsId: '987',
      transdesc: '',
      virtualHead: ''
    },
    {
      id: 9650,
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
      transdesc: '',
      virtualHead: ''
    }];

    instance.getTicketsQuery.betTypes = betTypes;
    const expected = ['123', '321', '789,987'];

    // Action
    const actual = instance.getPlayerValueSelectedFromBetTypeQuery();

    // Assert
    expect(actual).toEqual(expected);
  });

  it('mapPlayerValueToOddsInfo should return expected', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let oddsInfo: OddsInfo[] = [{
      betTypeId: 1,
      oddsId: '',
      playerId: 1,
      playerName: '',
      betChoice: '',
      playNamesChineseTraditional: '',
      playNamesChineseSimplified: ''
    },
    {
      betTypeId: 1,
      oddsId: '1',
      playerId: 1,
      playerName: '',
      betChoice: '1',
      playNamesChineseTraditional: '',
      playNamesChineseSimplified: ''
    }
    ];
    instance.advancedModeComponent.oddsInfo = oddsInfo;

    // Action
    const actual = instance.mapPlayerValueToOddsInfo(['1', '1,1']);

    // Assert
    expect(actual.length).toBe(2);
  });

  it('#initFilter should call correct method', async () => {
    const { instance } = await shallow.render();
    instance.getRemark = jest.fn();
    instance.getIssueTypes = jest.fn();
    instance.renderTicketType = jest.fn();
    instance.renderEventType = jest.fn();
    instance.renderSettledType = jest.fn();
    instance.renderGroupBetTypesHandler = jest.fn();
    instance['renderIssueType'] = jest.fn();
    instance['renderSubIssueType'] = jest.fn();

    await instance.initFilter();

    expect(instance.getRemark).toHaveBeenCalledTimes(1);
    expect(instance.getIssueTypes).toHaveBeenCalledTimes(1);
    expect(instance.renderTicketType).toHaveBeenCalledTimes(1);
    expect(instance.renderEventType).toHaveBeenCalledTimes(1);
    expect(instance.renderSettledType).toHaveBeenCalledTimes(1);
    expect(instance.renderGroupBetTypesHandler).toHaveBeenCalledTimes(1);
    expect(instance['renderIssueType']).toHaveBeenCalledTimes(1);
    expect(instance['renderSubIssueType']).toHaveBeenCalledTimes(1);
  });

  it('#getIssueTypes should call #getIssueTypes', async () => {
    const mockGetIssueTypes = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeIssueTypesModel));
    const { instance } = await shallow
      .mock(CommonService, { getIssueTypes: mockGetIssueTypes })
      .render();

    await instance.getIssueTypes();

    expect(mockGetIssueTypes).toHaveBeenCalled();
  });

  it('#setPlayerNamesSelected should update expected', async () => {
    const mockGetIssueTypes = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeIssueTypesModel));
    const { instance } = await shallow
      .mock(CommonService, { getIssueTypes: mockGetIssueTypes })
      .render();
    instance.getPlayerValueSelectedFromBetTypeQuery = jest.fn().mockReturnValue("aa");
    let oddsInfo: OddsInfo[] = [{
      betTypeId: 1,
      oddsId: '',
      playerId: 1,
      playerName: 'aa',
      betChoice: '',
      playNamesChineseTraditional: '',
      playNamesChineseSimplified: ''
    }
    ];

    instance.mapPlayerValueToOddsInfo = jest.fn().mockReturnValue(oddsInfo);

    await instance.setPlayerNamesSelected();

    expect(instance.playerNamesSelected.msgEnglish).toEqual('aa');
    expect(instance.playerNamesSelected.msgChineseTraditional).toEqual('aa');
    expect(instance.playerNamesSelected.msgChineseSimplified).toEqual('aa');
    expect(instance.playerNamesSelected.msgChineseNewSimplified).toEqual('aa');
  });

  it('#renderSubIssueType should call #changeIssueTypeEvent', async () => {
    const { instance } = await shallow.render();
    instance.issueType = new Type();
    instance.issueType.value = '1';
    instance.changeIssueTypeEvent = jest.fn();
    instance['renderSubIssueType']();

    expect(instance.changeIssueTypeEvent).toHaveBeenCalledTimes(1);
  });

  it('#renderSubIssueType should not call #changeIssueTypeEvent', async () => {
    const { instance } = await shallow.render();
    instance.issueType = new Type();
    instance.issueType.value = null;
    instance.changeIssueTypeEvent = jest.fn();
    instance['renderSubIssueType']();

    expect(instance.changeIssueTypeEvent).toHaveBeenCalledTimes(0);
  });

  it('#changeSubIssueTypeEvent should call #handleBetTypeOfBasketball', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [new BetType(15, '1H 1X2', false, 0, true)];
    instance.matchViewModel = new MatchModel();
    instance.matchViewModel.sportType = SportType.BASKETBALL;
    instance.handleBetTypeOfBasketball = jest.fn();
    instance.changeSubIssueTypeEvent();

    expect(instance.handleBetTypeOfBasketball).toHaveBeenCalledTimes(1);
  });

  it('#changeControlBet should update searchParlay to false', async () => {
    const { instance } = await shallow.render();
    instance.changeControlBet('Single');

    expect(instance.searchParlay).toBe(false);
  });

  it('#blurMatchId should not call #getMatchInfo', async () => {
    const { instance } = await shallow.render();
    instance.getMatchInfo = jest.fn();
    instance.matchId = undefined;
    await instance.blurMatchId();

    expect(instance.getMatchInfo).toHaveBeenCalledTimes(0);
  });

  it('#getMatchInfo should not call #getMatchInfo', async () => {
    const mockGetMatchInfo = jest.fn();
    const { instance } = await shallow
      .mock(AppService, { getMatchInfo: mockGetMatchInfo })
      .render();
    instance.getMatchInfo = jest.fn();
    await instance.getMatchInfo();

    expect(mockGetMatchInfo).toHaveBeenCalledTimes(0);
  });

  it('#getGroupBetTypes should not call #getGroupBetTypes', async () => {
    const mockGroupBetTypes = jest.fn();
    const { instance } = await shallow
      .mock(AppService, { getGroupBetTypes: mockGroupBetTypes })
      .render();
    instance.handleGroupBetTypes = jest.fn();
    await instance.getGroupBetTypes();

    expect(mockGroupBetTypes).toHaveBeenCalledTimes(1);
    expect(instance.handleGroupBetTypes).toHaveBeenCalledTimes(1);
  });

  it('#handleBetTypeOfBasketball should not call #checkAndUncheckBetTypesOfBasketball', async () => {
    const { instance } = await shallow.render();
    instance.issueType.value = IssueTypeConstant.DANGER_ACCEPTED;
    instance['checkAndUncheckBetTypesOfBasketball'] = jest.fn();
    instance.handleBetTypeOfBasketball();

    expect(instance['checkAndUncheckBetTypesOfBasketball']).toHaveBeenCalledTimes(0);
  });

  it('#handleBetTypeOfBasketball should not call #checkAndUncheckBetTypesOfBasketball when issue type is WRONG_OU', async () => {
    const { instance } = await shallow.render();
    instance.issueType.value = IssueTypeConstant.WRONG_OU;
    instance['checkAndUncheckBetTypesOfBasketball'] = jest.fn();
    instance.handleBetTypeOfBasketball();

    expect(instance['checkAndUncheckBetTypesOfBasketball']).toHaveBeenCalledTimes(1);
  });

  it('#handleBetTypeOfBasketball should call #checkAndUncheckBetTypesOfBasketball', async () => {
    const { instance } = await shallow.render();
    instance.issueType.value = IssueTypeConstant.WRONG_HDP;
    instance['checkAndUncheckBetTypesOfBasketball'] = jest.fn();
    instance.handleBetTypeOfBasketball();

    expect(instance['checkAndUncheckBetTypesOfBasketball']).toHaveBeenCalledTimes(1);
  });

  it('#changeBetTypes should update correct data', async () => {
    const { instance } = await shallow.render();
    instance.changeBetTypes([]);

    expect(instance.allBetTypes.length).toBe(0);
  });

  it('#resetFilter should update correct data', async () => {
    const { instance } = await shallow
      .render();
    instance.setDateTime = jest.fn();
    instance.resetFilter();

    expect(instance.advancedModeComponent.resetBetTeam).toHaveBeenCalledTimes(1);
    expect(instance.matchId).toBe('');
    expect(instance.preMatchId).toBe('');
    expect(instance.fromTransId).toBe('');
    expect(instance.toTransId).toBe('');
    expect(instance.fromTransId).toBe('');
  });

  it('#getParams should return correct data', async () => {
    const { instance } = await shallow.render();
    instance.groupBetTypes = new GroupBetTypesModel([], null);
    instance.groupBetTypes.getValueCheckedBetTypes = jest.fn();
    instance.advancedModeComponent.getBetTypeModels = jest.fn();
    instance['isTransDateValidity'] = jest.fn().mockImplementation(() => true);
    [true, false].forEach(async x => {
      const actual = instance.getParams();

      expect(actual).toBeDefined();
      expect(actual.match).toBe(null);
      expect(actual.eventType).toBe(instance.eventType.value);
      expect(actual.liveAwayScore).toBe(instance.liveAwayScore);
      expect(actual.liveHomeScore).toBe(instance.liveHomeScore);
    });
  });

  it('#getParams should return fromTransDate, toTransDate are null', async () => {
    const { instance } = await shallow.render();
    instance.groupBetTypes = new GroupBetTypesModel([], null);
    instance.groupBetTypes.getValueCheckedBetTypes = jest.fn();
    instance.advancedModeComponent.getBetTypeModels = jest.fn();
    instance['isTransDateValidity'] = jest.fn().mockImplementation(() => true);
    instance.isCheckTime = false;

    const actual = instance.getParams()

    expect(actual.fromTransDate).toBeNull();
    expect(actual.toTransDate).toBeNull();

  });

  it('#checkFilterParams should return false when isTransDateValidity false', async () => {
    const { instance } = await shallow
      .render();
    instance.matchId = '1234';
    instance.isSuccessMatch = true;
    instance.oddsValue = null;
    instance['isTransDateValidity'] = jest.fn().mockImplementation(() => false);
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();

    const actual = instance.checkFilterParams();

    expect(actual).toBe(false);
  });

  it('#checkFilterParams should return true', async () => {
    const { instance } = await shallow
      .render();
    instance.matchId = '1234';
    instance.isSuccessMatch = true;
    instance.oddsValue = null;
    instance['isTransDateValidity'] = jest.fn().mockImplementation(() => true);
    instance.groupBetTypesComponent = new GroupBetTypesComponent(null);
    instance.groupBetTypesComponent.validate = jest.fn().mockImplementation(() => true);
    const advancedModeService = new AdvancedModeService(null);
    advancedModeService.getBetTeams = jest.fn().mockImplementation(() => Promise.resolve([]));
    instance.advancedModeComponent.validate = jest.fn().mockImplementation(() => true);
    const actual = instance.checkFilterParams();

    expect(actual).toBe(true);
    expect(instance.advancedModeComponent.validate).toHaveBeenCalledTimes(1);
    expect(instance.groupBetTypesComponent.validate).toHaveBeenCalledTimes(1);
  });

  it('#isTransDateValidity should return true', async () => {
    const { instance } = await shallow.render();
    instance.fromDateTime = '2021-11-05 00:00:00.000';
    instance.toDateTime = '2021-11-06 00:00:00.000';
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    const actual = instance['isTransDateValidity']();

    expect(actual).toBeTruthy();
  });

  it('#viewLogInfo should call #checkMatchId', async () => {
    const { instance } = await shallow.render();
    instance.checkFilterParams = jest.fn().mockImplementation(() => true);
    instance.getParams = jest.fn();
    await instance.viewLogInfo();

    expect(instance.getParams).toHaveBeenCalledTimes(1);
  });

  it('#viewLogInfo should emit viewLogInfoEvent', async () => {
    const { instance } = await shallow.render();
    instance.checkFilterParams = jest.fn().mockImplementation(() => true);
    instance.getParams = jest.fn();
    instance.viewLogInfoEvent.emit = jest.fn();
    await instance.viewLogInfo();

    expect(instance.viewLogInfoEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#viewLogInfo should not call any method', async () => {
    const { instance } = await shallow.render();
    instance.checkFilterParams = jest.fn().mockImplementation(() => false);
    instance.viewLogInfoEvent.emit = jest.fn();
    instance.getParams = jest.fn();

    await instance.viewLogInfo();

    expect(instance.viewLogInfoEvent.emit).toHaveBeenCalledTimes(0);
    expect(instance.getParams).toHaveBeenCalledTimes(0);
  });

  it('#search should not call any method', async () => {
    const { instance } = await shallow.render();
    instance.checkFilterParams = jest.fn().mockImplementation(() => false);
    instance.viewLogInfoEvent.emit = jest.fn();
    instance.getParams = jest.fn();

    await instance.search();

    expect(instance.getParams).toHaveBeenCalledTimes(0);
  });

  it('#handleBetType216 should update getPlayerQuery', async () => {
    const matchId = '1111';
    const expected = new GetPlayersQuery(matchId, '216');
    const { instance } = await shallow.render();
    instance.matchId = matchId;
    instance.groupBetTypes = new GroupBetTypesModel([], null);
    instance.groupBetTypes.hasBetType = jest.fn().mockImplementation(() => true);

    instance.handleBetType216();

    expect(instance.getPlayerQuery).toEqual(expected);
  });

  it('#handleBetType216 should not update getPlayerQuery', async () => {
    const matchId = '1111';
    const expected = new GetPlayersQuery('12234', '216');
    const { instance } = await shallow.render();
    instance.getPlayerQuery = expected;
    instance.matchId = matchId;
    instance.groupBetTypes = new GroupBetTypesModel([], null);
    instance.groupBetTypes.hasBetType = jest.fn().mockImplementation(() => false);

    instance.handleBetType216();

    expect(instance.getPlayerQuery).toEqual(expected);
  });

  it('#unCheckBetTypeByCondition should update isChecked', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [
      new BetType(15, '1H 1X2', false, 0, true),
      new BetType(16, '1H 1X2', false, 0, true),
    ];
    instance['unCheckBetTypeByCondition']([15, 14]);

    expect(instance.allBetTypes[0].isChecked).toBe(false);
    expect(instance.allBetTypes[1].isChecked).toBe(true);
  });

  it('#checkBetTypeByCondition should update isChecked', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [
      new BetType(15, '1H 1X2', false, 0, true),
      new BetType(16, '1H 1X2', false, 0, true),
    ];
    instance['checkBetTypeByCondition']([15, 14]);

    expect(instance.allBetTypes[0].isChecked).toBe(true);
    expect(instance.allBetTypes[1].isChecked).toBe(true);
  });

  it('#unCheckAllBetType should update isChecked', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [
      new BetType(15, '1H 1X2', false, 0, true),
      new BetType(16, '1H 1X2', false, 0, true),
    ];
    instance['unCheckAllBetType']();

    expect(instance.allBetTypes[0].isChecked).toBe(false);
    expect(instance.allBetTypes[1].isChecked).toBe(false);
  });

  it('#checkAllBetType should update isChecked', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [
      new BetType(15, '1H 1X2', false, 0, false),
      new BetType(16, '1H 1X2', false, 0, false),
    ];
    instance['checkAllBetType']();

    expect(instance.allBetTypes[0].isChecked).toBe(true);
    expect(instance.allBetTypes[1].isChecked).toBe(true);
  });

  it('#getMatchInfo should call #getMatchInfo', async () => {
    const mockGetMatchInfo = jest.fn();
    const { instance } = await shallow
      .mock(AppService, { getMatchInfo: mockGetMatchInfo })
      .render();
    await instance.getMatchInfo();

    expect(mockGetMatchInfo).toHaveBeenCalledTimes(1);
  });

  it('#checkAndUncheckBetTypesOfBasketball should call correct method when is WRONG_HDP', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [];
    instance.issueType.value = IssueTypeConstant.WRONG_HDP;
    instance['checkBetTypeByCondition'] = jest.fn();
    instance.groupBetTypes = new GroupBetTypesModel([], null);
    instance.groupBetTypes.changeCheckGroupByBetTypes = jest.fn();
    instance.groupBetTypes.changeCheckedGroupToModel = jest.fn();
    instance.changeBetTypes = jest.fn();

    instance['checkAndUncheckBetTypesOfBasketball']();

    expect(instance['checkBetTypeByCondition']).toHaveBeenCalledTimes(1);
    expect(instance.groupBetTypes.changeCheckGroupByBetTypes).toHaveBeenCalledTimes(1);
    expect(instance.groupBetTypes.changeCheckedGroupToModel).toHaveBeenCalledTimes(1);
    expect(instance.changeBetTypes).toHaveBeenCalledTimes(1);
  });

  it('#checkAndUncheckBetTypesOfBasketball should call correct method when is WRONG_OU and subIssueType is WRONG_QUARTER_OU', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [];
    instance.issueType.value = IssueTypeConstant.WRONG_OU;
    instance.subIssueType.value = SubIssueTypeConstant.WRONG_QUARTER_OU;
    instance.groupBetTypes = new GroupBetTypesModel([], null);
    instance.groupBetTypes.changeCheckGroupByBetTypes = jest.fn();
    instance.groupBetTypes.changeCheckedGroupToModel = jest.fn();
    instance['checkAllBetType'] = jest.fn();
    instance.changeBetTypes = jest.fn();

    instance['checkAndUncheckBetTypesOfBasketball']();

    expect(instance.groupBetTypes.changeCheckGroupByBetTypes).toHaveBeenCalledTimes(1);
    expect(instance.groupBetTypes.changeCheckedGroupToModel).toHaveBeenCalledTimes(1);
    expect(instance.changeBetTypes).toHaveBeenCalledTimes(1);
    instance['checkAllBetType'] = jest.fn();
  });

  it('#checkAndUncheckBetTypesOfBasketball should call correct method when is WRONG_OU and subIssueType is WRONG_OU', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [];
    instance.issueType.value = IssueTypeConstant.WRONG_OU;
    instance.subIssueType.value = SubIssueTypeConstant.WRONG_OU;
    instance['checkBetTypeByCondition'] = jest.fn();
    instance.groupBetTypes = new GroupBetTypesModel([], null);
    instance.groupBetTypes.changeCheckGroupByBetTypes = jest.fn();
    instance.groupBetTypes.changeCheckedGroupToModel = jest.fn();
    instance.changeBetTypes = jest.fn();

    instance['checkAndUncheckBetTypesOfBasketball']();

    expect(instance['checkBetTypeByCondition']).toHaveBeenCalledTimes(1);
    expect(instance.groupBetTypes.changeCheckGroupByBetTypes).toHaveBeenCalledTimes(1);
    expect(instance.groupBetTypes.changeCheckedGroupToModel).toHaveBeenCalledTimes(1);
    expect(instance.changeBetTypes).toHaveBeenCalledTimes(1);
  });

  it('#checkAndUncheckBetTypesOfBasketball should only call any method of groupBetTypes when is WRONG_OU', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [];
    instance.issueType.value = IssueTypeConstant.WRONG_OU;
    instance.subIssueType.value = '';
    instance['checkBetTypeByCondition'] = jest.fn();
    instance.groupBetTypes = new GroupBetTypesModel([], null);
    instance.groupBetTypes.changeCheckGroupByBetTypes = jest.fn();
    instance.groupBetTypes.changeCheckedGroupToModel = jest.fn();
    instance.changeBetTypes = jest.fn();

    instance['checkAndUncheckBetTypesOfBasketball']();

    expect(instance.groupBetTypes.changeCheckGroupByBetTypes).toHaveBeenCalledTimes(1);
    expect(instance.groupBetTypes.changeCheckedGroupToModel).toHaveBeenCalledTimes(1);
  });

  it('#checkAndUncheckBetTypesOfBasketball should call correct method', async () => {
    const { instance } = await shallow.render();
    instance.allBetTypes = [
      new BetType(15, '1H 1X2', false, 0, true),
      new BetType(16, '1H 1X2', false, 0, false),
    ];
    instance['unCheckAllBetType'] = jest.fn();
    instance['checkBetTypeByCondition'] = jest.fn();
    instance.groupBetTypes = new GroupBetTypesModel([], null);
    instance.groupBetTypes.changeCheckGroupByBetTypes = jest.fn();
    instance.groupBetTypes.changeCheckedGroupToModel = jest.fn();
    instance.changeBetTypes = jest.fn();
    instance['checkAllBetType'] = jest.fn();

    [
      IssueTypeConstant.WRONG_1ST_HDP,
      IssueTypeConstant.WRONG_1ST_OU,
      IssueTypeConstant.WRONG_QUARTER_HDP,
      IssueTypeConstant.WRONG_SCORE
    ].forEach(x => {
      instance.issueType.value = x;
      instance['checkAndUncheckBetTypesOfBasketball']();

      expect(instance['unCheckAllBetType']).toHaveBeenCalled();
      expect(instance['checkBetTypeByCondition']).toHaveBeenCalled();
      expect(instance.groupBetTypes.changeCheckGroupByBetTypes).toHaveBeenCalled();
      expect(instance.groupBetTypes.changeCheckedGroupToModel).toHaveBeenCalled();
      expect(instance.changeBetTypes).toHaveBeenCalled();
    });
  });

  it('#displayGroupBetTypes should call #tooltip.display', async () => {
    const { instance } = await shallow.render();
    instance.groupBetTypesComponent = new GroupBetTypesComponent(null);
    instance.groupBetTypesComponent.displayGroup = jest.fn();
    instance.displayGroupBetTypes([]);

    expect(instance.groupBetTypesComponent.displayGroup).toHaveBeenCalledTimes(1);
  });

  it('#handleGroupBetTypes should call #displayGroup', async () => {
    const { instance } = await shallow.render();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    const groupBetTypes = _.cloneDeep(Helper.getFakeGroupBetTypes());
    groupBetTypes.result.errorCode = 0;
    groupBetTypes.groupBetTypes = [];
    instance.groupBetTypesHandler = new MultipleSelection();
    instance.groupBetTypes = groupBetTypes;
    instance.groupBetTypes.getAllBetType = jest.fn();
    instance.handleBetType216 = jest.fn();
    instance.handleBetTypeOfBasketball = jest.fn();

    instance.handleGroupBetTypes(groupBetTypes);

    expect(instance.isSuccessMatch).toBe(true);
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#handleGroupBetTypes should not call #displayGroup', async () => {
    const { instance } = await shallow.render();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    const groupBetTypes = _.cloneDeep(Helper.getFakeGroupBetTypes());
    groupBetTypes.result.errorCode = 0;
    instance.groupBetTypesHandler = new MultipleSelection();
    instance.groupBetTypes = groupBetTypes;
    instance.groupBetTypes.getAllBetType = jest.fn();
    instance.handleBetType216 = jest.fn();
    instance.handleBetTypeOfBasketball = jest.fn();

    instance.handleGroupBetTypes(groupBetTypes);

    expect(instance.isSuccessMatch).toBe(true);
    expect(instance.tooltip.display).toHaveBeenCalledTimes(0);
  });

  it('#handleGroupBetTypes should update isSuccessMatch to false', async () => {
    const { instance } = await shallow.render();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    const groupBetTypes = _.cloneDeep(Helper.getFakeGroupBetTypes());
    groupBetTypes.result.errorCode = 11;
    instance.groupBetTypesHandler = new MultipleSelection();
    instance.groupBetTypes = groupBetTypes;
    instance.groupBetTypes.getAllBetType = jest.fn();
    instance.handleBetType216 = jest.fn();
    instance.handleBetTypeOfBasketball = jest.fn();

    instance.handleGroupBetTypes(groupBetTypes);

    expect(instance.isSuccessMatch).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#changeEventType should emit updateEventType', async () => {
    const { instance } = await shallow.render();
    instance.updateEventType.emit = jest.fn();
    instance.changeEventType();

    expect(instance.updateEventType.emit).toHaveBeenCalledTimes(1);
  });

  it('#checkFilterParams should return false when isCorrectFormatOdds false', async () => {
    const { instance } = await shallow.render();
    instance.oddsValue = '12';
    instance.matchId = '12312';
    instance.isSuccessMatch = true;
    instance.isCorrectFormatOdds = jest.fn().mockImplementation(() => false);
    const actual = instance.checkFilterParams();

    expect(actual).toBeFalsy();
  });

  it('#copyClipboard should call #clipboardService.copyFromContent', async () => {
    const mockCopyFromContent = jest.fn();
    const { instance } = await shallow
      .mock(ClipboardService, { copyFromContent: mockCopyFromContent })
      .render();
    window.alert = jest.fn();
    instance.copyClipboard('');

    expect(mockCopyFromContent).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  it('#isCorrectFormatOdds should return true when value is empty', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.hide = jest.fn();
    const actual = instance.isCorrectFormatOdds('', '');

    expect(actual).toBeTruthy();
  });

  it('#isCorrectFormatOdds should return false when isCorrectFormatMultipleDecimal false', async () => {
    const { instance } = await shallow.render();
    instance.tooltip.display = jest.fn();
    const actual = instance.isCorrectFormatOdds('1.1.2', '');

    expect(actual).toBeFalsy();
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isCorrectFormatOdds should return true when isCorrectFormatMultipleDecimal true', async () => {
    const { instance } = await shallow.render();
    const actual = instance.isCorrectFormatOdds('1.2', '');

    expect(actual).toBeTruthy();
  });

  it('#getSelectionSubParlays return expected when bet is Sub Parlay', async () => {
    const { instance } = await shallow.render();
    let comboParlay = new MultipleSelection();
    comboParlay.items = ComboParlayConstants.ComboParlay;
    comboParlay.items[0].checked = false;
    comboParlay.items[8].checked = false;

    const expected = '3,4,5,6,7,8,9';
    const actual = instance.getSelectionSubParlays('Sub Parlay', comboParlay);

    expect(actual).toBe(expected);
  });

  it('#isShowAffectedLicenseeArea should return expected', async () => {
    const testCase = [
      {
        affectedLicensee: Helper.getFakeAffectedLicensee(), chinaViewLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(),
        affectedInstantLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cashOutLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), expected: true
      },
      {
        affectedLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), chinaViewLicensee: Helper.getFakeAffectedLicensee(),
        affectedInstantLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cashOutLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), expected: true
      },
      {
        affectedLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), chinaViewLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(),
        affectedInstantLicensee: Helper.getFakeAffectedLicensee(), cashOutLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), expected: true
      },
      {
        affectedLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), chinaViewLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(),
        affectedInstantLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cashOutLicensee: Helper.getFakeAffectedLicensee(), expected: true
      },
      {
        affectedLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), chinaViewLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(),
        affectedInstantLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cashOutLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), expected: false
      },
    ];
    const { instance } = await shallow.render();
    testCase.forEach(x => {
      instance.affectedLicensee = x.affectedLicensee;
      instance.chinaViewLicensee = x.chinaViewLicensee;
      instance.affectedInstantLicensee = x.affectedInstantLicensee;
      instance.cashOutLicensee = x.cashOutLicensee;

      const actual = instance.isShowAffectedLicenseeArea();

      expect(actual).toBe(x.expected);
    });
  });
});
