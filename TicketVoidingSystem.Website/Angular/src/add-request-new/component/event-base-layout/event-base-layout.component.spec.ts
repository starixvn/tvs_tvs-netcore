import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { EventBaseLayoutComponent } from './event-base-layout.component';
import { RequestModel } from '../../events/models/request.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { Selection } from '../../../utility/models/selection.model';
import { AddRequestStore } from '../../events/services/add-request.store';
import { EditRequestService } from '../../events/services/edit-request/edit-request.service';
import { CopyRequestInfoService } from '../../events/services/copy-request-info.service';
import { EventBaseService } from './event-base.service';
import { CommonService } from '../../../utility/services/common.service';
import { LogAnalysisService } from '../../events/services/log-analysis.service';
import { SignalRService } from '../../../utility/services/signal-r.service.native';
import { StaticService } from '../../../utility/services/static.service';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { FilterComponent } from '../filter/filter.component';


class Helper {
  static getFakeRequestModel(): RequestModel {
    return {
      filter: {
        issueTypeId: '1',
        isVoided: true
      },
      eventTicket14Model: {},
      others: {
        operatorsList: []
      },
      eventDetail: {
        matchId: 123
      }
    } as unknown as RequestModel;
  }

  static getFakeFilterModel(): FilterModel {
    return {
      issueTypeId: '1'
    } as FilterModel;
  }

  static getFakeIssueTypes(): IssueTypes {
    return new IssueTypes([]);
  }

  static getFakeOriginActions(): Selection[] {
    return [
      { value: '1', name: 'Action 1' },
      { value: '2', name: 'Action 2' }
    ];
  }
}

