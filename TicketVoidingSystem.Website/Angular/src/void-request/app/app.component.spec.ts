import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestDetailModel, RequestDetailViewModel } from '../../add-request-new/models/request-detail.model';
import { IssueTypeConstant } from '../../utility/constants/issue-type.constant';
import { TestingModule } from '../../utility/modules/testing.module';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

jest.mock('../../utility/services/signal-r.service.native');

// Mock SignalRService với các EventEmitter cần thiết
const mockSignalRService = {
  hubConnection: null,
  requestStatusChange: new EventEmitter(),
  notificationChange: new EventEmitter(),
  notificationIconClass: new EventEmitter(),
  toastr: null,
  initializeConnection: jest.fn().mockResolvedValue(undefined),
  registerEvent: jest.fn(),
  registerReceiveRequestStatusModelEvent: jest.fn(),
  registerReceiveNotification: jest.fn(),
  configToastr: jest.fn()
};

class Helper {
  static readonly url = 'http://localhost:60196/415421';
  static readonly fakeRequestId = 50121;
  static readonly fakeRequestDetailModel: RequestDetailModel = {
    actionId: 1,
    decidedBy: null,
    isTest: false,
    isVoided: false,
    issueTypeId: 11,
    mistakenBy: null,
    operators: [],
    provider: null,
    remark: 'test',
    requestedBy: "sa",
    source: null,
    sportType: 2,
    voidedBy: null,
    userId: 0,
    requestId: 1,
    briefInfoNote: ''
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: Helper.fakeRequestId,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    playerNames: [],
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    redCardModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: [],
    duplicateTicketsModel: null,
  };
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    // Setup mock cho SignalRService
    (SignalRService as jest.MockedClass<typeof SignalRService>).mockImplementation(() => mockSignalRService as any);

    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AppService, 
        { provide: SignalRService, useValue: mockSignalRService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('AppComponent should init match snapshot', async () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('isLikelyVoidDangerAccepted should return false for abnormal bet', async () => {
    component.requestDetail = Helper.fakeRequestDetailViewModel;
    component.requestDetail.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET);

    const actual = component.isLikelyVoidDangerAccepted();

    expect(actual).toBeFalsy();
  });

  it('isLikelyVoidDangerAccepted should return false when request is null', async () => {
    component.requestDetail = Helper.fakeRequestDetailViewModel;
    component.requestDetail.request = null;

    const actual = component.isLikelyVoidDangerAccepted();

    expect(actual).toBeFalsy();
  });

  it('isLikelyVoidDangerAccepted should return true for danger accepted', async () => {
    component.issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);

    const actual = component.isLikelyVoidDangerAccepted();

    expect(actual).toBeTruthy();
  });

  it('should handle null requestDetail', async () => {
    component.requestDetail = null;
    const actual = component.isLikelyVoidDangerAccepted();
    expect(actual).toBeFalsy();
  });
});