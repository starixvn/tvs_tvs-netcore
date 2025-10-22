import { TestBed } from '@angular/core/testing';
import { SummaryService } from './summary.service';
import { SummaryItem } from './summary.model';
import { PrimaryBetType } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';

describe('SummaryService', () => {
  let service: SummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initSummaryItem', () => {
    it('should initialize summary item with basic properties', () => {
      // Arrange
      const name = 'Test Name';
      const total = 100;
      const isChinaView = true;
      const licenseeName = 'Test Licensee';
      const betTypes = '1,2,3';
      const items: SummaryItem[] = [];
      const betTypeName = 'Test Bet Type';
      const specialPlatform = 1;

      // Act
      const result = service.initSummaryItem(
        name, total, isChinaView, licenseeName, betTypes, items, betTypeName, specialPlatform
      );

      // Assert
      expect(result).toBeInstanceOf(SummaryItem);
      expect(result.name).toBe(name);
      expect(result.total).toBe(total);
      expect(result.isChinaView).toBe(isChinaView);
      expect(result.licenseeName).toBe(licenseeName);
      expect(result.betTypeName).toBe(name);
      expect(result.specialPlatform).toBe(specialPlatform);
      expect(result.isGroup).toBe(false);
      expect(result.isChecked).toBe(false);
      expect(result.isShow).toBe(true);
    });

    it('should set betTypeName to name when licenseeName equals name', () => {
      // Arrange
      const name = 'Same Name';
      const licenseeName = 'Same Name';
      const betTypeName = 'Different Bet Type';

      // Act
      const result = service.initSummaryItem(
        name, 0, false, licenseeName, '', [], betTypeName, 0
      );

      // Assert
      expect(result.betTypeName).toBe(betTypeName);
    });

    it('should set betTypeName to betTypeName when licenseeName differs from name', () => {
      // Arrange
      const name = 'Different Name';
      const licenseeName = 'Licensee Name';
      const betTypeName = 'Bet Type Name';

      // Act
      const result = service.initSummaryItem(
        name, 0, false, licenseeName, '', [], betTypeName, 0
      );

      // Assert
      expect(result.betTypeName).toBe(name);
    });

    it('should set isGroup and isChecked to true when items array has elements', () => {
      // Arrange
      const items: SummaryItem[] = [
        new SummaryItem(),
        new SummaryItem()
      ];

      // Act
      const result = service.initSummaryItem(
        'Test', 0, false, 'Licensee', '', items, 'BetType', 0
      );

      // Assert
      expect(result.isGroup).toBe(true);
      expect(result.isChecked).toBe(true);
    });

    it('should set isGroup and isChecked to false when items array is empty', () => {
      // Arrange
      const items: SummaryItem[] = [];

      // Act
      const result = service.initSummaryItem(
        'Test', 0, false, 'Licensee', '', items, 'BetType', 0
      );

      // Assert
      expect(result.isGroup).toBe(false);
      expect(result.isChecked).toBe(false);
    });
  });

  describe('addSecondaryBetType', () => {
    it('should return empty string when betTypes is undefined', () => {
      // Act
      const result = service['addSecondaryBetType'](undefined);

      // Assert
      expect(result).toBe('');
    });

    it('should return empty string when betTypes is null', () => {
      // Act
      const result = service['addSecondaryBetType'](null);

      // Assert
      expect(result).toBe('');
    });

    it('should return empty string when betTypes is empty string', () => {
      // Act
      const result = service['addSecondaryBetType']('');

      // Assert
      expect(result).toBe('');
    });

    it('should convert bet type IDs to names using PrimaryBetType.ROOT', () => {
      // Arrange
      const betTypes = '1,2,3';
      const expectedResult = `${PrimaryBetType.ROOT['1']},${PrimaryBetType.ROOT['2']},${PrimaryBetType.ROOT['3']}`;

      // Act
      const result = service['addSecondaryBetType'](betTypes);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should return original ID when not found in PrimaryBetType.ROOT', () => {
      // Arrange
      const betTypes = '999,1000';
      const expectedResult = '999,1000';

      // Act
      const result = service['addSecondaryBetType'](betTypes);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should handle mixed valid and invalid bet type IDs', () => {
      // Arrange
      const betTypes = '1,999,2';
      const expectedResult = `${PrimaryBetType.ROOT['1']},999,${PrimaryBetType.ROOT['2']}`;

      // Act
      const result = service['addSecondaryBetType'](betTypes);

      // Assert
      expect(result).toBe(expectedResult);
    });

    it('should handle single bet type ID', () => {
      // Arrange
      const betTypes = '1';
      const expectedResult = PrimaryBetType.ROOT['1'];

      // Act
      const result = service['addSecondaryBetType'](betTypes);

      // Assert
      expect(result).toBe(expectedResult);
    });
  });

  describe('renderItems', () => {
    it('should clear existing items and populate with new items', () => {
      // Arrange
      const baseSummaryItem = new SummaryItem();
      baseSummaryItem.items = [new SummaryItem(), new SummaryItem()]; // Pre-populate with items
      
      const items: SummaryItem[] = [
        {
          name: 'Item 1',
          total: 100,
          isChinaView: true,
          licenseeName: 'Licensee 1',
          betTypes: '1,2',
          items: [],
          isGroup: false,
          isChecked: false,
          isShow: true,
          specialPlatform: 1,
          betTypeName: 'BetType 1'
        } as SummaryItem,
        {
          name: 'Item 2',
          total: 200,
          isChinaView: false,
          licenseeName: 'Licensee 2',
          betTypes: '3,4',
          items: [],
          isGroup: false,
          isChecked: false,
          isShow: true,
          specialPlatform: 2,
          betTypeName: 'BetType 2'
        } as SummaryItem
      ];

      // Act
      service['renderItems'](baseSummaryItem, items);

      // Assert
      expect(baseSummaryItem.items.length).toBe(2);
      expect(baseSummaryItem.items[0].name).toBe('Item 1');
      expect(baseSummaryItem.items[0].total).toBe(100);
      expect(baseSummaryItem.items[0].isChinaView).toBe(true);
      expect(baseSummaryItem.items[0].licenseeName).toBe('Licensee 1');
      expect(baseSummaryItem.items[0].specialPlatform).toBe(1);
      
      expect(baseSummaryItem.items[1].name).toBe('Item 2');
      expect(baseSummaryItem.items[1].total).toBe(200);
      expect(baseSummaryItem.items[1].isChinaView).toBe(false);
      expect(baseSummaryItem.items[1].licenseeName).toBe('Licensee 2');
      expect(baseSummaryItem.items[1].specialPlatform).toBe(2);
    });

    it('should handle empty items array', () => {
      // Arrange
      const baseSummaryItem = new SummaryItem();
      baseSummaryItem.items = [new SummaryItem()]; // Pre-populate with items
      const items: SummaryItem[] = [];

      // Act
      service['renderItems'](baseSummaryItem, items);

      // Assert
      expect(baseSummaryItem.items.length).toBe(0);
    });

    it('should set betTypeName from baseSummaryItem for all rendered items', () => {
      // Arrange
      const baseSummaryItem = new SummaryItem();
      baseSummaryItem.betTypeName = 'Base Bet Type';
      
      const items: SummaryItem[] = [
        {
          name: 'Item 1',
          total: 100,
          isChinaView: true,
          licenseeName: 'Licensee 1',
          betTypes: '1,2',
          items: [],
          isGroup: false,
          isChecked: false,
          isShow: true,
          specialPlatform: 1,
          betTypeName: 'Original BetType'
        } as SummaryItem
      ];

      // Act
      service['renderItems'](baseSummaryItem, items);

      // Assert
      expect(baseSummaryItem.items[0].betTypeName).toBe('Item 1');
    });
  });

  describe('Integration tests', () => {
    it('should work correctly with real PrimaryBetType.ROOT values', () => {
      // Arrange
      const betTypes = '1,2,3';
      
      // Act
      const result = service['addSecondaryBetType'](betTypes);

      // Assert
      expect(result).toBe('1,1303,2,1305,157,3,1306');
    });

    it('should handle complex initSummaryItem with nested items', () => {
      // Arrange
      const childItems: SummaryItem[] = [
        {
          name: 'Child 1',
          total: 50,
          isChinaView: true,
          licenseeName: 'Child Licensee 1',
          betTypes: '1',
          items: [],
          isGroup: false,
          isChecked: false,
          isShow: true,
          specialPlatform: 1,
          betTypeName: 'Child BetType 1'
        } as SummaryItem
      ];

      // Act
      const result = service.initSummaryItem(
        'Parent', 200, false, 'Parent Licensee', '1,2', childItems, 'Parent BetType', 2
      );

      // Assert
      expect(result.name).toBe('Parent');
      expect(result.total).toBe(200);
      expect(result.isGroup).toBe(true);
      expect(result.isChecked).toBe(true);
      expect(result.items.length).toBe(1);
      expect(result.items[0].name).toBe('Child 1');
      expect(result.items[0].betTypeName).toBe('Child 1');
    });
  });
});