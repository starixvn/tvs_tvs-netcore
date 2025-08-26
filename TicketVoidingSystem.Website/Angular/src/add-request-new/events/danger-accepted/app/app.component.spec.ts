import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationPopupService } from '../../../../utility/components/notification-popup/notification-popup.service';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { SignalRService } from '../../../../utility/services/signal-r.service.native';
import { RequestModel } from '../../../models/request.model';
import { AppComponent } from './app.component';
import { EventDangerAcceptedComponent } from './event-danger-accepted/event-danger-accepted.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TestingModule],
      providers: [
        {
          provide: SignalRService,
          useValue: {
            initializeConnection: jest.fn(),
            notificationChange: of([])
          }
        },
        {
          provide: NotificationPopupService,
          useValue: {
            isOpen$: of(false),
            toggle: jest.fn(),
            update: jest.fn(),
            get: jest.fn().mockResolvedValue([])
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.eventDangerAcceptedComponent = {} as EventDangerAcceptedComponent;
  });

  describe('Component Creation', () => {
    it('should create component successfully', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct selector', () => {
      expect(component.constructor.name).toBe('AppComponent');
    });
  });

  describe('Properties Initialization', () => {
    it('should initialize model as RequestModel instance', () => {
      expect(component.model).toBeInstanceOf(RequestModel);
    });

    it('should set issueTypeId to DANGER_ACCEPTED constant', () => {
      expect(component.issueTypeId).toBe(IssueTypeConstant.DANGER_ACCEPTED);
      expect(component.issueTypeId).toBe('1');
    });
  });

  describe('saveRequest Method', () => {
    it('should call eventDangerAcceptedComponent.saveRequest when saveRequest is called', async () => {
      // Arrange - mock đã được khởi tạo ở beforeEach
      component.eventDangerAcceptedComponent = {} as EventDangerAcceptedComponent;
      component.eventDangerAcceptedComponent.saveRequest = jest.fn();

      // Act
      await component.saveRequest();

      // Assert
      expect(component.eventDangerAcceptedComponent.saveRequest).toHaveBeenCalledTimes(1);
    });
  });
});
