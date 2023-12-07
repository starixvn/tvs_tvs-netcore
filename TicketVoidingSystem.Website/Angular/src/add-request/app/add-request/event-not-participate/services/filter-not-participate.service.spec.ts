import { AddRequestApiService } from '../../add-request-api.service';
import { NotParticipateBetTypeViewModel, Player } from '../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from './filter-not-participate.service';

class Helper {
  static readonly fakePlayers: Player[] = [
    {
      betChoice: '',
      betTypeId: 1,
      oddsId: '1',
      playerId: 1,
      playerName: '',
      playNamesChineseSimplified: '',
      playNamesChineseTraditional: '',
      disabled: false
    }
  ];
  static readonly fakeViewModel: NotParticipateBetTypeViewModel = {
    notParticipatePlayers: Helper.fakePlayers,
    notParticipateBetTypes: []
  }
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
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getNotParticipateBetTypes = jest.fn().mockReturnValue(Helper.fakePlayers);
    const mockService = new FilterNotParticipateService(addRequestApiService);
    [1, null].forEach(async x => {
      const actual = await mockService.getNotParticipateBetTypes(x);

      expect(actual).toEqual(Helper.fakePlayers)
      expect(addRequestApiService.getNotParticipateBetTypes).toHaveBeenCalled();
    })
  });
});
