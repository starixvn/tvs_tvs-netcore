import { TestBed } from '@angular/core/testing';
import { BetIdsComponent } from '../../../../../../utility/components/bet-ids/bet-ids.component';
import { GroupNumber } from '../../../../../../utility/components/bet-ids/bet-ids.model';
import { NumberItemService } from '../../../../../../utility/components/bet-ids/number-item.service';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { TEXT} from '../../../../../../utility/constants/text';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { PermissionAddRequest } from '../../../../../models/permission-add-request.model';
import { RecoverTicketModel } from '../../../../../models/recover-ticket.model';
import { CheckRecoverTicketResult } from '../models/check-recover-ticket-result.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { ValidationService } from './validation.service';
import cloneDeep from 'lodash/cloneDeep';

class Helper {
  static readonly fakeCheckRecoverTicketResult: CheckRecoverTicketResult = {
    invalidTransIds: '12345',
    unsupportedDateRangeTransIds: '34567',
    transInfoJson: '',
    existingReqTransIds: '',
    unMarkTransIds: ''
  };
}

describe('ValidationService', () => {
  let service: ValidationService;
  let addRequestApiService: AddRequestApiService;
  let numberItemService: NumberItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService]
    });

    service = TestBed.inject(ValidationService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    numberItemService = TestBed.inject(NumberItemService);
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

      const mockRecoverTicketModel = {
        transIds: [],
        subIssueTypeId: 1,
        filterBy: '',
        productIds: []
      } as unknown as RecoverTicketModel;

      const mockPrimitiveProps = { permission: {} as PermissionAddRequest } as PrimitiveProperty;
      const mockTooltip = {} as Tooltip;

      // Act
      const result = await service.checkBusinessRule(
        mockBetIdsComponent,
        mockRecoverTicketModel,
        123,
        mockPrimitiveProps,
        mockTooltip
      );

      // Assert
      expect(result.isValid).toBeFalsy();
    });

    it('should return invalid when API returns null', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: {
          items: []
        },
        isAllBetIdsValid: () => true,
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const mockRecoverTicketModel = {
        transIds: [],
        subIssueTypeId: 1,
        filterBy: 'filter1',
        productIds: ['1', '2']
      } as unknown as RecoverTicketModel;

      const mockPrimitiveProps = { permission: {} as PermissionAddRequest } as PrimitiveProperty;
      const mockTooltip = {} as Tooltip;

      jest.spyOn(addRequestApiService, 'checkRecoverTicket').mockResolvedValue(null);
      jest.spyOn(numberItemService, 'resetAllItemsToValid').mockImplementation();
      jest.spyOn(numberItemService, 'checkDuplicatedItems').mockImplementation();

      // Act
      const result = await service.checkBusinessRule(
        mockBetIdsComponent,
        mockRecoverTicketModel,
        123,
        mockPrimitiveProps,
        mockTooltip
      );

      // Assert
      expect(result.isValid).toBeFalsy();
      expect(numberItemService.resetAllItemsToValid).toHaveBeenCalledWith(mockBetIdsComponent.groupNumber);
      expect(numberItemService.checkDuplicatedItems).toHaveBeenCalledWith(mockBetIdsComponent.groupNumber.items);
    });

    it('should highlight invalid trans IDs and return valid result', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: {
          items: []
        },
        isAllBetIdsValid: () => true,
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const mockRecoverTicketModel = {
        transIds: [],
        subIssueTypeId: 1,
        filterBy: 'filter1',
        productIds: ['1', '2']
      } as unknown as RecoverTicketModel;


      const mockPrimitiveProps = { permission: {} as PermissionAddRequest } as PrimitiveProperty;
      const mockTooltip = {} as Tooltip;

      const mockValidationResult = {
        existingReqTransIds: '123',
        invalidTransIds: '456',
        unsupportedDateRangeTransIds: '789',
        transInfoJson: '{"info": "test"}',
        unMarkTransIds: '111'
      } as CheckRecoverTicketResult;

      jest.spyOn(addRequestApiService, 'checkRecoverTicket').mockResolvedValue(mockValidationResult);
      jest.spyOn(numberItemService, 'resetAllItemsToValid').mockImplementation();
      jest.spyOn(numberItemService, 'checkDuplicatedItems').mockImplementation();
      jest.spyOn(numberItemService, 'updateInvalidItems').mockImplementation();

      // Act
      const result = await service.checkBusinessRule(
        mockBetIdsComponent,
        mockRecoverTicketModel,
        123,
        mockPrimitiveProps,
        mockTooltip
      );

      // Assert
      expect(result.isValid).toBeTruthy();
      expect(result.transInfoJson).toBe('{"info": "test"}');
      expect(result.unMarkTransIds).toBe('111');
      expect(numberItemService.updateInvalidItems).toHaveBeenCalledWith(mockBetIdsComponent.groupNumber.items, '123', TEXT.INVALID_EXISTING_ON_OTHER_REQUEST);
      expect(numberItemService.updateInvalidItems).toHaveBeenCalledWith(mockBetIdsComponent.groupNumber.items, '456', TEXT.INVALID_TICKETS);
      expect(numberItemService.updateInvalidItems).toHaveBeenCalledWith(mockBetIdsComponent.groupNumber.items, '789');
    });
  });

  it('#checkBusinessRule should return validation model with invalid', async () => {
    const mockIsHasBetId = jest.fn().mockImplementation(() => false);
    const mockPrimitiveProps = { permission: {} as PermissionAddRequest } as PrimitiveProperty;
    const mockTooltip = {} as Tooltip;
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.isHasBetId = mockIsHasBetId;
    service['highlightInvalidTransIds'] = jest.fn();
    const result = await service.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), 1, mockPrimitiveProps, mockTooltip);

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkBusinessRule should call #checkTickets14 return validation model with invalid', async () => {
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberGetAllBetIds = jest.fn();
    const mockPrimitiveProps = { permission: {} as PermissionAddRequest } as PrimitiveProperty;
    const mockTooltip = {} as Tooltip;
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.isHasBetId = mockIsHasBetId;
    betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    betIdsComponent.groupNumber = new GroupNumber();
    addRequestApiService.checkRecoverTicket = jest.fn().mockImplementation(() => null);
    service['highlightInvalidTransIds'] = jest.fn();
    jest.spyOn(numberItemService, 'resetAllItemsToValid').mockImplementation();
    jest.spyOn(numberItemService, 'checkDuplicatedItems').mockImplementation();

    const result = await service.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), 1, mockPrimitiveProps, mockTooltip);

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(numberItemService.resetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(numberItemService.checkDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkBusinessRule should call #updateInvalidItems return validation model with invalid', async () => {
    const results = cloneDeep(Helper.fakeCheckRecoverTicketResult);
    results.invalidTransIds = '123445';
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberGetAllBetIds = jest.fn();
    const mockIsAllBetIdsValid = jest.fn().mockImplementation(() => false);
    const mockPrimitiveProps = { permission: {} as PermissionAddRequest } as PrimitiveProperty;
    const mockTooltip = {} as Tooltip;
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.isHasBetId = mockIsHasBetId;
    betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    betIdsComponent.isAllBetIdsValid = mockIsAllBetIdsValid;
    betIdsComponent.groupNumber = new GroupNumber();
    addRequestApiService.checkRecoverTicket = jest.fn().mockImplementation(() => results);
    service['highlightInvalidTransIds'] = jest.fn();
    jest.spyOn(numberItemService, 'resetAllItemsToValid').mockImplementation();
    jest.spyOn(numberItemService, 'checkDuplicatedItems').mockImplementation();

    const result = await service.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), 1, mockPrimitiveProps, mockTooltip);

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(numberItemService.resetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(numberItemService.checkDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkBusinessRule should return validation model with valid', async () => {
    const results = cloneDeep(Helper.fakeCheckRecoverTicketResult);
    results.invalidTransIds = null;
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberGetAllBetIds = jest.fn().mockImplementation(() => ['123', '456']);
    const mockIsAllBetIdsValid = jest.fn().mockImplementation(() => true);
    const mockPrimitiveProps = { permission: {} as PermissionAddRequest } as PrimitiveProperty;
    const mockTooltip = {} as Tooltip;
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.isHasBetId = mockIsHasBetId;
    betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    betIdsComponent.isAllBetIdsValid = mockIsAllBetIdsValid;
    betIdsComponent.groupNumber = new GroupNumber();

    jest.spyOn(addRequestApiService, 'checkRecoverTicket').mockResolvedValue(results);
    jest.spyOn(numberItemService, 'resetAllItemsToValid').mockImplementation();
    jest.spyOn(numberItemService, 'checkDuplicatedItems').mockImplementation();
    jest.spyOn(numberItemService, 'updateInvalidItems').mockImplementation();

    const result = await service.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), 1, mockPrimitiveProps, mockTooltip);

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(numberItemService.resetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(numberItemService.checkDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(true);
  });

  it('#highlightInvalidTransIds should call #updateInvalidItems', async () => {
    const model = new CheckRecoverTicketResult();
    model.existingReqTransIds = '12344';
    model.invalidTransIds = '12345';
    model.unsupportedDateRangeTransIds = '23456';
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.items = [];
    jest.spyOn(numberItemService, 'updateInvalidItems').mockImplementation();
    
    service['highlightInvalidTransIds'](model, betIdsComponent);

    expect(numberItemService.updateInvalidItems).toHaveBeenCalledTimes(3);
  });
});