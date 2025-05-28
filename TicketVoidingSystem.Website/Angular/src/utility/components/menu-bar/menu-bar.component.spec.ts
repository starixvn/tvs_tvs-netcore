import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { MenuBarComponent } from './menu-bar.component';
import { CommonService } from '../../../utility/services/common.service';
import { SignalRService } from '../../../utility/services/signal-r.service.native';
import { NotificationPopupService } from '../notification-popup/notification-popup.service';
import { EventEmitter } from '@angular/core';
import { ToastrModule, ToastrService, TOAST_CONFIG } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class Helper {
  static readonly fakeUserInfo = {
    userName: 'testUser',
    menuItem: [
      {
        id: 1,
        parentId: 0,
        displayOrder: 1,
        name: 'Menu 1'
      },
      {
        id: 2,
        parentId: 1,
        displayOrder: 1,
        name: 'Sub Menu 1'
      }
    ]
  };
}

describe('MenuBarComponent', () => {
  let component: MenuBarComponent;
  let fixture: ComponentFixture<MenuBarComponent>;
  let commonService: CommonService;
  let signalRService: SignalRService;
  let notificationPopupService: NotificationPopupService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
          timeOut: 3000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        })
      ],
      providers: [
        CommonService,
        {
          provide: SignalRService,
          useValue: {
            notificationIconClass: new EventEmitter<string>(),
            // Thêm các mock methods khác nếu cần
          }
        },
        NotificationPopupService,
        ToastrService,
        {
          provide: TOAST_CONFIG,
          useValue: {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuBarComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    signalRService = fixture.debugElement.injector.get(SignalRService);
    notificationPopupService = fixture.debugElement.injector.get(NotificationPopupService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', async () => {
    // Arrange
    document.body.setAttribute('root-url', '/test');
    commonService.getNapUserInfo = jest.fn().mockResolvedValue(Helper.fakeUserInfo);

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(component.rootUrl).toBe('/test');
    expect(component.username).toBe('testUser');
    expect(component.menuItems.length).toBe(1);
    expect(component.menuItems[0].items.length).toBe(1);
  });

  it('should handle notification icon class changes', async () => {
    // Arrange
    jest.useFakeTimers();
    const testClass = 'test-class';
    signalRService.notificationIconClass = new EventEmitter<string>();
    signalRService.notificationIconClass.emit(testClass);

    // Act
    await component.ngOnInit();
    jest.advanceTimersByTime(5000);

    // Assert
    expect(component.notificationIconClass).toBe('');
    jest.useRealTimers();
  });

  it('should toggle notification popup', () => {
    // Arrange
    const event = new Event('click');
    notificationPopupService.toggle = jest.fn();

    // Act
    component.toggleNotification(event);

    // Assert
    expect(component.notificationIconClass).toBe('');
    expect(notificationPopupService.toggle).toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    // Arrange
    component.notificationIconClassSubscription = signalRService.notificationIconClass.subscribe();

    // Act
    component.ngOnDestroy();

    // Assert
    expect(component.notificationIconClassSubscription.closed).toBeTruthy();
  });

  it('should handle empty user info response', async () => {
    // Arrange
    commonService.getNapUserInfo = jest.fn().mockResolvedValue(null);

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.isBlock).toBeTruthy();
    expect(component.menuItems).toEqual([]);
  });

  it('should sort menu items by display order', async () => {
    // Arrange
    const unsortedUserInfo = {
      userName: 'testUser',
      menuItem: [
        {
          id: 1,
          parentId: 0,
          displayOrder: 2,
          name: 'Menu 2'
        },
        {
          id: 2,
          parentId: 0,
          displayOrder: 1,
          name: 'Menu 1'
        }
      ]
    };
    commonService.getNapUserInfo = jest.fn().mockResolvedValue(unsortedUserInfo);

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.menuItems[0].name).toBe('Menu 1');
    expect(component.menuItems[1].name).toBe('Menu 2');
  });
});
