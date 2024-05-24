import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { MatchInfo, MatchInfoViewModel, LeagueInfo } from '../../../../utility/models/event.model';
import { HttpService } from '../../../../utility/services/http.service';
import { LeagueEventComponent } from './league-event.component';
import { MatchModel } from '../../../../utility/models/match.model';
import { LeagueEventService } from './league-event.service';
import { Tooltip } from 'src/utility/components/tooltip/tooltip.model';
import { Console } from 'console';

class Helper {

  static readonly fakeMatches: MatchInfo = {
    leagueId: 80714,
    leagueName: 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS',
    matchId: 70000364,
    name: '70000364 - Deportivo Alaves 5th Corner - vs - Zvezda Irkutsk',
    sportType: 1,
    kickOffTime: ''
  }
  static readonly fakeMatchModel: MatchModel = {
    leagueId: 80714,
    leagueName: 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS',
    matchId: 70000364,
    name: '70000364 - Deportivo Alaves 5th Corner - vs - Zvezda Irkutsk',
    sportType: 1,
    kickOffTime: '',
    matchCode: '',
    matchEvent: '',
    parentId: 1
  }
  static readonly fakeMatchViewModel: MatchInfoViewModel = {
    match: Helper.fakeMatchModel,
    errorCode: 0,
    errorMsg: ''
  };
}

describe('LeagueEventComponent', () => {
  @NgModule({
    imports: [
      FormsModule,
      NgSelectModule,
      ToolTipModule
    ],
    providers: [
      HttpService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LeagueEventComponent>;

  beforeEach(() => {
    shallow = new Shallow(LeagueEventComponent, AppModuleTest)
    .mock(LeagueEventService, { getMatch: jest.fn().mockImplementation(() => Helper.fakeMatchViewModel)})
  });

  it('LeagueEventComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#getMatchInfo should return matchInfoModel expected', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let match = Helper.fakeMatchModel;
    let matchInfoExpected: MatchInfo = {
      matchId: 70000364,
      name: '70000364 - Deportivo Alaves 5th Corner - vs - Zvezda Irkutsk',
      kickOffTime: '',
      leagueId: 80714,
      sportType: 1, 
      matchCode: '',
      leagueName: 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS',
      parentId: 1
    }; 

    // Action
    const actual = instance['getMatchInfo'](match);

    // Assert
    expect(actual).toEqual(matchInfoExpected);
  });
  
  it('#isMatchIdValid should return false when LeagueEventComponent has not matchId', async () => {
    // Arrange
    let fakeTooltipDisplay = jest.fn();
    const { instance } = await shallow.render();
    instance.tooltip.display = fakeTooltipDisplay;

    // Action
    const actual = instance['isMatchIdValid']();

    // Assert
    expect(actual).toBeFalsy();
    expect(fakeTooltipDisplay).toHaveBeenCalledTimes(1);
  });
  
  it('#isMatchIdValid should return true when LeagueEventComponent has matchId', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.matchId = 753535;

    // Action
    const actual = instance['isMatchIdValid']();

    // Assert
    expect(actual).toBeTruthy();
  });
  
  it('#updateUndefinedMatchAndLeague should reSetValue Matches And Leagues', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const fakeFunction = jest.fn();
    instance.leagues = [new LeagueInfo()];
    instance.matches = [new MatchInfo()];
    instance.matchId = 8573647;
    instance.leagueId = 1;
    instance.matchIdChange.emit = fakeFunction;

    // Action
    instance['updateUndefinedMatchAndLeague']();

    // Assert
    expect(instance.leagues).toHaveLength(0);
    expect(instance.matches).toHaveLength(0);
    expect(instance.matchId).toBeUndefined();
    expect(instance.leagueId).toBeUndefined();
    expect(fakeFunction).toHaveBeenCalledTimes(1);
  });

  it('#updateLeagueInfo should update leagues according to input', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.leagues = [new LeagueInfo()];
    instance.leagueId = 11111;
    const leagueId = 1;
    const leagueName = "AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS"
    const leaguesExpected: LeagueInfo[] = [{
      leagueId: leagueId,
      leagueName: leagueName
    }];
    // Action
    instance['updateLeagueInfo'](leagueId, leagueName);

    // Assert
    expect(instance.leagues).toEqual(leaguesExpected);
    expect(instance.leagueId).toEqual(leagueId);
  });
  
  it('#updateInfoWithOnlyOneMatch should update matches with input MatchValue', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const fakeEventChangeSportTypeAbnormal = jest.fn();
    const fakeEventMatchIdChange = jest.fn();
    const fakeFunctionUpdateLeagueInfo = jest.fn();
    instance.changeSportTypeAbnormal.emit = fakeEventChangeSportTypeAbnormal;
    instance.matchIdChange.emit = fakeEventMatchIdChange;
    instance.matches = [new MatchInfo()];
    instance.matchId = 654346;
    instance['updateLeagueInfo'] = fakeFunctionUpdateLeagueInfo;
    const matchesExpected: MatchInfo[] = [Helper.fakeMatches]

    // Action
    instance['updateInfoWithOnlyOneMatch'](Helper.fakeMatches);

    // Assert
    expect(instance.matches).toEqual(matchesExpected);
    expect(instance.matchId).toEqual(Helper.fakeMatches.matchId);
    expect(fakeEventChangeSportTypeAbnormal).toHaveBeenCalledTimes(1);
    expect(fakeEventMatchIdChange).toHaveBeenCalledTimes(1);
    expect(fakeFunctionUpdateLeagueInfo).toHaveBeenCalledTimes(1);
  });

  it('#updateInfoWithOnlyOneMatch should has call updateUndefinedMatchAndLeague with input Match is Undefined', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const fakeFunctionUpdateUndefinedMatchAndLeague = jest.fn();
    instance.matches = [new MatchInfo()];
    instance.matchId = 654346;
    instance['updateUndefinedMatchAndLeague'] = fakeFunctionUpdateUndefinedMatchAndLeague;
    let matchInput: MatchInfo;

    // Action
    instance['updateInfoWithOnlyOneMatch'](matchInput);

    // Assert
    expect(fakeFunctionUpdateUndefinedMatchAndLeague).toHaveBeenCalledTimes(1);
  });

  it('#getMatchFromMatchId should has call getMatch and updateMatchInfo', async () => {
    // Arrange
    const fakeFunctionGetMatch = jest.fn().mockReturnValue(Helper.fakeMatchViewModel);
    const fakeEventChangeMatchInfo = jest.fn();
    const fakeFunctionUpdateInfoWithOnlyOneMatch = jest.fn();

    const { instance } = await shallow
    .mock(LeagueEventService, {getMatch: fakeFunctionGetMatch})
    .render();
    instance.changeMatchInfo.emit = fakeEventChangeMatchInfo;
    instance['updateInfoWithOnlyOneMatch'] = fakeFunctionUpdateInfoWithOnlyOneMatch;

    // Action
    await instance['getMatchFromMatchId']();
    
    // Assert
    expect(fakeFunctionGetMatch).toHaveBeenCalledTimes(1);
    expect(fakeEventChangeMatchInfo).toHaveBeenCalledTimes(1);
    expect(fakeFunctionUpdateInfoWithOnlyOneMatch).toHaveBeenCalledTimes(1);
  });
});
