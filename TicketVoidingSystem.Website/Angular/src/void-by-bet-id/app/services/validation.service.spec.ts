import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { BetIdsComponent } from '../../../utility/components/bet-ids/bet-ids.component';
import { ConfirmationComponent } from '../../../utility/components/confirmation/confirmation.component';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { TEXT } from '../../../utility/constants/text';
import { TestingModule } from '../../../utility/modules/testing.module';
import { NumberItemService } from '../../../utility/components/bet-ids/number-item.service';
import { GroupNumber, NumberItem } from '../../../utility/components/bet-ids/bet-ids.model';

describe('ValidationService', () => {
  let service: ValidationService;
  let betIdsComponent: BetIdsComponent;
  let numberItemService: NumberItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService, NumberItemService]
    });

    service = TestBed.inject(ValidationService);
    numberItemService = TestBed.inject(NumberItemService);
    
    // Tạo GroupNumber với NumberItem thực tế
    const groupNumber = new GroupNumber();
    groupNumber.items = [
      new NumberItem('123'),
      new NumberItem('456'),
      new NumberItem('789'),
      new NumberItem('012')
    ];
    
    betIdsComponent = {
      groupNumber: groupNumber
    } as unknown as BetIdsComponent;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('highlightInvalidTransIds', () => {
    it('should handle both invalid and moved items when both are provided', () => {
      // Arrange
      const invalidTransIds = '123,456';
      const movedTransIds = '789,012';
      
      // Spy on NumberItemService methods
      const updateInvalidItemsSpy = jest.spyOn(numberItemService, 'updateInvalidItems');
      const updateMovedSpy = jest.spyOn(numberItemService, 'updateMoved');

      // Act
      service.highlightInvalidTransIds(betIdsComponent, invalidTransIds, movedTransIds);

      // Assert
      expect(updateInvalidItemsSpy).toHaveBeenCalledWith(betIdsComponent.groupNumber.items, invalidTransIds, TEXT.INVALID_TICKETS);
      expect(updateMovedSpy).toHaveBeenCalledWith(betIdsComponent.groupNumber.items, movedTransIds);
    });

    it('should update items with invalid status when invalidTransIds provided', () => {
      // Arrange
      const invalidTransIds = '123,456';
      const movedTransIds = '';
      
      // Spy on NumberItemService methods
      const updateInvalidItemsSpy = jest.spyOn(numberItemService, 'updateInvalidItems');
      const updateMovedSpy = jest.spyOn(numberItemService, 'updateMoved');

      // Act
      service.highlightInvalidTransIds(betIdsComponent, invalidTransIds, movedTransIds);

      // Assert
      expect(updateInvalidItemsSpy).toHaveBeenCalledWith(betIdsComponent.groupNumber.items, invalidTransIds, TEXT.INVALID_TICKETS);
      expect(updateMovedSpy).toHaveBeenCalledWith(betIdsComponent.groupNumber.items, movedTransIds);
    });

    it('should update items with moved status when movedTransIds provided', () => {
      // Arrange
      const invalidTransIds = '';
      const movedTransIds = '789,012';
      
      // Spy on NumberItemService methods
      const updateInvalidItemsSpy = jest.spyOn(numberItemService, 'updateInvalidItems');
      const updateMovedSpy = jest.spyOn(numberItemService, 'updateMoved');

      // Act
      service.highlightInvalidTransIds(betIdsComponent, invalidTransIds, movedTransIds);

      // Assert
      expect(updateInvalidItemsSpy).toHaveBeenCalledWith(betIdsComponent.groupNumber.items, invalidTransIds, TEXT.INVALID_TICKETS);
      expect(updateMovedSpy).toHaveBeenCalledWith(betIdsComponent.groupNumber.items, movedTransIds);
    });
  });

  describe('checkValidation', () => {
    it('should return true when both components pass validation', () => {
      // Arrange
      const messagesComponent = {
        checkValidation: jest.fn().mockReturnValue(true)
      } as unknown as TemplateMessageComponent;
      const confirmationComponent = {
        checkValidation: jest.fn().mockReturnValue(true)
      } as unknown as ConfirmationComponent;

      // Act
      const result = service.checkValidation(messagesComponent, confirmationComponent);

      // Assert
      expect(result).toBe(true);
      expect(messagesComponent.checkValidation).toHaveBeenCalled();
      expect(confirmationComponent.checkValidation).toHaveBeenCalled();
    });

    it('should return false when messagesComponent validation fails', () => {
      // Arrange
      const messagesComponent = {
        checkValidation: jest.fn().mockReturnValue(false)
      } as unknown as TemplateMessageComponent;
      const confirmationComponent = {
        checkValidation: jest.fn().mockReturnValue(true)
      } as unknown as ConfirmationComponent;

      // Act
      const result = service.checkValidation(messagesComponent, confirmationComponent);

      // Assert
      expect(result).toBe(false);
      expect(messagesComponent.checkValidation).toHaveBeenCalled();
      expect(confirmationComponent.checkValidation).not.toHaveBeenCalled();
    });

    it('should return false when confirmationComponent validation fails', () => {
      // Arrange
      const messagesComponent = {
        checkValidation: jest.fn().mockReturnValue(true)
      } as unknown as TemplateMessageComponent;
      const confirmationComponent = {
        checkValidation: jest.fn().mockReturnValue(false)
      } as unknown as ConfirmationComponent;

      // Act
      const result = service.checkValidation(messagesComponent, confirmationComponent);

      // Assert
      expect(result).toBe(false);
      expect(messagesComponent.checkValidation).toHaveBeenCalled();
      expect(confirmationComponent.checkValidation).toHaveBeenCalled();
    });

    it('should return false when both components fail validation', () => {
      // Arrange
      const messagesComponent = {
        checkValidation: jest.fn().mockReturnValue(false)
      } as unknown as TemplateMessageComponent;
      const confirmationComponent = {
        checkValidation: jest.fn().mockReturnValue(false)
      } as unknown as ConfirmationComponent;

      // Act
      const result = service.checkValidation(messagesComponent, confirmationComponent);

      // Assert
      expect(result).toBe(false);
      expect(messagesComponent.checkValidation).toHaveBeenCalled();
      expect(confirmationComponent.checkValidation).not.toHaveBeenCalled();
    });
  });
}); 
