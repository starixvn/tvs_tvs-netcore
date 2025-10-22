import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationPopupService } from '../../../../utility/components/notification-popup/notification-popup.service';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { SignalRService } from '../../../../utility/services/signal-r.service.native';
import { RequestModel } from '../../../models/request.model';
import { AppComponent } from './app.component';
import { EventAbnormalBetComponent } from './event-abnormal-bet/event-abnormal-bet.component';

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
    component.eventAbnormalBetComponent = {} as EventAbnormalBetComponent;
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

    it('should set issueTypeId to ABNORMAL_BET constant', () => {
      expect(component.issueTypeId).toBe(IssueTypeConstant.ABNORMAL_BET);
      expect(component.issueTypeId).toBe('11');
    });
  });

  describe('ngOnInit Method', () => {
    beforeEach(() => {
      // Mock document.getElementById
      document.getElementById = jest.fn();
    });

    it('should initialize SignalR connection when ngOnInit is called', async () => {
      const signalRService = TestBed.inject(SignalRService);
      document.getElementById = jest.fn().mockReturnValue(null);

      await component.ngOnInit();

      expect(signalRService.initializeConnection).toHaveBeenCalledTimes(1);
    });

    it('should not process external data when element is null', async () => {
      document.getElementById = jest.fn().mockReturnValue(null);
      const signalRService = TestBed.inject(SignalRService);

      await component.ngOnInit();

      expect(signalRService.initializeConnection).toHaveBeenCalledTimes(1);
      expect(component.isExternalUrl).toBe(false);
    });

    it('should process external data when element exists', async () => {
      const mockRequestData = {
        issueTypeId: '11',
        subIssueTypeId: '1',
        actionId: '2',
        isTest: true,
        transIds: '123,456'
      };
      
      const mockElement = {
        value: JSON.stringify(mockRequestData)
      } as HTMLInputElement;
      
      document.getElementById = jest.fn().mockReturnValue(mockElement);
      const signalRService = TestBed.inject(SignalRService);

      await component.ngOnInit();

      expect(signalRService.initializeConnection).toHaveBeenCalledTimes(1);
      expect(component.isExternalUrl).toBe(true);
      expect(component.model.filter.issueTypeId).toBe('11');
      expect(component.model.filter.subIssueTypeId).toBe('1');
      expect(component.model.filter.action).toBe('2');
      expect(component.model.filter.isTest).toBe(true);
      expect(component.model.abnormalBetModel.transIds).toBe('123,456');
    });
  });

  describe('mapModel Method', () => {
    it('should map all properties from InitializedRequestModel to model', () => {
      const requestModel = {
        issueTypeId: '11',
        subIssueTypeId: '2',
        actionId: '3',
        isTest: false,
        transIds: '789,101112'
      };

      component['mapModel'](requestModel);

      expect(component.model.filter.issueTypeId).toBe('11');
      expect(component.model.filter.subIssueTypeId).toBe('2');
      expect(component.model.filter.action).toBe('3');
      expect(component.model.filter.isTest).toBe(false);
      expect(component.model.abnormalBetModel.transIds).toBe('789,101112');
    });

    it('should handle empty transIds string', () => {
      const requestModel = {
        issueTypeId: '11',
        subIssueTypeId: '2',
        actionId: '3',
        isTest: true,
        transIds: ''
      };

      component['mapModel'](requestModel);

      expect(component.model.filter.issueTypeId).toBe('11');
      expect(component.model.filter.subIssueTypeId).toBe('2');
      expect(component.model.filter.action).toBe('3');
      expect(component.model.filter.isTest).toBe(true);
      expect(component.model.abnormalBetModel.transIds).toBe('');
    });

    it('should handle null/undefined values', () => {
      const requestModel = {
        issueTypeId: null,
        subIssueTypeId: undefined,
        actionId: '',
        isTest: false,
        transIds: null
      };

      component['mapModel'](requestModel);

      expect(component.model.filter.issueTypeId).toBe(null);
      expect(component.model.filter.subIssueTypeId).toBe(undefined);
      expect(component.model.filter.action).toBe('');
      expect(component.model.filter.isTest).toBe(false);
      expect(component.model.abnormalBetModel.transIds).toBe(null);
    });
  });

  describe('saveRequest Method', () => {
    it('should call eventAbnormalBetComponent.saveRequest when saveRequest is called', async () => {
      component.eventAbnormalBetComponent = {} as EventAbnormalBetComponent;
      component.eventAbnormalBetComponent.saveRequest = jest.fn();

      // Act
      await component.saveRequest();

      // Assert
      expect(component.eventAbnormalBetComponent.saveRequest).toHaveBeenCalledTimes(1);
    });
  });
});
