import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationPopupService } from '../../../../utility/components/notification-popup/notification-popup.service';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { SignalRService } from '../../../../utility/services/signal-r.service.native';
import { RequestModel } from '../../../models/request.model';
import { AppComponent } from './app.component';
import { EventTechnicalErrorComponent } from './event-technical-error/event-technical-error.component';

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
    component.eventTechnicalErrorComponent = {} as EventTechnicalErrorComponent;
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

    it('should set issueTypeId to TECHNICAL_ERROR constant', () => {
      expect(component.issueTypeId).toBe(IssueTypeConstant.TECHNICAL_ERROR);
      expect(component.issueTypeId).toBe('24');
    });
  });

  describe('saveRequest Method', () => {
    it('should call eventTechnicalErrorComponent.saveRequest when saveRequest is called', async () => {
      // Arrange - mock đã được khởi tạo ở beforeEach
      component.eventTechnicalErrorComponent = {} as EventTechnicalErrorComponent;
      component.eventTechnicalErrorComponent.saveRequest = jest.fn();

      // Act
      await component.saveRequest();

      // Assert
      expect(component.eventTechnicalErrorComponent.saveRequest).toHaveBeenCalledTimes(1);
    });
  });
});