describe('EventBaseLayoutComponent', () => {
  let component: EventBaseLayoutComponent;
  let fixture: ComponentFixture<EventBaseLayoutComponent>;
  let addRequestStore: AddRequestStore;
  let editRequestService: EditRequestService;
  let copyRequestInfoService: CopyRequestInfoService;
  let eventBaseService: EventBaseService;
  let commonService: CommonService;
  let logAnalysisService: LogAnalysisService;
  let signalRService: SignalRService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        {
          provide: SignalRService,
          useValue: {
            initializeConnection: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventBaseLayoutComponent);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    editRequestService = fixture.debugElement.injector.get(EditRequestService);
    copyRequestInfoService = fixture.debugElement.injector.get(CopyRequestInfoService);
    eventBaseService = fixture.debugElement.injector.get(EventBaseService);
    commonService = fixture.debugElement.injector.get(CommonService);
    logAnalysisService = fixture.debugElement.injector.get(LogAnalysisService);
    signalRService = fixture.debugElement.injector.get(SignalRService);
    component = fixture.componentInstance;

    // Set default input values
    component.model = Helper.getFakeRequestModel();
    component.issueTypeId = '1';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      jest.spyOn(component, 'initBaseData').mockImplementation(async () => {
        component.isLoadingData = false;
      });
      jest.spyOn(component, 'checkShowCopyInfoButton').mockImplementation();
      jest.spyOn(signalRService, 'initializeConnection').mockImplementation();
      jest.spyOn(logAnalysisService, 'writeLogAccessFunction').mockImplementation();
      
      // Mock the savingRequestStatus as an Observable with subscribe method
      const mockSavingRequestStatus = {
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() })
      };
      jest.spyOn(addRequestStore, 'savingRequestStatus', 'get').mockReturnValue(mockSavingRequestStatus as any);
    });

    it('should initialize component correctly', async () => {
      await component.ngOnInit();

      expect(component.isLoadingData).toBeFalsy();
      expect(component.initBaseData).toHaveBeenCalled();
      expect(component.checkShowCopyInfoButton).toHaveBeenCalled();
      expect(signalRService.initializeConnection).toHaveBeenCalled();
      expect(logAnalysisService.writeLogAccessFunction).toHaveBeenCalledWith(component.isEdit, component.issueTypeId, component.accessIssueTypeCount);
    });

    it('should subscribe to savingRequestStatus', async () => {
      await component.ngOnInit();

      expect(addRequestStore.savingRequestStatus.subscribe).toHaveBeenCalled();
    });
  });

  describe('initBaseData', () => {
    beforeEach(() => {
      jest.spyOn(component, 'initStaticData').mockImplementation();
      jest.spyOn(component, 'runAsyncData').mockResolvedValue();
    });

    it('should initialize base data correctly', async () => {
      await component.initBaseData();

      expect(component.initStaticData).toHaveBeenCalled();
      expect(component.runAsyncData).toHaveBeenCalled();
      expect(component.isLoadingData).toBeFalsy();
    });
  });

  describe('runAsyncData', () => {
    beforeEach(() => {
      jest.spyOn(eventBaseService, 'getSubIssueTypes').mockResolvedValue(new IssueTypes([]));
      jest.spyOn(commonService, 'getVoidActions').mockResolvedValue(Helper.getFakeOriginActions());
      jest.spyOn(editRequestService, 'getDataEditRequest').mockResolvedValue(null);
    });

    it('should load async data for add request', async () => {
      component.isEdit = false;
      await component.runAsyncData();

      expect(eventBaseService.getSubIssueTypes).toHaveBeenCalledWith(Number(component.issueTypeId));
      expect(commonService.getVoidActions).toHaveBeenCalled();
      expect(editRequestService.getDataEditRequest).not.toHaveBeenCalled();
      expect(component.originActions).toEqual(Helper.getFakeOriginActions());
      expect(component.issueTypes).toBeInstanceOf(IssueTypes);
    });

    it('should load async data for edit request', async () => {
      component.isEdit = true;
      component.requestId = 123;
      await component.runAsyncData();

      expect(eventBaseService.getSubIssueTypes).toHaveBeenCalledWith(Number(component.issueTypeId));
      expect(commonService.getVoidActions).toHaveBeenCalled();
      expect(editRequestService.getDataEditRequest).toHaveBeenCalledWith(component.requestId, component.model);
    });
  });

  describe('initStaticData', () => {
    beforeEach(() => {
      jest.spyOn(editRequestService, 'isActionEditRequest').mockReturnValue(false);
      jest.spyOn(editRequestService, 'getRequestId').mockReturnValue(123);
    });

    it('should initialize static data for add request', () => {
      jest.spyOn(editRequestService, 'isActionEditRequest').mockReturnValue(false);
      component.initStaticData();

      expect(component.isEdit).toBeFalsy();
      expect(component.title).toBe('Home / Manage Request / Add Request');
    });

    it('should initialize static data for edit request', () => {
      jest.spyOn(editRequestService, 'isActionEditRequest').mockReturnValue(true);
      jest.spyOn(editRequestService, 'getRequestId').mockReturnValue(123);
      component.initStaticData();

      expect(component.isEdit).toBeTruthy();
      expect(component.requestId).toBe(123);
      expect(component.title).toBe('Home / Manage Request / Edit Request - 123');
    });
  });

  describe('checkShowCopyInfoButton', () => {
    it('should show copy info button when conditions are met', () => {
      component.model.filter.isVoided = true;
      component.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;

      component.checkShowCopyInfoButton();

      expect(component.showCopyInfoButtons).toBeTruthy();
    });

    it('should not show copy info button when isVoided is false', () => {
      component.model.filter.isVoided = false;
      component.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;

      component.checkShowCopyInfoButton();

      expect(component.showCopyInfoButtons).toBeFalsy();
    });

    it('should not show copy info button when issueTypeId is not in allowed list', () => {
      component.model.filter.isVoided = true;
      component.issueTypeId = '999';

      component.checkShowCopyInfoButton();

      expect(component.showCopyInfoButtons).toBeFalsy();
    });
  });

  describe('ngAfterViewInit', () => {
    beforeEach(() => {
      component.filterComponent = {
        checkValidSubIssueType: jest.fn()
      } as unknown as FilterComponent;
      
      // Mock the getCheckValidSubIssueTypeInFilterSubject as an Observable with subscribe method
      const mockCheckValidSubject = {
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() })
      };
      jest.spyOn(addRequestStore, 'getCheckValidSubIssueTypeInFilterSubject', 'get').mockReturnValue(mockCheckValidSubject as any);
    });
    it('should subscribe to checkValidSubIssueTypeInFilterSubject', () => {
      component.ngAfterViewInit();

      expect(addRequestStore.getCheckValidSubIssueTypeInFilterSubject.subscribe).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should handle null subscriptions gracefully', () => {
      component.savingRequestSubscription = null;
      component.checkValidSubIssueTypeInFilterSubscription = null;
      component.abnormalFilterBySubscription = null;

      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('onSaveRequest', () => {
    beforeEach(() => {
      jest.spyOn(addRequestStore, 'changeBlockingUiStatus').mockImplementation();
      jest.spyOn(component.saveRequest, 'emit').mockImplementation();
    });

    it('should handle save request correctly', async () => {
      await component.onSaveRequest();

      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(component.isDisabledSaveButton).toBeTruthy();
      expect(component.saveRequest.emit).toHaveBeenCalled();
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('getEventLabel', () => {
    beforeEach(() => {
      jest.spyOn(StaticService, 'isAbnormalAccount').mockReturnValue(false);
      jest.spyOn(StaticService, 'isArchivedTicket').mockReturnValue(false);
      jest.spyOn(StaticService, 'isRecoverTicket').mockReturnValue(false);
    });

    it('should return "Username" for abnormal account', () => {
      jest.spyOn(StaticService, 'isAbnormalAccount').mockReturnValue(true);

      const result = component.getEventLabel();

      expect(result).toBe('Username');
    });

    it('should return "Ticket Info" for archived ticket', () => {
      jest.spyOn(StaticService, 'isArchivedTicket').mockReturnValue(true);

      const result = component.getEventLabel();

      expect(result).toBe('Ticket Info');
    });

    it('should return "Ticket Info" for recover ticket', () => {
      jest.spyOn(StaticService, 'isRecoverTicket').mockReturnValue(true);

      const result = component.getEventLabel();

      expect(result).toBe('Ticket Info');
    });

    it('should return "Event" for normal cases', () => {
      const result = component.getEventLabel();

      expect(result).toBe('Event');
    });
  });

  describe('onCopyEmailRequestInfo', () => {
    beforeEach(() => {
      jest.spyOn(addRequestStore, 'changeBlockingUiStatus').mockImplementation();
      jest.spyOn(copyRequestInfoService, 'copyEmailRequestInfo').mockImplementation();
      jest.spyOn(window, 'alert').mockImplementation();
      component.requestId = 123;
    });

    it('should copy email request info correctly', async () => {
      await component.onCopyEmailRequestInfo();

      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(copyRequestInfoService.copyEmailRequestInfo).toHaveBeenCalledWith(
        component.requestId,
        component.model.eventDetail.matchId,
        component.model.others.operatorsList
      );
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      expect(window.alert).toHaveBeenCalledWith('Request No.123 has been copied to clipboard.');
    });
  });

  describe('backToManagePage', () => {
    beforeEach(() => {
      jest.spyOn(eventBaseService, 'backToManagePage').mockImplementation();
    });

    it('should call eventBaseService.backToManagePage', () => {
      component.backToManagePage();

      expect(eventBaseService.backToManagePage).toHaveBeenCalled();
    });
  });

  describe('onCopyLetsTalkRequestInfo', () => {
    beforeEach(() => {
      jest.spyOn(addRequestStore, 'changeBlockingUiStatus').mockImplementation();
      jest.spyOn(component.copyLetsTalkRequestInfo, 'emit').mockImplementation();
    });

    it('should handle copy lets talk request info correctly', () => {
      component.onCopyLetsTalkRequestInfo();

      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(component.copyLetsTalkRequestInfo.emit).toHaveBeenCalled();
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('contextData getter', () => {
    it('should return correct context data', () => {
      component.model = Helper.getFakeRequestModel();
      component.isEdit = true;
      component.requestId = 123;
      component.model.filter = Helper.getFakeFilterModel();

      const result = component.contextData;

      expect(result).toEqual({
        eventModel: component.model.eventTicket14Model,
        otherModel: component.model.others,
        isEdit: component.isEdit,
        requestId: component.requestId,
        filterModel: component.model.filter
      });
    });
  });
}); 