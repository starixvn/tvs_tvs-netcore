import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AdvancedModeComponent } from './advanced-mode.component';
import { AdvancedModeApiService } from './advanced-mode-api.service';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { GetPlayersQuery, OddsInfo, Selection, Item, Player } from './advanced-mode.model';
import { BetType } from '../group-bettypes/group-bettypes.model';
import { SimpleChange } from '@angular/core';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { AdvancedModeService } from './advanced-mode.service';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';

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
  let multipleSelectionService: MultipleSelectionService;
  
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
    multipleSelectionService = fixture.debugElement.injector.get(MultipleSelectionService);
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

  describe('getBetTeamAndRenderValue', () => {
    it('should get bet teams and render values correctly', async () => {
      // Arrange
      const matchId = Helper.fakeMatchId;
      const mockBetTeams = [
        advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false)
      ];
      advancedModeApiService.getBetTeams = jest.fn().mockResolvedValue(mockBetTeams);
      commonService.getOddsInfoSpecialBetTypes = jest.fn().mockResolvedValue([]);

      // Act
      await component.getBetTeamAndRenderValue(matchId);

      // Assert
      expect(advancedModeApiService.getBetTeams).toHaveBeenCalled();
      expect(component.baseBetTeam).toEqual(mockBetTeams);
      expect(component.betTeams.length).toBeGreaterThan(0);
    });

    it('should update player cricket and basketball when matchId is provided', async () => {
      // Arrange
      const matchId = Helper.fakeMatchId;
      const mockBetTeams = [
        advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false)
      ];
      const mockOddsInfo = Helper.fakeOddsInfo;
      advancedModeApiService.getBetTeams = jest.fn().mockResolvedValue(mockBetTeams);
      commonService.getOddsInfoSpecialBetTypes = jest.fn().mockResolvedValue(mockOddsInfo);

      // Act
      await component.getBetTeamAndRenderValue(matchId);

      // Assert
      expect(commonService.getOddsInfoSpecialBetTypes).toHaveBeenCalled();
      expect(component.oddsInfo).toEqual(mockOddsInfo);
    });
  });

  describe('isValidOptionForType5', () => {
    it('should delegate to advancedModeService', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 5, '1'], [], [], [], false);
      const item = new Selection();
      const name = 'Test Name';
      advancedModeService.isValidOptionForType5 = jest.fn().mockReturnValue(true);

      // Act
      const result = component.isValidOptionForType5(betTeam, item, name);

      // Assert
      expect(advancedModeService.isValidOptionForType5).toHaveBeenCalledWith(betTeam, item, name);
      expect(result).toBeTruthy();
    });
  });

  describe('checkBetTeamItems', () => {
    it('should delegate to advancedModeService', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);
      advancedModeService.checkItems = jest.fn();

      // Act
      component.checkBetTeamItems(betTeam);

      // Assert
      expect(advancedModeService.checkItems).toHaveBeenCalledWith(betTeam);
    });
  });

  describe('controlIsCheckedBetTeam', () => {
    it('should delegate to advancedModeService', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);
      advancedModeService.controlIsChecked = jest.fn();

      // Act
      component.controlIsCheckedBetTeam(betTeam);

      // Assert
      expect(advancedModeService.controlIsChecked).toHaveBeenCalledWith(betTeam);
    });
  });

  describe('isValidInputs', () => {
    it('should return true when all inputs are valid', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);
      betTeam.inputs = [
        { index: 0, value: '1.5', isMultiple: false } as Item,
        { index: 1, value: '2.0', isMultiple: false } as Item
      ];
      advancedModeService.isValidInputDecimalValue = jest.fn().mockReturnValue(true);

      // Act
      const result = component.isValidInputs(betTeam);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when any input is invalid', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);
      betTeam.inputs = [
        { index: 0, value: 'invalid', isMultiple: false } as Item
      ];
      advancedModeService.isValidInputDecimalValue = jest.fn().mockReturnValue(false);
      component.isShowContent = true;
      component.tooltip.display = jest.fn();

      // Act
      const result = component.isValidInputs(betTeam);

      // Assert
      expect(result).toBeFalsy();
      expect(component.tooltip.display).toHaveBeenCalled();
    });
  });

  describe('getBetTypeModels', () => {
    it('should return bet type models correctly', () => {
      // Arrange
      const betTeam1 = advancedModeService.initBetTeam([0, 'Test1', '1', 1, '1'], [], [], [], false);
      betTeam1.checkedBetTypes = ['1', '2'];
      const betTeam2 = advancedModeService.initBetTeam([1, 'Test2', '2', 1, '2'], [], [], [], false);
      betTeam2.checkedBetTypes = ['3'];
      component.betTeams = [betTeam1, betTeam2];
      advancedModeService.getResult = jest.fn().mockReturnValue({ betTeam: 'Test', value: '1' });

      // Act
      const result = component.getBetTypeModels('1,2,3,4');

      // Assert
      expect(result.length).toBe(4);
      expect(result.some(x => x.id === 1)).toBeTruthy();
      expect(result.some(x => x.id === 2)).toBeTruthy();
      expect(result.some(x => x.id === 3)).toBeTruthy();
      expect(result.some(x => x.id === 4)).toBeTruthy();
    });

    it('should return empty bet types for unchecked bet types', () => {
      // Arrange
      component.betTeams = [];

      // Act
      const result = component.getBetTypeModels('1,2');

      // Assert
      expect(result.length).toBe(2);
      expect(result[0].betTeam).toBe('');
      expect(result[0].value).toBe('');
    });
  });

  describe('updateOtherSelection', () => {
    it('should update other selection when name is Performance', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '653', 1, '653'], [], [], [], false);
      const selection = new Selection();
      selection.name = 'Performance:';
      selection.multiSelection = {
        multipleSelect: new MultipleSelection()
      } as any;
      component.oddsInfo = Helper.fakeOddsInfo;
      multipleSelectionService.getValueItems = jest.fn().mockReturnValue('1,2');
      advancedModeService.getItemsOtherSelection = jest.fn().mockReturnValue([]);
      advancedModeService.initSelection = jest.fn().mockReturnValue(selection);
      advancedModeService.renderSelectionWithPlayer = jest.fn();

      // Act
      component.updateOtherSelection(betTeam, selection);

      // Assert
      expect(advancedModeService.getItemsOtherSelection).toHaveBeenCalled();
      expect(advancedModeService.renderSelectionWithPlayer).toHaveBeenCalled();
    });

    it('should not update when name is not Performance', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);
      const selection = new Selection();
      selection.name = 'Other:';
      advancedModeService.renderSelectionWithPlayer = jest.fn();

      // Act
      component.updateOtherSelection(betTeam, selection);

      // Assert
      expect(advancedModeService.renderSelectionWithPlayer).not.toHaveBeenCalled();
    });
  });

  describe('updateByControlAllBetType', () => {
    it('should update bet teams by control all bet type', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);
      betTeam.multiSelectionList = [
        { type: 'map', multipleSelect: new MultipleSelection() } as any
      ];
      component.betTeams = [betTeam];
      const itemList = ['1', '2'];
      advancedModeService.updateItemByControlAllBetType = jest.fn();

      // Act
      component.updateByControlAllBetType(itemList, 'map');

      // Assert
      expect(advancedModeService.updateItemByControlAllBetType).toHaveBeenCalled();
    });

    it('should not update when no bet team matches type', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);
      betTeam.multiSelectionList = [
        { type: 'round', multipleSelect: new MultipleSelection() } as any
      ];
      component.betTeams = [betTeam];
      advancedModeService.updateItemByControlAllBetType = jest.fn();

      // Act
      component.updateByControlAllBetType(['1'], 'map');

      // Assert
      expect(advancedModeService.updateItemByControlAllBetType).not.toHaveBeenCalled();
    });
  });

  describe('checkBetTypesMoreHDP', () => {
    it('should return true when bet team has items and bet type is in BETTYPES_MORE_HDP', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);
      betTeam.items = [
        { index: 0, value: '1.5', isChecked: true } as Item
      ];

      // Act
      const result = component.checkBetTypesMoreHDP(betTeam);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when bet team has no items', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '999', 1, '999'], [], [], [], false);
      betTeam.items = [];

      // Act
      const result = component.checkBetTypesMoreHDP(betTeam);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when bet type is not in BETTYPES_MORE_HDP', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '999', 1, '999'], [], [], [], false);
      betTeam.items = [
        { index: 0, value: '1.5', isChecked: true } as Item
      ];

      // Act
      const result = component.checkBetTypesMoreHDP(betTeam);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isShowTextBox', () => {
    it('should return true when bet team has inputs', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [{ index: 0, value: '', isMultiple: false } as Item], false);

      // Act
      const result = component.isShowTextBox(betTeam);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when bet team has no inputs', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);

      // Act
      const result = component.isShowTextBox(betTeam);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('handleChangeFancyBetTypeCricket', () => {
    it('should set input flag to true when fancy selection is All', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '9541', 1, '9541'], [], [], [], false);
      betTeam.checkedBetTypes = ['9541'];
      betTeam.inputs = [
        { index: 0, xmlAttribute: 'Value', value: '1.5', flag: false } as Item
      ];
      betTeam.selections = [
        { name: 'Fancy:', value: 'All' } as Selection
      ];
      component.betTeams = [betTeam];

      // Act
      component.handleChangeFancyBetTypeCricket(betTeam);

      // Assert
      expect(betTeam.inputs[0].flag).toBeTruthy();
      expect(betTeam.inputs[0].value).toBe('');
    });

    it('should set input flag to false when fancy selection is not All', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '9541', 1, '9541'], [], [], [], false);
      betTeam.checkedBetTypes = ['9541'];
      betTeam.inputs = [
        { index: 0, xmlAttribute: 'Value', value: '1.5', flag: true } as Item
      ];
      betTeam.selections = [
        { name: 'Fancy:', value: 'Other' } as Selection
      ];
      component.betTeams = [betTeam];

      // Act
      component.handleChangeFancyBetTypeCricket(betTeam);

      // Assert
      expect(betTeam.inputs[0].flag).toBeFalsy();
    });
  });

  describe('updatePlayerBasketball', () => {
    it('should update player basketball correctly', () => {
      // Arrange
      const oddsInfo: OddsInfo[] = [
        {
          betTypeId: 653,
          playerId: 1,
          playerName: 'Player 1',
          oddsId: '1',
          betChoice: '1'
        } as OddsInfo,
        {
          betTypeId: 653,
          playerId: 2,
          playerName: 'Player 2',
          oddsId: '2',
          betChoice: '2'
        } as OddsInfo
      ];
      advancedModeService.getItemsPlayerSelection = jest.fn().mockReturnValue([]);
      advancedModeService.getItemsBetChoiceSelection = jest.fn().mockReturnValue([]);
      advancedModeService.getItemsOtherSelection = jest.fn().mockReturnValue([]);
      advancedModeService.initSelection = jest.fn().mockReturnValue({} as Selection);

      // Act
      component['updatePlayerBasketball'](oddsInfo);

      // Assert
      expect(component.baseSpecialBetTypeBasketball.length).toBeGreaterThan(0);
    });
  });

  describe('renderPlayer', () => {
    it('should render players correctly', () => {
      // Arrange
      const players: Player[] = [
        { betChoice: '1', oddsInfo: '1.5' },
        { betChoice: '2', oddsInfo: '2.0' }
      ];
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '216', 1, '216'], [], [], [], false);
      betTeam.multiSelection = {
        multipleSelect: new MultipleSelection()
      } as any;
      component.betTeams = [betTeam];

      // Act
      component['renderPlayer'](players);

      // Assert
      expect(betTeam.multiSelection.multipleSelect.items.length).toBe(2);
    });
  });

  describe('validate - additional cases', () => {
    it('should return false when bet team has checked bet types but no items selected', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 1, '1'], [], [], [], false);
      betTeam.checkedBetTypes = ['1'];
      betTeam.type = 1;
      component.betTeams = [betTeam];
      advancedModeService.getItemsValue = jest.fn().mockReturnValue('');
      component.isShowContent = false;
      component.tooltip.display = jest.fn();

      // Act
      const result = component.validate();

      // Assert
      expect(result).toBeFalsy();
      expect(component.isShowContent).toBeTruthy();
    });

    it('should return true when bet team type is 4 and has no items', () => {
      // Arrange
      const betTeam = advancedModeService.initBetTeam([0, 'Test', '1', 4, '1'], [], [], [], false);
      betTeam.checkedBetTypes = ['1'];
      component.betTeams = [betTeam];
      advancedModeService.getItemsValue = jest.fn().mockReturnValue('');

      // Act
      const result = component.validate();

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isShowALLBetTypesSelection - additional cases', () => {
    it('should return false when all flags are false', () => {
      // Arrange
      component.isShowAllBetTypeMapRound = false;
      component.isShowAllBetTypeQuarter = false;
      component.isShowAllBetTypeSet = false;
      component.isShowAllBetTypeGame = false;
      component.isShowAllBetTypeInning = false;

      // Act
      const result = component.isShowALLBetTypesSelection();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when any flag is true', () => {
      // Arrange
      component.isShowAllBetTypeMapRound = false;
      component.isShowAllBetTypeQuarter = true;
      component.isShowAllBetTypeSet = false;
      component.isShowAllBetTypeGame = false;
      component.isShowAllBetTypeInning = false;

      // Act
      const result = component.isShowALLBetTypesSelection();

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('getPlayers - edge cases', () => {
    it('should not call getPlayer when getPlayerQuery is undefined', async () => {
      // Arrange
      component.getPlayerQuery = undefined;
      advancedModeApiService.getPlayer = jest.fn();

      // Act
      await component.getPlayers();

      // Assert
      expect(advancedModeApiService.getPlayer).not.toHaveBeenCalled();
    });

    it('should not call getPlayer when matchId is empty', async () => {
      // Arrange
      component.getPlayerQuery = { matchId: '', betType: '' } as GetPlayersQuery;
      advancedModeApiService.getPlayer = jest.fn();

      // Act
      await component.getPlayers();

      // Assert
      expect(advancedModeApiService.getPlayer).not.toHaveBeenCalled();
    });
  });
}); 