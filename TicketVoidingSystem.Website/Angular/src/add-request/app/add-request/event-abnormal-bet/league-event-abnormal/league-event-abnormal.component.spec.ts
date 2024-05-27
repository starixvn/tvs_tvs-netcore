import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { LeagueInfo, MatchInfo, MatchInfoViewModel } from '../../../../../utility/models/event.model';
import { LeagueEventAbnormalComponent } from './league-event-abnormal.component';
import { MatchModel } from '../../../../../utility/models/match.model';
import { LeagueEventService } from '../../services/league-event.service';

class Helper {
  static readonly fakeEventDate = '2020-11-06 09:44:46.361 PM';
  static readonly fakeMatch: MatchModel = {
    leagueId: 80714,
    leagueName: 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS',
    matchId: 70000364,
    name: '70000364 - Deportivo Alaves 5th Corner - vs - Zvezda Irkutsk',
    sportType: 1,
    kickOffTime: '',
    matchCode: '',
    matchEvent: ''
  };
  static readonly fakeMatchViewModel: MatchInfoViewModel = {
    match: Helper.fakeMatch,
    errorCode: 0,
    errorMsg: ''
  };
}

describe('LeagueEventAbnormalComponent', () => { 
  @NgModule({
    imports: [
      FormsModule,
      NgSelectModule,
      ToolTipModule
    ],
    providers: [
      LeagueEventService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LeagueEventAbnormalComponent>;

  beforeEach(() => {
    shallow = new Shallow(LeagueEventAbnormalComponent, AppModuleTest);
  });

  it('LeagueEventAbnormalComponent init should match snapshot', async () => {
    const { fixture, instance } = await shallow.render({
      bind: {
        isEdit: false,
      }
    });

    expect(fixture).toMatchSnapshot();
    expect(instance.isEdit).toBe(false); 
  });
  
  it('#ngOnInit should call #getMatchInEditPage when edit', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: true,
        }
      });
    instance.getMatchInEditPage = jest.fn();

    // Action
    await instance.ngOnInit();

    // Assert
    expect(instance.getMatchInEditPage).toHaveBeenCalledTimes(1);
  });

  it('#getMatchInEditPage should call #leagueEventService.getMatches and #updateInfoWithOnlyOneMatch', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(LeagueEventService, {
        getMatch: jest.fn().mockImplementation(() => Helper.fakeMatchViewModel),
        getMatchInfo: jest.fn().mockReturnValue(Helper.fakeMatch)
      })
      .render();
    instance['updateInfoWithOnlyOneMatch'] = jest.fn();

    // Action
    await instance.getMatchInEditPage(1, Helper.fakeEventDate, false, 1111, '5');

    // Assert
    expect(instance['updateInfoWithOnlyOneMatch']).toHaveBeenCalledTimes(1);
  });

  it('#updateInfoWithOnlyOneMatch should call #updateLeagueInfo', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance['updateLeagueInfo'] = jest.fn();
    let matchInfo: MatchInfo = {
      leagueId: 80714,
      leagueName: 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS',
      matchId: 70000364,
      name: '70000364 - Deportivo Alaves 5th Corner - vs - Zvezda Irkutsk',
      sportType: 1,
      kickOffTime: '',
      matchCode: '',
      matchEvent: ''
    };
  
    // Action
    instance['updateInfoWithOnlyOneMatch'](matchInfo);

    // Assert
    expect(instance['updateLeagueInfo']).toHaveBeenCalledTimes(1);
    expect(instance.matches).toEqual([matchInfo]);
  });
  
  it('#updateInfoWithOnlyOneMatch should call #updateUndefinedMatchAndLeague', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance['updateUndefinedMatchAndLeague'] = jest.fn();

    // Action
    instance['updateInfoWithOnlyOneMatch'](null);

    // Assert
    expect(instance['updateUndefinedMatchAndLeague']).toHaveBeenCalledTimes(1);
  });

  it('#updateLeagueInfo should be update leagues', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const expectedLeague: LeagueInfo[] = [{
      leagueId: Helper.fakeMatch.leagueId,
      leagueName: Helper.fakeMatch.leagueName
    }];
    // Action
    instance['updateLeagueInfo'](Helper.fakeMatch.leagueId, Helper.fakeMatch.leagueName);

    // Assert
    expect(instance.leagues).toEqual(expectedLeague);
    expect(instance.leagueId).toEqual(Helper.fakeMatch.leagueId);
  });

  it('#updateUndefinedMatchAndLeague should be update data', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    instance.updateUndefinedMatchAndLeague();

    // Assert
    expect(instance.leagues).toEqual([]);
    expect(instance.matches).toEqual([]);
    expect(instance.leagueId).toBeUndefined();
  });
});