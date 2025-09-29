import { TestBed } from '@angular/core/testing';
import { TicketListService } from './ticket-list.service';
import { TicketsModel } from './tickets.model';
import { GroupModel } from './group-tickets.model';
import { IconCheckBox } from '../../../utility/constants/config';

describe('TicketListService', () => {
  let service: TicketListService;
  let baseModel: TicketsModel;
  let dataModel: TicketsModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketListService);
    
    // Setup base model
    baseModel = new TicketsModel();
    
    // Setup data model with sample data
    dataModel = new TicketsModel();
    dataModel.total = 100;
    dataModel.totalSingle = 50;
    dataModel.totalParlay = 30;
    dataModel.totalCancelCashOut = 20;
    dataModel.fromTime = new Date('2023-01-01T10:00:00');
    dataModel.toTime = new Date('2023-01-01T18:00:00');
    dataModel.fromDate = new Date('2023-01-01');
    dataModel.toDate = new Date('2023-01-02');
    dataModel.singleTickets = [];
    dataModel.cancelCashOutTickets = [];
    dataModel.parlayTickets = [];
    dataModel.cricketTickets = [];
    dataModel.uncheckedTransIds = [];
    dataModel.betTypes = 'test';
    dataModel.checkPermissionTickets = [];
    dataModel.allCancelCashOutTickets = [];
    dataModel.isHasSettledTicket = true;
    dataModel.isAllLiveTickets = false;
    dataModel.isAllNonLiveTickets = true;
    dataModel.groupPHAffected = 5;
    dataModel.betTypeNameReplaceMessage = null;
    dataModel.groupBetTypeId = 1;
    dataModel.groups = [
      new GroupModel('Group 1', [], 10),
      new GroupModel('Group 2', [], 20)
    ];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initData', () => {
    it('should initialize all properties from data model', () => {
      // Act
      service.initData(baseModel, dataModel);

      // Assert
      expect(baseModel.total).toBe(100);
      expect(baseModel.totalSingle).toBe(50);
      expect(baseModel.totalParlay).toBe(30);
      expect(baseModel.totalCancelCashOut).toBe(20);
      expect(baseModel.fromTime).toEqual(new Date('2023-01-01T10:00:00'));
      expect(baseModel.toTime).toEqual(new Date('2023-01-01T18:00:00'));
      expect(baseModel.fromDate).toEqual(new Date('2023-01-01'));
      expect(baseModel.toDate).toEqual(new Date('2023-01-02'));
      expect(baseModel.strFromTime).toBe('10:00:00 AM');
      expect(baseModel.strToTime).toBe('06:00:00 PM');
      expect(baseModel.singleTickets).toEqual([]);
      expect(baseModel.cancelCashOutTickets).toEqual([]);
      expect(baseModel.parlayTickets).toEqual([]);
      expect(baseModel.cricketTickets).toEqual([]);
      expect(baseModel.uncheckedTransIds).toEqual([]);
      expect(baseModel.betTypes).toBe('test');
      expect(baseModel.checkPermissionTickets).toEqual([]);
      expect(baseModel.allCancelCashOutTickets).toEqual([]);
      expect(baseModel.isHasSettledTicket).toBe(true);
      expect(baseModel.isAllLiveTickets).toBe(false);
      expect(baseModel.isAllNonLiveTickets).toBe(true);
      expect(baseModel.groupPHAffected).toBe(5);
      expect(baseModel.betTypeNameReplaceMessage).toBeNull();
      expect(baseModel.groupBetTypeId).toBe(1);
    });

    it('should format time strings correctly', () => {
      // Arrange
      dataModel.fromTime = new Date('2023-01-01T14:30:45');
      dataModel.toTime = new Date('2023-01-01T22:15:30');

      // Act
      service.initData(baseModel, dataModel);

      // Assert
      expect(baseModel.strFromTime).toBe('02:30:45 PM');
      expect(baseModel.strToTime).toBe('10:15:30 PM');
    });

    it('should call mapGroups with correct parameters', () => {
      // Arrange
      const mapGroupsSpy = jest.spyOn(service as any, 'mapGroups');

      // Act
      service.initData(baseModel, dataModel);

      // Assert
      expect(mapGroupsSpy).toHaveBeenCalledWith(baseModel, dataModel.groups);
    });

    it('should call changeIconCheckBox on baseModel', () => {
      // Arrange
      const changeIconCheckBoxSpy = jest.spyOn(baseModel, 'changeIconCheckBox');

      // Act
      service.initData(baseModel, dataModel);

      // Assert
      expect(changeIconCheckBoxSpy).toHaveBeenCalled();
    });
  });

  describe('checkGroups', () => {
    beforeEach(() => {
      // Setup groups with different states
      baseModel.groups = [
        new GroupModel('Group 1', [], 10),
        new GroupModel('Group 2', [], 20)
      ];
      baseModel.groups[0].isDisabled = false;
      baseModel.groups[1].isDisabled = true;
    });

    it('should set all groups to unchecked when iconCheckBox is not none', () => {
      // Arrange
      baseModel.iconCheckBox = IconCheckBox.all;
      const checkAllTicketsSpy1 = jest.spyOn(baseModel.groups[0], 'checkAllTickets');
      const checkAllTicketsSpy2 = jest.spyOn(baseModel.groups[1], 'checkAllTickets');

      // Act
      service.checkGroups(baseModel);

      // Assert
      expect(baseModel.groups[0].isCheckAll).toBe(false); // Should be false when iconCheckBox is not none
      expect(baseModel.groups[1].isCheckAll).toBe(false); // Should be false when iconCheckBox is not none
      expect(checkAllTicketsSpy1).toHaveBeenCalled();
      expect(checkAllTicketsSpy2).toHaveBeenCalled();
      expect(baseModel.iconCheckBox).toBe(IconCheckBox.none);
    });

    it('should handle empty groups array', () => {
      // Arrange
      baseModel.groups = [];
      baseModel.iconCheckBox = IconCheckBox.all;

      // Act
      service.checkGroups(baseModel);

      // Assert
      expect(baseModel.iconCheckBox).toBe(IconCheckBox.all); // Should remain unchanged when no groups
    });
  });

  describe('mapGroups (private method)', () => {
    it('should map groups correctly', () => {
      // Arrange
      const groups = [
        new GroupModel('Group 1', [], 10),
        new GroupModel('Group 2', [], 20)
      ];
      const testDataModel = new TicketsModel();
      Object.assign(testDataModel, dataModel);
      testDataModel.groups = groups;

      // Act
      service.initData(baseModel, testDataModel);

      // Assert
      expect(baseModel.groups.length).toBe(2);
      expect(baseModel.groups[0].name).toBe('Group 1');
      expect(baseModel.groups[0].displayTotalTickets).toBe(10);
      expect(baseModel.groups[1].name).toBe('Group 2');
      expect(baseModel.groups[1].displayTotalTickets).toBe(20);
    });

    it('should handle empty groups array', () => {
      // Arrange
      const testDataModel = new TicketsModel();
      Object.assign(testDataModel, dataModel);
      testDataModel.groups = [];

      // Act
      service.initData(baseModel, testDataModel);

      // Assert
      expect(baseModel.groups.length).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle null/undefined data properties', () => {
      // Arrange
      const dataWithNulls = new TicketsModel();
      dataWithNulls.total = null;
      dataWithNulls.totalSingle = undefined;
      dataWithNulls.fromTime = null;
      dataWithNulls.toTime = null;
      dataWithNulls.groups = [];

      // Act & Assert
      expect(() => service.initData(baseModel, dataWithNulls)).not.toThrow();
    });

    it('should handle checkGroups with no groups', () => {
      // Arrange
      baseModel.groups = [];

      // Act & Assert
      expect(() => service.checkGroups(baseModel)).not.toThrow();
    });
  });
});
