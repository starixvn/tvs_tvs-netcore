import { TestBed } from '@angular/core/testing';
import { MultipleSelection } from '../../../../../../utility/components/multiple-selection/multiple-selection';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { NotParticipateBetTypeModel, NotParticipateBetTypeViewModel } from '../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from './filter-not-participate.service';

describe('FilterNotParticipateService', () => {
  let service: FilterNotParticipateService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [FilterNotParticipateService]
    });

    service = TestBed.inject(FilterNotParticipateService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initDefaultFilter', () => {
    it('should initialize default filter with correct values', () => {
      // Act
      const result = service.initDefaultFilter();

      // Assert
      expect(result).toBeInstanceOf(FilterNotParticipateModel);
      expect(result.betTypeMultipleSelection).toBeDefined();
    });
  });

  describe('getNotParticipateBetTypes', () => {
    it('should call API service with correct matchId', async () => {
      // Arrange
      const matchId = 123;
      const mockResponse = {} as NotParticipateBetTypeViewModel;
      addRequestApiService.getNotParticipateBetTypes = jest.fn().mockResolvedValue(mockResponse);

      // Act
      const result = await service.getNotParticipateBetTypes(matchId);

      // Assert
      expect(addRequestApiService.getNotParticipateBetTypes).toHaveBeenCalledWith(matchId);
      expect(result).toBe(mockResponse);
    });
  });

  describe('renderBetTypes', () => {
    it('should render bet types correctly', () => {
      // Arrange
      const models: NotParticipateBetTypeModel[] = [
        {
          betTypeId: 1,
          betTypeName: 'Type 1',
          parentId: 1,
          parentName: 'Parent 1',
          playerId: 1
        },
        {
          betTypeId: 2,
          betTypeName: 'Type 2',
          parentId: 1,
          parentName: 'Parent 1',
          playerId: 1
        },
        {
          betTypeId: 3,
          betTypeName: 'Type 3',
          parentId: 2,
          parentName: 'Parent 2',
          playerId: 2
        }
      ];

      // Act
      const result = service.renderBetTypes(models);

      // Assert
      expect(result.length).toBe(2); // Two parent groups
      expect(result[0].items.length).toBe(2); // Two items in first parent
      expect(result[1].items.length).toBe(1); // One item in second parent
      expect(result[0].id).toBe(1);
      expect(result[0].text).toBe('Parent 1');
      expect(result[0].items[0].id).toBe(0);
      expect(result[0].items[0].text).toBe('Type 1');
    });
  });

  describe('initDefaultBetTypeSelection', () => {
    it('should initialize default bet type selection with correct properties', () => {
      // Act
      const result = service.initDefaultBetTypeSelection();

      // Assert
      expect(result).toBeInstanceOf(MultipleSelection);
      expect(result.checkAllCheckBoxText).toBe('All');
      expect(result.allItemsCheckedText).toBe('All');
      expect(result.noneItemCheckedText).toBe('Select an option');
      expect(result.maxWidth).toBe('300px');
      expect(result.numberItemsDisplay).toBe(1);
      expect(result.buttonHeight).toBe('29.5px');
      expect(result.isDefaultSelectAll).toBeFalsy();
      expect(result.items).toEqual([]);
    });
  });
});
