import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AdvancedModeComponent } from './advanced-mode.component';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AdvancedModeAddRequestModel } from '../advanced-mode-add-request.model';
import { BetTypeAddRequest } from '../group-bet-types/group-bet-types.model';
import { BetTeamAddRequest } from './advanced-mode.model';
import { SimpleChange } from '@angular/core';
import { BetTeamAddRequestService } from './bet-team-add-request.service';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';

class Helper {
  static readonly fakeMatchId = 123;
  static readonly fakeChangedBetTypes: BetTypeAddRequest[] = [
    { id: 1, name: 'Test Bet Type', isChecked: true, isDisable: false }
  ];
  static readonly fakeAdvancedModeAddRequestModel = {
    checkedBetTypes: [],
    betTeamsResult: [],
    selectedAllBetTypes: []
  } as unknown as AdvancedModeAddRequestModel;
  static readonly fakeBetTeams = [
    new BetTeamAddRequestService(new MultipleSelectionService()).initBetTeamAddRequest([0, 'Test Team', 'value', 1, '1'], [], [], true)
  ] as unknown as BetTeamAddRequest[];
  static readonly fakeOddsInfo = [
    {
      betTypeId: '1',
      playerName: 'Test Player',
      playerId: 1,
      oddsId: 1,
      betChoice: 'choice'
    }
  ];
}

describe('AdvancedModeComponent', () => {
  let component: AdvancedModeComponent;
  let fixture: ComponentFixture<AdvancedModeComponent>;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        CommonService,
        StaticService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedModeComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    component = fixture.componentInstance;
    component.changeFilterEvent.emit = jest.fn();
    component.isLoadingData.emit = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.betTeams).toEqual([]);
    expect(component.isCollapse).toBeTruthy();
    expect(component.isShowAdvancedModeFilter).toBeFalsy();
  });

  it('should handle ngOnChanges with matchId and changedBetTypes', async () => {
    // Arrange
    component.matchId = Helper.fakeMatchId;
    component.changedBetTypes = Helper.fakeChangedBetTypes;
    component.betTeams = [];
    const mockGetBetTeams = jest.fn().mockResolvedValue(Helper.fakeBetTeams);
    Object.defineProperty(component, 'service', {
      get: () => ({ getBetTeamsAddRequest: mockGetBetTeams })
    });
    commonService.getOddsInfoSpecialBetTypes = jest.fn().mockResolvedValue(Helper.fakeOddsInfo);

    // Act
    await component.ngOnChanges({
      changedBetTypes: {
        currentValue: Helper.fakeChangedBetTypes,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.isLoadingData.emit).toHaveBeenCalledWith(true);
    expect(mockGetBetTeams).toHaveBeenCalled();
    expect(component.isLoadingData.emit).toHaveBeenCalledWith(false);
  });

  it('should handle ngOnChanges with advancedModeAddRequestModel', async () => {
    // Arrange
    component.matchId = Helper.fakeMatchId;
    component.advancedModeAddRequestModel = Helper.fakeAdvancedModeAddRequestModel;
    const mockGetBetTeams = jest.fn().mockResolvedValue(Helper.fakeBetTeams);
    Object.defineProperty(component, 'service', {
      get: () => ({ getBetTeamsAddRequest: mockGetBetTeams })
    });
    commonService.getOddsInfoSpecialBetTypes = jest.fn().mockResolvedValue(Helper.fakeOddsInfo);

    // Act
    await component.ngOnChanges({
      advancedModeAddRequestModel: {
        currentValue: Helper.fakeAdvancedModeAddRequestModel,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.isLoadingData.emit).toHaveBeenCalledWith(true);
    expect(mockGetBetTeams).toHaveBeenCalled();
    expect(component.isLoadingData.emit).toHaveBeenCalledWith(false);
  });

  it('should expand and validate', () => {
    // Arrange
    component.isCollapse = true;

    // Act
    component.expandAndValidate();

    // Assert
    expect(component.isCollapse).toBeFalsy();
  });

  it('should clear bet team', () => {
    // Arrange
    component.isShowAdvancedModeFilter = true;
    component.isCollapse = false;
    component.betTeams = Helper.fakeBetTeams;

    // Act
    component.clearBetTeam();

    // Assert
    expect(component.isShowAdvancedModeFilter).toBeFalsy();
    expect(component.isCollapse).toBeTruthy();
    expect(component.betTeams).toEqual([]);
  });

  it('should validate selections', () => {
    // Arrange
    const betTeam = Helper.fakeBetTeams[0];

    betTeam.selections = [{
      index: 0,
      name: 'Test Selection',
      value: "value",
      items: [],
      multiSelection: null,
      isMultiple: false,
      xmlAttribute: 'test',
      isDisabled: false
      
    }];

    // Act
    const result = component.isValidSelections(betTeam);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate inputs', () => {
    // Arrange
    const betTeam = Helper.fakeBetTeams[0];
    betTeam.inputs = [{
        index: 0,
        value: '1.5',
        isMultiple: false,
        name: 'Test Input',
        isRowSpan: false,
        isDisabled: false,
        isChecked: false,
        xmlAttribute: 'test',
        format: 'decimal'
      }];

    // Act
    const result = component.isValidInputs(betTeam);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should update controls all bet types', () => {
    // Arrange
    component.advancedModeAddRequestModel = Helper.fakeAdvancedModeAddRequestModel;
    component.advancedModeAddRequestModel.selectedAllBetTypes = [
      { name: 'Test Type', value: '1,2,3' }
    ];

    // Act
    component.updateControlsAllBetTypes();

    // Assert
    expect(component.controlsAllBetTypesLists.length).toBeGreaterThan(0);
  });
}); 