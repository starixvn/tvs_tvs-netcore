import { TicketsService } from './tickets.service';
import { GroupModel } from './group.model';
import { TicketModel } from './ticket.model';
import { IconCheckBox } from '../../constants/config';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

class Helper {
  static readonly fakeGroups = [
    {name: 'Group 1', tickets: [
     { value: 'TXN001', mainTransId: '1', isChecked: true, status: 'Running', member: 'user1', soldId: 'SOLD001', siteDbGroupId: 1 },
      { value: 'TXN002', mainTransId: '2', isChecked: false, status: 'Running', member: 'user2', soldId: 'SOLD002', siteDbGroupId: 1 }
    ], disabledTickets: []} as GroupModel,
    {name: 'Group 2', tickets: [
      { value: 'TXN003', mainTransId: '3', isCricket: true, isChecked: false, status: 'Sold', member: 'user3', soldId: 'SOLD003', siteDbGroupId: 2 },
      { value: 'TXN004', mainTransId: '4', isChecked: true, isDisable: true, status: 'Won', member: 'user4', soldId: 'SOLD004', siteDbGroupId: 2 }
    ], disabledTickets: []} as GroupModel,
  ] as GroupModel[];
}
describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(TicketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCheckedBetIds', () => {
    it('should return empty string when groups is null', () => {
      // Action
      const result = service.getCheckedBetIds(null);

      // Assert
      expect(result).toBe('');
    });

    it('should return empty string when groups is undefined', () => {
      // Action
      const result = service.getCheckedBetIds(undefined);

      // Assert
      expect(result).toBe('');
    });

    it('should return comma-separated transIds for checked tickets', () => {
      // Arrange
      const mockTicketsGroup1 = [{ transId: 'TXN001' }];
      const mockTicketsGroup2 = [{ transId: 'TXN003' }];
      service.groupService.getEnableTickets = jest.fn()
        .mockReturnValueOnce(mockTicketsGroup1)  // First group
        .mockReturnValueOnce(mockTicketsGroup2); // Second group

      // Action
      const result = service.getCheckedBetIds(Helper.fakeGroups);

      // Assert
      expect(result).toBe('TXN001,TXN003');
      expect(service.groupService.getEnableTickets).toHaveBeenCalledTimes(2);
    });

    it('should return empty string when no tickets are checked', () => {
      // Arrange
      service.groupService.getEnableTickets = jest.fn().mockReturnValue([]);

      // Action
      const result = service.getCheckedBetIds(Helper.fakeGroups);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('getNumberOfCheckedTickets', () => {
    it('should return 0 when groups is empty', () => {
      // Action
      const result = service.getNumberOfCheckedTickets([]);

      // Assert
      expect(result).toBe(0);
    });

    it('should return correct count of checked tickets', () => {
      // Arrange
      service.groupService.getCheckedTickets = jest.fn().mockReturnValueOnce([{ transId: 'TXN001' }]) // First group
        .mockReturnValueOnce([{ transId: 'TXN003' }]); // Second group
        
      // Action
      const result = service.getNumberOfCheckedTickets(Helper.fakeGroups);

      // Assert
      expect(result).toBe(2);
      expect(service.groupService.getCheckedTickets).toHaveBeenCalledTimes(2);
    });

    it('should return 0 when no tickets are checked', () => {
      // Arrange
      service.groupService.getCheckedTickets = jest.fn().mockReturnValue([]);

      // Action
      const result = service.getNumberOfCheckedTickets(Helper.fakeGroups);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('isAllItemsChecked', () => {
    it('should return true when all tickets in all groups are checked', () => {
      // Arrange
      Helper.fakeGroups.forEach(group => {
        group.tickets.forEach(ticket => ticket.isChecked = true);
      });

      // Action
      const result = service.isAllItemsChecked(Helper.fakeGroups);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when some tickets are not checked', () => {
      // Arrange
      Helper.fakeGroups[0].tickets[0].isChecked = true;
      Helper.fakeGroups[0].tickets[1].isChecked = false;

      // Action
      const result = service.isAllItemsChecked(Helper.fakeGroups);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when groups is empty', () => {
      // Action
      const result = service.isAllItemsChecked([]);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('checkSettledTickets', () => {
    it('should return true when any group has settled tickets', () => {
      // Arrange
      service.groupService.checkSettledTickets = jest.fn().mockReturnValueOnce(false) // First group
        .mockReturnValueOnce(true); // Second group
        
      // Action
      const result = service.checkSettledTickets(Helper.fakeGroups);

      // Assert
      expect(result).toBe(true);
      expect(service.groupService.checkSettledTickets).toHaveBeenCalledTimes(2);
    });

    it('should return false when no groups have settled tickets', () => {
      // Arrange
      service.groupService.checkSettledTickets = jest.fn().mockReturnValue(false);

      // Action
      const result = service.checkSettledTickets(Helper.fakeGroups);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when groups is empty', () => {
      // Action
      const result = service.checkSettledTickets([]);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('checkGroups', () => {
    it('should check all groups when iconCheckBox is none', () => {
      // Arrange
      const iconCheckBox = IconCheckBox.none;

      // Action
      service.checkGroups(Helper.fakeGroups, iconCheckBox);

      // Assert
      Helper.fakeGroups.forEach(group => {
        expect(group.isCheckAll).toBe(!group.isDisabled);
      });
    });

    it('should uncheck all groups when iconCheckBox is not none', () => {
      // Arrange
      const iconCheckBox = IconCheckBox.all;

      // Action
      service.checkGroups(Helper.fakeGroups, iconCheckBox);

      // Assert
      Helper.fakeGroups.forEach(group => {
        expect(group.isCheckAll).toBe(false);
      });
    });

    it('should handle empty groups array', () => {
      // Arrange
      const iconCheckBox = IconCheckBox.none;

      // Action
      service.checkGroups([], iconCheckBox);

      // Assert
      expect(Helper.fakeGroups.length).toBe(2); // Original groups unchanged
    });
  });

  describe('checkAllGroupsDropDown', () => {
    it('should check all groups when iconCheckBox is not all', () => {
      // Arrange
      const iconCheckBox = IconCheckBox.none;

      // Action
      service.checkAllGroupsDropDown(Helper.fakeGroups, iconCheckBox);

      // Assert
      Helper.fakeGroups.forEach(group => {
        expect(group.isCheckAll).toBe(!group.isDisabled);
      });
    });

    it('should uncheck all groups when iconCheckBox is all', () => {
      // Arrange
      const iconCheckBox = IconCheckBox.all;

      // Action
      service.checkAllGroupsDropDown(Helper.fakeGroups, iconCheckBox);

      // Assert
      Helper.fakeGroups.forEach(group => {
        expect(group.isCheckAll).toBe(false);
      });
    });
  });

  describe('getTicketSold', () => {
    it('should return comma-separated sold ticket values', () => {
      // Arrange
      service.groupService.getTicketSold = jest.fn().mockReturnValueOnce('TXN001')
        .mockReturnValueOnce('TXN003');

      // Action
      const result = service.getTicketSold(Helper.fakeGroups);

      // Assert
      expect(result).toBe('TXN001,TXN003');
      expect(service.groupService.getTicketSold).toHaveBeenCalledTimes(2);
    });

    it('should return empty string when no tickets are sold', () => {
      // Arrange
      service.groupService.getTicketSold = jest.fn().mockReturnValue('');

      // Action
      const result = service.getTicketSold(Helper.fakeGroups);

      // Assert
      expect(result).toBe('');
    });

    it('should include lasted sold ID when conditions are met', () => {
      // Arrange
      const lastGroup = Helper.fakeGroups[Helper.fakeGroups.length - 1];
      const lastTicket = lastGroup.tickets[lastGroup.tickets.length - 1];
      lastTicket.isChecked = true;
      lastTicket.status = 'Sold';
      lastTicket.member = 'bettrade_user';
      lastTicket.soldId = 'LAST_SOLD';
      
      service.groupService.getTicketSold = jest.fn().mockReturnValue('');

      // Action
      const result = service.getTicketSold(Helper.fakeGroups);

      // Assert
      expect(result).toContain('LAST_SOLD');
    });
  });

  describe('changeIconCheckBox', () => {
    it('should set iconCheckBox to none when no tickets', () => {
      // Arrange
      let iconCheckBox = IconCheckBox.all;

      // Action
      iconCheckBox = TicketsService.updateIconCheckBox([]);

      // Assert
      expect(iconCheckBox).toBe(IconCheckBox.none);
    });

    it('should set iconCheckBox to all when all tickets are checked', () => {
      // Arrange
      let iconCheckBox = IconCheckBox.none;
      const testGroups = [
        {name: 'Group 1', tickets: [
          new TicketModel({ value: 'TXN001', mainTransId: '1', isChecked: true, status: 'Running', member: 'user1', soldId: 'SOLD001', siteDbGroupId: 1 }),
          new TicketModel({ value: 'TXN002', mainTransId: '2', isChecked: true, status: 'Running', member: 'user2', soldId: 'SOLD002', siteDbGroupId: 1 })
        ], disabledTickets: []} as GroupModel,
        {name: 'Group 2', tickets: [
          new TicketModel({ value: 'TXN003', mainTransId: '3', isChecked: true, status: 'Sold', member: 'user3', soldId: 'SOLD003', siteDbGroupId: 2 }),
          new TicketModel({ value: 'TXN004', mainTransId: '4', isChecked: true, status: 'Won', member: 'user4', soldId: 'SOLD004', siteDbGroupId: 2 })
        ], disabledTickets: []} as GroupModel,
      ] as GroupModel[];

      // Action
      iconCheckBox = TicketsService.updateIconCheckBox(testGroups);

      // Assert
      expect(iconCheckBox).toBe(IconCheckBox.all);
    });

    it('should set iconCheckBox to any when some tickets are checked', () => {
      // Arrange
      let iconCheckBox = IconCheckBox.none;
      const testGroups = [
        {name: 'Group 1', tickets: [
          new TicketModel({ value: 'TXN001', mainTransId: '1', isChecked: true, isDisable: false, status: 'Running', member: 'user1', soldId: 'SOLD001', siteDbGroupId: 1 }),
          new TicketModel({ value: 'TXN002', mainTransId: '2', isChecked: false, isDisable: true, status: 'Running', member: 'user2', soldId: 'SOLD002', siteDbGroupId: 1 })
        ], disabledTickets: []} as GroupModel,
        {name: 'Group 2', tickets: [
          new TicketModel({ value: 'TXN003', mainTransId: '3', isChecked: false, isDisable: true, status: 'Sold', member: 'user3', soldId: 'SOLD003', siteDbGroupId: 2 }),
          new TicketModel({ value: 'TXN004', mainTransId: '4', isChecked: false, isDisable: true, status: 'Won', member: 'user4', soldId: 'SOLD004', siteDbGroupId: 2 })
        ], disabledTickets: []} as GroupModel,
      ];

      // Action
      iconCheckBox = TicketsService.updateIconCheckBox(testGroups);

      // Assert
      expect(iconCheckBox).toBe(IconCheckBox.any);
    });

    it('should set iconCheckBox to none when no tickets are checked', () => {
      // Arrange
      let iconCheckBox = IconCheckBox.all;
      const testGroups = [
        {name: 'Group 1', tickets: [
          new TicketModel({ value: 'TXN001', mainTransId: '1', isChecked: false, isDisable: true, status: 'Running', member: 'user1', soldId: 'SOLD001', siteDbGroupId: 1 }),
          new TicketModel({ value: 'TXN002', mainTransId: '2', isChecked: false, isDisable: true, status: 'Running', member: 'user2', soldId: 'SOLD002', siteDbGroupId: 1 })
        ], disabledTickets: []} as GroupModel,
        {name: 'Group 2', tickets: [
          new TicketModel({ value: 'TXN003', mainTransId: '3', isChecked: false, isDisable: true, status: 'Sold', member: 'user3', soldId: 'SOLD003', siteDbGroupId: 2 }),
          new TicketModel({ value: 'TXN004', mainTransId: '4', isChecked: false, isDisable: true, status: 'Won', member: 'user4', soldId: 'SOLD004', siteDbGroupId: 2 })
        ], disabledTickets: []} as GroupModel,
      ];

      // Action
      iconCheckBox = TicketsService.updateIconCheckBox(testGroups);

      // Assert
      expect(iconCheckBox).toBe(IconCheckBox.none);
    });
  });

  describe('getTicketCricket', () => {
    it('should return only cricket tickets that are checked', () => {
      // Arrange
      const mockCricketTickets = [{ transId: 'TXN003' }];
      service.groupService.getTicketCricket = jest.fn().mockReturnValueOnce([]) // First group
        .mockReturnValueOnce(mockCricketTickets); // Second group

      // Action
      const result = service.getTicketCricket(Helper.fakeGroups);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].transId).toBe('TXN003');
      expect(service.groupService.getTicketCricket).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no cricket tickets are checked', () => {
      // Arrange
      service.groupService.getTicketCricket = jest.fn().mockReturnValue([]);

      // Action
      const result = service.getTicketCricket(Helper.fakeGroups);

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('getAllTicket', () => {
    it('should return all tickets from all groups', () => {
      // Arrange
      const mockTickets1 = [{ transId: 'TXN001' }, { transId: 'TXN002' }];
      const mockTickets2 = [{ transId: 'TXN003' }, { transId: 'TXN004' }];
      service.groupService.getTickets = jest.fn().mockReturnValueOnce(mockTickets1)
        .mockReturnValueOnce(mockTickets2);

      // Action
      const result = service.getAllTicket(Helper.fakeGroups);

      // Assert
      expect(result).toHaveLength(4);
      expect(result[0].transId).toBe('TXN001');
      expect(result[1].transId).toBe('TXN002');
      expect(service.groupService.getTickets).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when groups is empty', () => {
      // Action
      const result = service.getAllTicket([]);

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('getTicketEnable', () => {
    it('should return only enabled tickets that are checked', () => {
      // Arrange
      const mockEnabledTickets = [{ transId: 'TXN001' }];
      service.groupService.getEnableTickets = jest.fn().mockReturnValueOnce(mockEnabledTickets)
        .mockReturnValueOnce([]);

      // Action
      const result = service.getTicketEnable(Helper.fakeGroups);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].transId).toBe('TXN001');
      expect(service.groupService.getEnableTickets).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no enabled tickets are checked', () => {
      // Arrange
      service.groupService.getEnableTickets = jest.fn().mockReturnValue([]);

      // Action
      const result = service.getTicketEnable(Helper.fakeGroups);

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('updatePositionListCheckGroup', () => {
    it('should update iconCheckBoxTop with calculated position', () => {
      // Arrange
      const mockElement = {
        nativeElement: {
          getElementsByClassName: jest.fn().mockReturnValue([{
            offsetParent: { offsetTop: 100 },
            offsetHeight: 50
          }])
        }
      } as unknown as ElementRef;

      // Action
      const result = service.updatePositionListCheckGroup(mockElement);

      // Assert
      expect(mockElement.nativeElement.getElementsByClassName).toHaveBeenCalledWith('list-check-groups-input');
      expect(result).toBe('150px');
    });
  });
});
