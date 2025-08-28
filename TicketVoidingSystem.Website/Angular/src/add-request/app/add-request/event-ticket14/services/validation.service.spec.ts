import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { AddRequestApiService } from '../../add-request-api.service';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { CheckTickets14Result } from '../models/check-tickets14-result.model';
import { TEXT} from '../../../../../utility/constants/text';

describe('ValidationService', () => {
  let service: ValidationService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService]
    });

    service = TestBed.inject(ValidationService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
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
      const result = await service.checkBusinessRule(mockBetIdsComponent, '1', mockPermission);

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

      jest.spyOn(addRequestApiService, 'checkTickets14').mockResolvedValue(null);

      // Act
      const result = await service.checkBusinessRule(mockBetIdsComponent, '1', mockPermission);

      // Assert
      expect(result.isValid).toBeFalsy();
      expect(addRequestApiService.checkTickets14).toHaveBeenCalled();
    });

    it('should highlight invalid trans IDs and return valid result', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: {
          resetAllItemsToValid: () => {},
          checkDuplicatedItems: () => {},
          updateInvalidItems: jest.fn()
        },
        isAllBetIdsValid: () => true,
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

      jest.spyOn(addRequestApiService, 'checkTickets14').mockResolvedValue(mockValidationResult);

      // Act
      const result = await service.checkBusinessRule(mockBetIdsComponent, '1', mockPermission);

      // Assert
      expect(result.isValid).toBeTruthy();
      expect(result.transInfoJson).toBe('{}');
      expect(mockBetIdsComponent.groupNumber.updateInvalidItems).toHaveBeenCalledWith('123', TEXT.INVALID_TICKETS);
      expect(mockBetIdsComponent.groupNumber.updateInvalidItems).toHaveBeenCalledWith('456', TEXT.INVALID_UNSUPPORTED_DATE_RANGE_TICKETS);
    });
  });
});
