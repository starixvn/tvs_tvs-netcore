import { TestBed } from '@angular/core/testing';
import { FilterWrongOuService } from './filter-wrong-ou.service';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';

describe('FilterWrongOuService', () => {
  let service: FilterWrongOuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterWrongOuService]
    });
    service = TestBed.inject(FilterWrongOuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBetChoiceSelection', () => {
    const mockOddsInfo: OddsInfo[] = [
      { betTypeId: 1, oddsId: '1', playerId: 1, playerName: 'Player 1', betChoice: 'Over', playNamesChineseTraditional: '', playNamesChineseSimplified: '', oddsInfo: '', performance: '' },
      { betTypeId: 1, oddsId: '2', playerId: 2, playerName: 'Player 2', betChoice: 'Under', playNamesChineseTraditional: '', playNamesChineseSimplified: '', oddsInfo: '', performance: '' },
      { betTypeId: 2, oddsId: '3', playerId: 3, playerName: 'Player 3', betChoice: 'Home', playNamesChineseTraditional: '', playNamesChineseSimplified: '', oddsInfo: '', performance: '' },
      { betTypeId: 1, oddsId: '4', playerId: 4, playerName: 'Player 4', betChoice: 'Over', playNamesChineseTraditional: '', playNamesChineseSimplified: '', oddsInfo: '', performance: '' }
    ];

    it('should return bet choice selection for given betTypeId', () => {
      const result = service.getBetChoiceSelection(mockOddsInfo, 1);

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(2); // Over and Under
      expect(result.items[0].value).toBe('Over');
      expect(result.items[1].value).toBe('Under');
    });

    it('should return empty items when no oddsInfo matches betTypeId', () => {
      const result = service.getBetChoiceSelection(mockOddsInfo, 999);

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(0);
    });

    it('should return empty items when oddsInfo is empty', () => {
      const result = service.getBetChoiceSelection([], 1);

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(0);
    });

    it('should mark items as checked when they are in selectedItems', () => {
      const selectedItems = ['Over'];
      const result = service.getBetChoiceSelection(mockOddsInfo, 1, selectedItems);

      expect(result.items[0].checked).toBe(true);
      expect(result.items[1].checked).toBe(false);
    });

    it('should not mark items as checked when selectedItems is empty', () => {
      const result = service.getBetChoiceSelection(mockOddsInfo, 1, []);

      expect(result.items[0].checked).toBe(false);
      expect(result.items[1].checked).toBe(false);
    });

    it('should handle undefined selectedItems parameter', () => {
      const result = service.getBetChoiceSelection(mockOddsInfo, 1, undefined);

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(2);
      expect(result.items[0].checked).toBe(false);
      expect(result.items[1].checked).toBe(false);
    });

    it('should remove duplicate betChoices', () => {
      const result = service.getBetChoiceSelection(mockOddsInfo, 1);

      expect(result.items.length).toBe(2);
      const betChoices = result.items.map(item => item.value);
      expect(betChoices).toEqual(['Over', 'Under']);
    });
  });

  describe('isBetTypeHasBetChoiceSelection', () => {
    it('should return true for valid betTypeIds', () => {
      expect(service.isBetTypeHasBetChoiceSelection('653')).toBe(true);
      expect(service.isBetTypeHasBetChoiceSelection('655')).toBe(true);
      expect(service.isBetTypeHasBetChoiceSelection('685')).toBe(true);
    });

    it('should return false for invalid betTypeIds', () => {
      expect(service.isBetTypeHasBetChoiceSelection('999')).toBe(false);
      expect(service.isBetTypeHasBetChoiceSelection('675')).toBe(false);
      expect(service.isBetTypeHasBetChoiceSelection('')).toBe(false);
      expect(service.isBetTypeHasBetChoiceSelection(null as any)).toBe(false);
    });
  });
});
