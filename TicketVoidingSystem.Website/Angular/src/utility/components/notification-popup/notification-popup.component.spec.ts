import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationPopupComponent } from './notification-popup.component';
import { NotificationPopupService } from './notification-popup.service';
import { SignalRService } from '../../services/signal-r.service.native';
import { ChangeDetectorRef, DestroyRef } from '@angular/core';
import { NotificationModel } from './notification-popup.model';
import { NotificationTabName, NotificationFilterTabName, NotificationType } from '../../constants/notification.constant';
import { CommonModule } from '@angular/common';
import { TestingModule } from '../../modules/testing.module';

class Helper {
  static readonly mockNotifications = [
    {
      id: 1,
      content: 'Test notification 1',
      type: NotificationType.NOTIFICATION,
      isRead: false,
      createdDate: new Date('2024-03-20T10:00:00')
    },
    {
      id: 2,
      content: 'Test notification 2',
      type: NotificationType.ERROR,
      isRead: true,
      createdDate: new Date('2024-03-20T11:00:00')
    }
  ] as NotificationModel[];

  static readonly mockNewNotification = {
    id: 3,
    content: 'New test notification',
    type: NotificationType.NOTIFICATION,
    isRead: false,
    createdDate: new Date('2024-03-20T12:00:00')
  } as NotificationModel;

  static readonly mockDuplicateNotification = {
    id: 4,
    content: 'Test notification 1',
    type: NotificationType.NOTIFICATION,
    isRead: false,
    createdDate: new Date('2024-03-20T13:00:00')
  } as NotificationModel;
}

