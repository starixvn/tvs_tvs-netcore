import { TestBed } from '@angular/core/testing';
import { CheckAddPermissionService } from './check-permission.service';
import { TestingModule } from '../../../utility/modules/testing.module';
import { TVSRequestActionType } from '../../../utility/constants/config';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { PopupService } from './popup.service';

describe('CheckAddPermissionService', () => {
  let service: CheckAddPermissionService;
  let popupService: PopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [CheckAddPermissionService]
    });

    service = TestBed.inject(CheckAddPermissionService);
    popupService = TestBed.inject(PopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isAccountHasAddRequestPermission', () => {
    it('should return true when action is TAKE_NOTE_ID', () => {
      // Arrange
      const currentActionId = TVSRequestActionType.TAKE_NOTE_ID.toString();
      const isHasInstantlySettledTicket = true;
      const isHasSettledTicket = true;
      const permission = {
        isAddInstantlySettledTickets: false,
        isAddSettledTickets: false
      } as PermissionAddRequest;

      // Act
      const result = service.isAccountHasAddRequestPermission(
        currentActionId,
        isHasInstantlySettledTicket,
        isHasSettledTicket,
        permission
      );

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false and show error when has instantly settled ticket without permission', () => {
      // Arrange
      const currentActionId = '1';
      const isHasInstantlySettledTicket = true;
      const isHasSettledTicket = false;
      const permission = {
        isAddInstantlySettledTickets: false,
        isAddSettledTickets: false
      } as PermissionAddRequest;

      jest.spyOn(popupService, 'showPermissionError');

      // Act
      const result = service.isAccountHasAddRequestPermission(
        currentActionId,
        isHasInstantlySettledTicket,
        isHasSettledTicket,
        permission
      );

      // Assert
      expect(result).toBeFalsy();
      expect(popupService.showPermissionError).toHaveBeenCalledWith(
        'Your account does not have permission to add instantly settled ticket. Please change account to add request.'
      );
    });

    it('should return false and show error when has settled ticket without permission', () => {
      // Arrange
      const currentActionId = '1';
      const isHasInstantlySettledTicket = false;
      const isHasSettledTicket = true;
      const permission = {
        isAddInstantlySettledTickets: false,
        isAddSettledTickets: false
      } as PermissionAddRequest;

      jest.spyOn(popupService, 'showPermissionError');

      // Act
      const result = service.isAccountHasAddRequestPermission(
        currentActionId,
        isHasInstantlySettledTicket,
        isHasSettledTicket,
        permission
      );

      // Assert
      expect(result).toBeFalsy();
      expect(popupService.showPermissionError).toHaveBeenCalledWith(
        'Your account does not have permission to add settled ticket. Please change account to add request.'
      );
    });

    it('should return false and show error when has both types of tickets without permissions', () => {
      // Arrange
      const currentActionId = '1';
      const isHasInstantlySettledTicket = true;
      const isHasSettledTicket = true;
      const permission = {
        isAddInstantlySettledTickets: false,
        isAddSettledTickets: false
      } as PermissionAddRequest;

      jest.spyOn(popupService, 'showPermissionError');

      // Act
      const result = service.isAccountHasAddRequestPermission(
        currentActionId,
        isHasInstantlySettledTicket,
        isHasSettledTicket,
        permission
      );

      // Assert
      expect(result).toBeFalsy();
      expect(popupService.showPermissionError).toHaveBeenCalledWith(
        'Your account does not have permission to add instantly settled ticket, settled ticket. Please change account to add request.'
      );
    });

    it('should return true when has all required permissions', () => {
      // Arrange
      const currentActionId = '1';
      const isHasInstantlySettledTicket = true;
      const isHasSettledTicket = true;
      const permission = {
        isAddInstantlySettledTickets: true,
        isAddSettledTickets: true
      } as PermissionAddRequest;

      jest.spyOn(popupService, 'showPermissionError');

      // Act
      const result = service.isAccountHasAddRequestPermission(
        currentActionId,
        isHasInstantlySettledTicket,
        isHasSettledTicket,
        permission
      );

      // Assert
      expect(result).toBeTruthy();
      expect(popupService.showPermissionError).not.toHaveBeenCalled();
    });
  });
}); 