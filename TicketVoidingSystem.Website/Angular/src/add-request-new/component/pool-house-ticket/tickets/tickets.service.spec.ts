import { TestBed } from '@angular/core/testing';
import { TicketsService } from './tickets.service';
import { TicketsModel } from './tickets.model';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initData', () => {
    it('should initialize tickets data correctly', () => {
      // Arrange
      const mockData = new TicketsModel();
      mockData.totalSingle = 10;
      mockData.totalParlay = 5;
      mockData.isHasSettledTicket = true;
      mockData.fromTime = new Date('2023-01-01');
      mockData.toTime = new Date('2023-01-02');
      
      const mockTicket1 = new TicketModel({
        betId: '1',
        value: 'ticket1',
        betType: 'Single',
        isParlay: false,
        betTypeId: 1,
        subBetTypeId: 0,
        isDisable: false
      });
      
      const mockTicket2 = new TicketModel({
        betId: '2',
        value: 'ticket2',
        betType: 'Parlay',
        isParlay: true,
        betTypeId: 0,
        subBetTypeId: 2,
        isDisable: false
      });

      const mockGroup = new GroupModel('Test Group', [mockTicket1, mockTicket2], 2);
      const mockOtherGroup = new GroupModel('Others', [mockTicket1], 1);
      
      mockData.groups = [mockGroup];
      mockData.groupOtherTickets = [mockOtherGroup];

      // Act
      const result = service.initData(mockData);

      // Assert
      expect(result).toBeDefined();
      expect(result.totalSingle).toBe(10);
      expect(result.totalParlay).toBe(5);
      expect(result.isHasSettledTicket).toBe(true);
      expect(result.fromTime).toEqual(new Date('2023-01-01'));
      expect(result.toTime).toEqual(new Date('2023-01-02'));
      expect(result.groups).toHaveLength(1);
      expect(result.groupOtherTickets).toHaveLength(1);
    });
  });

  describe('checkAllTickets', () => {
    it('should check all tickets in all groups', () => {
      // Arrange
      const mockTicket1 = new TicketModel({
        betId: '1',
        value: 'ticket1',
        isDisable: false
      });
      
      const mockTicket2 = new TicketModel({
        betId: '2',
        value: 'ticket2',
        isDisable: false
      });

      const mockGroup1 = new GroupModel('Group 1', [mockTicket1], 1);
      const mockGroup2 = new GroupModel('Group 2', [mockTicket2], 1);
      const groups = [mockGroup1, mockGroup2];

      // Act
      service.checkAllTickets(groups);

      // Assert
      expect(mockTicket1.isChecked).toBe(true);
      expect(mockTicket2.isChecked).toBe(true);
    });
  });

  describe('checkAllTicketsForPoolHousePopup', () => {
    it('should check all tickets except in Others group', () => {
      // Arrange
      const mockTicket1 = new TicketModel({
        betId: '1',
        value: 'ticket1',
        isDisable: false
      });
      
      const mockTicket2 = new TicketModel({
        betId: '2',
        value: 'ticket2',
        isDisable: true
      });

      const mockGroup1 = new GroupModel('Normal Group', [mockTicket1], 1);
      const mockGroup2 = new GroupModel('Others', [mockTicket2], 1);
      const groups = [mockGroup1, mockGroup2];

      // Act
      service.checkAllTicketsForPoolHousePopup(groups);

      // Assert
      expect(mockTicket1.isChecked).toBe(true);
      expect(mockTicket2.isChecked).toBe(false);
      expect(mockGroup1.isCheckAll).toBe(true);
      expect(mockGroup2.isCheckAll).toBe(false);
    });
  });

  describe('checkTicketByBetTypesForLGEarlyPopup', () => {
    it('should check tickets based on bet type names', () => {
      // Arrange
      const mockTicket1 = new TicketModel({
        betId: '1',
        value: 'ticket1',
        betType: 'Single',
        isParlay: false,
        isDisable: false
      });
      
      const mockTicket2 = new TicketModel({
        betId: '2',
        value: 'ticket2',
        subBetType: 'Parlay',
        isParlay: true,
        isDisable: false
      });

      const mockGroup = new GroupModel('Test Group', [mockTicket1, mockTicket2], 2);
      const groups = [mockGroup];
      const betTypeNames = ['Single', 'Parlay'];

      // Act
      service.checkTicketByBetTypesForLGEarlyPopup(groups, betTypeNames);

      // Assert
      expect(mockTicket1.isChecked).toBe(true);
      expect(mockTicket2.isChecked).toBe(true);
      expect(mockGroup.displayTotalTickets).toBe(2);
      expect(mockGroup.isCheckAll).toBe(true);
    });

    it('should not check tickets with unmatched bet types', () => {
      // Arrange
      const mockTicket = new TicketModel({
        betId: '1',
        value: 'ticket1',
        betType: 'Different',
        isParlay: false,
        isDisable: false
      });

      const mockGroup = new GroupModel('Test Group', [mockTicket], 1);
      const groups = [mockGroup];
      const betTypeNames = ['Single'];

      // Act
      service.checkTicketByBetTypesForLGEarlyPopup(groups, betTypeNames);

      // Assert
      expect(mockGroup.displayTotalTickets).toBe(0);
      expect(mockGroup.isCheckAll).toBe(false);
    });
  });

  describe('handleCheckTicketByBetTypes', () => {
    it('should check tickets based on bet type IDs for single bets', () => {
      // Arrange
      const mockTicket = new TicketModel({
        betId: '1',
        value: 'ticket1',
        betTypeId: 1,
        isParlay: false,
        isDisable: false
      });

      const mockGroup = new GroupModel('Test Group', [mockTicket], 1);
      const groups = [mockGroup];
      const checkedBetTypes = [1];

      // Act
      service.handleCheckTicketByBetTypes(groups, checkedBetTypes);

      // Assert
      expect(mockTicket.isChecked).toBe(true);
      expect(mockGroup.displayTotalTickets).toBe(1);
      expect(mockGroup.isCheckAll).toBe(true);
    });
  });

  describe('updateSelectedTickets', () => {
    it('should update selected single and parlay ticket counts', () => {
      // Arrange
      const mockTicket1 = new TicketModel({
        betId: '1',
        value: 'ticket1',
        isParlay: false,
        isDisable: false,
        isChecked: true
      });
      
      const mockTicket2 = new TicketModel({
        betId: '2',
        value: 'ticket2',
        isParlay: true,
        isDisable: false,
        isChecked: true
      });

      const mockTicket3 = new TicketModel({
        betId: '3',
        value: 'ticket3',
        isParlay: false,
        isDisable: false,
        isChecked: false
      });

      const mockGroup1 = new GroupModel('Normal Group', [mockTicket1, mockTicket2], 2);
      const mockGroup2 = new GroupModel('Others', [mockTicket3], 1);
      
      const tickets = new TicketsModel();
      tickets.groups = [mockGroup1, mockGroup2];

      // Act
      service.updateSelectedTickets(tickets);

      // Assert
      expect(tickets.selectedSingle).toBe(1);
      expect(tickets.selectedParlay).toBe(1);
    });

    it('should not count tickets from Others group', () => {
      // Arrange
      const mockTicket1 = new TicketModel({
        betId: '1',
        value: 'ticket1',
        isParlay: false,
        isDisable: false,
        isChecked: true
      });

      const mockGroup = new GroupModel('Others', [mockTicket1], 1);
      
      const tickets = new TicketsModel();
      tickets.groups = [mockGroup];

      // Act
      service.updateSelectedTickets(tickets);

      // Assert
      expect(tickets.selectedSingle).toBe(0);
      expect(tickets.selectedParlay).toBe(0);
    });

    it('should handle empty groups', () => {
      // Arrange
      const tickets = new TicketsModel();
      tickets.groups = [];

      // Act
      service.updateSelectedTickets(tickets);

      // Assert
      expect(tickets.selectedSingle).toBe(0);
      expect(tickets.selectedParlay).toBe(0);
    });
  });

  describe('isCheckedTicket (private method)', () => {
    it('should return true for single bet with matching bet type ID', () => {
      // Arrange
      const mockTicket = new TicketModel({
        betTypeId: 1,
        isParlay: false,
        isDisable: false
      });
      const checkedBetTypes = [1];

      // Act
      const result = (service as any).isCheckedTicket(mockTicket, checkedBetTypes);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for parlay bet with matching sub bet type ID', () => {
      // Arrange
      const mockTicket = new TicketModel({
        subBetTypeId: 2,
        isParlay: true,
        isDisable: false
      });
      const checkedBetTypes = [2];

      // Act
      const result = (service as any).isCheckedTicket(mockTicket, checkedBetTypes);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for single bet with non-matching bet type ID', () => {
      // Arrange
      const mockTicket = new TicketModel({
        betTypeId: 1,
        isParlay: false,
        isDisable: false
      });
      const checkedBetTypes = [2];

      // Act
      const result = (service as any).isCheckedTicket(mockTicket, checkedBetTypes);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for parlay bet with non-matching sub bet type ID', () => {
      // Arrange
      const mockTicket = new TicketModel({
        subBetTypeId: 1,
        isParlay: true,
        isDisable: false
      });
      const checkedBetTypes = [2];

      // Act
      const result = (service as any).isCheckedTicket(mockTicket, checkedBetTypes);

      // Assert
      expect(result).toBe(false);
    });
  });
});