describe('NotificationPopupComponent', () => {
  let component: NotificationPopupComponent;
  let fixture: ComponentFixture<NotificationPopupComponent>;
  let notificationService: NotificationPopupService;
  let signalRService: SignalRService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TestingModule
      ],
      providers: [
        { provide: NotificationPopupService, useValue: { 
          isOpen$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) },
          get: jest.fn().mockResolvedValue(Helper.mockNotifications),
          update: jest.fn().mockResolvedValue({}),
          toggle: jest.fn()
        }},
        { provide: SignalRService, useValue: {
          notificationChange: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) }
        }},
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() }},
        { provide: DestroyRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationPopupComponent);
    component = fixture.componentInstance;
    notificationService = fixture.debugElement.injector.get(NotificationPopupService);
    signalRService = fixture.debugElement.injector.get(SignalRService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should initialize component', async () => {
    // Arrange & Act
    await component.ngOnInit();

    // Assert
    expect(notificationService.isOpen$.pipe).toHaveBeenCalled();
    expect(signalRService.notificationChange.pipe).toHaveBeenCalled();
    expect(notificationService.get).toHaveBeenCalled();
  });

  it('#unreadNotificationCount should return correct count', () => {
    // Arrange
    component.notifications = Helper.mockNotifications;

    // Act
    const result = component.unreadNotificationCount;

    // Assert
    expect(result).toBe('1');
  });

  it('#unreadErrorCount should return correct count', () => {
    // Arrange
    component.notifications = Helper.mockNotifications;

    // Act
    const result = component.unreadErrorCount;

    // Assert
    expect(result).toBe('');
  });

  it('#selectTab should update active tab', () => {
    // Arrange
    const newTab = NotificationTabName.ERROR;
    component.notifications = Helper.mockNotifications;

    // Act
    component.selectTab(newTab);

    // Assert
    expect(component.activeTab).toBe(newTab);
  });

  it('#selectFilterTab should update filter tab', () => {
    // Arrange
    const newFilterTab = NotificationFilterTabName.UNREAD;
    component.notifications = Helper.mockNotifications;

    // Act
    component.selectFilterTab(newFilterTab);

    // Assert
    expect(component.filterTab).toBe(newFilterTab);
  });

  it('#clickNotification should mark notification as read', () => {
    // Arrange
    const notification = Helper.mockNotifications[0];
    const event = { stopPropagation: jest.fn() } as unknown as Event;
    jest.spyOn(notificationService, 'update');

    // Act
    component.clickNotification(event, notification);

    // Assert
    expect(notification.isRead).toBe(true);
    expect(notificationService.update).toHaveBeenCalledWith(notification.id.toString(), true);
  });

  it('#toggleNotifications should toggle expanded state', () => {
    // Arrange
    component.isExpanded = false;
    const initialHeight = component.notificationHeight;

    // Act
    component.toggleNotifications();

    // Assert
    expect(component.isExpanded).toBe(true);
    expect(component.notificationHeight).toBe(750);
  });

  it('#markAllAsRead should mark all notifications as read', () => {
    // Arrange
    component.notifications = Helper.mockNotifications;
    component.activeTab = NotificationTabName.NOTIFICATION;
    jest.spyOn(notificationService, 'update');

    // Act
    component.markAllAsRead();

    // Assert
    expect(component.notifications[0].isRead).toBe(true);
  });

  it('#closeOnClickOutside should close notification when clicking outside', () => {
    // Arrange
    component.isOpen = true;
    const event = { target: document.createElement('div') } as unknown as Event;
    jest.spyOn(notificationService, 'toggle');

    // Act
    component.closeOnClickOutside(event);

    // Assert
    expect(notificationService.toggle).toHaveBeenCalled();
  });

  it('should update grouped notifications when notifications change', () => {
    // Arrange
    component.notifications = Helper.mockNotifications;
    component.activeTab = NotificationTabName.NOTIFICATION;
    component.filterTab = NotificationFilterTabName.ALL;

    // Act
    component.selectTab(NotificationTabName.ERROR);

    // Assert
    expect(component.groupedNotifications.length).toBeGreaterThan(0);
  });

  it('should handle new notification correctly', () => {
    // Arrange
    component.notifications = Helper.mockNotifications;
    component.activeTab = NotificationTabName.NOTIFICATION;

    // Act
    component['addNewNotification'](Helper.mockNewNotification);

    // Assert
    expect(component.notifications[0]).toBe(Helper.mockNewNotification);
  });

  it('should not add duplicate notification', () => {
    // Arrange
    component.notifications = Helper.mockNotifications;
    component.activeTab = NotificationTabName.NOTIFICATION;

    // Act
    component['addNewNotification'](Helper.mockDuplicateNotification);

    // Assert
    expect(component.notifications.length).toBe(Helper.mockNotifications.length);
  });

  it('should handle notification with stored content', () => {
    // Arrange
    const storedNotification = {
      ...Helper.mockNewNotification,
      content: 'stored notification content'
    };
    component.notifications = Helper.mockNotifications;

    // Act
    component['addNewNotification'](storedNotification);

    // Assert
    expect(component.notifications).toContain(storedNotification);
  });

  it('should update grouped notifications when filter changes', () => {
    // Arrange
    component.notifications = Helper.mockNotifications;
    component.activeTab = NotificationTabName.NOTIFICATION;
    component.filterTab = NotificationFilterTabName.ALL;

    // Act
    component.selectFilterTab(NotificationFilterTabName.UNREAD);

    // Assert
    expect(component.groupedNotifications.length).toBeGreaterThan(0);
  });

  it('should handle notification open event with existing notifications', async () => {
    // Arrange
    component.notifications = Helper.mockNotifications;

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.notifications).toEqual(Helper.mockNotifications);
  });

  it('should handle notification click with already read notification', () => {
    // Arrange
    const readNotification = { ...Helper.mockNotifications[0], isRead: true };
    const event = { stopPropagation: jest.fn() } as unknown as Event;
    jest.spyOn(notificationService, 'update');

    // Act
    component.clickNotification(event, readNotification);

    // Assert
    expect(notificationService.update).not.toHaveBeenCalled();
  });

  it('should handle mark all as read with no unread notifications', () => {
    // Arrange
    const allReadNotifications = Helper.mockNotifications.map(n => ({ ...n, isRead: true }));
    component.notifications = allReadNotifications;
    component.activeTab = NotificationTabName.NOTIFICATION;
    jest.spyOn(notificationService, 'update');

    // Act
    component.markAllAsRead();

    // Assert
    expect(notificationService.update).not.toHaveBeenCalled();
  });

  it('should handle click inside notification container', () => {
    // Arrange
    component.isOpen = true;
    const event = { 
      target: document.createElement('div'),
      closest: jest.fn().mockReturnValue(true)
    } as unknown as Event;
    jest.spyOn(notificationService, 'toggle');

    // Act
    component.closeOnClickOutside(event);

    // Assert
    expect(notificationService.toggle).toHaveBeenCalled();
  });
});
