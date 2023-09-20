import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { NotParticipateBetType } from '../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from './filter-not-participate.service';

class Helper {
  static readonly fakeNotParticipateBetTypes: NotParticipateBetType[] = [
    { betTypeId: 1, betTypeName: '', disabled: false },
    { betTypeId: 2, betTypeName: '', disabled: false },
    { betTypeId: 3, betTypeName: '', disabled: false },
    { betTypeId: 4, betTypeName: '', disabled: false },
  ];
  static readonly fakePlayers: OddsInfo[] = [
    {
      betChoice: '',
      betTypeId: '1',
      oddsId: '1',
      playerId: '1',
      playerName: '',
      playNamesChineseSimplified: '',
      playNamesChineseTraditional: ''
    }
  ];
}

describe('FilterNotParticipateService', () => {
  let service: FilterNotParticipateService;

  beforeEach(() => {
    service = new FilterNotParticipateService(null, null);
  });

  it('#initDefaultFilter should call #initBetTypeNgSelectMixtureModel', async () => {
    service.initDefaultPlayerSelection = jest.fn();
    const actual = service.initDefaultFilter();

    expect(service.initDefaultPlayerSelection).toHaveBeenCalledTimes(1);
    expect(actual).toBeDefined();
  });

  it('#getNotParticipateBetTypes should return NotParticipateBetType', async () => {
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getNotParticipateBetTypes = jest.fn().mockReturnValue(Helper.fakeNotParticipateBetTypes);
    const service = new FilterNotParticipateService(addRequestApiService, null);
    const actual = await service.getNotParticipateBetTypes(1);

    expect(actual).toEqual(Helper.fakeNotParticipateBetTypes)
    expect(addRequestApiService.getNotParticipateBetTypes).toHaveBeenCalledTimes(1);
  });

  it('#initDefaultBetTypeNgSelectMixtureModel should return model with items empty', async () => {
    const actual = service.initDefaultBetTypeNgSelectMixtureModel();

    expect(actual.items).toEqual([]);
  });

  it('#initDefaultPlayerSelection should return model with items empty', async () => {
    const actual = service.initDefaultPlayerSelection();

    expect(actual.items).toEqual([]);
  });

  it('#getPlayers should return NotParticipateBetType', async () => {
    const commonService = new CommonService(null);
    commonService.GetOddsInfoSpecialBetTypes = jest.fn().mockReturnValue(Helper.fakePlayers);
    const mockService = new FilterNotParticipateService(null, commonService);
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
