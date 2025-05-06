import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AffectedTicketComponent } from './affected-ticket.component';
import { AffectedTicketService } from './affected-ticket.service';
import { LogAnalysisService } from '../services/log-analysis.service';
import { AffectedTicketsModel } from '../models/live-game-early-ticket.model';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { SimpleChange } from '@angular/core';
import { GroupModel } from '../pool-house-ticket/tickets/group-tickets.model';

class Helper {
  static readonly fakeIssueTypeId = '123';
  static readonly fakeLogInfoTicketsJson = '{"someData": "test"}';
  static readonly fakeAffectedTicketsModel = {
    issueTypeId: '123',
    logInfoTicketsJson: '{"someData": "test"}',
    isOpen: true
  } as unknown as AffectedTicketsModel;
}

describe('AffectedTicketComponent', () => {
  let component: AffectedTicketComponent;
  let fixture: ComponentFixture<AffectedTicketComponent>;
  let affectedTicketService: AffectedTicketService;
  let logAnalysisService: LogAnalysisService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AffectedTicketService,
        LogAnalysisService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AffectedTicketComponent);
    affectedTicketService = fixture.debugElement.injector.get(AffectedTicketService);
    logAnalysisService = fixture.debugElement.injector.get(LogAnalysisService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.model).toBeDefined();
    expect(component.blockBetList).toBeFalsy();
    expect(component.isShowOtherTickets).toBeTruthy();
    expect(component.isShowAffectedTickets).toBeTruthy();
    expect(component.isShowGroupBetTypesCount).toBeTruthy();
  });

  it('should handle model changes when isOpen is true', async () => {
    // Arrange
    const mockTickets = new TicketsModel();
    affectedTicketService.getAffectedTickets = jest.fn().mockResolvedValue(mockTickets);
    logAnalysisService.writeLogClickLiveGameDetails = jest.fn().mockResolvedValue(undefined);
    component.model = Helper.fakeAffectedTicketsModel;

    // Act
    await component.ngOnChanges({
      model: {
        currentValue: Helper.fakeAffectedTicketsModel,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.blockBetList).toBeFalsy();
    expect(affectedTicketService.getAffectedTickets).toHaveBeenCalledWith(
      Helper.fakeIssueTypeId,
      Helper.fakeLogInfoTicketsJson
    );
    expect(logAnalysisService.writeLogClickLiveGameDetails).toHaveBeenCalledWith(Helper.fakeIssueTypeId);
  });

  it('should not process changes when isOpen is false', async () => {
    // Arrange
    component.model = { ...Helper.fakeAffectedTicketsModel, isOpen: false };
    affectedTicketService.getAffectedTickets = jest.fn();

    // Act
    await component.ngOnChanges({
      model: {
        currentValue: component.model,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(affectedTicketService.getAffectedTickets).not.toHaveBeenCalled();
  });

  it('should handle close click correctly', () => {
    // Arrange
    component.isShowOtherTickets = false;
    component.isShowAffectedTickets = false;
    component.isShowGroupBetTypesCount = false;
    component.model.isOpen = true;

    // Act
    component.closeClick();

    // Assert
    expect(component.isShowOtherTickets).toBeTruthy();
    expect(component.isShowAffectedTickets).toBeTruthy();
    expect(component.isShowGroupBetTypesCount).toBeTruthy();
    expect(component.model.isOpen).toBeFalsy();
  });

  it('should update selected bet types correctly', () => {
    // Arrange
    const betTypes = ['type1', 'type2'];
    component.tickets = new TicketsModel();
    component.tickets.checkTicketByBetTypesForLGEarlyPopup = jest.fn();

    // Act
    component.updateSelectedBetTypes(betTypes);

    // Assert
    expect(component.tickets.checkTicketByBetTypesForLGEarlyPopup).toHaveBeenCalledWith(betTypes);
  });

  it('should initialize filter bet types when tickets groups exist', () => {
    // Arrange
    component.tickets = new TicketsModel();
    component.tickets.groups = [{
      tickets: [
        { betType: 'type1', isParlay: false },
        { betType: 'type2', isParlay: true, subBetType: 'subType1' }
      ]
    } as unknown as GroupModel];

    // Act
    component['initFilterBetTypes']();

    // Assert
    expect(component.filterBetTypes).toBeDefined();
    expect(component.filterBetTypes.items.length).toBe(2);
  });

  it('should not initialize filter bet types when no tickets groups exist', () => {
    // Arrange
    component.tickets = new TicketsModel();
    component.tickets.groups = [];

    // Act
    component['initFilterBetTypes']();

    // Assert
    expect(component.filterBetTypes).toBeUndefined();
  });
});
