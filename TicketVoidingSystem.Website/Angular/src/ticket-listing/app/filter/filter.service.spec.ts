import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { AppService } from '../app.service';
import { Product } from '../../../utility/constants/config';
import { GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetTypesModel } from '../../../utility/components/bettypes/bettypes.model';
import { BetTypesComponent } from '../../../utility/components/bettypes/bettypes.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../utility/constants/text';
import { MatchModel } from '../../../utility/models/match.model';
import { Licensee } from './filter.model';
import { StaticService } from '../../../utility/services/static.service';

describe('FilterService', () => {
  let service: FilterService;
  let appService: jest.Mocked<AppService>;

  beforeEach(() => {
    const appServiceMock = {
      getLicensees: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        FilterService,
        { provide: AppService, useValue: appServiceMock }
      ]
    });

    service = TestBed.inject(FilterService);
    appService = TestBed.inject(AppService) as jest.Mocked<AppService>;
    jest.clearAllMocks();

    // Mock StaticService.isNumber
    jest.spyOn(StaticService, 'isNumber').mockImplementation((value: string) => {
      return /^\+?(0|[1-9]\d*)$/.test(value);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#isInvalidOtherProducts', () => {
    it('should return true for invalid sport types', () => {
      // Arrange
      const invalidSportTypes = [100, 200, 300];

      // Act & Assert
      invalidSportTypes.forEach(sportType => {
        expect(service.isInvalidOtherProducts(sportType)).toBe(true);
      });
    });

    it('should return false for valid sport types', () => {
      // Arrange
      const validSportTypes = [175, 161, 164, 154, 125, 126, 127];

      // Act & Assert
      validSportTypes.forEach(sportType => {
        expect(service.isInvalidOtherProducts(sportType)).toBe(false);
      });
    });
  });

  describe('#isSelectionNotValid', () => {
    it('should return true when singleOrSubParlay is SubParlay and no selections', () => {
      // Arrange
      const singleOrSubParlay = 'SubParlay';
      const selectedComboParlay: string[] = [];

      // Act
      const result = service.isSelectionNotValid(singleOrSubParlay, selectedComboParlay);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when singleOrSubParlay is SubParlay and has selections', () => {
      // Arrange
      const singleOrSubParlay = 'SubParlay';
      const selectedComboParlay = ['1', '2', '3'];

      // Act
      const result = service.isSelectionNotValid(singleOrSubParlay, selectedComboParlay);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when singleOrSubParlay is not SubParlay', () => {
      // Arrange
      const singleOrSubParlay = 'All';
      const selectedComboParlay: string[] = [];

      // Act
      const result = service.isSelectionNotValid(singleOrSubParlay, selectedComboParlay);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('#invalidProduct', () => {
    it('should return true for invalid product 0 with sport type > 99', () => {
      // Arrange
      const product = 0;
      const sportType = 100;

      // Act
      const result = service.invalidProduct(product, sportType);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for valid product 0 with sport type <= 99', () => {
      // Arrange
      const product = 0;
      const sportType = 50;

      // Act
      const result = service.invalidProduct(product, sportType);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true for invalid product 1 with wrong sport type', () => {
      // Arrange
      const product = 1;
      const sportType = 100;

      // Act
      const result = service.invalidProduct(product, sportType);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for valid product 1 with correct sport type', () => {
      // Arrange
      const product = 1;
      const sportType = 161;

      // Act
      const result = service.invalidProduct(product, sportType);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true for invalid product 2 with wrong sport type', () => {
      // Arrange
      const product = 2;
      const sportType = 100;

      // Act
      const result = service.invalidProduct(product, sportType);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for valid product 2 with correct sport type', () => {
      // Arrange
      const product = 2;
      const sportType = 180;

      // Act
      const result = service.invalidProduct(product, sportType);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true for invalid product 9 with wrong sport type', () => {
      // Arrange
      const product = 9;
      const sportType = 100;

      // Act
      const result = service.invalidProduct(product, sportType);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for valid product 9 with correct sport type', () => {
      // Arrange
      const product = 9;
      const sportType = 175;

      // Act
      const result = service.invalidProduct(product, sportType);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('#getSelectionSubParlays', () => {
    it('should return empty string when bet is not SubParlay', () => {
      // Arrange
      const bet = 'All';
      const selectedComboParlay = ['1', '2', '3'];

      // Act
      const result = service.getSelectionSubParlays(bet, selectedComboParlay);

      // Assert
      expect(result).toBe('');
    });

    it('should return joined string when bet is SubParlay', () => {
      // Arrange
      const bet = 'SubParlay';
      const selectedComboParlay = ['1', '2', '3'];

      // Act
      const result = service.getSelectionSubParlays(bet, selectedComboParlay);

      // Assert
      expect(result).toBe('1,2,3');
    });

    it('should return empty string when bet is SubParlay but no selections', () => {
      // Arrange
      const bet = 'SubParlay';
      const selectedComboParlay: string[] = [];

      // Act
      const result = service.getSelectionSubParlays(bet, selectedComboParlay);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('#enableGroupBetTypesAndAdvancedMode', () => {
    it('should enable group bet types component when provided', () => {
      // Arrange
      const groupBetTypesComponent = {
        isDisabledAllBetTypes: true
      } as unknown as GroupBetTypesComponent;

      // Act
      service.enableGroupBetTypesAndAdvancedMode(groupBetTypesComponent);

      // Assert
      expect(groupBetTypesComponent.isDisabledAllBetTypes).toBe(false);
    });

    it('should not throw error when component is null', () => {
      // Arrange & Act & Assert
      expect(() => service.enableGroupBetTypesAndAdvancedMode(null)).not.toThrow();
    });
  });

  describe('#enableBetTypesAndAdvancedMode', () => {
    it('should enable bet types component when provided', () => {
      // Arrange
      const betTypesComponent = {
        isDisabledAllBetTypes: true
      } as unknown as BetTypesComponent;

      // Act
      service.enableBetTypesAndAdvancedMode(betTypesComponent);

      // Assert
      expect(betTypesComponent.isDisabledAllBetTypes).toBe(false);
    });

    it('should not throw error when component is null', () => {
      // Arrange & Act & Assert
      expect(() => service.enableBetTypesAndAdvancedMode(null)).not.toThrow();
    });
  });

  describe('#checkAndDisabledAllBetTypes', () => {
    it('should disable and check all bet types for BET_BUILDER when isReSettled is true', () => {
      // Arrange
      const product = Product.BET_BUILDER;
      const isReSettled = true;
      const betTypesComponent = {
        isDisabledAllBetTypes: false
      } as unknown as BetTypesComponent;
      const betTypes = {
        isChecked: false,
        betTypes: [
          { isChecked: false },
          { isChecked: false }
        ]
      } as unknown as BetTypesModel;

      // Act
      service.checkAndDisabledAllBetTypes(product, isReSettled, betTypesComponent, betTypes);

      // Assert
      expect(betTypesComponent.isDisabledAllBetTypes).toBe(true);
      expect(betTypes.isChecked).toBe(true);
      expect(betTypes.betTypes[0].isChecked).toBe(true);
      expect(betTypes.betTypes[1].isChecked).toBe(true);
    });

    it('should enable bet types for BET_BUILDER when isReSettled is false', () => {
      // Arrange
      const product = Product.BET_BUILDER;
      const isReSettled = false;
      const betTypesComponent = {
        isDisabledAllBetTypes: true
      } as unknown as BetTypesComponent;
      const betTypes = {
        isChecked: false,
        betTypes: [
          { isChecked: false },
          { isChecked: false }
        ]
      } as unknown as BetTypesModel;

      // Act
      service.checkAndDisabledAllBetTypes(product, isReSettled, betTypesComponent, betTypes);

      // Assert
      expect(betTypesComponent.isDisabledAllBetTypes).toBe(false);
    });

    it('should not affect other products', () => {
      // Arrange
      const product = Product.SPORTS_BOOK;
      const isReSettled = true;
      const betTypesComponent = {
        isDisabledAllBetTypes: false
      } as unknown as BetTypesComponent;
      const betTypes = {
        isChecked: false,
        betTypes: [
          { isChecked: false }
        ]
      } as unknown as BetTypesModel;

      // Act
      service.checkAndDisabledAllBetTypes(product, isReSettled, betTypesComponent, betTypes);

      // Assert
      expect(betTypesComponent.isDisabledAllBetTypes).toBe(false);
      expect(betTypes.isChecked).toBe(false);
    });
  });

  describe('#checkAndDisabledAllGroupBetTypes', () => {
    it('should disable and check all group bet types for SPORTS_BOOK when isReSettled is true', () => {
      // Arrange
      const product = Product.SPORTS_BOOK;
      const isReSettled = true;
      const groupBetTypesComponent = {
        isDisabledAllBetTypes: false
      } as unknown as GroupBetTypesComponent;
      const groupBetTypes = {
        isChecked: false,
        groupBetTypes: [
          {
            isChecked: false,
            betTypes: [
              { isChecked: false },
              { isChecked: false }
            ]
          }
        ]
      } as unknown as GroupBetTypesModel;

      // Act
      service.checkAndDisabledAllGroupBetTypes(product, isReSettled, groupBetTypesComponent, groupBetTypes);

      // Assert
      expect(groupBetTypesComponent.isDisabledAllBetTypes).toBe(true);
      expect(groupBetTypes.isChecked).toBe(true);
      expect(groupBetTypes.groupBetTypes[0].isChecked).toBe(true);
      expect(groupBetTypes.groupBetTypes[0].betTypes[0].isChecked).toBe(true);
      expect(groupBetTypes.groupBetTypes[0].betTypes[1].isChecked).toBe(true);
    });

    it('should enable group bet types for SPORTS_BOOK when isReSettled is false', () => {
      // Arrange
      const product = Product.SPORTS_BOOK;
      const isReSettled = false;
      const groupBetTypesComponent = {
        isDisabledAllBetTypes: true
      } as unknown as GroupBetTypesComponent;
      const groupBetTypes = {
        isChecked: false,
        groupBetTypes: []
      } as unknown as GroupBetTypesModel;

      // Act
      service.checkAndDisabledAllGroupBetTypes(product, isReSettled, groupBetTypesComponent, groupBetTypes);

      // Assert
      expect(groupBetTypesComponent.isDisabledAllBetTypes).toBe(false);
    });

    it('should not affect other products', () => {
      // Arrange
      const product = Product.BET_BUILDER;
      const isReSettled = true;
      const groupBetTypesComponent = {
        isDisabledAllBetTypes: false
      } as unknown as GroupBetTypesComponent;
      const groupBetTypes = {
        isChecked: false,
        groupBetTypes: []
      } as unknown as GroupBetTypesModel;

      // Act
      service.checkAndDisabledAllGroupBetTypes(product, isReSettled, groupBetTypesComponent, groupBetTypes);

      // Assert
      expect(groupBetTypesComponent.isDisabledAllBetTypes).toBe(false);
      expect(groupBetTypes.isChecked).toBe(false);
    });
  });

  describe('#getLicenseeSelectList', () => {
    it('should return default list when no licensees', async () => {
      // Arrange
      appService.getLicensees.mockResolvedValue([]);

      // Act
      const result = await service.getLicenseeSelectList();

      // Assert
      expect(result).toEqual([
        { id: 0, name: 'All' },
        { id: -1, name: 'Credit' }
      ]);
      expect(appService.getLicensees).toHaveBeenCalledTimes(1);
    });

    it('should return list with licensees when available', async () => {
      // Arrange
      const licensees: Licensee[] = [
        { id: 1, name: 'Licensee 1' },
        { id: 2, name: 'Licensee 2' }
      ];
      appService.getLicensees.mockResolvedValue(licensees);

      // Act
      const result = await service.getLicenseeSelectList();

      // Assert
      expect(result).toEqual([
        { id: 0, name: 'All' },
        { id: -1, name: 'Credit' },
        { id: 1, name: 'Licensee 1', group: 'Licensee' },
        { id: 2, name: 'Licensee 2', group: 'Licensee' }
      ]);
      expect(appService.getLicensees).toHaveBeenCalledTimes(1);
    });

    it('should handle empty licensees array', async () => {
      // Arrange
      appService.getLicensees.mockResolvedValue([]);

      // Act
      const result = await service.getLicenseeSelectList();

      // Assert
      expect(result.length).toBe(2);
      expect(result[0]).toEqual({ id: 0, name: 'All' });
      expect(result[1]).toEqual({ id: -1, name: 'Credit' });
    });
  });

  describe('#inValidSportTypeVirtualSport', () => {
    it('should return true for invalid sport types for Virtual Sports', () => {
      // Arrange
      const invalidSportTypes = [100, 150, 200, 300];

      // Act & Assert
      invalidSportTypes.forEach(sportType => {
        expect(service.inValidSportTypeVirtualSport(sportType)).toBe(true);
      });
    });

    it('should return false for valid Virtual Sports sport types (180-186)', () => {
      // Arrange
      const validSportTypes = [180, 181, 183, 186];

      // Act & Assert
      validSportTypes.forEach(sportType => {
        expect(service.inValidSportTypeVirtualSport(sportType)).toBe(false);
      });
    });

    it('should return false for valid Virtual Sports 2 sport types (190-199, 177)', () => {
      // Arrange
      const validSportTypes = [177, 190, 195, 199];

      // Act & Assert
      validSportTypes.forEach(sportType => {
        expect(service.inValidSportTypeVirtualSport(sportType)).toBe(false);
      });
    });
    it('should return false for valid Virtual Sports 4, 5, 6, 7 sport types', () => {
      // Arrange
      const validSportTypes = [188, 147, 134, 125, 126, 127];

      // Act & Assert
      validSportTypes.forEach(sportType => {
        expect(service.inValidSportTypeVirtualSport(sportType)).toBe(false);
      });
    });
  });

  describe('#isShowCheckboxAffected', () => {
    it('should return true for SPORTS_BOOK when groupBetTypes has items', () => {
      // Arrange
      const product = Product.SPORTS_BOOK;
      const groupBetTypes = {
        groupBetTypes: [
          { isChecked: false, betTypes: [] }
        ]
      } as unknown as GroupBetTypesModel;
      const betTypes = null;

      // Act
      const result = service.isShowCheckboxAffected(product, groupBetTypes, betTypes);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for SPORTS_BOOK when groupBetTypes is empty', () => {
      // Arrange
      const product = Product.SPORTS_BOOK;
      const groupBetTypes = {
        groupBetTypes: []
      } as unknown as GroupBetTypesModel;
      const betTypes = null;

      // Act
      const result = service.isShowCheckboxAffected(product, groupBetTypes, betTypes);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true for BET_BUILDER when betTypes has items', () => {
      // Arrange
      const product = Product.BET_BUILDER;
      const groupBetTypes = null;
      const betTypes = {
        betTypes: [
          { isChecked: false }
        ]
      } as unknown as BetTypesModel;

      // Act
      const result = service.isShowCheckboxAffected(product, groupBetTypes, betTypes);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for BET_BUILDER when betTypes is empty', () => {
      // Arrange
      const product = Product.BET_BUILDER;
      const groupBetTypes = null;
      const betTypes = {
        betTypes: []
      } as unknown as BetTypesModel;

      // Act
      const result = service.isShowCheckboxAffected(product, groupBetTypes, betTypes);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for other products', () => {
      // Arrange
      const products = [Product.NUMBER_GAME, Product.VIRTUAL_SPORTS, Product.BITCOIN];
      const groupBetTypes = null;
      const betTypes = null;

      // Act & Assert
      products.forEach(product => {
        expect(service.isShowCheckboxAffected(product, groupBetTypes, betTypes)).toBe(false);
      });
    });
  });

  describe('#invalidMatch', () => {
    it('should return true and display tooltip when matchId is empty', () => {
      // Arrange
      const matchId = '';
      const match = null;
      const tooltip = new Tooltip();
      tooltip.display = jest.fn();

      // Act
      const result = service.invalidMatch(matchId, match, tooltip);

      // Assert
      expect(result).toBe(true);
      expect(tooltip.display).toHaveBeenCalledWith('match-id', TEXT.REQUIRED_MATCHID);
    });

    it('should return true and display tooltip when matchId is undefined', () => {
      // Arrange
      const matchId = undefined;
      const match = null;
      const tooltip = new Tooltip();
      tooltip.display = jest.fn();

      // Act
      const result = service.invalidMatch(matchId, match, tooltip);

      // Assert
      expect(result).toBe(true);
      expect(tooltip.display).toHaveBeenCalledWith('match-id', TEXT.REQUIRED_MATCHID);
    });

    it('should return true and display tooltip when matchId is not a number', () => {
      // Arrange
      const matchId = 'abc';
      const match = null;
      const tooltip = new Tooltip();
      tooltip.display = jest.fn();

      // Act
      const result = service.invalidMatch(matchId, match, tooltip);

      // Assert
      expect(result).toBe(true);
      expect(tooltip.display).toHaveBeenCalledWith('match-id', TEXT.INVALID_MATCHID);
    });

    it('should return true and display tooltip when match is null', () => {
      // Arrange
      const matchId = '123';
      const match = null;
      const tooltip = new Tooltip();
      tooltip.display = jest.fn();

      // Act
      const result = service.invalidMatch(matchId, match, tooltip);

      // Assert
      expect(result).toBe(true);
      expect(tooltip.display).toHaveBeenCalledWith('match-id', TEXT.INVALID_MATCHID);
    });

    it('should return false when matchId is valid number and match exists', () => {
      // Arrange
      const matchId = '123';
      const match = {} as MatchModel;
      const tooltip = new Tooltip();
      tooltip.display = jest.fn();

      // Act
      const result = service.invalidMatch(matchId, match, tooltip);

      // Assert
      expect(result).toBe(false);
      expect(tooltip.display).not.toHaveBeenCalled();
    });

    it('should return false for numeric matchId string', () => {
      // Arrange
      const matchId = '999';
      const match = { id: 999 } as unknown as MatchModel;
      const tooltip = new Tooltip();
      tooltip.display = jest.fn();

      // Act
      const result = service.invalidMatch(matchId, match, tooltip);

      // Assert
      expect(result).toBe(false);
      expect(tooltip.display).not.toHaveBeenCalled();
    });
  });
});
