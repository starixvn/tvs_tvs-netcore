import { TestBed } from '@angular/core/testing';
import { GetTicketsService } from './get-tickets.service';
import { TicketsViewModel } from '../model/get-tickets.query';
import { GroupModel } from '../../../utility/components/tickets/group.model';
import { TicketsService } from '../../../utility/components/tickets/tickets.service';
import { GroupService } from '../../../utility/components/tickets/group.service';
import { TicketModel } from '../../../utility/components/tickets/ticket.model';

// Mock dependencies
jest.mock('../../../utility/components/tickets/tickets.service');
jest.mock('../../../utility/components/tickets/group.service');

class Helper {
  static readonly fakeTicketsViewModel = {
    singleCount: 10,
    parlayCount: 5,
    fromTransTime: '2023-01-01T10:00:00Z',
    toTransTime: '2023-01-01T12:00:00Z',
    invalidTransIds: [1, 2, 3],
    movedTransIds: [4, 5],
    matchId: 100,
    licenseesName: 'Test Licensee',
    totalItems: 15,
    groups: [
      {
        name: 'Normal Group',
        tickets: [
          { id: 1, isChecked: false, isDisable: false },
          { id: 2, isChecked: false, isDisable: false }
        ]
      },
      {
        name: 'Betfair Group',
        tickets: [
          { id: 3, isChecked: false, isDisable: false }
        ]
      },
      {
        name: 'Parlay Group',
        tickets: [
          { id: 4, isChecked: false, isDisable: false }
        ]
      },
      {
        name: 'Phone Betting Group',
        tickets: [
          { id: 5, isChecked: false, isDisable: false }
        ]
      }
    ]
  } as unknown as TicketsViewModel;

  static readonly fakeBaseModel = {
    singleCount: 0,
    parlayCount: 0,
    fromTransTime: '',
    toTransTime: '',
    strFromTime: '',
    strToTime: '',
    invalidTransIds: [],
    movedTransIds: [],
    matchId: 0,
    licenseesName: '',
    totalItems: 0,
    groups: []
  } as unknown as TicketsViewModel;

  static readonly fakeGroupModel = new GroupModel('Test Group', [
    { isChecked: false, isDisable: false },
    { isChecked: false, isDisable: false }
  ] as unknown as TicketModel[]);
}

describe('GetTicketsService', () => {
  let service: GetTicketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetTicketsService, TicketsService]
    });
    service = TestBed.inject(GetTicketsService);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initData', () => {
    beforeEach(() => {
      TicketsService.updateIconCheckBox = jest.fn().mockReturnValue('mock-icon');
      GroupService.setIsCheckAll = jest.fn().mockReturnValue(true);
    });

    it('should return early when data is null', () => {
      // Arrange
      const baseModel = Helper.fakeBaseModel;
      const data = null;

      // Action
      service.initData(baseModel, data);

      // Assert
      expect(baseModel.singleCount).toBe(0);
      expect(baseModel.parlayCount).toBe(0);
      expect(baseModel.groups).toEqual([]);
    });

    it('should return early when data is undefined', () => {
      // Arrange
      const baseModel = Helper.fakeBaseModel;
      const data = undefined;

      // Action
      service.initData(baseModel, data);

      // Assert
      expect(baseModel.singleCount).toBe(0);
      expect(baseModel.parlayCount).toBe(0);
      expect(baseModel.groups).toEqual([]);
    });

    it('should initialize baseModel with data properties', () => {
      // Arrange
      const baseModel = Helper.fakeBaseModel;
      const data = Helper.fakeTicketsViewModel;

      // Action
      service.initData(baseModel, data);

      // Assert
      expect(baseModel.singleCount).toBe(10);
      expect(baseModel.parlayCount).toBe(5);
      expect(baseModel.invalidTransIds).toEqual([1, 2, 3]);
      expect(baseModel.movedTransIds).toEqual([4, 5]);
      expect(baseModel.matchId).toBe(100);
      expect(baseModel.licenseesName).toBe('Test Licensee');
      expect(baseModel.totalItems).toBe(15);
    });

    it('should call checkedSpecialTicket with groups', () => {
      // Arrange
      const baseModel = Helper.fakeBaseModel;
      const data = Helper.fakeTicketsViewModel;
      service['checkedSpecialTicket'] = jest.fn();

      // Action
      service.initData(baseModel, data);

      // Assert
      expect(service['checkedSpecialTicket']).toHaveBeenCalledWith(baseModel.groups);
    });
  });

  describe('isGroupSpecial', () => {
    it('should return true for betfair group', () => {
      // Action & Assert
      expect(service['isGroupSpecial']('betfair group')).toBe(true);
      expect(service['isGroupSpecial']('BETFAIR GROUP')).toBe(true);
      expect(service['isGroupSpecial']('Group Betfair Test')).toBe(true);
    });

    it('should return true for parlay group', () => {
      // Action & Assert
      expect(service['isGroupSpecial']('parlay group')).toBe(true);
      expect(service['isGroupSpecial']('PARLAY GROUP')).toBe(true);
      expect(service['isGroupSpecial']('Group Parlay Test')).toBe(true);
    });

    it('should return true for phone betting group', () => {
      // Action & Assert
      expect(service['isGroupSpecial']('phone betting group')).toBe(true);
      expect(service['isGroupSpecial']('PHONE BETTING GROUP')).toBe(true);
      expect(service['isGroupSpecial']('Group Phone Betting Test')).toBe(true);
    });

    it('should return false for normal groups', () => {
      // Action & Assert
      expect(service['isGroupSpecial']('normal group')).toBe(false);
      expect(service['isGroupSpecial']('regular group')).toBe(false);
      expect(service['isGroupSpecial']('standard group')).toBe(false);
      expect(service['isGroupSpecial']('')).toBe(false);
    });

    it('should handle case insensitive matching', () => {
      // Action & Assert
      expect(service['isGroupSpecial']('BetFair')).toBe(true);
      expect(service['isGroupSpecial']('Parlay')).toBe(true);
      expect(service['isGroupSpecial']('Phone Betting')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle data with null/undefined properties', () => {
      // Arrange
      const baseModel = Helper.fakeBaseModel;
      const data = {
        singleCount: null,
        parlayCount: undefined,
        fromTransTime: null,
        toTransTime: undefined,
        invalidTransIds: null,
        movedTransIds: undefined,
        matchId: null,
        licenseesName: undefined,
        totalItems: null,
        groups: null
      } as unknown as TicketsViewModel;

      // Action
      service.initData(baseModel, data);

      // Assert
      expect(baseModel.singleCount).toBeNull();
      expect(baseModel.parlayCount).toBeUndefined();
      expect(baseModel.fromTransTime).toBeNull();
      expect(baseModel.toTransTime).toBeUndefined();
      expect(baseModel.invalidTransIds).toBeNull();
      expect(baseModel.movedTransIds).toBeUndefined();
      expect(baseModel.matchId).toBeNull();
      expect(baseModel.licenseesName).toBeUndefined();
      expect(baseModel.totalItems).toBeNull();
      expect(baseModel.groups).toEqual([]);
    });

    it('should handle data with empty groups array', () => {
      // Arrange
      const baseModel = Helper.fakeBaseModel;
      const data = {
        ...Helper.fakeTicketsViewModel,
        groups: []
      };

      // Action
      service.initData(baseModel, data);

      // Assert
      expect(baseModel.groups).toHaveLength(0);
      expect(TicketsService.updateIconCheckBox).toHaveBeenCalledWith([]);
    });
  });
});
