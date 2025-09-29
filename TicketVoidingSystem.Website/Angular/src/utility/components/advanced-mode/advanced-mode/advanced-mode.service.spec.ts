import { TestBed } from '@angular/core/testing';
import { AdvancedModeService } from './advanced-mode.service';
import { BetTeam, Selection, Item, MultiSelection, BetTeamResult } from './advanced-mode.model';
import { AdvancedModeConstants } from '../advanced-mode.constants';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { ItemsSelect } from '../../multiple-selection/items-select';

class Helper {
  static readonly fakeCommonInfo: [number, string, string, number, string] = [1, 'Team A', 'A', 1, '1,2,3'];
  
  static readonly fakeSelection = {
    name: 'Selection 1',
    value: 'Value 1',
    items: [],
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

  static readonly fakeItem = new Item(0, 'Item 1', 'Value 1', true, 'attr1', false);
  static readonly fakeInput = new Item(0, 'Input 1', 'Input Value 1', true, 'inputAttr1', false);

  static readonly fakeBetTeam = {
    index: 1,
    name: 'Team A',
    value: 'A',
    type: 1,
    betTypes: '1,2,3',
    selections: [],
    multiSelectionList: [],
    items: [],
    inputs: [],
    checkedBetTypes: []
  } as BetTeam;

  static readonly fakeMultiSelection = {
    name: 'Test Multi',
    value: 'Test Value',
    xmlAttribute: 'testAttr',
    multipleSelect: new MultipleSelection(),
    type: 'map'
  } as MultiSelection;

  static readonly fakeBetTeamResult = {
    betTeam: 'Test BetTeam',
    set: 'Test Set',
    game: 'Test Game',
    betOption: 'Test BetOption',
    value: 'Test Value',
    valueHdp1: 'Test ValueHdp1',
    valueHdp2: 'Test ValueHdp2',
    goal: 'Test Goal',
    oddsSpread: 'Test OddsSpread',
    oddsId: 'Test OddsId',
    transdesc: 'Test Transdesc',
    virtualHead: 'Test VirtualHead'
  } as BetTeamResult;
}

describe('AdvancedModeService', () => {
  let service: AdvancedModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancedModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initBetTeam', () => {
    it('should initialize BetTeam with common info and selections', () => {
      // Arrange
      const commonInfo = Helper.fakeCommonInfo;
      const selections = [Helper.fakeSelection];
      const items = [Helper.fakeItem];
      const inputs = [Helper.fakeInput];
      const isShowMultiSelectionList = false;

      // Act
      const result = service.initBetTeam(commonInfo, selections, items, inputs, isShowMultiSelectionList);

      // Assert
      expect(result.index).toBe(1);
      expect(result.name).toBe('Team A');
      expect(result.value).toBe('A');
      expect(result.type).toBe(1);
      expect(result.betTypes).toBe('1,2,3');
      expect(result.isShowMultiSelectionList).toBe(false);
      expect(result.checkedBetTypes).toEqual([]);
      expect(result.isChecked).toBe(false);
      expect(result.selections).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.inputs).toBeDefined();
    });

    it('should initialize BetTeam with null selections and items', () => {
      // Arrange
      const commonInfo = Helper.fakeCommonInfo;
      const selections: Selection[] = null;
      const items: Item[] = null;
      const inputs: Item[] = null;
      const isShowMultiSelectionList = true;

      // Act
      const result = service.initBetTeam(commonInfo, selections, items, inputs, isShowMultiSelectionList);

      // Assert
      expect(result.index).toBe(1);
      expect(result.name).toBe('Team A');
      expect(result.value).toBe('A');
      expect(result.type).toBe(1);
      expect(result.betTypes).toBe('1,2,3');
      expect(result.isShowMultiSelectionList).toBe(true);
      expect(result.selections).toEqual([]);
      expect(result.items).toEqual([]);
      expect(result.inputs).toEqual([]);
    });
  });

  describe('initSelection', () => {
    it('should initialize Selection with all parameters', () => {
      // Arrange
      const name = 'Selection Name';
      const value = 'Selection Value';
      const items: Selection[] = [];
      const isMultiple = true;
      const xmlAttribute = 'xmlAttr'

      // Act
      const result = service.initSelection(
        name, value, items, isMultiple, xmlAttribute,
        true, false, false, false, false, false
      );

      // Assert
      expect(result.name).toBe(name);
      expect(result.value).toBe(value);
      expect(result.items).toEqual([]);
      expect(result.isMultiple).toBe(isMultiple);
      expect(result.xmlAttribute).toBe(xmlAttribute);
      expect(result.isCanSelectMapFromOutside).toBeTruthy();
      expect(result.isCanSelectRoundFromOutside).toBeFalsy();
      expect(result.isCanSelectQuarterFromOutside).toBeFalsy();
      expect(result.isCanSelectSetFromOutside).toBeFalsy();
      expect(result.isCanSelectGameFromOutside).toBeFalsy();
      expect(result.isCanSelectInningFromOutside).toBeFalsy();
    });
  });

  describe('renderMultipleSelect', () => {
    it('should render MultiSelection for given Selection', () => {
      // Arrange
      const item = Helper.fakeSelectionWithItems;

      // Act
      const result = service.renderMultipleSelect(item);

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

  describe('resetChecked', () => {
    it('should reset checked state and reset selections', () => {
      // Arrange
      const betTeam = new BetTeam();
      betTeam.isChecked = false;
      betTeam.selections = [Helper.fakeSelection];
      betTeam.items = [Helper.fakeItem];

      // Act
      service.resetChecked(betTeam);

      // Assert
      expect(betTeam.isChecked).toBe(true);
      expect(betTeam.selections[0].value).toBe('All');
      expect(betTeam.items[0].isChecked).toBe(true);
    });
  });

  describe('isValidOptionForType5', () => {
    it('should return true for non-Half/Full Time bet types', () => {
      const betTeam = new BetTeam();
      betTeam.checkedBetTypes = ['1', '2'];
      const item = {
        name: 'Test Item',
        value: 'Test Value',
        items: [],
          xmlAttribute: 'testAttr',
      } as Selection;
      const name = 'Test Name';

      const result = service.isValidOptionForType5(betTeam, item, name);

      expect(result).toBe(true);
    });

    it('should return true for Half/Full Time bet types when handler416 returns true', () => {
      const betTeam = new BetTeam();
      betTeam.checkedBetTypes = [AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE];
      betTeam.selections = [
        {
          name: 'HT:',
          value: 'All',
          items: [],
          xmlAttribute: 'ht'
        } as Selection
      ];
      const item = {
        name: 'All',
        value: 'All',
        items: [],
          xmlAttribute: 'testAttr'
      } as Selection;
      const name = 'HT:';

      const result = service.isValidOptionForType5(betTeam, item, name);

      expect(result).toBe(true);
    });
  });

  describe('checkItems', () => {
    it('should set isChecked for all items based on betTeam.isChecked', () => {
      // Arrange
      const betTeam = new BetTeam();
      betTeam.isChecked = true;
      betTeam.items = [Helper.fakeItem, new Item(1, 'Item 2', 'Value 2', true, 'attr2', false)];

      // Act
      service.checkItems(betTeam);

      // Assert
      expect(betTeam.items[0].isChecked).toBe(true);
      expect(betTeam.items[1].isChecked).toBe(true);
    });

    it('should set isChecked to false when betTeam.isChecked is false', () => {
      // Arrange
      const betTeam = new BetTeam();
      betTeam.isChecked = false;
      betTeam.items = [Helper.fakeItem];

      // Act
      service.checkItems(betTeam);

      // Assert
      expect(betTeam.items[0].isChecked).toBe(false);
    });
  });

  describe('controlIsChecked', () => {
    it('should set isChecked to true when all items are checked', () => {
      // Arrange
      const betTeam = new BetTeam();
      betTeam.items = [Helper.fakeItem, new Item(1, 'Item 2', 'Value 2', true, 'attr2', false)];
      betTeam.items[0].isChecked = true;
      betTeam.items[1].isChecked = true;

      // Act
      service.controlIsChecked(betTeam);

      // Assert
      expect(betTeam.isChecked).toBe(true);
    });

    it('should set isChecked to false when any item is not checked', () => {
      // Arrange
      const betTeam = new BetTeam();
      betTeam.items = [Helper.fakeItem, new Item(1, 'Item 2', 'Value 2', true, 'attr2', false)];
      betTeam.items[0].isChecked = true;
      betTeam.items[1].isChecked = false;

      // Act
      service.controlIsChecked(betTeam);

      // Assert
      expect(betTeam.isChecked).toBe(false);
    });
  });

  describe('getItemsValue', () => {
    it('should return "All" when betTeam is checked', () => {
      // Arrange
      const betTeam = new BetTeam();
      betTeam.isChecked = true;
      betTeam.items = [Helper.fakeItem];

      // Act
      const result = service.getItemsValue(betTeam);

      // Assert
      expect(result).toBe('All');
    });

    it('should return comma-separated values of checked items', () => {
      // Arrange
      const betTeam = new BetTeam();
      betTeam.isChecked = false;
      betTeam.items = [
        Helper.fakeItem,
        new Item(1, 'Item 2', 'Value 2', true, 'attr2', false),
        new Item(2, 'Item 3', 'Value 3', true, 'attr3', false)
      ];
      betTeam.items[0].isChecked = true;
      betTeam.items[1].isChecked = false;
      betTeam.items[2].isChecked = true;

      // Act
      const result = service.getItemsValue(betTeam);

      // Assert
      expect(result).toBe('Value 1,Value 3');
    });
  });

  describe('updateItemByControlAllBetType', () => {
    it('should update items in multiSelectionList based on itemList', () => {
      // Arrange
      const multiSelectionList: MultiSelection[] = [Helper.fakeMultiSelection];
      const itemList = ['item1', 'item2'];
      const type = 'map';

      // Mock the multipleSelect items
      multiSelectionList[0].multipleSelect.items = [
        new ItemsSelect(0, 'item1', 'Item 1', true, true, true, []),
        new ItemsSelect(1, 'item2', 'Item 2', true, true, true, []),
        new ItemsSelect(2, 'item3', 'Item 3', true, true, true, [])
      ];

      // Act
      service.updateItemByControlAllBetType(multiSelectionList, itemList, type);

      // Assert
      expect(multiSelectionList[0].multipleSelect.items[0].checked).toBe(true);
      expect(multiSelectionList[0].multipleSelect.items[1].checked).toBe(true);
      expect(multiSelectionList[0].multipleSelect.items[2].checked).toBe(false);
    });
  });

  describe('getResult', () => {
    it('should handle BetTeam type 5 with Half/Full Time bet types', () => {
      const betTeam = new BetTeam();
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
      betTeam.items = [];
      betTeam.inputs = [];
      betTeam.type = AdvancedModeConstants.BETTEAM_TYPE_5;
      betTeam.checkedBetTypes = [AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE];

      const result = service.getResult(betTeam, AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE);

      expect(result).toBeDefined();
      expect(result.betTeam).toBe('All');
    });
  });
});
