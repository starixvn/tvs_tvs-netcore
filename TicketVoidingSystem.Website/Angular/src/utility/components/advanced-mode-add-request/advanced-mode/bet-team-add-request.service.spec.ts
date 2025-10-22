import { TestBed } from '@angular/core/testing';
import { BetTeamAddRequestService } from './bet-team-add-request.service';
import { BetTeamAddRequest, Item, MultiSelection, Selection } from './advanced-mode.model';
import { AdvancedModeConstants } from '../../advanced-mode/advanced-mode.constants';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { ItemsSelect } from '../../multiple-selection/items-select';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';
import { ItemsSelectService } from '../../multiple-selection/items-select.service';

class Helper {
  static readonly fakeCommonInfo: [number, string, string, number, string] = [1, 'Team A', 'A', 1, '1,2,3'];
  
  static readonly fakeSelection = {
    name: 'Selection 1',
    value: 'Value 1',
    items: [],
    isMultiple: false,
    xmlAttribute: 'attr1'
  } as Selection;

  static readonly fakeSelectionWithItems = {
    name: 'Test Selection',
    value: 'Test Value',
    items: [
      {
        name: 'Sub Item 1',
        value: 'Sub Value 1',
        items: [],
        isMultiple: false,
        xmlAttribute: 'subAttr1'
      }
    ],
    isMultiple: true,
    xmlAttribute: 'testAttr'
  } as Selection;

  static readonly fakeInput = new Item(0, 'Input 1', 'Input Value 1', true, false, false, 'inputAttr1', '', false);
}

