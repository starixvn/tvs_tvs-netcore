import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetIdsComponent } from '../../../utility/components/bet-ids/bet-ids.component';
import { NumberItemService } from '../../../utility/components/bet-ids/number-item.service';
import { TEXT } from '../../../utility/constants/text';
import { Result } from '../../../utility/models/result';
import { AppApiService } from '../app-api.service';
import { CorrectSummaryTicketComponent } from './correct-summary-ticket.component';
import { InsertBetTicket14ResultModel, UpdateSummaryStatusModel } from './correct-summary-ticket.model';

describe('CorrectSummaryTicketComponent', () => {
  let component: CorrectSummaryTicketComponent;
  let fixture: ComponentFixture<CorrectSummaryTicketComponent>;
  let mockAppApiService: jest.Mocked<AppApiService>;
  let mockNumberItemService: jest.Mocked<NumberItemService>;
  let mockBetIdsComponent: jest.Mocked<BetIdsComponent>;

  beforeEach(async () => {
    // Create mock for AppApiService
    mockAppApiService = {
      insertBetTicket14: jest.fn(),
      updateSummaryTicket19999: jest.fn()
    } as unknown as jest.Mocked<AppApiService>;

    mockNumberItemService = {
      resetAllItemsToValid: jest.fn(),
      checkDuplicatedItems: jest.fn(),
      updateInvalidItems: jest.fn(),
      updateBeingBalanceUp: jest.fn()
    } as unknown as jest.Mocked<NumberItemService>;

    // Create mock for BetIdsComponent
    mockBetIdsComponent = {
      clearBetId: jest.fn(),
      isHasBetId: jest.fn(),
      getAllBetIds: jest.fn(),
      groupNumber: {
        items: []
      }
    } as unknown as jest.Mocked<BetIdsComponent>;

    await TestBed.configureTestingModule({
      imports: [CorrectSummaryTicketComponent],
      providers: [
        { provide: AppApiService, useValue: mockAppApiService },
        { provide: NumberItemService, useValue: mockNumberItemService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CorrectSummaryTicketComponent);
    component = fixture.componentInstance;

    // Set the mock betIdsComponent
    component.betIdsComponent = mockBetIdsComponent;

    // Don't call fixture.detectChanges() to avoid DOM issues
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isBlock).toBeFalsy();
    expect(component.isDisabledBetIds).toBeFalsy();
    expect(component.statusInsertBetTicket14).toEqual(new UpdateSummaryStatusModel(false));
    expect(component.statusUpdateSummaryTicket19999).toEqual(new UpdateSummaryStatusModel(true));
  });

  describe('resetAll', () => {
    it('should reset all component state', () => {
      // Arrange
      component.isDisabledBetIds = true;
      component.statusInsertBetTicket14 = new UpdateSummaryStatusModel(true);
      component.statusUpdateSummaryTicket19999 = new UpdateSummaryStatusModel(false);

      // Act
      component.resetAll();

      // Assert
      expect(mockBetIdsComponent.clearBetId).toHaveBeenCalled();
      expect(component.isDisabledBetIds).toBeFalsy();
      expect(component.statusInsertBetTicket14).toEqual(new UpdateSummaryStatusModel(false));
      expect(component.statusUpdateSummaryTicket19999).toEqual(new UpdateSummaryStatusModel(true));
    });
  });

  describe('insertBetTicket14', () => {
    it('should not proceed if no bet IDs are present', async () => {
      // Arrange
      mockBetIdsComponent.isHasBetId.mockReturnValue(false);

      // Act
      await component.insertBetTicket14();

      // Assert
      expect(mockAppApiService.insertBetTicket14).not.toHaveBeenCalled();
      expect(component.isBlock).toBeFalsy();
    });

    it('should proceed with valid bet IDs and handle successful result', async () => {
      // Arrange
      const transIds = '123,456';
      const mockResult: InsertBetTicket14ResultModel = {
        isSuccessful: true,
        invalidTransIds: '',
        balanceUpTransIds: '',
        data: null
      } as InsertBetTicket14ResultModel;
      
      mockBetIdsComponent.isHasBetId.mockReturnValue(true);
      mockBetIdsComponent.getAllBetIds.mockReturnValue(transIds);
      mockAppApiService.insertBetTicket14.mockResolvedValue(mockResult);

      // Act
      await component.insertBetTicket14();

      // Assert
      expect(mockNumberItemService.resetAllItemsToValid).toHaveBeenCalled();
      expect(mockNumberItemService.checkDuplicatedItems).toHaveBeenCalled();
      expect(mockAppApiService.insertBetTicket14).toHaveBeenCalledWith(transIds);
      expect(component.isBlock).toBeFalsy();
      expect(component.isDisabledBetIds).toBeTruthy();
      expect(component.statusInsertBetTicket14.status).toBe('Successfully!');
      expect(component.statusInsertBetTicket14.isDisableButton).toBeTruthy();
      expect(component.statusUpdateSummaryTicket19999.isDisableButton).toBeFalsy();
    });

    it('should handle failed result', async () => {
      // Arrange
      const transIds = '123,456';
      const mockResult: InsertBetTicket14ResultModel = {
        isSuccessful: false,
        invalidTransIds: '',
        balanceUpTransIds: '',
        data: null
      } as InsertBetTicket14ResultModel;
      
      mockBetIdsComponent.isHasBetId.mockReturnValue(true);
      mockBetIdsComponent.getAllBetIds.mockReturnValue(transIds);
      mockAppApiService.insertBetTicket14.mockResolvedValue(mockResult);

      // Act
      await component.insertBetTicket14();

      // Assert
      expect(component.statusInsertBetTicket14.status).toBe('Failed!');
      expect(component.statusInsertBetTicket14.isFailed).toBeTruthy();
    });

    it('should handle validation errors with invalid and balance up tickets', async () => {
      // Arrange
      const transIds = '123,456';
      const mockResult: InsertBetTicket14ResultModel = {
        isSuccessful: true,
        invalidTransIds: '123',
        balanceUpTransIds: '456',
        data: null
      } as InsertBetTicket14ResultModel;
      
      mockBetIdsComponent.isHasBetId.mockReturnValue(true);
      mockBetIdsComponent.getAllBetIds.mockReturnValue(transIds);
      mockAppApiService.insertBetTicket14.mockResolvedValue(mockResult);

      // Act
      await component.insertBetTicket14();

      // Assert
      expect(mockNumberItemService.updateInvalidItems).toHaveBeenCalledWith([],'123', TEXT.INVALID_TICKETS);
      expect(mockNumberItemService.updateBeingBalanceUp).toHaveBeenCalledWith([],'456', TEXT.BEING_BALANCE_UP);
    });
  });

  describe('updateSummaryTicket19999', () => {
    it('should handle successful update', async () => {
      // Arrange
      const mockResult: Result<null> = {
        isSuccessful: true,
        data: null
      } as Result<null>;
      mockAppApiService.updateSummaryTicket19999.mockResolvedValue(mockResult);

      // Act
      await component.updateSummaryTicket19999();

      // Assert
      expect(mockAppApiService.updateSummaryTicket19999).toHaveBeenCalled();
      expect(component.isBlock).toBeFalsy();
      expect(component.statusUpdateSummaryTicket19999.status).toBe('Successfully!');
      expect(component.statusUpdateSummaryTicket19999.isDisableButton).toBeTruthy();
    });

    it('should handle failed update', async () => {
      // Arrange
      const mockResult: Result<null> = {
        isSuccessful: false,
        data: null
      } as Result<null>;
      mockAppApiService.updateSummaryTicket19999.mockResolvedValue(mockResult);

      // Act
      await component.updateSummaryTicket19999();

      // Assert
      expect(mockAppApiService.updateSummaryTicket19999).toHaveBeenCalled();
      expect(component.isBlock).toBeFalsy();
      expect(component.statusUpdateSummaryTicket19999.status).toBe('Failed!');
      expect(component.statusUpdateSummaryTicket19999.isFailed).toBeTruthy();
    });
  });

  describe('private methods', () => {
    describe('beforeInsertBetTicket14', () => {
      it('should reset and check items', () => {
        // Act
        component['beforeInsertBetTicket14']();

        // Assert
        expect(mockNumberItemService.resetAllItemsToValid).toHaveBeenCalled();
        expect(mockNumberItemService.checkDuplicatedItems).toHaveBeenCalled();
      });
    });

    describe('afterInsertBetTicket14', () => {
      it('should call updateDateWhenSuccess when validation passes', () => {
        // Arrange
        const result: InsertBetTicket14ResultModel = {
          isSuccessful: true,
          invalidTransIds: '',
          balanceUpTransIds: '',
          data: null
        } as InsertBetTicket14ResultModel;
        const updateDateWhenSuccessSpy = jest.spyOn(component as any, 'updateDateWhenSuccess');

        // Act
        component['afterInsertBetTicket14'](result);

        // Assert
        expect(updateDateWhenSuccessSpy).toHaveBeenCalledWith(result);
      });

      it('should call updateTicketsValidaiton when validation fails', () => {
        // Arrange
        const result: InsertBetTicket14ResultModel = {
          isSuccessful: true,
          invalidTransIds: '123',
          balanceUpTransIds: '456',
          data: null
        } as InsertBetTicket14ResultModel;
        const updateTicketsValidaitonSpy = jest.spyOn(component as any, 'updateTicketsValidaiton');

        // Act
        component['afterInsertBetTicket14'](result);

        // Assert
        expect(updateTicketsValidaitonSpy).toHaveBeenCalledWith(result);
      });
    });

    describe('updateDateWhenSuccess', () => {
      it('should handle successful result', () => {
        // Arrange
        const result: InsertBetTicket14ResultModel = {
          isSuccessful: true,
          invalidTransIds: '',
          balanceUpTransIds: '',
          data: null
        } as InsertBetTicket14ResultModel;

        // Act
        component['updateDateWhenSuccess'](result);

        // Assert
        expect(component.isDisabledBetIds).toBeTruthy();
        expect(component.statusInsertBetTicket14.status).toBe('Successfully!');
        expect(component.statusInsertBetTicket14.isDisableButton).toBeTruthy();
        expect(component.statusUpdateSummaryTicket19999.isDisableButton).toBeFalsy();
      });

      it('should handle failed result', () => {
        // Arrange
        const result: InsertBetTicket14ResultModel = {
          isSuccessful: false,
          invalidTransIds: '',
          balanceUpTransIds: '',
          data: null
        } as InsertBetTicket14ResultModel;

        // Act
        component['updateDateWhenSuccess'](result);

        // Assert
        expect(component.statusInsertBetTicket14.status).toBe('Failed!');
        expect(component.statusInsertBetTicket14.isFailed).toBeTruthy();
      });
    });

    describe('updateTicketsValidaiton', () => {
      it('should update invalid and balance up items', () => {
        // Arrange
        const result: InsertBetTicket14ResultModel = {
          isSuccessful: true,
          invalidTransIds: '123,456',
          balanceUpTransIds: '789,012',
          data: null
        } as InsertBetTicket14ResultModel;

        // Act
        component['updateTicketsValidaiton'](result);

        // Assert
        expect(mockNumberItemService.updateInvalidItems).toHaveBeenCalledWith([], '123,456', TEXT.INVALID_TICKETS);
        expect(mockNumberItemService.updateBeingBalanceUp).toHaveBeenCalledWith([], '789,012', TEXT.BEING_BALANCE_UP);
      });
    });
  });
}); 