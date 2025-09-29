import { TestBed } from '@angular/core/testing';
import { BetTypesService } from './bettypes.service';
import { BetTypeModel, BetTypesModel } from './bettypes.model';
import { Product } from '../../constants/config';

describe('BetTypesService', () => {
  let service: BetTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('changeAll', () => {
    it('should set all betTypes isChecked to true when isChecked is true', () => {
      // Arrange
      const betTypes: BetTypeModel[] = [
        Object.assign(new BetTypeModel(), { id: '1', name: 'Test 1', liveIndicator: false, type: 1, isChecked: false }),
        Object.assign(new BetTypeModel(), { id: '2', name: 'Test 2', liveIndicator: false, type: 1, isChecked: false }),
        Object.assign(new BetTypeModel(), { id: '3', name: 'Test 3', liveIndicator: false, type: 1, isChecked: false })
      ];

      // Action
      service.changeAll(betTypes, true);

      // Assert
      betTypes.forEach(item => {
        expect(item.isChecked).toBe(true);
      });
    });

    it('should set all betTypes isChecked to false when isChecked is false', () => {
      // Arrange
      const betTypes: BetTypeModel[] = [
        Object.assign(new BetTypeModel(), { id: '1', name: 'Test 1', liveIndicator: false, type: 1, isChecked: true }),
        Object.assign(new BetTypeModel(), { id: '2', name: 'Test 2', liveIndicator: false, type: 1, isChecked: true }),
        Object.assign(new BetTypeModel(), { id: '3', name: 'Test 3', liveIndicator: false, type: 1, isChecked: true })
      ];

      // Action
      service.changeAll(betTypes, false);

      // Assert
      betTypes.forEach(item => {
        expect(item.isChecked).toBe(false);
      });
    });

    it('should handle empty array', () => {
      // Arrange
      const betTypes: BetTypeModel[] = [];

      // Action & Assert
      expect(() => service.changeAll(betTypes, true)).not.toThrow();
    });
  });

  describe('changeItem', () => {
    it('should set isChecked to true when all visible items are checked', () => {
      // Arrange
      const betType1 = Object.assign(new BetTypeModel(), { id: '1', name: 'Test 1', liveIndicator: false, type: 1, isChecked: true, isShow: true });
      const betType2 = Object.assign(new BetTypeModel(), { id: '2', name: 'Test 2', liveIndicator: false, type: 1, isChecked: true, isShow: true });
      
      const model = new BetTypesModel();
      model.betTypes = [betType1, betType2];
      model.isChecked = false;

      // Action
      service.changeItem(model);

      // Assert
      expect(model.isChecked).toBe(true);
    });

    it('should set isChecked to true when no items are visible', () => {
      // Arrange
      const betType1 = Object.assign(new BetTypeModel(), { id: '1', name: 'Test 1', liveIndicator: false, type: 1, isChecked: false, isShow: false });
      const betType2 = Object.assign(new BetTypeModel(), { id: '2', name: 'Test 2', liveIndicator: false, type: 1, isChecked: false, isShow: false });
      
      const model = new BetTypesModel();
      model.betTypes = [betType1, betType2];
      model.isChecked = false;

      // Action
      service.changeItem(model);

      // Assert
      expect(model.isChecked).toBe(true);
    });
  });

  describe('getCheckedBetTypes', () => {
    it('should return array of checked and visible bet type ids', () => {
      // Arrange
      const betType1 = Object.assign(new BetTypeModel(), { id: '1', name: 'Test 1', liveIndicator: false, type: 1, isChecked: true, isShow: true });
      const betType2 = Object.assign(new BetTypeModel(), { id: '2', name: 'Test 2', liveIndicator: false, type: 1, isChecked: true, isShow: true });
      const betType3 = Object.assign(new BetTypeModel(), { id: '3', name: 'Test 3', liveIndicator: false, type: 1, isChecked: false, isShow: true });
      const betType4 = Object.assign(new BetTypeModel(), { id: '4', name: 'Test 4', liveIndicator: false, type: 1, isChecked: true, isShow: false });

      const betTypes = [betType1, betType2, betType3, betType4];

      // Action
      const result = service.getCheckedBetTypes(betTypes);

      // Assert
      expect(result).toEqual(['1', '2']);
    });

    it('should return empty array when no items are checked and visible', () => {
      // Arrange
      const betType1 = Object.assign(new BetTypeModel(), { id: '1', name: 'Test 1', liveIndicator: false, type: 1, isChecked: false, isShow: true });
      const betType2 = Object.assign(new BetTypeModel(), { id: '2', name: 'Test 2', liveIndicator: false, type: 1, isChecked: true, isShow: false });

      const betTypes = [betType1, betType2];

      // Action
      const result = service.getCheckedBetTypes(betTypes);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle empty array', () => {
      // Arrange
      const betTypes: BetTypeModel[] = [];

      // Action
      const result = service.getCheckedBetTypes(betTypes);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('checkDisplay', () => {
    it('should return true when at least one item is visible', () => {
      // Arrange
      const betType1 = Object.assign(new BetTypeModel(), { id: '1', name: 'Test 1', liveIndicator: false, type: 1, isChecked: false, isShow: false });
      const betType2 = Object.assign(new BetTypeModel(), { id: '2', name: 'Test 2', liveIndicator: false, type: 1, isChecked: false, isShow: true });
      const betType3 = Object.assign(new BetTypeModel(), { id: '3', name: 'Test 3', liveIndicator: false, type: 1, isChecked: false, isShow: false });

      const betTypes = [betType1, betType2, betType3];

      // Action
      const result = service.checkDisplay(betTypes);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when no items are visible', () => {
      // Arrange
      const betType1 = Object.assign(new BetTypeModel(), { id: '1', name: 'Test 1', liveIndicator: false, type: 1, isChecked: false, isShow: false });
      const betType2 = Object.assign(new BetTypeModel(), { id: '2', name: 'Test 2', liveIndicator: false, type: 1, isChecked: false, isShow: false });

      const betTypes = [betType1, betType2];

      // Action
      const result = service.checkDisplay(betTypes);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle empty array', () => {
      // Arrange
      const betTypes: BetTypeModel[] = [];

      // Action
      const result = service.checkDisplay(betTypes);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when first item is visible (early exit)', () => {
      // Arrange
      const betType1 = Object.assign(new BetTypeModel(), { id: '1', name: 'Test 1', liveIndicator: false, type: 1, isChecked: false, isShow: true });
      const betType2 = Object.assign(new BetTypeModel(), { id: '2', name: 'Test 2', liveIndicator: false, type: 1, isChecked: false, isShow: false });

      const betTypes = [betType1, betType2];

      // Action
      const result = service.checkDisplay(betTypes);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('displayNumberGame', () => {
    it('should set isShow to true for sportType 161 with valid ball sequence', () => {
      // Arrange
      const model = new BetTypeModel();
      model.id = '85';
      model.name = 'Test';
      model.liveIndicator = false;
      model.type = 1;
      model.isChecked = false;
      model.ballSequence = [1, 2, 3]; // LiveAll
      const product = Product.NUMBER_GAME;
      const sportType = 161;
      const ballSequence = [1, 2, 3]; // LiveAll

      // Action
      service.displayNumberGame(model, product, sportType, ballSequence);

      // Assert
      expect(model.isShow).toBe(true);
    });

    it('should set isShow to false for sportType 161 with invalid ball sequence', () => {
      // Arrange
      const model = new BetTypeModel();
      model.id = '85';
      model.name = 'Test';
      model.liveIndicator = false;
      model.type = 1;
      model.isChecked = false;
      model.ballSequence = [1, 2, 3]; // LiveAll
      const product = Product.NUMBER_GAME;
      const sportType = 161;
      const ballSequence = [4, 5, 6]; // Invalid sequence

      // Action
      service.displayNumberGame(model, product, sportType, ballSequence);

      // Assert
      expect(model.isShow).toBe(false);
    });

    it('should set isShow to true for sportType 164 with valid id range', () => {
      // Arrange
      const model = new BetTypeModel();
      model.id = '8103';
      model.name = 'Test';
      model.liveIndicator = false;
      model.type = 1;
      model.isChecked = false;
      const product = Product.NUMBER_GAME;
      const sportType = 164;
      const ballSequence = [1, 2, 3];

      // Action
      service.displayNumberGame(model, product, sportType, ballSequence);

      // Assert
      expect(model.isShow).toBe(true);
    });

    it('should set isShow to false for sportType 164 with invalid id range', () => {
      // Arrange
      const model = new BetTypeModel();
      model.id = '8200';
      model.name = 'Test';
      model.liveIndicator = false;
      model.type = 1;
      model.isChecked = false;
      const product = Product.NUMBER_GAME;
      const sportType = 164;
      const ballSequence = [1, 2, 3];

      // Action
      service.displayNumberGame(model, product, sportType, ballSequence);

      // Assert
      expect(model.isShow).toBe(false);
    });

    it('should set isShow to false for other sportType', () => {
      // Arrange
      const model = new BetTypeModel();
      model.id = '85';
      model.name = 'Test';
      model.liveIndicator = false;
      model.type = 1;
      model.isChecked = false;
      const product = Product.NUMBER_GAME;
      const sportType = 999; // Other sport type
      const ballSequence = [1, 2, 3];

      // Action
      service.displayNumberGame(model, product, sportType, ballSequence);

      // Assert
      expect(model.isShow).toBe(false);
    });

    it('should not modify isShow for non-number game product', () => {
      // Arrange
      const model = new BetTypeModel();
      model.id = '85';
      model.name = 'Test';
      model.liveIndicator = false;
      model.type = 1;
      model.isChecked = false;
      model.isShow = true;
      const product = Product.SPORTS_BOOK; // Non-number game product
      const sportType = 161;
      const ballSequence = [1, 2, 3];

      // Action
      service.displayNumberGame(model, product, sportType, ballSequence);

      // Assert
      expect(model.isShow).toBe(true); // Should remain unchanged
    });
  });

  describe('initBetTypesModel', () => {
    it('should create BetTypesModel with all betTypes checked', () => {
      // Arrange
      const betTypes = [
        { id: '1', name: 'Test 1', liveIndicator: false, type: 1 },
        { id: '2', name: 'Test 2', liveIndicator: true, type: 2 }
      ] as BetTypeModel[];
      const isChecked = true;

      // Action
      const result = service.initBetTypesModel(betTypes, isChecked);

      // Assert
      expect(result).toBeInstanceOf(BetTypesModel);
      expect(result.isChecked).toBe(true);
      expect(result.betTypes).toHaveLength(2);
      expect(result.betTypes[0].isChecked).toBe(true);
      expect(result.betTypes[1].isChecked).toBe(true);
    });

    it('should create BetTypesModel with all betTypes unchecked', () => { 
      // Arrange
      const betTypes = [
        { id: '1', name: 'Test 1', liveIndicator: false, type: 1 },
        { id: '2', name: 'Test 2', liveIndicator: true, type: 2 }
      ] as BetTypeModel[];
      const isChecked = false;

      // Action
      const result = service.initBetTypesModel(betTypes, isChecked);

      // Assert
      expect(result).toBeInstanceOf(BetTypesModel);
      expect(result.isChecked).toBe(false);
      expect(result.betTypes).toHaveLength(2);
      expect(result.betTypes[0].isChecked).toBe(false);
      expect(result.betTypes[1].isChecked).toBe(false);
    });

    it('should handle empty betTypes array', () => {
      // Arrange
      const betTypes: any[] = [];
      const isChecked = true;

      // Action
      const result = service.initBetTypesModel(betTypes, isChecked);

      // Assert
      expect(result).toBeInstanceOf(BetTypesModel);
      expect(result.isChecked).toBe(true);
      expect(result.betTypes).toHaveLength(0);
    });
  });

  describe('initBetTypeModel', () => {
    it('should create BetTypeModel with default ball sequence for non-number game', () => {
      // Arrange
      const id = '1';
      const name = 'Test Name';
      const liveIndicator = false;
      const type = Product.SPORTS_BOOK; // Non-number game
      const isChecked = false;

      // Action
      const result = service.initBetTypeModel(id, name, liveIndicator, type, isChecked);

      // Assert
      expect(result).toBeInstanceOf(BetTypeModel);
      expect(result.id).toBe('1');
      expect(result.name).toBe('Test Name'); // Should not be renamed
      expect(result.liveIndicator).toBe(false);
      expect(result.type).toBe(Product.SPORTS_BOOK);
      expect(result.isChecked).toBe(false);
      expect(result.ballSequence).toEqual([]); // Empty for non-number game
    });

    it('should handle id 86 with Next prefix', () => {
      // Arrange
      const id = '86';
      const name = 'Test Name';
      const liveIndicator = false;
      const type = Product.NUMBER_GAME;
      const isChecked = false;

      // Action
      const result = service.initBetTypeModel(id, name, liveIndicator, type, isChecked);

      // Assert
      expect(result.name).toBe('Next Test Name');
    });

    it('should handle id 87 with LiveSecondOrThird ball sequence', () => {
      // Arrange
      const id = '87';
      const name = 'Test Name';
      const liveIndicator = false;
      const type = Product.NUMBER_GAME;
      const isChecked = false;

      // Action
      const result = service.initBetTypeModel(id, name, liveIndicator, type, isChecked);

      // Assert
      expect(result.ballSequence).toEqual([2, 3]); // LiveSecondOrThird
    });

    it('should handle id 88 with LiveSecondOrThird ball sequence', () => {
      // Arrange
      const id = '88';
      const name = 'Test Name';
      const liveIndicator = false;
      const type = Product.NUMBER_GAME;
      const isChecked = false;

      // Action
      const result = service.initBetTypeModel(id, name, liveIndicator, type, isChecked);

      // Assert
      expect(result.ballSequence).toEqual([2, 3]); // LiveSecondOrThird
    });

    it('should handle other id with LiveAll ball sequence', () => {
      // Arrange
      const id = '89';
      const name = 'Test Name';
      const liveIndicator = false;
      const type = Product.NUMBER_GAME;
      const isChecked = false;

      // Action
      const result = service.initBetTypeModel(id, name, liveIndicator, type, isChecked);

      // Assert
      expect(result.ballSequence).toEqual([1, 2, 3]); // LiveAll
    });
  });
});
