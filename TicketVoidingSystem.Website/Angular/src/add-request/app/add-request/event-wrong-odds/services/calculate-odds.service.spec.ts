import { MatchModel } from '../../../../../utility/models/match.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterWrongOddsModel, MaxBetAndSpreadQuery } from '../models/filter-wrong-odds.model';
import { CalculateOddsService } from './calculate-odds.service';

describe('CalculateOddsService', () => {
  let service: CalculateOddsService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(() => {
    jest.clearAllMocks();
    addRequestApiService = new AddRequestApiService(null);
    service = new CalculateOddsService(addRequestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#updateOddsInfo should update odds info correctly', async () => {
    const oddsInfo: FilterWrongOddsModel = { maxBetAndSpreadInfo: [] } as FilterWrongOddsModel;
    const match: MatchModel = { matchId: 1, parentId: 2, subtype: 3 } as MatchModel;
    const subIssueTypeId = 'subIssueType1';
    const maxBetAndSpreadInfo = [{ subIssueTypeId: subIssueTypeId, maxBet: 100, spread: '0.2' }];
    addRequestApiService.getMaxBetAndSpreadOfEvent = jest.fn().mockReturnValue(maxBetAndSpreadInfo);

    await service.updateOddsInfo(oddsInfo, match, subIssueTypeId);

    expect(addRequestApiService.getMaxBetAndSpreadOfEvent).toHaveBeenCalledWith(service.createMaxBetAndSpreadQuery(match));
    expect(oddsInfo.maxBetAndSpreadInfo).toEqual(maxBetAndSpreadInfo);
  });
  
  it('#createMaxBetAndSpreadQuery should create correct MaxBetAndSpreadQuery', () => {
    const match: MatchModel = { matchId: 1, parentId: 2, subtype: 3 } as MatchModel;
    const query: MaxBetAndSpreadQuery = service.createMaxBetAndSpreadQuery(match);

    expect(query.matchId).toBe(1);
    expect(query.parentId).toBe(2);
    expect(query.subtype).toBe(3);
  });

  it('#createMaxBetAndSpreadQuery should create subtype MaxBetAndSpreadQuery is 0 when match has not subtype', () => {
    const match: MatchModel = { matchId: 1, parentId: 2 } as MatchModel;
    const query: MaxBetAndSpreadQuery = service.createMaxBetAndSpreadQuery(match);

    expect(query.matchId).toBe(1);
    expect(query.parentId).toBe(2);
    expect(query.subtype).toBe(0);
  });

  it('#resetOddsInfo should reset odds info correctly', () => {
    const oddsInfo: FilterWrongOddsModel = { maxBetAndSpreadInfo: [], correctOddsHomeOver: '1.5', correctOddsAwayUnder: '1.4' } as FilterWrongOddsModel;
    const subIssueTypeId = 'subIssueType1';

    service.resetOddsInfo(oddsInfo, subIssueTypeId);

    expect(oddsInfo.correctOddsHomeOver).toBe('');
    expect(oddsInfo.correctOddsAwayUnder).toBe('');
  });

  it('#updateMaxBetAbsSpread should not update max bet and spread when has not maxBetAndSpreadInfo', () => {
    const oddsInfo: FilterWrongOddsModel = { maxBet: 0, spread: '' } as FilterWrongOddsModel;
    const subIssueTypeId = 'subIssueType1';

    service.updateMaxBetAbsSpread(oddsInfo, subIssueTypeId);

    expect(oddsInfo.maxBet).toBe(0);
    expect(oddsInfo.spread).toEqual('');
  });

  it('#updateMaxBetAbsSpread should not update max bet and spread when maxBetAndSpreadInfo has not value', () => {
    const oddsInfo: FilterWrongOddsModel = { maxBet: 0, spread: '', maxBetAndSpreadInfo: [] } as FilterWrongOddsModel;
    const subIssueTypeId = 'subIssueType1';

    service.updateMaxBetAbsSpread(oddsInfo, subIssueTypeId);

    expect(oddsInfo.maxBet).toBe(0);
    expect(oddsInfo.spread).toEqual('');
  });

  it('#updateMaxBetAbsSpread should update max bet and spread correctly', () => {
    const oddsInfo: FilterWrongOddsModel = { maxBetAndSpreadInfo: [{ subIssueTypeId: 'subIssueType1', maxBet: 100, spread: '0.2' }] } as FilterWrongOddsModel;
    const inputTests = [{subIssueTypeId: "subIssueType1", maxBet: 100, spread: '0.2'}, 
      {subIssueTypeId: "subIssueType2", maxBet: 0, spread: '0'}
    ]
    inputTests.forEach(test => {
      service.updateMaxBetAbsSpread(oddsInfo, test.subIssueTypeId);
      expect(oddsInfo.maxBet).toBe(test.maxBet);
      expect(oddsInfo.spread).toBe(test.spread);
    })
  });

  it('#updateAllowanceRate should update allowance rate default 20 when maxBet & spread is 0', () => {
    const oddsInfo: FilterWrongOddsModel = { maxBet: 0, spread: '0', maxBetAndSpreadInfo: [] } as FilterWrongOddsModel;

    service.updateAllowanceRate(oddsInfo);

    expect(oddsInfo.allowanceRate).toBe('20');
  });

  it('#updateAllowanceRate should update allowance rate correctly when max bet is >= 80000', () => {
    const oddsInfo: FilterWrongOddsModel = { maxBet: 80000, spread: '0', maxBetAndSpreadInfo: [] } as FilterWrongOddsModel;

    service.updateAllowanceRate(oddsInfo);

    expect(oddsInfo.allowanceRate).toBe('20');
  });

  it('#updateAllowanceRate should update allowance rate correctly when spread is > 0.15', () => {
    const oddsInfo: FilterWrongOddsModel = { maxBet: 70000, spread: '0.2', maxBetAndSpreadInfo: [{}] } as FilterWrongOddsModel;

    service.updateAllowanceRate(oddsInfo);

    expect(oddsInfo.allowanceRate).toBe('30');
  });

  it('#updateAllowanceRate should update allowance rate correctly for other cases', () => {
    const oddsInfo: FilterWrongOddsModel = { maxBet: 70000, spread: '0.1', maxBetAndSpreadInfo: [{}] } as FilterWrongOddsModel;

    service.updateAllowanceRate(oddsInfo);

    expect(oddsInfo.allowanceRate).toBe('25');
  });

  it('#updateCorrectOddsAwayUnder should update correct odds away under correctly', () => {
    const inputTests = [{correctOddsHomeOver: '0.7', spread: '0.2', correctOddsAwayUnder: '-0.90'}, 
      {correctOddsHomeOver: '0.9', spread: '0.3', correctOddsAwayUnder: '0.80'}];

    inputTests.forEach(test => {
      const oddsInfo: FilterWrongOddsModel = { correctOddsHomeOver: test.correctOddsHomeOver, spread: test.spread } as FilterWrongOddsModel;
      service.updateCorrectOddsAwayUnder(oddsInfo);
      expect(oddsInfo.correctOddsAwayUnder).toBe(test.correctOddsAwayUnder);
    })
  });
  
  it('#updateCorrectOddsAwayUnder should not update correct odds away when has not correctOddsHomeOver', () => {
    const oddsInfo: FilterWrongOddsModel = { spread: '0.2' } as FilterWrongOddsModel;

    service.updateCorrectOddsAwayUnder(oddsInfo);

    expect(oddsInfo.correctOddsAwayUnder).toBeUndefined();
  });

  
  it('#updateCorrectOddsAwayUnder should not update correct odds away when has not spread', () => {
    const oddsInfo: FilterWrongOddsModel = {  correctOddsHomeOver: '0.7' } as FilterWrongOddsModel;

    service.updateCorrectOddsAwayUnder(oddsInfo);

    expect(oddsInfo.correctOddsAwayUnder).toBeUndefined();
  });

  it('#calculateOddsRange should calculate odds range correctly', () => {
    // Arrange
    const inputTests = [{ correctOddsHomeOver: '0.7', correctOddsAwayUnder: '-0.90', allowanceRate: '20', toOddsNotVoidHomeOver: '0.90', 
      toOddsNotVoidAwayUnder:'-0.70', fromOddsNotVoidHomeOver:'0.50', fromOddsNotVoidAwayUnder:'0.90'},
      { correctOddsHomeOver: '0.9', correctOddsAwayUnder: '0.96', allowanceRate: '25', toOddsNotVoidHomeOver: '-0.85', 
        toOddsNotVoidAwayUnder:'-0.79', fromOddsNotVoidHomeOver:'0.65', fromOddsNotVoidAwayUnder:'0.71'},
      { correctOddsHomeOver: '-0.9', correctOddsAwayUnder: '0.76', allowanceRate: '25', toOddsNotVoidHomeOver: '-0.65', 
        toOddsNotVoidAwayUnder:'-0.99', fromOddsNotVoidHomeOver:'0.85', fromOddsNotVoidAwayUnder:'0.51'}]

    inputTests.forEach(test => {
      const oddsInfo: FilterWrongOddsModel = { correctOddsHomeOver: test.correctOddsHomeOver, correctOddsAwayUnder: test.correctOddsAwayUnder, 
        allowanceRate: test.allowanceRate, spread: '0.2'} as FilterWrongOddsModel;

      // Action
      service.calculateOddsRange(oddsInfo);
    
      // Assert
      expect(oddsInfo.toOddsNotVoidHomeOver).toBe(test.toOddsNotVoidHomeOver);
      expect(oddsInfo.toOddsNotVoidAwayUnder).toBe(test.toOddsNotVoidAwayUnder);
      expect(oddsInfo.fromOddsNotVoidHomeOver).toBe(test.fromOddsNotVoidHomeOver);
      expect(oddsInfo.fromOddsNotVoidAwayUnder).toBe(test.fromOddsNotVoidAwayUnder);
    })    
  });
  
  it('#calculateOddsRange should not calculate odds range when correctOddsAwayUnder is Undefined', () => {
    // Arrange
    const oddsInfo: FilterWrongOddsModel = { correctOddsHomeOver: '-0.90', allowanceRate: '20', spread: '0.2'} as FilterWrongOddsModel;

    // Action
    service.calculateOddsRange(oddsInfo);

    // Assert
    expect(oddsInfo.toOddsNotVoidHomeOver).toBeUndefined();
    expect(oddsInfo.toOddsNotVoidAwayUnder).toBeUndefined();
    expect(oddsInfo.fromOddsNotVoidHomeOver).toBeUndefined();
    expect(oddsInfo.fromOddsNotVoidAwayUnder).toBeUndefined();
  });
});
