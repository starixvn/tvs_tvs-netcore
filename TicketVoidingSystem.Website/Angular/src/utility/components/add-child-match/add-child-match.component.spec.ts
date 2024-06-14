import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { ChildMatchModel } from '../../../add-request/app/add-request/models/related-event.model';
import { MatchType } from '../../constants/config';
import { HttpService } from '../../services/http.service';
import { BlockUiModule } from '../block-ui/block-ui.module';
import { ToolTipModule } from '../tooltip/tooltip.module';
import { AddChildMatchComponent } from './add-child-match.component';
import { AddChildMatchModel } from './add-child-match.model';

class Helper {
  static readonly inputMatchSelector = 'input[type=text].input-match-id';

  static readonly fakeAddChildMatchModel: AddChildMatchModel = {
    isOpen: true,
    matchType: 0,
    selectedMatchIds: []
  };
  static readonly fakeChildMatchModelList: ChildMatchModel[] = [
    {
      matchId: 12345,
      matchCode: '111',
      matchEvent: 'Holstein Kiel - vs - Hamburger SV',
      isChecked: true,
      matchType: 0,
      leagueName: '',
      name: '',
      homeId: 0,
      homeName: '',
      homeNameNewSimplified: '',
      homeNameSimplified: '',
      homeNameTraditional: '',
      awayId: 0,
      awayName: '',
      awayNameNewSimplified: '',
      awayNameSimplified: '',
      awayNameTraditional: '',
      eventDate: undefined,
      dateTime: undefined,
      leagueId: 0,
      leagueGroupId: 0,
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '',
      startTime: undefined,
      endTime: undefined,
      sportType: 0,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: ''
    },
    {
      matchId: 39420383,
      matchCode: '222',
      matchEvent: 'MU (V) - vs - Real Madrid (V)',
      isChecked: true,
      matchType: 0,
      leagueName: '',
      name: '',
      homeId: 0,
      homeName: '',
      homeNameNewSimplified: '',
      homeNameSimplified: '',
      homeNameTraditional: '',
      awayId: 0,
      awayName: '',
      awayNameNewSimplified: '',
      awayNameSimplified: '',
      awayNameTraditional: '',
      eventDate: undefined,
      dateTime: undefined,
      leagueId: 0,
      leagueGroupId: 0,
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '',
      startTime: undefined,
      endTime: undefined,
      sportType: 0,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: ''
    },
    {
      matchId: 39420384,
      matchCode: '222',
      matchEvent: 'Barca (V) - vs - Real Madrid (V)',
      isChecked: true,
      matchType: 1,
      leagueName: '',
      name: '',
      homeId: 0,
      homeName: '',
      homeNameNewSimplified: '',
      homeNameSimplified: '',
      homeNameTraditional: '',
      awayId: 0,
      awayName: '',
      awayNameNewSimplified: '',
      awayNameSimplified: '',
      awayNameTraditional: '',
      eventDate: undefined,
      dateTime: undefined,
      leagueId: 0,
      leagueGroupId: 0,
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '',
      startTime: undefined,
      endTime: undefined,
      sportType: 0,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: ''
    }
  ];

  static readonly fakeTempChildMatches: ChildMatchModel[] = [
    {
      matchId: 12345,
      matchCode: '111',
      matchEvent: 'Holstein Kiel - vs - Hamburger SV',
      isChecked: true,
      matchType: 1,
      leagueName: '',
      name: '',
      homeId: 0,
      homeName: '',
      homeNameNewSimplified: '',
      homeNameSimplified: '',
      homeNameTraditional: '',
      awayId: 0,
      awayName: '',
      awayNameNewSimplified: '',
      awayNameSimplified: '',
      awayNameTraditional: '',
      eventDate: undefined,
      dateTime: undefined,
      leagueId: 0,
      leagueGroupId: 0,
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '',
      startTime: undefined,
      endTime: undefined,
      sportType: 0,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: ''
    },
    {
      matchId: 39420383,
      matchCode: '222',
      matchEvent: 'VietNam (V) - vs - Real Madrid (V)',
      isChecked: false,
      matchType: 2,
      leagueName: '',
      name: '',
      homeId: 0,
      homeName: '',
      homeNameNewSimplified: '',
      homeNameSimplified: '',
      homeNameTraditional: '',
      awayId: 0,
      awayName: '',
      awayNameNewSimplified: '',
      awayNameSimplified: '',
      awayNameTraditional: '',
      eventDate: undefined,
      dateTime: undefined,
      leagueId: 0,
      leagueGroupId: 0,
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '',
      startTime: undefined,
      endTime: undefined,
      sportType: 0,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: ''
    },
    {
      matchId: 39420384,
      matchCode: '222',
      matchEvent: 'MU (V) - vs - Real Madrid (V)',
      isChecked: false,
      matchType: 1,
      leagueName: '',
      name: '',
      homeId: 0,
      homeName: '',
      homeNameNewSimplified: '',
      homeNameSimplified: '',
      homeNameTraditional: '',
      awayId: 0,
      awayName: '',
      awayNameNewSimplified: '',
      awayNameSimplified: '',
      awayNameTraditional: '',
      eventDate: undefined,
      dateTime: undefined,
      leagueId: 0,
      leagueGroupId: 0,
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '',
      startTime: undefined,
      endTime: undefined,
      sportType: 0,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: ''
    }
  ];

