import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterNotParticipateService } from './filter-not-participate.service';

class Helper {
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

describe('FilterNotParticipateService', () => {
  let service: FilterNotParticipateService;

  beforeEach(() => {
    service = new FilterNotParticipateService(null);
  });

  it('#initDefaultFilter should call #initBetTypeNgSelectMixtureModel', async () => {
    const actual = service.initDefaultFilter();

    expect(actual).toBeDefined();
  });

  it('#getPlayers should return NotParticipateBetType', async () => {
    const commonService = new CommonService(null);
    commonService.GetOddsInfoSpecialBetTypes = jest.fn().mockReturnValue(Helper.fakePlayers);
    const mockService = new FilterNotParticipateService(commonService);
    [1, null].forEach(async x => {
      const actual = await mockService.getPlayers(x);

      expect(actual).toEqual(Helper.fakePlayers)
      expect(commonService.GetOddsInfoSpecialBetTypes).toHaveBeenCalled();
    })
  });
});
