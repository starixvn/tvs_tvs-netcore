import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { LABELS } from '../../../../utility/constants/labels';
import { MatchInfo, MatchInfoViewModel } from '../../../../utility/models/event.model';
import { ToolTipModule } from '../../../../utility/modules/tooltip/tooltip.module';
import { HttpService } from '../../../../utility/services/http.service';
import { LeagueEventComponent } from './league-event.component';
import { LeagueEventService } from './league-event.service';

class Helper {

  static readonly fakeMatches: MatchInfo = {
    leagueId: 80714,
    leagueName: 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS',
    matchId: 70000364,
    name: '70000364 - Deportivo Alaves 5th Corner - vs - Zvezda Irkutsk',
    sportType: 1
  }
  
  static readonly fakeMatchViewModel: MatchInfoViewModel = {
    match: Helper.fakeMatches,
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
    shallow = new Shallow(LeagueEventComponent, AppModuleTest);
  });

  it('LeagueEventComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('LeagueEventComponent should return expected data when change model', async () => {
    const { findComponent, fixture, instance } = await shallow.dontMock(NgSelectComponent)
      .mock(LeagueEventService, {
        getMatch: jest.fn().mockImplementation(() => Helper.fakeMatchViewModel)
      })
      .render();
    instance.isAbnormal = true; 
    instance.isEdit = false;
    const changes = {
      'isAbnormal': new SimpleChange(false, true, true)
    };
    await instance.ngOnChanges(changes);
    fixture.detectChanges();
    const selectComponent = findComponent(NgSelectComponent);
    const leagueElement = selectComponent[0];
    const eventElement = selectComponent[1];
    expect(instance.matchId).toBeUndefined();
    expect(instance.leagueId).toBeUndefined();
    expect(leagueElement.items).toStrictEqual([]);
    expect(eventElement.items).toStrictEqual([]);

    instance.isEdit = true;
    instance.sportType = 1;
    instance.eventDate = '2019-11-18 10:20:30.737';
    const sportTypeChanges = {
      'sportType': new SimpleChange(0, 1, false)
    };
    await instance.ngOnChanges(sportTypeChanges);
    fixture.detectChanges();
    expect(instance.leagues.length).toBe(1);
  });

  it('#onChangeMatchEvent should call #updateLeagueInfo and emit changeEvent', async () => {
    const { instance } = await shallow.dontMock(NgSelectComponent).render();
    instance['updateLeagueInfo'] = jest.fn();

    instance.onChangeMatchEvent(Helper.fakeMatchViewModel.match);

    expect(instance['updateLeagueInfo']).toHaveBeenCalledWith(80714, 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS');
    expect(instance.changeEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#getMatchFromMatchId should call #updateUndefinedMatchAndLeague', async () => {
    const { instance } = await shallow.dontMock(NgSelectComponent)
    .mock(LeagueEventService, {
      getMatch: jest.fn().mockImplementation(() => new MatchInfoViewModel())
    })
    .render();
    instance['updateInfoWithOnlyOneMatch'] = jest.fn();

    await instance.getMatchFromTransIds('123456789');

    expect(instance['updateInfoWithOnlyOneMatch']).toHaveBeenCalledTimes(1);
  });

  it('#isMatchIdValid should return false and display tooltip', async () => {
    const { instance } = await shallow.dontMock(NgSelectComponent).render();
    instance.matchId = undefined;
    instance.tooltip.display = jest.fn();

    const actual = instance.isMatchIdValid();

    expect(actual).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', LABELS.REQUIRED_MATCHID);
  });

  it('#isMatchIdValid should return true', async () => {
    const { instance } = await shallow.dontMock(NgSelectComponent).render();
    instance.matchId = 12345;

    const actual = instance.isMatchIdValid();

    expect(actual).toBe(true);
  });

  it('#getMatchFromMatchId should call #updateUndefinedMatchAndLeague', async () => {
    const { instance } = await shallow.dontMock(NgSelectComponent)
    .mock(LeagueEventService, {
      getMatch: jest.fn().mockImplementation(() => null)
    })
    .render();
    instance['updateUndefinedMatchAndLeague'] = jest.fn();

    await instance.getMatchFromTransIds('123456789');

    expect(instance['updateUndefinedMatchAndLeague']).toHaveBeenCalledTimes(1);
  });  
});
