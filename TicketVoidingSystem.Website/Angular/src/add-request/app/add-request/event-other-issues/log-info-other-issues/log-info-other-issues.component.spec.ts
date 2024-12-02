import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { OtherIssuesModel } from '../../models/event-other-issues.model';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { FilterOtherIssuesModel } from '../models/filter-other-isssues.model';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { LogInfoOtherIssuesComponent } from './log-info-other-issues.component';

class Helper {
  static readonly fakeOtherIssuesModel: OtherIssuesModel = {
    filterFromTransTime: '2024-10-08 09:44:46.363 PM',
    filterToTransTime: '2024-10-08 09:44:46.364 PM',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    subIssueTypeId: 1
  } as OtherIssuesModel;
  static readonly fakeLogInfoOtherIssues: LogInfoOtherIssues = {
    matchId: 1,
    filterOtherIssues: new FilterOtherIssuesModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
  } as LogInfoOtherIssues;
  static readonly fakeFilterOtherIssues: FilterOtherIssuesModel = {
    fromDateTime: '2024-10-08 09:44:46.361 PM',
    toDateTime: '2024-10-08 09:44:46.362 PM',
  } as FilterOtherIssuesModel;
}

describe('LogInfoOtherIssuesComponent', () => {
  let mockComponent: LogInfoOtherIssuesComponent;
  let mockModalService: ModalService;

  beforeEach(() => {
    mockModalService = new ModalService(new NgbModalConfig(null), null, null);
    mockComponent = new LogInfoOtherIssuesComponent(mockModalService);
    mockComponent.logInfo = Helper.fakeLogInfoOtherIssues;
  });

  it('LogInfoOtherIssuesComponent init should match snapshot', async () => {
    expect(mockComponent).toMatchSnapshot();
  });

  it('ngOnInit should update isShowValidation', async () => {
    [
      { isEdit: true, expected: true },
      { isEdit: false, expected: undefined }
    ].forEach((testCase) => {
      mockComponent.primitiveProps = new PrimitiveProperty();
      mockComponent.isEdit = testCase.isEdit;
      mockComponent.ngOnInit();

      expect(mockComponent.primitiveProps.isShowValidation).toBe(testCase.expected);
    });
  });

  it('openPopupTransIds should call #modalService.open', async () => {
    mockModalService.open = jest.fn();
    mockComponent.openPopupTransIds(1, '1,2');

    expect(mockModalService.open).toHaveBeenCalledTimes(1);
  });

  it('displayFullDateTimeFormat should return time type string', async () => {
    const actual = mockComponent.displayFullDateTimeFormat(new Date('2024-10-08 04:44:46.363 PM'));

    expect(actual).toBe('2024/10/08 04:44:46.363 PM');
  });

  it('clearDataValidation should update logInfo data to null', async () => {
    mockComponent.logInfo = Helper.fakeLogInfoOtherIssues;
    mockComponent.clearDataValidation();

    expect(mockComponent.logInfo.logInfoDetail).toBeNull();
    expect(mockComponent.logInfo.messageValidationLogInfo).toBeNull();
  });

  it('openPopupTransIds should call #modalService.open', async () => {
    mockModalService.open = jest.fn();
    mockComponent.openPopupTransIds(1, '1,2');

    expect(mockModalService.open).toHaveBeenCalledTimes(1);
  });

  it('countInfoContent should return count ticket', async () => {
    const actual = mockComponent.countInfoContent(1, 1, 1);

    expect(actual).toBe(' (Cash Out: <strong>1</strong>, Settled: <strong>1</strong>, Instantly Settled: <strong>1</strong>)');
  });

  it('displayTransId should return expected', async () => {
    [
      { count: 0, transId: '', expected: '-' },
      { count: 1, transId: '1', expected: '1' }
    ].forEach((testCase) => {
      const actual = mockComponent.displayTransId(testCase.count, testCase.transId);
      expect(actual).toBe(testCase.expected);
    });
  });

  it('displayTransId should return expected', async () => {
    [
      { cashOutCount: 0, settleCount: 0, instantlySettleCount: 0, expected: false },
      { cashOutCount: 0, settleCount: 0, instantlySettleCount: 1, expected: true },
      { cashOutCount: 0, settleCount: 1, instantlySettleCount: 0, expected: true },
      { cashOutCount: 1, settleCount: 0, instantlySettleCount: 0, expected: true },
    ].forEach((testCase) => {
      const actual = mockComponent.isShowCountInfo(testCase.cashOutCount, testCase.settleCount, testCase.instantlySettleCount);
      expect(actual).toBe(testCase.expected);
    });
  });

  it('showAffectedTicketsDetails should update affectedTicketsModel', async () => {
    mockComponent.logInfo = Helper.fakeLogInfoOtherIssues;
    mockComponent.logInfo.logInfoDetail = new LogInfoDetail();
    mockComponent.logInfo.logInfoDetail.logInfoTicketsJson = 'abc';
    mockComponent.affectedTicketsModel = new AffectedTicketsModel();
    mockComponent.issueTypeId = '1';
    mockComponent.showAffectedTicketsDetails();

    expect(mockComponent.affectedTicketsModel.isOpen).toBeTruthy();
    expect(mockComponent.affectedTicketsModel.issueTypeId).toBe(1);
    expect(mockComponent.affectedTicketsModel.logInfoTicketsJson).toBe('abc');
  });
});