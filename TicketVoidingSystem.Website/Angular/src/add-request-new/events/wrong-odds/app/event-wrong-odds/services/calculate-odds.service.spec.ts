import { TestBed } from '@angular/core/testing';
import { CalculateOddsService } from './calculate-odds.service';
import { TestingModule } from "../../../../../../utility/modules/testing.module";
import { MatchModel } from "../../../../../../utility/models/match.model";
import { FilterWrongOddsModel, MaxBetAndSpreadQuery } from '../models/filter-wrong-odds.model';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';

describe('CalculateOddsService', () => {
  let service: CalculateOddsService;
  let addRequestApiService: AddRequestApiService;

  const mockMatchModel = {
    matchId: 123,
    parentId: 456,
    subtype: 1
  } as MatchModel;

  const mockMaxBetAndSpreadInfo = [
    {
      subIssueTypeId: '1',
      maxBet: 50000,
      spread: '0.1'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        CalculateOddsService,
        AddRequestApiService
      ]
    });

    service = TestBed.inject(CalculateOddsService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateOddsInfo', () => {
    it('should update odds info successfully', async () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      const subIssueTypeId = '1';
      jest.spyOn(addRequestApiService, 'getMaxBetAndSpreadOfEvent').mockResolvedValue(mockMaxBetAndSpreadInfo);

      // Act
      await service.updateOddsInfo(oddsInfo, mockMatchModel, subIssueTypeId);

      // Assert
      expect(oddsInfo.maxBetAndSpreadInfo).toEqual(mockMaxBetAndSpreadInfo);
      expect(oddsInfo.maxBet).toBe(50000);
      expect(oddsInfo.spread).toBe('0.1');
      expect(oddsInfo.allowanceRate).toBe('25');
    });

    it('should not update odds info when matchId is not provided', async () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      const matchWithoutId = {} as MatchModel;
      const subIssueTypeId = '1';
      const spy = jest.spyOn(addRequestApiService, 'getMaxBetAndSpreadOfEvent');

      // Act
      await service.updateOddsInfo(oddsInfo, matchWithoutId, subIssueTypeId);

      // Assert
      expect(oddsInfo.maxBetAndSpreadInfo).toBeUndefined();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('createMaxBetAndSpreadQuery', () => {
    it('should create query with correct values', () => {
      // Act
      const result = service.createMaxBetAndSpreadQuery(mockMatchModel);

      // Assert
      expect(result).toEqual({
        matchId: 123,
        parentId: 456,
        subtype: 1
      } as MaxBetAndSpreadQuery);
    });

    it('should use default subtype when not provided', () => {
      // Arrange
      const matchWithoutSubtype = {
        matchId: 123,
        parentId: 456
      } as MatchModel;

      // Act
      const result = service.createMaxBetAndSpreadQuery(matchWithoutSubtype);

      // Assert
      expect(result.subtype).toBe(0);
    });
  });

  describe('resetOddsInfo', () => {
    it('should reset odds info correctly', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.correctOddsHomeOver = '1.5';
      oddsInfo.correctOddsAwayUnder = '2.5';
      const subIssueTypeId = '1';

      // Act
      service.resetOddsInfo(oddsInfo, subIssueTypeId);

      // Assert
      expect(oddsInfo.correctOddsHomeOver).toBe('');
      expect(oddsInfo.correctOddsAwayUnder).toBe('');
    });
  });

  describe('updateMaxBetAndSpread', () => {
    it('should update max bet and spread when info is available', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.maxBetAndSpreadInfo = mockMaxBetAndSpreadInfo;
      const subIssueTypeId = '1';

      // Act
      service.updateMaxBetAndSpread(oddsInfo, subIssueTypeId);

      // Assert
      expect(oddsInfo.maxBet).toBe(50000);
      expect(oddsInfo.spread).toBe('0.1');
    });

    it('should set default values when no info is available', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.maxBetAndSpreadInfo = [];
      const subIssueTypeId = '1';

      // Act
      service.updateMaxBetAndSpread(oddsInfo, subIssueTypeId);

      // Assert
      expect(oddsInfo.maxBet).toBe(0);
      expect(oddsInfo.spread).toBe('');
    });
  });

  describe('updateAllowanceRate', () => {
    it('should set allowance rate to 20 when max bet is >= 80000', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.maxBet = 80000;
      oddsInfo.spread = '0.1';

      // Act
      service.updateAllowanceRate(oddsInfo);

      // Assert
      expect(oddsInfo.allowanceRate).toBe('20');
    });

    it('should set allowance rate to 30 when spread > 0.15', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.maxBet = 50000;
      oddsInfo.spread = '0.2';

      // Act
      service.updateAllowanceRate(oddsInfo);

      // Assert
      expect(oddsInfo.allowanceRate).toBe('30');
    });

    it('should set allowance rate to 25 for other cases', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.maxBet = 50000;
      oddsInfo.spread = '0.1';

      // Act
      service.updateAllowanceRate(oddsInfo);

      // Assert
      expect(oddsInfo.allowanceRate).toBe('25');
    });
  });

  describe('updateCorrectOddsAwayUnder', () => {
    it('should calculate correct odds away under correctly', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.correctOddsHomeOver = '1.5';
      oddsInfo.spread = '0.1';

      // Act
      service.updateCorrectOddsAwayUnder(oddsInfo);

      // Assert
      expect(oddsInfo.correctOddsAwayUnder).toBe('0.40');
    });

    it('should not calculate when required values are missing', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.correctOddsHomeOver = '1.5';

      // Act
      service.updateCorrectOddsAwayUnder(oddsInfo);

      // Assert
      expect(oddsInfo.correctOddsAwayUnder).toBeUndefined();
    });
  });

  describe('calculateOddsRange', () => {
    it('should calculate odds range correctly', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.correctOddsHomeOver = '0.7';
      oddsInfo.correctOddsAwayUnder = '-0.9';
      oddsInfo.allowanceRate = '20';

      // Act
      service.calculateOddsRange(oddsInfo);

      // Assert
      expect(oddsInfo.toOddsNotVoidHomeOver).toBe('0.90');
      expect(oddsInfo.toOddsNotVoidAwayUnder).toBe('-0.70');
      expect(oddsInfo.fromOddsNotVoidHomeOver).toBe('0.50');
      expect(oddsInfo.fromOddsNotVoidAwayUnder).toBe('0.90');
    });

    it('should not calculate when correct odds away under is missing', () => {
      // Arrange
      const oddsInfo = new FilterWrongOddsModel();
      oddsInfo.correctOddsHomeOver = '1.5';
      oddsInfo.allowanceRate = '25';

      // Act
      service.calculateOddsRange(oddsInfo);

      // Assert
      expect(oddsInfo.toOddsNotVoidHomeOver).toBeUndefined();
      expect(oddsInfo.toOddsNotVoidAwayUnder).toBeUndefined();
      expect(oddsInfo.fromOddsNotVoidHomeOver).toBeUndefined();
      expect(oddsInfo.fromOddsNotVoidAwayUnder).toBeUndefined();
    });
  });
});
