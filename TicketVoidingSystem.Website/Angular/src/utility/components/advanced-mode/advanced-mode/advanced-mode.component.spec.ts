import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AdvancedModeComponent } from './advanced-mode.component';
import { AdvancedModeApiService } from './advanced-mode-api.service';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { GetPlayersQuery, OddsInfo } from './advanced-mode.model';
import { BetType } from '../group-bettypes/group-bettypes.model';
import { SimpleChange } from '@angular/core';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { AdvancedModeService } from './advanced-mode.service';

class Helper {
  static readonly fakeMatchId = '123';
  static readonly fakeBetTypes = [
    {
      id: 1,
      name: 'Test Bet Type 1',
      value: '1',
      isChecked: true
    },
    {
      id: 2, 
      name: 'Test Bet Type 2',
      value: '2',
      isChecked: false
    }
  ] as BetType[];
  static readonly fakeGetPlayerQuery = {
    matchId: '123',
    betTypeId: '1'
  } as unknown as GetPlayersQuery;
  static readonly fakeOddsInfo = [
    {
      betTypeId: '1',
      playerId: 1,
      playerName: 'Test Player',
      oddsId: '1',
      betChoice: '1'
    }
  ] as unknown as OddsInfo[];
}

describe('AdvancedModeComponent', () => {
  let component: AdvancedModeComponent;
  let fixture: ComponentFixture<AdvancedModeComponent>;
  let advancedModeApiService: AdvancedModeApiService;
  let commonService: CommonService;
  let advancedModeService: AdvancedModeService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AdvancedModeApiService,
        CommonService,
        StaticService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedModeComponent);
    advancedModeApiService = fixture.debugElement.injector.get(AdvancedModeApiService);
    commonService = fixture.debugElement.injector.get(CommonService);
    advancedModeService = fixture.debugElement.injector.get(AdvancedModeService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isShowAdvancedMode).toBeFalsy();
    expect(component.isShowContent).toBeFalsy();
    expect(component.isShowAllBetTypeMapRound).toBeFalsy();
    expect(component.isShowAllBetTypeQuarter).toBeFalsy();
    expect(component.isShowAllBetTypeSet).toBeFalsy();
    expect(component.isShowAllBetTypeGame).toBeFalsy();
    expect(component.isShowAllBetTypeInning).toBeFalsy();
  });

  it('should handle bet types changes', async () => {
    // Arrange
    component.matchId = Helper.fakeMatchId;
    component.allBetTypes = Helper.fakeBetTypes;
    const mockBetTeams = [
      advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false)
    ];
    advancedModeApiService.getBetTeams = jest.fn().mockResolvedValue(mockBetTeams);
    commonService.getOddsInfoSpecialBetTypes = jest.fn().mockResolvedValue([]);

    // Act
    await component.ngOnChanges({
      allBetTypes: {
        currentValue: Helper.fakeBetTypes,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      } as SimpleChange
    });

    // Assert
    expect(component.isShowAdvancedMode).toBeTruthy();
    expect(component.isShowContent).toBeTruthy();
  });

  it('should handle get player query changes', async () => {
    // Arrange
    component.getPlayerQuery = Helper.fakeGetPlayerQuery;
    const mockPlayers = [
      {
        betChoice: '1',
        oddsInfo: '1.5'
      }
    ];
    const mockBetTeam = advancedModeService.initBetTeam([0, 'Test', '216', 1, '216'], [], [], [], false);
    const mockMultiSelection = {
      name: 'test',
      value: 'test',
      xmlAttribute: 'test',
      type: 'test',
      multipleSelect: new MultipleSelection()
    };
    mockBetTeam.multiSelection = mockMultiSelection;
    component.betTeams = [mockBetTeam];
    advancedModeApiService.getPlayer = jest.fn().mockResolvedValue(mockPlayers);

    // Act
    await component.ngOnChanges({
      getPlayerQuery: {
        currentValue: Helper.fakeGetPlayerQuery,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      } as SimpleChange
    });

    // Assert
    expect(advancedModeApiService.getPlayer).toHaveBeenCalledWith(Helper.fakeGetPlayerQuery);
  });

  it('should render bet teams correctly', () => {
    // Arrange
    const mockBetTeams = [
      advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false)
    ];

    // Act
    component.renderBetTeams(mockBetTeams);

    // Assert
    expect(component.betTeams.length).toBe(1);
    expect(component.betTeams[0].name).toBe('Test');
  });

  it('should render map and round correctly', () => {
    // Act
    component.renderMapAndRound();

    // Assert
    expect(component.mapList).toBeDefined();
    expect(component.roundList).toBeDefined();
    expect(component.quarterList).toBeDefined();
    expect(component.setList).toBeDefined();
    expect(component.gameList).toBeDefined();
    expect(component.inningList).toBeDefined();
  });

  it('should update player cricket correctly', () => {
    // Arrange
    const oddsInfo = Helper.fakeOddsInfo;

    // Act
    component['updatePlayerCricket'](oddsInfo);

    // Assert
    expect(component.baseSpecialBetTypeCricket.length).toBeGreaterThan(0);
  });

  it('should check if all bet types selection is shown', () => {
    // Arrange
    component.isShowAllBetTypeMapRound = true;
    component.isShowAllBetTypeQuarter = false;
    component.isShowAllBetTypeSet = false;
    component.isShowAllBetTypeGame = false;
    component.isShowAllBetTypeInning = false;

    // Act
    const result = component.isShowALLBetTypesSelection();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should reset bet team correctly', () => {
    // Act
    component.resetBetTeam();

    // Assert
    expect(component.isShowAdvancedMode).toBeFalsy();
    expect(component.isShowContent).toBeFalsy();
    expect(component.baseBetTeam).toEqual([]);
    expect(component.betTeams).toEqual([]);
  });

  it('should validate bet types correctly', () => {
    // Arrange
    component.betTeams = [
      advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false)
    ];
    component.allBetTypes = Helper.fakeBetTypes;

    // Act
    const result = component.validate();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should handle bet type changes correctly', () => {
    // Arrange
    const betType = Helper.fakeBetTypes[0];
    const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);

    // Act
    component['changeBetTeam'](betType, betTeam);

    // Assert
    expect(betTeam.checkedBetTypes).toContain(betType.value);
  });
}); 