import { TestBed } from '@angular/core/testing';
import { AbnormalAccountService } from './abnormal-account.service';
import { ExtraWarningModel } from '../../confirm-add-request/confirm-add-request.model';

describe('AbnormalAccountService', () => {
  let service: AbnormalAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbnormalAccountService]
    });

    service = TestBed.inject(AbnormalAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getExtraWarningModel', () => {
    it('should return null when numberOfTicketsExistedInRequest is 0', () => {
      // Arrange
      const numberOfTicketsExistedInRequest = 0;

      // Act
      const result = service.getExtraWarningModel(numberOfTicketsExistedInRequest);

      // Assert
      expect(result).toBeNull();
    });

    it('should return ExtraWarningModel when numberOfTicketsExistedInRequest is greater than 0', () => {
      // Arrange
      const numberOfTicketsExistedInRequest = 5;

      // Act
      const result = service.getExtraWarningModel(numberOfTicketsExistedInRequest);

      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual({
        title: `There are some tickets (${numberOfTicketsExistedInRequest}) that existed in other Requests.`,
        messages: []
      } as ExtraWarningModel);
    });

    it('should return ExtraWarningModel with correct title for different ticket counts', () => {
      // Arrange
      const testCases = [1, 10, 100];

      // Act & Assert
      testCases.forEach(count => {
        const result = service.getExtraWarningModel(count);
        expect(result).toBeDefined();
        expect(result.title).toBe(`There are some tickets (${count}) that existed in other Requests.`);
        expect(result.messages).toEqual([]);
      });
    });
  });
}); 