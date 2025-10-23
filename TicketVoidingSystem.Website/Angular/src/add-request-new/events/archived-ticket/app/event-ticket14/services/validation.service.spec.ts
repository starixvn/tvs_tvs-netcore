import { TestBed } from '@angular/core/testing';
import { BetIdsComponent } from '../../../../../../utility/components/bet-ids/bet-ids.component';
import { GroupNumber, NumberItem } from '../../../../../../utility/components/bet-ids/bet-ids.model';
import { NumberItemService } from '../../../../../../utility/components/bet-ids/number-item.service';
import { TEXT } from '../../../../../../utility/constants/text';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { PermissionAddRequest } from '../../../../../models/permission-add-request.model';
import { AppService } from '../../app.service';
import { CheckTickets14Result } from '../models/check-tickets14-result.model';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let eventTicket14ApiService: AppService;
  let numberItemService: NumberItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService, NumberItemService]
    });

    service = TestBed.inject(ValidationService);
    eventTicket14ApiService = TestBed.inject(AppService);
    numberItemService = TestBed.inject(NumberItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkBusinessRule', () => {
    it('should return invalid when no bet IDs', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => false,
        groupNumber: new GroupNumber()
      } as unknown as BetIdsComponent;

      const mockPermission = {} as PermissionAddRequest;

      // Act
      const result = await service.checkBusinessRule(mockBetIdsComponent, mockPermission);

      // Assert
      expect(result.isValid).toBeFalsy();
    });

    it('should return invalid when API returns null', async () => {
      // Arrange
      const groupNumber = new GroupNumber();
      groupNumber.items = [new NumberItem('123'), new NumberItem('456')];
      
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: groupNumber,
        isAllBetIdsValid: () => true,
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const mockPermission = {
        isVoidAllArchivedTickets: false
      } as PermissionAddRequest;

      jest.spyOn(eventTicket14ApiService, 'checkTickets14').mockResolvedValue(null);
      jest.spyOn(numberItemService, 'resetAllItemsToValid').mockImplementation();
      jest.spyOn(numberItemService, 'checkDuplicatedItems').mockImplementation();

      // Act
      const result = await service.checkBusinessRule(mockBetIdsComponent, mockPermission);

      // Assert
      expect(result.isValid).toBeFalsy();
      expect(eventTicket14ApiService.checkTickets14).toHaveBeenCalled();
      expect(numberItemService.resetAllItemsToValid).toHaveBeenCalledWith(groupNumber);
      expect(numberItemService.checkDuplicatedItems).toHaveBeenCalledWith(groupNumber.items);
    });

    it('should highlight invalid trans IDs and return valid result', async () => {
      // Arrange
      const groupNumber = new GroupNumber();
      groupNumber.items = [new NumberItem('123'), new NumberItem('456')];
      
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: groupNumber,
        isAllBetIdsValid: () => true,
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const mockPermission = {
        isVoidAllArchivedTickets: false
      } as PermissionAddRequest;

      const mockValidationResult = {
        invalidTransIds: '123',
        unsupportedDateRangeTransIds: '456',
        transInfoJson: '{}',
      } as CheckTickets14Result;

      jest.spyOn(eventTicket14ApiService, 'checkTickets14').mockResolvedValue(mockValidationResult);
      jest.spyOn(numberItemService, 'resetAllItemsToValid').mockImplementation();
      jest.spyOn(numberItemService, 'checkDuplicatedItems').mockImplementation();
      jest.spyOn(numberItemService, 'updateInvalidItems').mockImplementation();

      // Act
      const result = await service.checkBusinessRule(mockBetIdsComponent, mockPermission);

      // Assert
      expect(result.isValid).toBeTruthy();
      expect(result.transInfoJson).toBe('{}');
      expect(numberItemService.resetAllItemsToValid).toHaveBeenCalledWith(groupNumber);
      expect(numberItemService.checkDuplicatedItems).toHaveBeenCalledWith(groupNumber.items);
      expect(numberItemService.updateInvalidItems).toHaveBeenCalledWith(groupNumber.items, '123', TEXT.INVALID_TICKETS);
      expect(numberItemService.updateInvalidItems).toHaveBeenCalledWith(groupNumber.items, '456', TEXT.INVALID_UNSUPPORTED_DATE_RANGE_TICKETS);
    });
  });
});
