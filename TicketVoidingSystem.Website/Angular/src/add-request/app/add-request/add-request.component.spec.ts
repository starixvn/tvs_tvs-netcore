import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { AddRequestComponent } from './add-request.component';
import { AddRequestStore } from './add-request.store';
import { CopyRequestInfoService } from './services/copy-request-info.service';
import { FilterModel } from './filter/filter.model';
import { RequestModel } from './models/request.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { of } from 'rxjs';
import { MatchModel } from '../../../utility/models/match.model';
import { OperatorInfo } from './others/others.model';
import { EventRedCardComponent } from './event-red-card/event-red-card.component';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeMatchId = 123;
  static readonly fakeUserId = 123;
  static readonly fakeRequestedBy = 'testUser';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeRequestModel = new RequestModel();
  static readonly fakeMatchModel: MatchModel = {
    matchId: 123,
    parentId: 456,
    matchCode: 'TEST123',
    leagueName: 'Test League',
    matchEvent: 'Test Event'
  } as MatchModel;
  static readonly fakeOperatorInfo: OperatorInfo = {
    matchId: 123,
    operatorId: 1,
    operatorType: 1,
    userName: 'operator1',
    groupName: 'Test Group'
  } as OperatorInfo;
}

describe('AddRequestComponent', () => {
  let component: AddRequestComponent;
  let fixture: ComponentFixture<AddRequestComponent>;
  let addRequestStore: AddRequestStore;
  let copyRequestInfoService: CopyRequestInfoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AddRequestStore,
        CopyRequestInfoService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRequestComponent);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    copyRequestInfoService = fixture.debugElement.injector.get(CopyRequestInfoService);
    component = fixture.componentInstance;
    document.body.innerHTML = '<div id="body" user-id="1" user-name="testUser"></div>';

    // Mock store observables
    jest.spyOn(addRequestStore, 'savingRequestStatus', 'get').mockReturnValue(of(false));
    jest.spyOn(addRequestStore, 'blockingUiStatus', 'get').mockReturnValue(of([false]));
    jest.spyOn(addRequestStore, 'getAbnormalFilterBySubject', 'get').mockReturnValue(of(0));

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        assign: jest.fn()
      },
      writable: true
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle saving request status changes', () => {
    // Arrange
    jest.spyOn(addRequestStore, 'savingRequestStatus', 'get').mockReturnValue(of(true));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.isDisabledSaveButton).toBeTruthy();
  });

  it('should handle blocking UI status changes', () => {
    // Arrange
    jest.spyOn(addRequestStore, 'blockingUiStatus', 'get').mockReturnValue(of([true]));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.isBlock).toBeTruthy();
  });

  it('should handle abnormal filter by changes', () => {
    // Arrange
    jest.spyOn(addRequestStore, 'getAbnormalFilterBySubject', 'get').mockReturnValue(of(1));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.abnormalFilterBy).toBe(1);
  });

  it('should update match ID', () => {
    // Arrange
    const matchId = 123;

    // Act
    component.updateMatchId(matchId);

    // Assert
    expect(component.matchId).toBe(matchId);
  });

  it('should update match info', () => {
    // Arrange
    const match = Helper.fakeMatchModel;

    // Act
    component.updateMatchInfo(match);

    // Assert
    expect(component.matchId).toBe(123);
    expect(component.parentMatchId).toBe(456);
  });

  it('should handle issue type change for abnormal bet', () => {
    // Arrange
    const issueTypeId = IssueTypeConstant.ABNORMAL_BET;
    document.body.setAttribute('user-name', 'testUser');
    component.model = new RequestModel();
    component.model.others = { decidedBy: '', remark: '' };

    // Act
    component.onChangeIssueType(issueTypeId);

    // Assert
    expect(component.model.others.decidedBy).toBe('testUser');
  });

  it('should handle issue type change for normal case', () => {
    // Arrange
    const issueTypeId = '1';

    // Act
    component.onChangeIssueType(issueTypeId);

    // Assert
    expect(component.model.others.decidedBy).toBe('');
  });

  it('should show others full fields for normal case', () => {
    // Arrange
    component.model.filter.issueTypeId = '1';

    // Act & Assert
    expect(component.isShowOthersFullFields()).toBeTruthy();
  });

  it('should not show others full fields for abnormal account', () => {
    // Arrange
    component.model.filter.issueTypeId = IssueTypeConstant.ABNORMAL_ACCOUNT;

    // Act & Assert
    expect(component.isShowOthersFullFields()).toBeFalsy();
  });

  it('should show copy info button for danger accepted', () => {
    // Arrange
    component.model.filter.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    component.model.filter.isVoided = true;

    // Act & Assert
    expect(component.isShowCopyInfoButton()).toBeTruthy();
  });

  it('should not show copy info button for non-voided request', () => {
    // Arrange
    component.model.filter.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    component.model.filter.isVoided = false;

    // Act & Assert
    expect(component.isShowCopyInfoButton()).toBeFalsy();
  });

  it('should handle copy email request info', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.matchId = Helper.fakeMatchId;
    component.model.others.operatorsList = [Helper.fakeOperatorInfo];
    addRequestStore.changeBlockingUiStatus = jest.fn();
    copyRequestInfoService.copyEmailRequestInfo = jest.fn();
    window.alert = jest.fn();

    // Act
    await component.copyEmailRequestInfo();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
    expect(copyRequestInfoService.copyEmailRequestInfo).toHaveBeenCalledWith(
      Helper.fakeRequestId,
      Helper.fakeMatchId,
      [Helper.fakeOperatorInfo]
    );
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    expect(window.alert).toHaveBeenCalledWith(`Request No.${Helper.fakeRequestId} has been copied to clipboard.`);
  });

  it('should handle copy lets talk request info', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.matchId = Helper.fakeMatchId;
    component.model.others.operatorsList = [Helper.fakeOperatorInfo];
    component.model.filter.issueTypeId = IssueTypeConstant.RED_CARD;
    component.eventRedCardComponent = {} as EventRedCardComponent;
    component.eventRedCardComponent.getLogInfoDetail = jest.fn().mockReturnValue([]);
    addRequestStore.changeBlockingUiStatus = jest.fn();
    copyRequestInfoService.copyLetsTalkRequestInfo = jest.fn();
    window.alert = jest.fn();

    // Act
    await component.copyLetsTalkRequestInfo();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
    expect(copyRequestInfoService.copyLetsTalkRequestInfo).toHaveBeenCalled();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    expect(window.alert).toHaveBeenCalledWith(`Request No.${Helper.fakeRequestId} has been copied to clipboard.`);
  });

  it('should update model with filter', () => {
    // Arrange
    const filterModel = Helper.fakeFilterModel;

    // Act
    component.updateModel(filterModel);

    // Assert
    expect(component.model.filter).toEqual(filterModel);
  });

  it('should get event label for abnormal account', () => {
    // Arrange
    component.model.filter.issueTypeId = IssueTypeConstant.ABNORMAL_ACCOUNT;

    // Act & Assert
    expect(component.getEventLabel()).toBe('Username');
  });

  it('should get event label for archived ticket', () => {
    // Arrange
    component.model.filter.issueTypeId = IssueTypeConstant.ARCHIVED_TICKET;

    // Act & Assert
    expect(component.getEventLabel()).toBe('Ticket Info');
  });

  it('should get event label for normal case', () => {
    // Arrange
    component.model.filter.issueTypeId = '1';

    // Act & Assert
    expect(component.getEventLabel()).toBe('Event');
  });
});
