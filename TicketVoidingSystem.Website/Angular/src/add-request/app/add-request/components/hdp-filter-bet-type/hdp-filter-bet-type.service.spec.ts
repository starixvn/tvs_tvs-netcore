import { TestBed } from '@angular/core/testing';
import { HdpFilterBetTypeService } from './hdp-filter-bet-type.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';
import { HdpFilterBetType } from '../../models/hdp-filter-betType.model';

describe('HdpFilterBetTypeService', () => {
  let service: HdpFilterBetTypeService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [HdpFilterBetTypeService]
    });

    service = TestBed.inject(HdpFilterBetTypeService);
    commonService = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GetHdpFilterBetTypes', () => {
    it('should initialize and return filter bet types', async () => {
      // Arrange
      const mockFilterBetTypes: HdpFilterBetType[] = [
        {
          betType: '1',
          isChecked: false,
          selections: [
            {
              xmlAttribute: 'betIdx',
              value: '',
              items: [{ value: '1' }]
            }
          ]
        }
      ] as unknown as HdpFilterBetType[];

      jest.spyOn(commonService, 'getHdpFilterBetTypes').mockResolvedValue(mockFilterBetTypes);

      // Act
      const result = await service.GetHdpFilterBetTypes(1, '1');

      // Assert
      expect(result).toEqual(mockFilterBetTypes);
      expect(commonService.getHdpFilterBetTypes).toHaveBeenCalledWith('1', 1);
      expect(result[0].selections[0].value).toBe('1');
    });
  });

  describe('updateAllFilterBetTypeData', () => {
    it('should update filter bet type data when bet type is selected', () => {
      // Arrange
      const mockFilterBetTypes: HdpFilterBetType[] = [
        {
          betType: '1',
          isChecked: true,
          selections: [
            {
              xmlAttribute: 'betIdx',
              value: '1',
              items: [{ value: '1' }]
            }
          ],
          inputs: [
            {
              xmlAttribute: 'betIdY',
              value: '2'
            }
          ]
        }
      ] as unknown as HdpFilterBetType[];

      const filterBetType: FilterBetType = {
        filterBetIdX: '',
        filterBetIdY: '',
        filterBetTypeId: ''
      };

      // Act
      service.updateAllFilterBetTypeData(mockFilterBetTypes, filterBetType);

      // Assert
      expect(filterBetType.filterBetTypeId).toBe('1');
      expect(filterBetType.filterBetIdX).toBe('1');
      expect(filterBetType.filterBetIdY).toBe('2');
    });

    it('should not update when no bet type is selected', () => {
      // Arrange
      const mockFilterBetTypes: HdpFilterBetType[] = [];
      const filterBetType: FilterBetType = {
        filterBetIdX: '',
        filterBetIdY: '',
        filterBetTypeId: ''
      };

      // Act
      service.updateAllFilterBetTypeData(mockFilterBetTypes, filterBetType);

      // Assert
      expect(filterBetType.filterBetTypeId).toBe('');
      expect(filterBetType.filterBetIdX).toBe('');
      expect(filterBetType.filterBetIdY).toBe('');
    });
  });

  describe('updateFilterBetTypeData', () => {
    it('should update filter bet type data for betIdx attribute', () => {
      // Arrange
      const filterBetType: FilterBetType = {
        filterBetIdX: '',
        filterBetIdY: '',
        filterBetTypeId: ''
      };

      // Act
      service.updateFilterBetTypeData(filterBetType, 'betIdx', '1');

      // Assert
      expect(filterBetType.filterBetIdX).toBe('1');
    });

    it('should update filter bet type data for betIdY attribute', () => {
      // Arrange
      const filterBetType: FilterBetType = {
        filterBetIdX: '',
        filterBetIdY: '',
        filterBetTypeId: ''
      };

      // Act
      service.updateFilterBetTypeData(filterBetType, 'betIdY', '2');

      // Assert
      expect(filterBetType.filterBetIdY).toBe('2');
    });

    it('should update filter bet type data for _xxx attribute', () => {
      // Arrange
      const filterBetType: FilterBetType = {
        filterBetIdX: '',
        filterBetIdY: '',
        filterBetTypeId: ''
      };

      // Act
      service.updateFilterBetTypeData(filterBetType, '_xxx', '1');

      // Assert
      expect(filterBetType.filterBetIdX).toBe('_001');
    });

    it('should update filter bet type data for yy attribute', () => {
      // Arrange
      const filterBetType: FilterBetType = {
        filterBetIdX: '',
        filterBetIdY: '',
        filterBetTypeId: ''
      };

      // Act
      service.updateFilterBetTypeData(filterBetType, 'yy', '1');

      // Assert
      expect(filterBetType.filterBetIdY).toBe('01');
    });
  });

  describe('loadDataEditPage', () => {
    it('should load data for edit page', () => {
      // Arrange
      const mockFilterBetTypes: HdpFilterBetType[] = [
        {
          betType: '1',
          isChecked: false,
          selections: [
            {
              xmlAttribute: 'betIdx',
              value: '',
              items: [{ value: '1' }]
            }
          ],
          inputs: [
            {
              xmlAttribute: 'betIdY',
              value: ''
            }
          ]
        }
      ] as unknown as HdpFilterBetType[];

      const filterBetType: FilterBetType = {
        filterBetIdX: '_001',
        filterBetIdY: '01',
        filterBetTypeId: '1'
      };

      // Act
      service.loadDataEditPage(mockFilterBetTypes, filterBetType);

      // Assert
      expect(mockFilterBetTypes[0].isChecked).toBe(true);
      expect(mockFilterBetTypes[0].selections[0].value).toBe('_001');
    });
  });

  describe('getInputFilterBetTypeEdit', () => {
    it('should get input value for betIdx attribute', () => {
      // Arrange
      const filterBetType: FilterBetType = {
        filterBetIdX: '1',
        filterBetIdY: '',
        filterBetTypeId: ''
      };

      // Act
      const result = service.getInputFilterBetTypeEdit(filterBetType, 'betIdx');

      // Assert
      expect(result).toBe('1');
    });

    it('should get input value for betIdY attribute', () => {
      // Arrange
      const filterBetType: FilterBetType = {
        filterBetIdX: '',
        filterBetIdY: '2',
        filterBetTypeId: ''
      };

      // Act
      const result = service.getInputFilterBetTypeEdit(filterBetType, 'betIdY');

      // Assert
      expect(result).toBe('2');
    });

    it('should get input value for _xxx attribute', () => {
      // Arrange
      const filterBetType: FilterBetType = {
        filterBetIdX: '_001',
        filterBetIdY: '',
        filterBetTypeId: ''
      };

      // Act
      const result = service.getInputFilterBetTypeEdit(filterBetType, '_xxx');

      // Assert
      expect(result).toBe('1');
    });

    it('should get input value for yy attribute', () => {
      // Arrange
      const filterBetType: FilterBetType = {
        filterBetIdX: '',
        filterBetIdY: '01',
        filterBetTypeId: ''
      };

      // Act
      const result = service.getInputFilterBetTypeEdit(filterBetType, 'yy');

      // Assert
      expect(result).toBe('1');
    });
  });
});
