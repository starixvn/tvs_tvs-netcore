import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { BetIdsComponent } from '../../../utility/components/bet-ids/bet-ids.component';
import { ConfirmationComponent } from '../../../utility/components/confirmation/confirmation.component';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { TEXT } from '../../../utility/constants/text';
import { TestingModule } from '../../../utility/modules/testing.module';
import { TicketsViewModel } from '../model/get-tickets.query';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';

class Helper {
  static readonly fakeTicketsViewModel = {
    groups: [{ tickets: [{isChecked: true, mainTransId: '123'}]}],
  } as TicketsViewModel;
}
describe('ValidationService', () => {
  let service: ValidationService;
  let betIdsComponent: BetIdsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService]
    });

    service = TestBed.inject(ValidationService);
    betIdsComponent = {
      groupNumber: {
        updateInvalidItems: jest.fn(),
        updateMoved: jest.fn()
      }
    } as unknown as BetIdsComponent;

    Helper.fakeTicketsViewModel.getNumberOfCheckedTickets = jest.fn().mockReturnValue(1);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('highlightInvalidTransIds', () => {
    it('should handle both invalid and moved items when both are provided', () => {
      // Arrange
      const invalidTransIds = '123,456';
      const movedTransIds = '789,012';
      betIdsComponent.groupNumber.updateInvalidItems = jest.fn();
      betIdsComponent.groupNumber.updateMoved = jest.fn();
      
      // Act
      service.highlightInvalidTransIds(betIdsComponent, invalidTransIds, movedTransIds);

      // Assert
      expect(betIdsComponent.groupNumber.updateInvalidItems).toHaveBeenCalledWith(invalidTransIds, TEXT.INVALID_TICKETS);
      expect(betIdsComponent.groupNumber.updateMoved).toHaveBeenCalledWith(movedTransIds);
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
      const result = service.checkValidation(Helper.fakeTicketsViewModel, messagesComponent, confirmationComponent, null);

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
      const result = service.checkValidation(Helper.fakeTicketsViewModel, messagesComponent, confirmationComponent, null);

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
      const result = service.checkValidation(Helper.fakeTicketsViewModel, messagesComponent, confirmationComponent, null);

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
      const result = service.checkValidation(Helper.fakeTicketsViewModel, messagesComponent, confirmationComponent, null);

      // Assert
      expect(result).toBe(false);
      expect(messagesComponent.checkValidation).toHaveBeenCalled();
      expect(confirmationComponent.checkValidation).not.toHaveBeenCalled();
    });

    
    it('should return false when no tickets are selected', () => {
      // Arrange
      const messagesComponent = {
        checkValidation: jest.fn().mockReturnValue(false)
      } as unknown as TemplateMessageComponent;
      const confirmationComponent = {
        checkValidation: jest.fn().mockReturnValue(false)
      } as unknown as ConfirmationComponent;
      const ticketsViewModel = {
        groups: [{ tickets: []}]
      } as TicketsViewModel;
      ticketsViewModel.getNumberOfCheckedTickets = jest.fn().mockReturnValue(0);

      const tooltip = new Tooltip();
      tooltip.display = jest.fn();

      // Act
      const result = service.checkValidation(ticketsViewModel, messagesComponent, confirmationComponent, tooltip);

      // Assert
      expect(result).toBe(false);
      expect(tooltip.display).toHaveBeenCalled();
      expect(messagesComponent.checkValidation).not.toHaveBeenCalled();
      expect(confirmationComponent.checkValidation).not.toHaveBeenCalled();
    });
  });
}); 
