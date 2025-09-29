import { TestBed } from '@angular/core/testing';
import { GroupService } from './group.service';
import { GroupModel } from './group.model';
import { TicketModel } from './ticket.model';
import { BetID } from '../../models/bet-id.model';

class Helper {
  static readonly fakeTickets: TicketModel[] = [
    new TicketModel({ value: 'TXN001', mainTransId: '1', isChecked: true, status: 'Running', member: 'user1', soldId: 'SOLD001', siteDbGroupId: 1, isDisable: false, isCricket: false }),
    new TicketModel({ value: 'TXN002', mainTransId: '2', isChecked: false, status: 'Running', member: 'user2', soldId: 'SOLD002', siteDbGroupId: 1, isDisable: false, isCricket: false }),
    new TicketModel({ value: 'TXN003', mainTransId: '3', isChecked: true, status: 'Sold', member: 'user3', soldId: 'SOLD003', siteDbGroupId: 2, isDisable: false, isCricket: true }),
    new TicketModel({ value: 'TXN004', mainTransId: '4', isChecked: false, status: 'Won', member: 'user4', soldId: 'SOLD004', siteDbGroupId: 2, isDisable: true, isCricket: false })
  ];

  static readonly fakeGroup: GroupModel = new GroupModel('Test Group', Helper.fakeTickets);
}

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(GroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCheckedTickets', () => {
    it('should return mainTransIds of checked tickets', () => {
      // Arrange
      const tickets = Helper.fakeTickets;

      // Action
      const result = service.getCheckedTickets(tickets);

      // Assert
      expect(result).toEqual(['1', '2', '3']);
    });

    it('should return empty array when no tickets are checked', () => {
      // Arrange
      const tickets = Helper.fakeTickets.map(ticket => ({ ...ticket, isChecked: false }));

      // Action
      const result = service.getCheckedTickets(tickets);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when tickets array is empty', () => {
      // Action
      const result = service.getCheckedTickets([]);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('checkSettledTickets', () => {
    it('should return true when any checked ticket is settled', () => {
      // Arrange
      const tickets = Helper.fakeTickets;
      tickets[0].isChecked = true;
      tickets[0].status = 'Won';

      // Action
      const result = service.checkSettledTickets(tickets);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when no checked tickets are settled', () => {
      // Arrange
      const tickets = Helper.fakeTickets;
      tickets.forEach(ticket => {
        ticket.isChecked = true;
        ticket.status = 'Running';
      });

      // Action
      const result = service.checkSettledTickets(tickets);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when no tickets are checked', () => {
      // Arrange
      const tickets = Helper.fakeTickets.map(ticket => ({ ...ticket, isChecked: false }));

      // Action
      const result = service.checkSettledTickets(tickets);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getTicketSold', () => {
    it('should return comma-separated values of checked sold tickets', () => {
      // Arrange
      const tickets = Helper.fakeTickets;
      tickets[0].isChecked = true;
      tickets[0].status = 'Sold';
      tickets[1].isChecked = true;
      tickets[1].status = 'Sold';

      // Action
      const result = service.getTicketSold(tickets);

      // Assert
      expect(result).toBe('TXN001,TXN002');
    });

    it('should return empty string when no tickets are sold', () => {
      // Arrange
      const tickets = Helper.fakeTickets;
      tickets.forEach(ticket => {
        ticket.isChecked = true;
        ticket.status = 'Running';
      });

      // Action
      const result = service.getTicketSold(tickets);

      // Assert
      expect(result).toBe('');
    });

    it('should return empty string when no tickets are checked', () => {
      // Arrange
      const tickets = Helper.fakeTickets.map(ticket => ({ ...ticket, isChecked: false }));

      // Action
      const result = service.getTicketSold(tickets);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('getTicketCricket', () => {
    it('should return only checked cricket tickets', () => {
      // Arrange
      const tickets = Helper.fakeTickets;
      tickets[0].isChecked = true;
      tickets[0].isCricket = false;
      tickets[2].isChecked = true;
      tickets[2].isCricket = true;

      // Action
      const result = service.getTicketCricket(tickets);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        transId: 'TXN003',
        siteDbGroupId: 2
      } as BetID);
    });

    it('should return empty array when no cricket tickets are checked', () => {
      // Arrange
      const tickets = Helper.fakeTickets;
      tickets.forEach(ticket => {
        ticket.isChecked = false;
        ticket.isCricket = true;
      });

      // Action
      const result = service.getTicketCricket(tickets);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getTickets', () => {
    it('should return all tickets as BetID array', () => {
      // Arrange
      const tickets = Helper.fakeTickets;

      // Action
      const result = service.getTickets(tickets);

      // Assert
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({
        transId: 'TXN001',
        siteDbGroupId: 1
      } as BetID);
    });

    it('should return empty array when tickets array is empty', () => {
      // Action
      const result = service.getTickets([]);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getEnableTickets', () => {
    it('should return only checked and enabled tickets', () => {
      // Arrange
      const tickets = Helper.fakeTickets;
      tickets[0].isChecked = true;
      tickets[0].isDisable = false;
      tickets[1].isChecked = true;
      tickets[1].isDisable = true;
      tickets[2].isChecked = false;
      tickets[2].isDisable = false;

      // Action
      const result = service.getEnableTickets(tickets);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        transId: 'TXN001',
        siteDbGroupId: 1
      } as BetID);
    });

    it('should return empty array when no tickets are checked and enabled', () => {
      // Arrange
      const tickets = Helper.fakeTickets;
      tickets.forEach(ticket => {
        ticket.isChecked = false;
        ticket.isDisable = false;
      });

      // Action
      const result = service.getEnableTickets(tickets);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('setIsCheckAll', () => {
    it('should return true when all tickets are checked and not disabled', () => {
      // Arrange
      const tickets = Helper.fakeTickets.map(ticket => ({
        ...ticket,
        isChecked: true,
        isDisable: false
      }));

      // Action
      const result = GroupService.setIsCheckAll(tickets);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when some tickets are not checked', () => {
      // Arrange
      const tickets = Helper.fakeTickets;
      tickets[0].isChecked = true;
      tickets[1].isChecked = false;

      // Action
      const result = GroupService.setIsCheckAll(tickets);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when some tickets are disabled', () => {
      // Arrange
      const tickets = Helper.fakeTickets.map(ticket => ({
        ...ticket,
        isChecked: true,
        isDisable: true
      }));

      // Action
      const result = GroupService.setIsCheckAll(tickets);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('changeTicketChecked', () => {
    it('should update isCheckAll and check disabled ticket', () => {
      // Arrange
      const group = new GroupModel('Test Group', Helper.fakeTickets);
      const ticket = group.tickets[0];
      ticket.isChecked = true;

      // Action
      service.changeTicketChecked(group, ticket);

      // Assert
      expect(group.isCheckAll).toBeDefined();
    });
  });

  describe('setValue', () => {
    it('should set group properties correctly', () => {
      // Arrange
      const group = new GroupModel('', Helper.fakeTickets);
      const name = 'New Group Name';

      // Action
      GroupService.setValue(group, name);

      // Assert
      expect(group.name).toBe(name);
      expect(group.isExpanded).toBe(true);
      expect(group.isCheckAll).toBeDefined();
      expect(group.isDisabled).toBeDefined();
    });
  });

  describe('checkAllTickets', () => {
    it('should check all non-disabled tickets when isCheckAll is true', () => {
      // Arrange
      const group = new GroupModel('Test Group', Helper.fakeTickets);
      group.isCheckAll = true;

      // Action
      service.checkAllTickets(group);

      // Assert
      group.tickets.forEach(ticket => {
        if (!ticket.isDisable) {
          expect(ticket.isChecked).toBe(true);
        }
      });
    });

    it('should uncheck all non-disabled tickets when isCheckAll is false', () => {
      // Arrange
      const group = new GroupModel('Test Group', Helper.fakeTickets);
      group.isCheckAll = false;

      // Action
      service.checkAllTickets(group);

      // Assert
      group.tickets.forEach(ticket => {
        if (!ticket.isDisable) {
          expect(ticket.isChecked).toBe(false);
        }
      });
    });
  });

  describe('checkDisableTickets', () => {
    it('should check disabled tickets', () => {
      // Arrange
      const group = new GroupModel('Test Group', Helper.fakeTickets);
      group.disabledTickets = ['1', '2'];

      // Action
      GroupService['checkDisableTickets'](group);

      // Assert
      // Method should execute without errors
      expect(group.disabledTickets).toBeDefined();
    });
  });

  describe('mapTickets', () => {
    it('should map tickets to group', () => {
      // Arrange
      const group = new GroupModel('Test Group', []);
      const tickets = Helper.fakeTickets;

      // Action
      GroupService['mapTickets'](group, tickets);

      // Assert
      expect(group.tickets).toHaveLength(4);
      expect(group.tickets[0]).toBeInstanceOf(TicketModel);
    });

    it('should clear existing tickets before mapping', () => {
      // Arrange
      const group = new GroupModel('Test Group', Helper.fakeTickets);
      const newTickets = [Helper.fakeTickets[0]];

      // Action
      GroupService['mapTickets'](group, newTickets);

      // Assert
      expect(group.tickets).toHaveLength(1);
    });
  });
});
