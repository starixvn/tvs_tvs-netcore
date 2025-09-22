import { TestBed } from '@angular/core/testing';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { GroupReducedOverConstant } from '../constants/bet-type-reduced-over.constant';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { FilterReducedOverService } from './filter-reduced-over.service';

class Helper {
  static readonly fakeReducedOverBetType: ReducedOverBetType = {
    betTypeId: 1,
    betTypeName: 'Test Bet Type',
    isHasOverWicket: true,
    isHasPlayer: true,
    isHasRuns: true,
    parentId: 0,
    items: []
  };

  static readonly fakeReducedOverBetTypes: ReducedOverBetType[] = [
    {
      betTypeId: 1,
      betTypeName: 'Home OE',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: GroupReducedOverConstant.ALL_HOME_OE,
      items: []
    },
    {
      betTypeId: 2,
      betTypeName: 'Away OE',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: GroupReducedOverConstant.ALL_AWAY_OE,
      items: []
    },
    {
      betTypeId: 3,
      betTypeName: 'Others OE',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: GroupReducedOverConstant.OTHERS_OE_BET_TYPE,
      items: []
    }
  ];

  static readonly fakePlayers: OddsInfo[] = [
    {
      betChoice: 'Test Choice',
      betTypeId: 1,
      oddsId: '1',
      playerId: 1,
      playerName: 'Player 1',
      playNamesChineseSimplified: '',
      playNamesChineseTraditional: ''
    }
  ];
}

describe('FilterReducedOverService', () => {
  let service: FilterReducedOverService;
  let addRequestApiService: AddRequestApiService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [FilterReducedOverService]
    });

    service = TestBed.inject(FilterReducedOverService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    commonService = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initDefaultFilter', () => {
    it('should initialize default filter with bet types and player selection', () => {
      const result = service.initDefaultFilter(Helper.fakeReducedOverBetTypes);

      expect(result).toBeDefined();
      expect(result.betTypeNgSelectMixtureModel).toBeDefined();
      expect(result.playerMultipleSelection).toBeDefined();
    });
  });

  describe('getReducedOverBetTypes', () => {
    it('should get reduced over bet types from API', async () => {
      addRequestApiService.getReducedOverBetTypes = jest.fn().mockResolvedValue(Helper.fakeReducedOverBetTypes);

      const result = await service.getReducedOverBetTypes(1);

      expect(result).toEqual(Helper.fakeReducedOverBetTypes);
      expect(addRequestApiService.getReducedOverBetTypes).toHaveBeenCalledWith(1);
    });
  });

  describe('renderGroupReducedOverBetTypes', () => {
    it('should render group reduced over bet types correctly', () => {
      const result = service.renderGroupReducedOverBetTypes(Helper.fakeReducedOverBetTypes);

      expect(result.length).toBe(3);
      expect(result[0].betTypeId).toBe(GroupReducedOverConstant.ALL_HOME_OE);
      expect(result[1].betTypeId).toBe(GroupReducedOverConstant.ALL_AWAY_OE);
      expect(result[2].betTypeId).toBe(GroupReducedOverConstant.OTHERS_OE_BET_TYPE);
    });
  });

  describe('initDefaultBetTypeNgSelectMixtureModel', () => {
    it('should initialize default bet type ng select mixture model', () => {
      const result = service.initDefaultBetTypeNgSelectMixtureModel();

      expect(result).toBeDefined();
      expect(result.items).toEqual([]);
      expect(result.allItemsCheckedText).toBe('All');
      expect(result.noneItemCheckedText).toBe('Select bet type');
      expect(result.maxWidth).toBe('300px');
      expect(result.numberItemsDisplay).toBe(1);
    });
  });

  describe('initBetTypeNgSelectMixtureModel', () => {
    it('should initialize bet type ng select mixture model with items', () => {
      const result = service.initBetTypeNgSelectMixtureModel(Helper.fakeReducedOverBetTypes);

      expect(result).toBeDefined();
      expect(result.items.length).toBe(3);
    });
  });

  describe('initDefaultPlayerSelection', () => {
    it('should initialize default player selection', () => {
      const result = service.initDefaultPlayerSelection();

      expect(result).toBeDefined();
      expect(result.items).toEqual([]);
      expect(result.checkAllCheckBoxText).toBe('All');
      expect(result.allItemsCheckedText).toBe('All');
      expect(result.noneItemCheckedText).toBe('Select player');
      expect(result.maxWidth).toBe('200px');
      expect(result.numberItemsDisplay).toBe(1);
      expect(result.buttonHeight).toBe('29.5px');
      expect(result.isDefaultSelectAll).toBe(false);
    });
  });

  describe('getPlayers', () => {
    it('should get players from common service', async () => {
      commonService.getOddsInfoSpecialBetTypes = jest.fn().mockResolvedValue(Helper.fakePlayers);

      const result = await service.getPlayers(1, '1,2,3');

      expect(result).toEqual(Helper.fakePlayers);
      expect(commonService.getOddsInfoSpecialBetTypes).toHaveBeenCalledWith({
        matchId: '1',
        betTypes: '1,2,3'
      });
    });
  });

  describe('renderPlayer', () => {
    it('should render player items correctly', () => {
      const result = service.renderPlayer(Helper.fakePlayers);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(0);
      expect(result[0].text).toBe('Player 1');
    });
  });
});
