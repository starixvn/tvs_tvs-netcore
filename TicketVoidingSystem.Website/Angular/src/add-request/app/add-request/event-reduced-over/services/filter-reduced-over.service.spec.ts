import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { FilterReducedOverService } from './filter-reduced-over.service';

class Helper {
  static readonly fakeReducedOverBetType: ReducedOverBetType =  { betTypeId: 0, betTypeName: '', isHasOverWicket: true, isHasPlayer: true, isHasRuns: true, parentId: 0, items: [] };
  static readonly fakeReducedOverBetTypes: ReducedOverBetType[] = [
    { betTypeId: 1, betTypeName: '', isHasOverWicket: true, isHasPlayer: true, isHasRuns: true, parentId: 0, items: null },
    { betTypeId: 2, betTypeName: '', isHasOverWicket: true, isHasPlayer: true, isHasRuns: true, parentId: -1, items: null },
    { betTypeId: 3, betTypeName: '', isHasOverWicket: true, isHasPlayer: true, isHasRuns: true, parentId: -2, items: null },
    { betTypeId: 4, betTypeName: '', isHasOverWicket: true, isHasPlayer: true, isHasRuns: true, parentId: -3, items: [Helper.fakeReducedOverBetType] },
  ];
  static readonly fakePlayers: OddsInfo[] = [
    {
      betChoice: '',
      betTypeId: 1,
      oddsId: '1',
      playerId: 1,
      playerName: '',
      playNamesChineseSimplified: '',
      playNamesChineseTraditional: ''
    }
  ];
}

describe('FilterReducedOverService', () => {
  let service: FilterReducedOverService;

  beforeEach(() => {
    service = new FilterReducedOverService(null, null);
  });

  it('#initDefaultFilter should call #initBetTypeNgSelectMixtureModel', async () => {
    service.initBetTypeNgSelectMixtureModel = jest.fn();
    service.initDefaultPlayerSelection = jest.fn();
    const actual = service.initDefaultFilter(Helper.fakeReducedOverBetTypes);

    expect(service.initBetTypeNgSelectMixtureModel).toHaveBeenCalledTimes(1);
    expect(service.initDefaultPlayerSelection).toHaveBeenCalledTimes(1);
    expect(actual).toBeDefined();
  });

  it('#getReducedOverBetTypes should return ReducedOverBetType', async () => {
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getReducedOverBetTypes = jest.fn().mockReturnValue(Helper.fakeReducedOverBetTypes);
    const service = new FilterReducedOverService(addRequestApiService, null);
    const actual = await service.getReducedOverBetTypes(1);

    expect(actual).toEqual(Helper.fakeReducedOverBetTypes)
    expect(addRequestApiService.getReducedOverBetTypes).toHaveBeenCalledTimes(1);
  });

  it('#renderGroupReducedOverBetTypes should return list of GroupReducedOverBetType', async () => {
    const actual = service.renderGroupReducedOverBetTypes(Helper.fakeReducedOverBetTypes);

    expect(actual.length).toBe(4);
  });

  it('#getGroupName should return empty', async () => {
    const actual = service['getGroupName'](1212);

    expect(actual).toBe('');
  });

  it('#initDefaultBetTypeNgSelectMixtureModel should return model with items empty', async () => {
    const actual = service.initDefaultBetTypeNgSelectMixtureModel();

    expect(actual.items).toEqual([]);
  });

  it('#initDefaultPlayerSelection should return model with items empty', async () => {
    const actual = service.initDefaultPlayerSelection();

    expect(actual.items).toEqual([]);
  });

  it('#initBetTypeNgSelectMixtureModel should call #initDefaultBetTypeProperties', async () => {
    service['initDefaultBetTypeProperties'] = jest.fn();
    service.initBetTypeNgSelectMixtureModel(Helper.fakeReducedOverBetTypes);

    expect(service['initDefaultBetTypeProperties']).toHaveBeenCalledTimes(1);
  });

  it('#getPlayers should return ReducedOverBetType', async () => {
    const commonService = new CommonService(null);
    commonService.GetOddsInfoSpecialBetTypes = jest.fn().mockReturnValue(Helper.fakePlayers);
    const mockService = new FilterReducedOverService(null, commonService);
    [1, null].forEach(async x => {
      const actual = await mockService.getPlayers(x, '');

      expect(actual).toEqual(Helper.fakePlayers)
      expect(commonService.GetOddsInfoSpecialBetTypes).toHaveBeenCalled();
    })
  });

  it('#renderPlayer should return ItemsSelect', async () => {
    const actual = service.renderPlayer(Helper.fakePlayers);

    expect(actual).toBeDefined();
  });
});
