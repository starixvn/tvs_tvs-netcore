import { FilterService } from "./filter.service";

describe('FilterService', () => {
    it('#initMultiSelectProduct should return 3 group', () => {
      // Arrange & Action
      const result = FilterService.initMultiSelectProduct();
  
      // Assert
      expect(result.items.length).toBe(3);
      expect(result.items[0].text).toBe('Sports Book');
      expect(result.items[1].text).toBe('Other products');
      expect(result.items[2].text).toBe('Main Parlay');
    });
});