  static readonly fakeChildMatchModel: ChildMatchModel = {
    matchId: 99999,
    matchCode: '222',
    matchEvent: 'TestC - vs - Real Madrid (V)',
    isChecked: true,
    matchType: 0,
    leagueName: '',
    name: '',
    homeId: 0,
    homeName: '',
    homeNameNewSimplified: '',
    homeNameSimplified: '',
    homeNameTraditional: '',
    awayId: 0,
    awayName: '',
    awayNameNewSimplified: '',
    awayNameSimplified: '',
    awayNameTraditional: '',
    eventDate: undefined,
    dateTime: undefined,
    leagueId: 0,
    leagueGroupId: 0,
    leagueNameNewSimplified: '',
    leagueNameSimplified: '',
    leagueNameTraditional: '',
    matchEventSimplified: '',
    matchEventNewSimplified: '',
    kickOffTime: '',
    startTime: undefined,
    endTime: undefined,
    sportType: 0,
    sportTypeName: '',
    sportTypeNameNewSimplified: '',
    sportTypeNameSimplified: '',
    sportTypeNameTraditional: ''
  };
}

describe('AddChildMatchComponent', () => {
  @NgModule({
    imports: [
      ToolTipModule,
      BlockUiModule,
      FormsModule
    ],
    providers: [
      HttpService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AddChildMatchComponent>;

  beforeEach(() => {
    shallow = new Shallow(AddChildMatchComponent, AppModuleTest);
  });

  it('#AddChildMatchComponent init should match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    
    // Action
    expect(fixture).toMatchSnapshot();
  });
  
  it('#handleCheckAllMatches should update checked when click check all', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    instance.tempRelatedEvents = Helper.fakeTempChildMatches;
    instance.model.matchType = MatchType.CHILD;

    // Action
    instance.handleCheckAllMatches({target:{checked: true}});
    
    // Asset
    expect(instance.tempRelatedEvents.filter(y => y.matchType === instance.model.matchType).every(x => x.isChecked)).toBeTruthy();
  });
  
  it('#handleCheckAllMatches should not update checked when click check all', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    instance.tempRelatedEvents = _.cloneDeep(Helper.fakeTempChildMatches);
    instance.tempRelatedEvents.forEach(x => x.matchType = MatchType.LINK);
    instance.model.matchType = MatchType.CHILD;

    // Action
    instance.handleCheckAllMatches({target:{checked: true}});
    
    // Asset
    expect(instance.tempRelatedEvents.filter(y => y.matchType === instance.model.matchType).every(x => x.isChecked)).toBeTruthy();
  });
  
  it('#handleCheckAllMatches should emit #changeEvent', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    instance.changeEvent.emit = jest.fn();

    // Action
    instance.clickButtonSave();
    
    // Asset
    expect(instance.changeEvent.emit).toHaveBeenCalledTimes(1);
  });
  
  it('#closeChildMatchModal should emit #isOpenChange', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    instance.isOpenChange.emit = jest.fn();

    // Action
    instance.closeChildMatchModal();
    
    // Asset
    expect(instance.isOpenChange.emit).toHaveBeenCalledTimes(1);
  });
  
  it('#saveSelectedRelatedEvents should emit #selectedEventsChange', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    instance.tempRelatedEvents = Helper.fakeTempChildMatches;
    instance.selectedEventsChange.emit = jest.fn();
    instance.closeChildMatchModal = jest.fn();

    // Action
    instance.saveSelectedRelatedEvents();
    
    // Asset
    expect(instance.selectedEventsChange.emit).toHaveBeenCalledTimes(1);
    expect(instance.closeChildMatchModal).toHaveBeenCalledTimes(1);
  });
  
  it('#isMatchExisted should return true', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });

    // Action
    const actual = instance.isMatchExisted(Helper.fakeTempChildMatches, 12345);
    
    // Asset
    expect(actual).toBeTruthy();
  });
  
  it('#isMatchExisted should return false', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });

    // Action
    const actual = instance.isMatchExisted(Helper.fakeTempChildMatches, 1234567);
    
    // Asset
    expect(actual).toBe(false);
  });
  
  it('#handleCheckBox should update #isCheckedAll to true', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    instance.tempRelatedEvents = _.cloneDeep(Helper.fakeTempChildMatches);
    instance.tempRelatedEvents.forEach(x => x.isChecked = true);

    // Action
    instance.handleCheckBox();
    
    // Asset
    expect(instance.isCheckedAll).toBe(true);
  });
  
  it('#handleCheckBox should update #isCheckedAll to false', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    instance.tempRelatedEvents = _.cloneDeep(Helper.fakeTempChildMatches);
    instance.tempRelatedEvents.forEach(x => x.isChecked = true);
    instance.tempRelatedEvents.push(new ChildMatchModel());

    // Action
    instance.handleCheckBox();
    
    // Asset
    expect(instance.isCheckedAll).toBe(false);
  });

  it('#ngOnChanges should call #handleCheckBox', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    instance.relatedEvents = Helper.fakeTempChildMatches;
    instance.tempRelatedEvents = Helper.fakeTempChildMatches;
    instance.handleCheckBox = jest.fn();
    const changes = {
      'model': new SimpleChange(new AddChildMatchModel(), new AddChildMatchModel(), true)
    };

    // Action
    await instance.ngOnChanges(changes);
    
    // Asset
    expect(instance.handleCheckBox).toHaveBeenCalledTimes(1);
  });
  
  it('#ngOnChanges should not call #handleCheckBox', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeAddChildMatchModel,
      }
    });
    instance.handleCheckBox = jest.fn();

    // Action
    await instance.ngOnChanges({});
    
    // Asset
    expect(instance.handleCheckBox).toHaveBeenCalledTimes(0);
  });
});
