import { TestBed } from '@angular/core/testing';
import { ControlsAllBetTypesService } from './controls-all-bet-types.service';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';
import { ItemsSelect } from '../../multiple-selection/items-select';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { ControlsAllBetTypes } from './controls-all-bet-types.model';
import { AdvancedModeConstants } from '../../advanced-mode/advanced-mode.constants';
import { ItemsSelectService } from '../../multiple-selection/items-select.service';

describe('ControlsAllBetTypesService', () => {
  let service: ControlsAllBetTypesService;
  let multipleSelectionService: MultipleSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    
    service = TestBed.inject(ControlsAllBetTypesService);
    multipleSelectionService = TestBed.inject(MultipleSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initSelectionAllBetType', () => {
    it('should initialize MultipleSelection with correct properties', () => {
      // Arrange
      const mockItems: ItemsSelect[] = [
        ItemsSelectService.initItemsSelect(1, 'item1', 'Item 1', false, false, true, []),
        ItemsSelectService.initItemsSelect(2, 'item2', 'Item 2', false, false, true, [])
      ];
      multipleSelectionService.checkAllItems = jest.fn();

      // Act
      const result = service.initSelectionAllBetType(mockItems);

      // Assert
      expect(result).toBeInstanceOf(MultipleSelection);
      expect(result.checkAllCheckBoxText).toBe('All');
      expect(result.allItemsCheckedText).toBe('All');
      expect(result.noneItemCheckedText).toBe('Select options');
      expect(result.maxWidth).toBe('100%');
      expect(result.items).toBe(mockItems);
      expect(multipleSelectionService.checkAllItems).toHaveBeenCalledWith(result, true);
    });

    it('should call checkAllItems with correct parameters', () => {
      // Arrange
      const mockItems: ItemsSelect[] = [];
      multipleSelectionService.checkAllItems = jest.fn();

      // Act
      service.initSelectionAllBetType(mockItems);

      // Assert
      expect(multipleSelectionService.checkAllItems).toHaveBeenCalled();
    });
  });

  describe('resetAllChecked', () => {
    it('should call checkAllItems and set isCheckAll to true', () => {
      // Arrange
      const mockItems = new MultipleSelection();
      mockItems.isCheckAll = false;
      multipleSelectionService.checkAllItems = jest.fn();

      // Act
      service.resetAllChecked(mockItems);

      // Assert
      expect(multipleSelectionService.checkAllItems).toHaveBeenCalled();
      expect(mockItems.isCheckAll).toBe(true);
    });
  });

  describe('initControlsAllBetTypes', () => {
    it('should initialize ControlsAllBetTypes with correct properties', () => {
      // Arrange
      const type = 'TestType';
      const mockItems: ItemsSelect[] = [
        ItemsSelectService.initItemsSelect(1, 'item1', 'Item 1', false, false, true, [])
      ];

      // Act
      const result = service.initControlsAllBetTypes(type, mockItems);

      // Assert
      expect(result).toBeInstanceOf(ControlsAllBetTypes);
      expect(result.isShow).toBe(false);
      expect(result.type).toBe(type);
      expect(result.items).toBeInstanceOf(MultipleSelection);
      expect(result.items.items).toBe(mockItems);
    });

    it('should set isShow to false by default', () => {
      // Arrange
      const type = 'TestType';
      const mockItems: ItemsSelect[] = [];

      // Act
      const result = service.initControlsAllBetTypes(type, mockItems);

      // Assert
      expect(result.isShow).toBe(false);
    });
  });

  describe('initControlsAllBetTypesLists', () => {
    it('should return array of 6 ControlsAllBetTypes objects', () => {
      // Act
      const result = service.initControlsAllBetTypesLists();

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(6);
      expect(result.every(item => item instanceof ControlsAllBetTypes)).toBe(true);
    });

    it('should create ControlsAllBetTypes for each type with correct type values', () => {
      // Act
      const result = service.initControlsAllBetTypesLists();

      // Assert
      const expectedTypes = ['Map', 'Round', 'Quarter', 'Set', 'Game', 'Inning'];
      const actualTypes = result.map(item => item.type);
      expect(actualTypes).toEqual(expectedTypes);
    });

    it('should initialize each ControlsAllBetTypes with isShow false', () => {
      // Act
      const result = service.initControlsAllBetTypesLists();

      // Assert
      expect(result.every(item => item.isShow === false)).toBe(true);
    });

    it('should use correct constants for each type', () => {
      // Act
      const result = service.initControlsAllBetTypesLists();

      // Assert
      expect(result[0].items.items).toBe(AdvancedModeConstants.MAP_LIST);
      expect(result[1].items.items).toBe(AdvancedModeConstants.ROUND_LIST);
      expect(result[2].items.items).toBe(AdvancedModeConstants.QUARTER_LIST);
      expect(result[3].items.items).toBe(AdvancedModeConstants.SET_LIST);
      expect(result[4].items.items).toBe(AdvancedModeConstants.GAME_LIST);
      expect(result[5].items.items).toBe(AdvancedModeConstants.INNING_LIST);
    });
  });
});
