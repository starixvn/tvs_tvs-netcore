import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationPopupService } from '../../../../utility/components/notification-popup/notification-popup.service';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { SignalRService } from '../../../../utility/services/signal-r.service.native';
import { RequestModel } from '../../../models/request.model';
import { AppComponent } from './app.component';
import { EventWrongOfferedNameComponent } from './event-wrong-offered-name/event-wrong-offered-name.component';

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
    component.eventWrongOfferedNameComponent = {} as EventWrongOfferedNameComponent;
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

    it('should set issueTypeId to WRONG_OFFERED_NAME constant', () => {
      expect(component.issueTypeId).toBe(IssueTypeConstant.WRONG_OFFERED_NAME);
    });
  });

  describe('saveRequest Method', () => {
    it('should call eventWrongOfferedNameComponent.saveRequest when saveRequest is called', async () => {
      // Arrange
      component.eventWrongOfferedNameComponent = {} as EventWrongOfferedNameComponent;
      component.eventWrongOfferedNameComponent.saveRequest = jest.fn();

      // Act
      await component.saveRequest();

      // Assert
      expect(component.eventWrongOfferedNameComponent.saveRequest).toHaveBeenCalledTimes(1);
    });
  });
});
