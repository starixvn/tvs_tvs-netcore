import { TestBed } from '@angular/core/testing';
import { HttpService } from '../../services/http.service';
import { NotificationModel } from './notification-popup.model';
import { NotificationPopupService } from './notification-popup.service';

describe('NotificationPopupService', () => {
  let service: NotificationPopupService;
  let httpService: HttpService;

  beforeEach(() => {
    const mockHttpService = {
      getJson: jest.fn(),
      postJson: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationPopupService,
        { provide: HttpService, useValue: mockHttpService }
      ]
    });

    service = TestBed.inject(NotificationPopupService);
    httpService = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toggle', () => {
    it('should toggle isOpen from false to true', () => {
      // Arrange
      service.close(); // Ensure initial state is false
      let currentValue: boolean;
      const subscription = service.isOpen$.subscribe(value => currentValue = value);

      // Act
      service.toggle();

      // Assert
      expect(currentValue).toBe(true);
      subscription.unsubscribe();
    });

    it('should toggle isOpen from true to false', () => {
      // Arrange
      service.toggle(); // Set initial state to true
      let currentValue: boolean;
      const subscription = service.isOpen$.subscribe(value => currentValue = value);

      // Act
      service.toggle();

      // Assert
      expect(currentValue).toBe(false);
      subscription.unsubscribe();
    });

    it('should maintain toggle state correctly', () => {
      // Arrange
      let values: boolean[] = [];
      const subscription = service.isOpen$.subscribe(value => values.push(value));

      // Act
      service.toggle();
      service.toggle();
      service.toggle();

      // Assert
      expect(values).toEqual([false, true, false, true]);
      subscription.unsubscribe();
    });
  });

  describe('close', () => {
    it('should set isOpen to false when called', () => {
      // Arrange
      service.toggle(); // Set initial state to true
      let currentValue: boolean;
      const subscription = service.isOpen$.subscribe(value => currentValue = value);

      // Act
      service.close();

      // Assert
      expect(currentValue).toBe(false);
      subscription.unsubscribe();
    });

    it('should set isOpen to false even when already false', () => {
      // Arrange
      service.close(); // Set initial state to false
      let currentValue: boolean;
      const subscription = service.isOpen$.subscribe(value => currentValue = value);

      // Act
      service.close();

      // Assert
      expect(currentValue).toBe(false);
      subscription.unsubscribe();
    });
  });

  describe('get', () => {
    it('should call httpService.getJson with correct endpoint', async () => {
      // Arrange
      const mockNotifications: NotificationModel[] = [
        {
          id: 1,
          content: 'Test notification 1',
          type: 'info',
          username: 123,
          createdDate: new Date(),
          isRead: false
        },
        {
          id: 2,
          content: 'Test notification 2',
          type: 'warning',
          username: 456,
          createdDate: new Date(),
          isRead: true
        }
      ];
      (httpService.getJson as jest.Mock).mockResolvedValue(mockNotifications);

      // Act
      const result = await service.get();

      // Assert
      expect(httpService.getJson).toHaveBeenCalledWith('api/Notification/Get');
      expect(result).toEqual(mockNotifications);
    });

    it('should handle httpService.getJson error', async () => {
      // Arrange
      const errorMessage = 'Network error';
      (httpService.getJson as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.get()).rejects.toThrow(errorMessage);
    });

    it('should return empty array when no notifications', async () => {
      // Arrange
      (httpService.getJson as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await service.get();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should call httpService.postJson with correct parameters', async () => {
      // Arrange
      const idList = '1,2,3';
      const isRead = true;
      const mockResponse = { success: true };
      (httpService.postJson as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await service.update(idList, isRead);

      // Assert
      expect(httpService.postJson).toHaveBeenCalledWith(
        { idList: idList, isRead: isRead },
        'api/Notification/Update'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should call httpService.postJson with isRead false', async () => {
      // Arrange
      const idList = '4,5,6';
      const isRead = false;
      const mockResponse = { success: true };
      (httpService.postJson as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await service.update(idList, isRead);

      // Assert
      expect(httpService.postJson).toHaveBeenCalledWith(
        { idList: idList, isRead: isRead },
        'api/Notification/Update'
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