describe('BetTeamAddRequestService', () => {
  let service: BetTeamAddRequestService;
  let multipleSelectionService: MultipleSelectionService;
  beforeEach(() => {
    const spy = {
      getDisplayedItems: jest.fn(),
      getValueItems: jest.fn(),
      updateItemChecked: jest.fn(),
      checkAllItems: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        BetTeamAddRequestService,
        { provide: MultipleSelectionService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(BetTeamAddRequestService);
    multipleSelectionService = TestBed.inject(MultipleSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initBetTeamAddRequest', () => {
    it('should initialize BetTeamAddRequest with common info and selections', () => {
      // Arrange
      const commonInfo = Helper.fakeCommonInfo;
      const selections = [Helper.fakeSelection];
      const inputs = [Helper.fakeInput];
      const isChecked = true;

      // Act
      const result = service.initBetTeamAddRequest(commonInfo, selections, inputs, isChecked);

      // Assert
      expect(result.index).toBe(1);
      expect(result.name).toBe('Team A');
      expect(result.value).toBe('A');
      expect(result.type).toBe(1);
      expect(result.betTypes).toBe('1,2,3');
      expect(result.isShow).toBe(true);
    });

    it('should initialize BetTeamAddRequest with null selections and inputs', () => {
      // Arrange
      const commonInfo = Helper.fakeCommonInfo;
      const selections: Selection[] = null;
      const inputs: Item[] = null;
      const isChecked = false;

      // Act
      const result = service.initBetTeamAddRequest(commonInfo, selections, inputs, isChecked);

      // Assert
      expect(result.index).toBe(1);
      expect(result.name).toBe('Team A');
      expect(result.value).toBe('A');
      expect(result.type).toBe(1);
      expect(result.betTypes).toBe('1,2,3');
      expect(result.isShow).toBe(false);
      expect(result.selections).toEqual([]);
      expect(result.inputs).toEqual([]);
    });
  });

  describe('renderMultipleSelection', () => {
    it('should render MultiSelection for given Selection', () => {
      // Arrange
      const item = Helper.fakeSelectionWithItems;
      multipleSelectionService.getDisplayedItems = jest.fn().mockReturnValue('Test Display');

      // Act
      const result = service.renderMultipleSelection(item);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe('Test Selection');
      expect(result.value).toBe('Test Value');
      expect(result.xmlAttribute).toBe('testAttr');
      expect(result.multipleSelect).toBeDefined();
      expect(result.multipleSelect.checkAllCheckBoxText).toBe('All');
      expect(result.multipleSelect.allItemsCheckedText).toBe('All');
      expect(result.multipleSelect.noneItemCheckedText).toBe('Select options');
      expect(result.multipleSelect.maxWidth).toBe('100%');
    });
  });

  describe('resetAllChecked', () => {
    it('should reset all checked state for selections', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      const mockMultiSelection = new MultiSelection();
      mockMultiSelection.multipleSelect = new MultipleSelection();
      betTeam.selections = [
        {
          name: 'Test Selection',
          value: 'Test Value',
          items: [],
          isMultiple: true,
          xmlAttribute: 'testAttr',
          multiSelection: mockMultiSelection
        } as Selection
      ];

      // Act
      service.resetAllChecked(betTeam);

      // Assert
      expect(multipleSelectionService.checkAllItems).toHaveBeenCalled();
    });
  });

  describe('getResult', () => {
    it('should return BetTeamAddRequestResult with basic data', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [Helper.fakeSelection];
      betTeam.inputs = [Helper.fakeInput];
      const betTypeId = 'testBetType';

      // Act
      const result = service.getResult(betTeam, betTypeId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('testBetType');
    });

    it('should handle Half/Full Time Correct Score bet types', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [
        {
          name: 'HT:',
          value: 'All',
          items: [
            {
              name: '1-0',
              value: '1-0',
              items: [],
              xmlAttribute: 'ht'
            }
          ],
          xmlAttribute: 'ht'
        },
        {
          name: 'FT:',
          value: 'All',
          items: [
            {
              name: '2-1',
              value: '2-1',
              items: [],
              xmlAttribute: 'ft'
            }
          ],
          xmlAttribute: 'ft'
        }
      ] as Selection[];
      betTeam.inputs = [];

      // Act
      const result = service.getResult(betTeam, AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE);

      // Assert
      expect(result).toBeDefined();
      expect(result.team).toBe('All');
    });

    it('should handle Penalty Shootout Combo bet type', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'First Value', '1', true, false, false, 'firstvalue', '', false),
        new Item(1, 'Second Value', '2', true, false, false, 'secondvalue', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, AdvancedModeConstants.BETTYPE_PENALTY_SHOOTOUT_COMBO);

      // Assert
      expect(result).toBeDefined();
      expect(result.team).toBe('1-2');
    });

    it('should handle Cricket with Fancy bet types', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [
        {
          name: 'Team',
          value: 'All',
          items: [],
          xmlAttribute: 'team'
        }
      ] as Selection[];
      betTeam.inputs = [
        new Item(0, 'First Value', '10', true, false, false, 'firstvalue', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, '9541');

      // Assert
      expect(result).toBeDefined();
      expect(result.hdp).toBe('10');
    });

    it('should handle Over X Exact Runs bet types', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'First Value', '5', true, false, false, 'firstvalue', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, '9484');

      // Assert
      expect(result).toBeDefined();
      expect(result.team).toBe('All');
      expect(result.hdp1).toBe('5');
    });
  });

  describe('updateItemChecked', () => {
    it('should update item checked state', () => {
      // Arrange
      const multipleSelect = new MultipleSelection();
      const checkedItems = ['item1', 'item2'];

      // Act
      service.updateItemChecked(multipleSelect, checkedItems);

      // Assert
      expect(multipleSelectionService.updateItemChecked).toHaveBeenCalledWith(multipleSelect, checkedItems);
    });
  });

  describe('updateDisabledStatus', () => {
    it('should update disabled status for multiple selection', () => {
      // Arrange
      const multipleSelect = new MultipleSelection();
      multipleSelect.items = [
        ItemsSelectService.initItemsSelect(0, 'item1', 'Item 1', true, true, true, []),
        ItemsSelectService.initItemsSelect(1, 'item2', 'Item 2', true, true, true, [])
      ];
      const isDisabled = true;

      // Act
      service.updateDisabledStatus(multipleSelect, isDisabled);

      // Assert
      expect(multipleSelect.isDisabled).toBe(true);
      expect(multipleSelect.items[0].enable).toBe(false);
      expect(multipleSelect.items[1].enable).toBe(false);
    });

    it('should enable items when isDisabled is false', () => {
      // Arrange
      const multipleSelect = new MultipleSelection();
      multipleSelect.items = [
        ItemsSelectService.initItemsSelect(0, 'item1', 'Item 1', true, true, true, []),
        ItemsSelectService.initItemsSelect(1, 'item2', 'Item 2', true, true, true, [])
      ];
      const isDisabled = false;

      // Act
      service.updateDisabledStatus(multipleSelect, isDisabled);

      // Assert
      expect(multipleSelect.isDisabled).toBe(false);
      expect(multipleSelect.items[0].enable).toBe(true);
      expect(multipleSelect.items[1].enable).toBe(true);
    });
  });

  describe('updateResult method coverage', () => {
    it('should handle team attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [
        {
          name: 'Team',
          value: 'Team A',
          items: [],
          xmlAttribute: 'team'
        }
      ] as Selection[];
      betTeam.inputs = [];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.team).toBe('Team A');
    });

    it('should handle hdp attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [
        {
          name: 'HDP',
          value: '1.5',
          items: [],
          xmlAttribute: 'hdp'
        }
      ] as Selection[];
      betTeam.inputs = [];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.hdp).toBe('1.5');
    });

    it('should handle player attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [
        {
          name: 'Player',
          value: 'Player 1',
          items: [],
          xmlAttribute: 'player'
        }
      ] as Selection[];
      betTeam.inputs = [];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.player).toBe('Player 1');
    });

    it('should handle playerandodds attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [
        {
          name: 'Player and Odds',
          value: 'Player 1 - 1.5',
          items: [],
          xmlAttribute: 'playerandodds'
        }
      ] as Selection[];
      betTeam.inputs = [];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.playerAndOdds).toBe('Player 1 - 1.5');
    });

    it('should handle oddsspread attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [
        {
          name: 'Odds Spread',
          value: '2.5',
          items: [],
          xmlAttribute: 'oddsspread'
        }
      ] as Selection[];
      betTeam.inputs = [];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.oddsSpread).toBe('2.5');
    });

    it('should handle _xx attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'XX Value', '1,2', true, false, false, '_xx', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.betIdX).toBe('1,2');
      expect(result.filterBetIdX).toBe('_01&_02');
    });

    it('should handle _xxx attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'XXX Value', '1,2', true, false, false, '_xxx', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.betIdX).toBe('1,2');
      expect(result.filterBetIdX).toBe('_1,2');
    });

    it('should handle yy attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'YY Value', '1,2', true, false, false, 'yy', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.betIdY).toBe('1,2');
      expect(result.filterBetIdY).toBe('1,2');
    });

    it('should handle betidx attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [
        {
          name: 'Bet Id X',
          value: '801',
          items: [],
          xmlAttribute: 'betidx'
        }
      ] as Selection[];
      betTeam.inputs = [];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.betIdX).toBe('801');
      expect(result.filterBetIdX).toBe('801');
    });

    it('should handle betidy attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [
        {
          name: 'Bet Id Y',
          value: '01',
          items: [],
          xmlAttribute: 'betidy'
        }
      ] as Selection[];
      betTeam.inputs = [];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.betIdY).toBe('01');
      expect(result.filterBetIdY).toBe('01');
    });

    it('should handle firstvalue attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'First Value', '10', true, false, false, 'firstvalue', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.firstValue).toBe('10');
    });

    it('should handle secondvalue attribute', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'Second Value', '20', true, false, false, 'secondvalue', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.secondValue).toBe('20');
    });
  });

  describe('getValueBetIdTypeXx', () => {
    it('should return ___ for empty value', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'XX Value', '', true, false, false, '_xx', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.filterBetIdX).toBe('___');
    });

    it('should format XX values correctly', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'XX Value', '1,5,10', true, false, false, '_xx', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.filterBetIdX).toBe('_01&_05&_10');
    });
  });

  describe('getValueBetIdTypeXxx', () => {
    it('should return ____ for empty value', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'XXX Value', '', true, false, false, '_xxx', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.filterBetIdX).toBe('____');
    });

    it('should format XXX values correctly', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'XXX Value', '1,5,100', true, false, false, '_xxx', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.filterBetIdX).toBe('_1,5,100');
    });
  });

  describe('getValueBetIdTypeYy', () => {
    it('should return empty string for empty value', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'YY Value', '', true, false, false, 'yy', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.filterBetIdY).toBe('');
    });

    it('should format YY values correctly', () => {
      // Arrange
      const betTeam = new BetTeamAddRequest();
      betTeam.selections = [];
      betTeam.inputs = [
        new Item(0, 'YY Value', '1,5,10', true, false, false, 'yy', '', false)
      ];

      // Act
      const result = service.getResult(betTeam, 'testBetType');

      // Assert
      expect(result.filterBetIdY).toBe('1,5,10');
    });
  });
});
