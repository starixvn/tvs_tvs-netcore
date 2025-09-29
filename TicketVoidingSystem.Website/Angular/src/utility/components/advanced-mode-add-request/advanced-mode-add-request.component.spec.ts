import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { AdvancedModeAddRequestComponent } from './advanced-mode-add-request.component';
import { AdvancedModeAddRequestModel } from './advanced-mode-add-request.model';
import { GroupBetTypesAddRequestModel, BetTypeAddRequest } from './group-bet-types/group-bet-types.model';
import { BetTeamAddRequestResult } from './advanced-mode/advanced-mode.model';

class Helper {
  static readonly fakeMatchId = 123;
  static readonly fakeModel: AdvancedModeAddRequestModel = {
    checkedBetTypes: [],
    betTeamsResult: [],
    selectedAllBetTypes: []
  };
  static readonly fakeGroupBetTypes = {groupBetTypes: [], isChecked: false, isDisable: false, isCollapsed: false} as GroupBetTypesAddRequestModel;
  static readonly fakeBetTypeAddRequest = {
    id: '1',
    name: 'Test Bet Type',
    isChecked: true
  } as unknown as BetTypeAddRequest;
  static readonly fakeBetTeamAddRequestResult = {
    id: '1'
  } as unknown as BetTeamAddRequestResult;
}

describe('AdvancedModeAddRequestComponent', () => {
  let component: AdvancedModeAddRequestComponent;
  let fixture: ComponentFixture<AdvancedModeAddRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ 
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedModeAddRequestComponent);
    component = fixture.componentInstance;
    component.matchId = Helper.fakeMatchId;
    component.model = Helper.fakeModel;
    component.groupBetTypes = Helper.fakeGroupBetTypes;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.matchId).toBe(Helper.fakeMatchId);
    expect(component.model).toEqual(Helper.fakeModel);
    expect(component.groupBetTypes).toEqual(Helper.fakeGroupBetTypes);
    expect(component.changedBetTypes).toEqual([]);
  });

  it('should change bet types', () => {
    const betTypes = [Helper.fakeBetTypeAddRequest];
    component.changeBetTypes(betTypes);
    expect(component.changedBetTypes).toEqual(betTypes);
  });

  it('should emit change filter event', () => {
    const spy = jest.spyOn(component.changeFilterEvent, 'emit');
    component.changeFilter();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit loading data event', () => {
    const isLoading = true;
    const spy = jest.spyOn(component.isLoadingData, 'emit');
    component.checkingLoadDataAdvancedMode(isLoading);
    expect(spy).toHaveBeenCalledWith(isLoading);
  });

  it('should get checked bet types', () => {
    const mockCheckedBetTypes = [Helper.fakeBetTeamAddRequestResult];
    const mockAdvancedModeBetTypes = [Helper.fakeBetTeamAddRequestResult];
    
    component.groupBetTypesComponent = {
      getCheckedBetTypes: () => mockCheckedBetTypes
    } as any;

    component.advancedModeComponent = {
      getCheckedBetTypeModels: () => mockAdvancedModeBetTypes
    } as any;

    const result = component.getCheckedBetTypes();
    expect(result).toBeDefined();
  });

  it('should get more bet types with same displayed id', () => {
    const inputModels = [Helper.fakeBetTeamAddRequestResult];
    const result = component.getMoreBetTypeSameDisplayedId(inputModels);
    expect(result).toBeDefined();
  });

  it('should get more bet types by item', () => {
    const inputModel = Helper.fakeBetTeamAddRequestResult;
    const result = component.getMoreBetTypeSameDisplayedIdByItem(inputModel);
    expect(result).toBeDefined();
  });

  it('should handle no bet type event', () => {
    const isHaveBetType = true;
    const spy = jest.spyOn(component.checkExistBetTypeEvent, 'emit');
    component.handleNoBetTypeEvent(isHaveBetType);
    expect(spy).toHaveBeenCalledWith(isHaveBetType);
  });

  it('should clear bet team', () => {
    component.advancedModeComponent = {
      clearBetTeam: jest.fn()
    } as any;
    component.clearBetTeam();
    expect(component.advancedModeComponent.clearBetTeam).toHaveBeenCalled();
  });

  it('should check validity', () => {
    component.groupBetTypesComponent = {
      isValidity: () => true
    } as any;
    component.advancedModeComponent = {
      isValidity: () => true
    } as any;
    const result = component.isValidity();
    expect(result).toBeTruthy();
  });

  it('should reset all bet teams', () => {
    const mockBetTeams = [{
      selections: [],
      resetAllChecked: jest.fn()
    }];
    component.advancedModeComponent = {
      betTeams: mockBetTeams,
      resetControlsAllBetTypes: jest.fn()
    } as any;
    component.resetAllBetTeams();
    expect(component.advancedModeComponent.resetControlsAllBetTypes).toHaveBeenCalled();
  });
}); 