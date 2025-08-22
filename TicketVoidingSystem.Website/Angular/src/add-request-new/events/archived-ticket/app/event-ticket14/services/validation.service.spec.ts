import { TestBed } from '@angular/core/testing';
import { BetIdsComponent } from '../../../../../../utility/components/bet-ids/bet-ids.component';
import { TEXT} from '../../../../../../utility/constants/text';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { PermissionAddRequest } from '../../../../../models/permission-add-request.model';
import { AppService } from '../../app.service';
import { CheckTickets14Result } from '../models/check-tickets14-result.model';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let eventTicket14ApiService: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService]
    });

    service = TestBed.inject(ValidationService);
    eventTicket14ApiService = TestBed.inject(AppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkBusinessRule', () => {
    it('should return invalid when no bet IDs', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => false
      } as unknown as BetIdsComponent;

      const mockPermission = {} as PermissionAddRequest;

      // Act
      const result = await service.checkBusinessRule(mockBetIdsComponent, mockPermission);

      // Assert
      expect(result.isValid).toBeFalsy();
    });

    it('should return invalid when API returns null', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: {
          resetAllItemsToValid: () => {},
          checkDuplicatedItems: () => {}
        },
        isAllBetIdsValid: () => true,
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const mockPermission = {
        isVoidAllArchivedTickets: false
      } as PermissionAddRequest;

      eventTicket14ApiService.checkTickets14 = jest.fn().mockResolvedValue(null);

      // Act
      const result = await service.checkBusinessRule(mockBetIdsComponent, mockPermission);

      // Assert
      expect(result.isValid).toBeFalsy();
    });

    it('should highlight invalid trans IDs and return valid result', async () => {
      // Arrange
      const mockUpdateInvalidItems = jest.fn();
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: {
          resetAllItemsToValid: () => {},
          checkDuplicatedItems: () => {},
          updateInvalidItems: mockUpdateInvalidItems
        },
        isAllBetIdsValid: () => false,
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const mockPermission = {
        isVoidAllArchivedTickets: false
      } as PermissionAddRequest;

      const mockValidationResult: CheckTickets14Result = {
        invalidTransIds: '123',
        unsupportedDateRangeTransIds: '456',
        transInfoJson: '{}'
      };

      eventTicket14ApiService.checkTickets14 = jest.fn().mockResolvedValue(mockValidationResult);

      // Act
      const result = await service.checkBusinessRule(mockBetIdsComponent, mockPermission);

      // Assert
      expect(result.isValid).toBeFalsy();
      expect(mockUpdateInvalidItems).toHaveBeenCalledWith('123', TEXT.INVALID_TICKETS);
      expect(mockUpdateInvalidItems).toHaveBeenCalledWith('456', TEXT.INVALID_UNSUPPORTED_DATE_RANGE_TICKETS);
    });
  });
});
