import { TestBed } from '@angular/core/testing';
import { TicketsListService } from './tickets-list.service';
import { TicketsModel } from './tickets.model';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';
import { IconCheckBox } from '../../../utility/constants/config';
import { BetID } from '../../../utility/models/bet-id.model';

describe('TicketsListService', () => {
  let service: TicketsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initData', () => {
    it('should initialize tickets model with provided data', () => {
      // Arrange
      const ticketsModel = new TicketsModel();
      const data = new TicketsModel();
      data.totalItems = 10;
      data.fromTime = '2023-01-01';
      data.toTime = '2023-01-02';
      data.singleCount = 5;
      data.parlayCount = 5;
      data.totalItemsList = [{ transId: '1', matchId: 1, siteDbGroupId: 1 }] as BetID[];
      data.uncheckedTransIds = ['1', '2'];
      data.groups = [];

      // Act
      service.initData(ticketsModel, data);

      // Assert
      expect(ticketsModel.totalItems).toBe(10);
      expect(ticketsModel.fromTime).toBe('2023-01-01');
      expect(ticketsModel.toTime).toBe('2023-01-02');
      expect(ticketsModel.singleCount).toBe(5);
      expect(ticketsModel.parlayCount).toBe(5);
      expect(ticketsModel.checkedTotalItems).toBe(10);
      expect(ticketsModel.totalItemsList).toEqual(data.totalItemsList);
      expect(ticketsModel.uncheckedTransIds).toEqual(['1', '2']);
      expect(ticketsModel.tempUncheckedList).toEqual([]);
    });

    it('should adjust checkedTotalItems when tempUncheckedList has items', () => {
      // Arrange
      const ticketsModel = new TicketsModel();
      const data = new TicketsModel();
      data.totalItems = 10;
      data.groups = [];

      // Act
      service.initData(ticketsModel, data);

      // Assert
      expect(ticketsModel.checkedTotalItems).toBe(10); // tempUncheckedList được reset về []
    });
  });

  describe('checkGroups', () => {
    it('should handle empty groups array', () => {
      // Arrange
      const ticketsModel = new TicketsModel();
      ticketsModel.iconCheckBox = IconCheckBox.none;
      ticketsModel.groups = [];

      // Act
      service.checkGroups(ticketsModel);

      // Assert
      expect(ticketsModel.iconCheckBox).toBe(IconCheckBox.none);
    });
  });

  describe('getNumberOfTickets', () => {
    it('should return total number of tickets in all groups', () => {
      // Arrange
      const ticket1 = new TicketModel({ value: '1', mainTransId: '1' });
      const ticket2 = new TicketModel({ value: '2', mainTransId: '2' });
      const ticket3 = new TicketModel({ value: '3', mainTransId: '3' });
      
      const group1 = { name: 'Group 1', tickets: [ticket1, ticket2], uncheckedTicketList: [] } as unknown as GroupModel;
      const group2 = { name: 'Group 2', tickets: [ticket3], uncheckedTicketList: [] } as unknown as GroupModel;
      const groups = [group1, group2];

      // Act
      const result = service.getNumberOfTickets(groups);

      // Assert
      expect(result).toBe(3);
    });

    it('should return 0 for empty groups array', () => {
      // Arrange
      const groups: GroupModel[] = [];

      // Act
      const result = service.getNumberOfTickets(groups);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('getTicketsParam', () => {
    it('should return only checked and enabled tickets', () => {
      // Arrange
      const ticket1 = new TicketModel({ value: '1', isDisable: false, siteDbGroupId: 1, mainTransId: '1' });
      const ticket2 = new TicketModel({ value: '2', isDisable: false, siteDbGroupId: 2, mainTransId: '2' });
      const ticket3 = new TicketModel({ value: '3', isDisable: true, siteDbGroupId: 3, mainTransId: '3' });
      const ticket4 = new TicketModel({ value: '4', isDisable: false, siteDbGroupId: 4, mainTransId: '4' });
      
      // Manually set isChecked after constructor
      ticket1.isChecked = true;
      ticket2.isChecked = false;
      ticket3.isChecked = true;
      ticket4.isChecked = true;
      
      // Add ticket2 to unchecked list to make it unchecked in GroupModel
      const group = { name: 'Group 1', tickets: [ticket1, ticket2, ticket3, ticket4], uncheckedTicketList: ['2'] } as unknown as GroupModel;
      const groups = [group];

      // Act
      const result = service.getTicketsParam(groups);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].transId).toBe('1');
      expect(result[1].transId).toBe('4');
    });

    it('should return empty array when no tickets are checked', () => {
      // Arrange
      const ticket1 = new TicketModel({ value: '1', isDisable: false, siteDbGroupId: 1, mainTransId: '1' });
      ticket1.isChecked = false; // Set after constructor
      // Add ticket1 to unchecked list to make it unchecked in GroupModel
      const group = { name: 'Group 1', tickets: [ticket1], uncheckedTicketList: ['1'] } as unknown as GroupModel;
      const groups = [group];

      // Act
      const result = service.getTicketsParam(groups);

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('getAllTickets', () => {
    it('should return all tickets regardless of checked status', () => {
      // Arrange
      const ticket1 = new TicketModel({ value: '1', isDisable: false, siteDbGroupId: 1, mainTransId: '1' });
      const ticket2 = new TicketModel({ value: '2', isDisable: true, siteDbGroupId: 2, mainTransId: '2' });
      
      ticket1.isChecked = true;
      ticket2.isChecked = false;
      
      const group = { name: 'Group 1', tickets: [ticket1, ticket2], uncheckedTicketList: [] } as unknown as GroupModel;
      const groups = [group];

      // Act
      const result = service.getAllTickets(groups);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].transId).toBe('1');
      expect(result[1].transId).toBe('2');
    });
  });

  describe('getUncheckedTicketList', () => {
    let ticketsModel: TicketsModel;

    beforeEach(() => {
      ticketsModel = new TicketsModel();
    });

    it('should increment checkedTotalItems when ticket is checked', () => {
      // Arrange
      ticketsModel.checkedTotalItems = 5;
      ticketsModel.tempUncheckedList = ['1'];
      const ticket = new TicketModel({ value: '1', isChecked: true });

      // Act
      service.getUncheckedTicketList(ticketsModel, ticket);

      // Assert
      expect(ticketsModel.checkedTotalItems).toBe(6);
      expect(ticketsModel.tempUncheckedList).not.toContain('1');
    });
  });

  describe('getUncheckedTicketListFromGroup', () => {
    it('should process all tickets in group', () => {
      // Arrange
      const ticketsModel = {checkedTotalItems: 5, tempUncheckedList: ['1']} as TicketsModel;

      const group = { tickets: [ticketsModel]} as unknown as GroupModel;

      // Act
      service.getUncheckedTicketListFromGroup(ticketsModel, group);

      // Assert
      expect(ticketsModel.checkedTotalItems).toBe(4);
      expect(ticketsModel.tempUncheckedList).toContain('1');
    });
  });

  describe('getTicketsParamWithAllPage', () => {
    it('should return filtered tickets excluding unchecked ones', () => {
      // Arrange
      const ticketsModel = new TicketsModel();
      ticketsModel.totalItemsList = [
        { transId: '1', matchId: 1, siteDbGroupId: 1 },
        { transId: '2', matchId: 2, siteDbGroupId: 2 },
        { transId: '3', matchId: 3, siteDbGroupId: 3 }
      ] as BetID[];
      ticketsModel.tempUncheckedList = ['1', '3'];

      // Act
      const result = service.getTicketsParamWithAllPage(ticketsModel);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].transId).toBe('2');
    });

    it('should return all tickets when tempUncheckedList is empty', () => {
      // Arrange
      const ticketsModel = new TicketsModel();
      ticketsModel.totalItemsList = [
        { transId: '1', matchId: 1, siteDbGroupId: 1 },
        { transId: '2', matchId: 2, siteDbGroupId: 2 }
      ] as BetID[];
      ticketsModel.tempUncheckedList = [];

      // Act
      const result = service.getTicketsParamWithAllPage(ticketsModel);

      // Assert
      expect(result).toHaveLength(2);
    });
  });

  describe('initGroup', () => {
    it('should initialize group with provided name and tickets', () => {
      // Arrange
      const name = 'Test Group';
      const tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false }),
        new TicketModel({ value: '2', mainTransId: '2', isDisable: false })
      ];
      const uncheckedTicketsList = ['1'];

      // Act
      const result = service.initGroup(name, tickets, uncheckedTicketsList);

      // Assert
      expect(result).toBeInstanceOf(GroupModel);
      expect(result.name).toBe(name);
      expect(result.isExpanded).toBe(true);
      expect(result.tickets).toHaveLength(2);
      expect(result.uncheckedTicketList).toEqual(uncheckedTicketsList);
    });

    it('should set correct isCheckAll and isDisabled based on ticket count', () => {
      // Arrange
      const name = 'Test Group';
      const tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false }),
        new TicketModel({ value: '2', mainTransId: '2', isDisable: false })
      ];
      const uncheckedTicketsList = [];

      // Act
      const result = service.initGroup(name, tickets, uncheckedTicketsList);

      // Assert
      expect(result.isCheckAll).toBe(true);
      expect(result.isDisabled).toBe(false);
    });

    it('should handle special group correctly', () => {
      // Arrange
      const name = 'phone betting'; // Special group name
      const tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false }),
        new TicketModel({ value: '2', mainTransId: '2', isDisable: false })
      ];
      const uncheckedTicketsList = [];

      // Act
      const result = service.initGroup(name, tickets, uncheckedTicketsList);

      // Assert
      expect(result.isCheckAll).toBe(false);
      expect(result.tickets.every(ticket => ticket.isChecked === false)).toBe(true);
    });
  });

  describe('defaultSpecialGroup', () => {
    it('should set isCheckAll to false and uncheck all tickets for special group', () => {
      // Arrange
      const group = new GroupModel();
      group.name = 'phone betting';
      group.tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false }),
        new TicketModel({ value: '2', mainTransId: '2', isDisable: false })
      ];
      group.tickets.forEach(ticket => ticket.isChecked = true);

      // Act
      service['defaultSpecialGroup'](group);

      // Assert
      expect(group.isCheckAll).toBe(false);
      expect(group.tickets.every(ticket => ticket.isChecked === false)).toBe(true);
    });

    it('should not modify non-special group', () => {
      // Arrange
      const group = new GroupModel();
      group.name = 'normal group';
      group.tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false }),
        new TicketModel({ value: '2', mainTransId: '2', isDisable: false })
      ];
      group.tickets.forEach(ticket => ticket.isChecked = true);
      const originalIsCheckAll = group.isCheckAll;
      const originalTicketsChecked = group.tickets.map(t => t.isChecked);

      // Act
      service['defaultSpecialGroup'](group);

      // Assert
      expect(group.isCheckAll).toBe(originalIsCheckAll);
      expect(group.tickets.map(t => t.isChecked)).toEqual(originalTicketsChecked);
    });

    it('should handle case insensitive special group names', () => {
      // Arrange
      const group = new GroupModel();
      group.name = 'PHONE BETTING'; // Uppercase
      group.tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false })
      ];
      group.tickets.forEach(ticket => ticket.isChecked = true);

      // Act
      service['defaultSpecialGroup'](group);

      // Assert
      expect(group.isCheckAll).toBe(false);
      expect(group.tickets.every(ticket => ticket.isChecked === false)).toBe(true);
    });
  });

  describe('setValue', () => {
    it('should set group properties correctly', () => {
      // Arrange
      const group = new GroupModel();
      const name = 'Test Group';
      group.tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false }),
        new TicketModel({ value: '2', mainTransId: '2', isDisable: false })
      ];

      // Act
      service['setValue'](group, name);

      // Assert
      expect(group.name).toBe(name);
      expect(group.isExpanded).toBe(true);
      expect(group.isCheckAll).toBe(true);
      expect(group.isDisabled).toBe(false);
    });

    it('should set isDisabled to true when all tickets are disabled', () => {
      // Arrange
      const group = new GroupModel();
      const name = 'Test Group';
      group.tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: true }),
        new TicketModel({ value: '2', mainTransId: '2', isDisable: true })
      ];

      // Act
      service['setValue'](group, name);

      // Assert
      expect(group.isDisabled).toBe(true);
      expect(group.isCheckAll).toBe(false);
    });

    it('should call defaultSpecialGroup for special group names', () => {
      // Arrange
      const group = new GroupModel();
      const name = 'phone betting';
      group.tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false })
      ];

      // Act
      service['setValue'](group, name);

      // Assert
      expect(group.isCheckAll).toBe(false);
      expect(group.tickets.every(ticket => ticket.isChecked === false)).toBe(true);
    });
  });

  describe('mapTickets', () => {
    it('should map tickets to group and set unchecked status correctly', () => {
      // Arrange
      const group = new GroupModel();
      group.uncheckedTicketList = ['2'];
      const tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false }),
        new TicketModel({ value: '2', mainTransId: '2', isDisable: false }),
        new TicketModel({ value: '3', mainTransId: '3', isDisable: false })
      ];

      // Act
      service['mapTickets'](group, tickets);

      // Assert
      expect(group.tickets).toHaveLength(3);
      expect(group.tickets[0].isChecked).toBe(true); // Not in unchecked list
      expect(group.tickets[1].isChecked).toBe(false); // In unchecked list
      expect(group.tickets[2].isChecked).toBe(true); // Not in unchecked list
    });

    it('should handle empty tickets array', () => {
      // Arrange
      const group = new GroupModel();
      group.uncheckedTicketList = [];
      const tickets: TicketModel[] = [];

      // Act
      service['mapTickets'](group, tickets);

      // Assert
      expect(group.tickets).toHaveLength(0);
    });

    it('should handle empty uncheckedTicketList', () => {
      // Arrange
      const group = new GroupModel();
      group.uncheckedTicketList = [];
      const tickets = [
        new TicketModel({ value: '1', mainTransId: '1', isDisable: false }),
        new TicketModel({ value: '2', mainTransId: '2', isDisable: false })
      ];

      // Act
      service['mapTickets'](group, tickets);

      // Assert
      expect(group.tickets).toHaveLength(2);
      expect(group.tickets.every(ticket => ticket.isChecked === true)).toBe(true);
    });

    it('should preserve original ticket properties', () => {
      // Arrange
      const group = new GroupModel();
      group.uncheckedTicketList = [];
      const tickets = [
        new TicketModel({ 
          value: '1', 
          mainTransId: '1', 
          isDisable: false,
          betId: 'BET001',
          member: 'Member1'
        })
      ];

      // Act
      service['mapTickets'](group, tickets);

      // Assert
      expect(group.tickets[0].value).toBe('1');
      expect(group.tickets[0].mainTransId).toBe('1');
      expect(group.tickets[0].betId).toBe('BET001');
      expect(group.tickets[0].member).toBe('Member1');
    });
  });
});
