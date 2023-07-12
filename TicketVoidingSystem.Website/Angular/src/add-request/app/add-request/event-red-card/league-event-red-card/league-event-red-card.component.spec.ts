import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { LABELS } from '../../../../../utility/constants/labels';
import { LeagueInfo, MatchInfo, MatchInfoViewModel } from '../../../../../utility/models/event.model';
import { ToolTipModule } from '../../../../../utility/modules/tooltip/tooltip.module';
import { LeagueEventService } from '../../league-event/league-event.service';
import { LeagueEventRedCardComponent } from './league-event-red-card.component';

class Helper {
  static readonly fakeEventDate = '2020-11-06 09:44:46.361 PM';
  static readonly fakeMatches = {
    leagueId: 80714,
    leagueName: 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS',
    matchId: 70000364,
    name: '70000364 - Deportivo Alaves 5th Corner - vs - Zvezda Irkutsk',
    sportType: 1
  };
  
  static readonly fakeMatchViewModel: MatchInfoViewModel = {
    match: Helper.fakeMatches,
    errorCode: 0,
    errorMsg: ''
  };
}

describe('LeagueEventRedCardComponent', () => { 
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

  let shallow: Shallow<LeagueEventRedCardComponent>;

  beforeEach(() => {
    shallow = new Shallow(LeagueEventRedCardComponent, AppModuleTest);
  });

  it('LeagueEventRedCardComponent init should match snapshot', async () => {
    const { fixture, instance } = await shallow.render({
      bind: {
        isEdit: false,
      }
    });

    expect(fixture).toMatchSnapshot();
    expect(instance.isEdit).toBe(false); 
  });

  it('#ngOnChanges should call #updateUndefinedMatchAndLeague and emit changeEvent', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
        }
      });
    instance.updateUndefinedMatchAndLeague = jest.fn();
    const changes = {
      'eventDate': new SimpleChange('2020-11-06 09:44:46.361 PM', '2020-11-07 09:44:46.361 PM', true)
    };
    // Action
    await instance.ngOnChanges(changes);

    // Assert
    expect(instance.updateUndefinedMatchAndLeague).toHaveBeenCalledTimes(1);
    expect(instance.changeEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#ngOnChanges should call #getMatchInEditPage', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: true,
        }
      });
    instance.getMatchInEditPage = jest.fn();
    instance.initMatchId = 999;
    const changes = {
      'initMatchId': new SimpleChange('999', '111', true)
    };
    // Action
    await instance.ngOnChanges(changes);

    // Assert
    expect(instance.getMatchInEditPage).toHaveBeenCalledTimes(1);
  });

  it('#onChangeMatchEvent should call #updateLeagueInfo and emit changeEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: true,
      }
    });
    instance['updateLeagueInfo'] = jest.fn();

    instance.onChangeMatchEvent(Helper.fakeMatches);

    expect(instance['updateLeagueInfo']).toHaveBeenCalledWith(80714, 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS');
    expect(instance.changeEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isMatchIdValid should return false and display tooltip', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: true,
      }
    });
    instance.selectedMatch.matchId = undefined;
    instance.tooltip.display = jest.fn();

    const actual = instance.isMatchIdValid();

    expect(actual).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', LABELS.REQUIRED_MATCHID);
  });

  it('#isMatchIdValid should return true', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: true,
        }
      });
    instance.selectedMatch.matchId = 12345;

    const actual = instance.isMatchIdValid();

    expect(actual).toBe(true);
  });

  it('#getMatchInEditPage should call #leagueEventService.getMatches and #updateInfoWithOnlyOneMatch', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(LeagueEventService, {
        getMatch: jest.fn().mockImplementation(() => Helper.fakeMatchViewModel)
      })
      .render();
    instance['updateInfoWithOnlyOneMatch'] = jest.fn();

    // Action
    await instance.getMatchInEditPage(1, Helper.fakeEventDate, false, 1111, '5');

    // Assert
    expect(instance['updateInfoWithOnlyOneMatch']).toHaveBeenCalledTimes(1);
  });
  
  it('#onChangeMatchEvent should call #updateLeagueInfo', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance['updateLeagueInfo'] = jest.fn();
    instance.changeEvent.emit = jest.fn();

    // Action
    instance.onChangeMatchEvent(Helper.fakeMatches);

    // Assert
    expect(instance['updateLeagueInfo']).toHaveBeenCalledTimes(1);
    expect(instance.selectedMatch).toEqual(Helper.fakeMatches);
    expect(instance.changeEvent.emit).toHaveBeenCalledWith(Helper.fakeMatches);
  });

  it('#updateInfoWithOnlyOneMatch should call #updateLeagueInfo', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance['updateLeagueInfo'] = jest.fn();

    // Action
    instance['updateInfoWithOnlyOneMatch'](Helper.fakeMatches);

    // Assert
    expect(instance['updateLeagueInfo']).toHaveBeenCalledTimes(1);
    expect(instance.selectedMatch).toEqual(Helper.fakeMatches);
    expect(instance.matches).toEqual([Helper.fakeMatches]);
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
      leagueId: Helper.fakeMatches.leagueId,
      leagueName: Helper.fakeMatches.leagueName
    }];
    // Action
    instance['updateLeagueInfo'](Helper.fakeMatches.leagueId, Helper.fakeMatches.leagueName);

    // Assert
    expect(instance.leagues).toEqual(expectedLeague);
    expect(instance.leagueId).toEqual(Helper.fakeMatches.leagueId);
  });

  it('#updateUndefinedMatchAndLeague should be update data', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    instance.updateUndefinedMatchAndLeague();

    // Assert
    expect(instance.leagues).toEqual([]);
    expect(instance.matches).toEqual([]);
    expect(instance.selectedMatch).toStrictEqual(new MatchInfo());
    expect(instance.leagueId).toBeUndefined();
  });
  
  it('#blurMatchSelect should be update validationMessage to empty', async () => {
    // Arrange
    const { instance } = await shallow.render();
    
    // Action
    instance.blurMatchSelect();

    // Assert
    expect(instance.validationMessage).toBe('');
  });
});