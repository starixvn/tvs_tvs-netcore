import { TestBed } from '@angular/core/testing';
import { CopyRequestInfoService } from './copy-request-info.service';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { CommonService } from '../../../../utility/services/common.service';
import { AcceptType } from '../../../../utility/constants/config';
import { CopyRequestInfoResponse } from '../../../../utility/models/copy-request-info.query';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { OperatorInfo, OperatorType } from '../others/others.model';

describe('CopyRequestInfoService', () => {
  let service: CopyRequestInfoService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [CopyRequestInfoService]
    });

    service = TestBed.inject(CopyRequestInfoService);
    commonService = TestBed.inject(CommonService);

    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        write: jest.fn(),
        writeText: jest.fn()
      },
      writable: true
    });

    // Mock ClipboardItem
    (global as any).ClipboardItem = class ClipboardItem {
      constructor(data: { [key: string]: Blob }) {
        return data;
      }
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('copyEmailRequestInfo', () => {
    it('should copy email request info to clipboard', async () => {
      // Arrange
      const requestId = 123;
      const matchId = 456;
      const operatorsList: OperatorInfo[] = [
        { 
          operatorId: 1, 
          userName: 'Trader1', 
          operatorType: OperatorType.TRADER,
          matchId: matchId,
          groupName: 'Group A'
        },
        { 
          operatorId: 2, 
          userName: 'Suspender1', 
          operatorType: OperatorType.SUSPENDER,
          matchId: matchId,
          groupName: 'Group A'
        }
      ];

      const mockResponse: CopyRequestInfoResponse = {
        requestInfo: {
          requestId: requestId,
          matchId: matchId,
          globalShowTime: new Date('2024-03-20T10:00:00'),
          leagueName: 'Premier League',
          matchEvent: 'Team A vs Team B',
          operators: operatorsList,
          provider: 'Provider A',
          issueTypeName: 'Issue Type',
          subIssueTypeName: 'Sub Issue Type',
          requestedBy: 'User A',
          isHasSettledTicket: true,
          remark: 'Test remark',
          filterBy: 'filter1',
          subIssueTypeId: 1,
          issueTypeId: 1,
          actionId: 'action1',
          actionName: 'Action 1',
          actionType: 1,
          actionTypeName: 'Action Type 1',
          actionStatus: 1,
          actionStatusName: 'Action Status 1',
          actionCreatedBy: 1,
          actionCreatedByName: 'Creator 1',
          actionCreatedDate: new Date('2024-03-20T10:00:00'),
          actionUpdatedBy: 1,
          actionUpdatedByName: 'Updater 1',
          actionUpdatedDate: new Date('2024-03-20T10:00:00')
        }
      } as unknown as CopyRequestInfoResponse;

      jest.spyOn(commonService, 'copyRequestInfo').mockResolvedValue(mockResponse);
      jest.spyOn(navigator.clipboard, 'write');

      // Act
      await service.copyEmailRequestInfo(requestId, matchId, operatorsList);

      // Assert
      expect(commonService.copyRequestInfo).toHaveBeenCalledWith({
        requestId,
        matchId
      });
      expect(navigator.clipboard.write).toHaveBeenCalled();
    });
  });

  describe('copyLetsTalkRequestInfo', () => {
    it('should copy LetsTalk request info to clipboard', async () => {
      // Arrange
      const requestId = 123;
      const matchId = 456;
      const operatorsList: OperatorInfo[] = [
        { 
          operatorId: 1, 
          userName: 'Trader1', 
          operatorType: OperatorType.TRADER,
          matchId: matchId,
          groupName: 'Group A'
        },
        { 
          operatorId: 2, 
          userName: 'Suspender1', 
          operatorType: OperatorType.SUSPENDER,
          matchId: matchId,
          groupName: 'Group A'
        }
      ];

      const logInfoDetails: LogInfoDetail[] = [{
        matchId: matchId,
        voidFromTime: new Date('2024-03-20T10:00:00'),
        voidToTime: new Date('2024-03-20T11:00:00'),
        transVoidToTime: new Date('2024-03-20T11:00:00'),
        liveScores: '1-0',
        singleCount: 5,
        mainParlayCount: 2,
        cancelCashOutCount: 1,
        cashOutCount: 0,
        settleCount: 0,
        highlightAcceptType: AcceptType.AUTO_ACCEPT,
        highlightMinTime: new Date('2024-03-20T10:30:00'),
        highlightMaxTime: new Date('2024-03-20T11:00:00'),
        highlightMinTimeValue: 0,
        highlightMaxTimeValue: 0
      } as unknown as LogInfoDetail];

      const mockResponse: CopyRequestInfoResponse = {
        requestInfo: {
          requestId: requestId,
          matchId: matchId,
          globalShowTime: new Date('2024-03-20T10:00:00'),
          leagueName: 'Premier League',
          matchEvent: 'Team A vs Team B',
          operators: operatorsList,
          provider: 'Provider A',
          issueTypeName: 'Issue Type',
          subIssueTypeName: 'Sub Issue Type',
          requestedBy: 'User A',
          isHasSettledTicket: true,
          remark: 'Test remark',
          filterBy: 'filter1',
          subIssueTypeId: 1,
          issueTypeId: 1,
          actionId: 'action1',
          actionName: 'Action 1',
          actionType: 1,
          actionTypeName: 'Action Type 1',
          actionStatus: 1,
          actionStatusName: 'Action Status 1',
          actionCreatedBy: 1,
          actionCreatedByName: 'Creator 1',
          actionCreatedDate: new Date('2024-03-20T10:00:00'),
          actionUpdatedBy: 1,
          actionUpdatedByName: 'Updater 1',
          actionUpdatedDate: new Date('2024-03-20T10:00:00')
        }
      } as unknown as CopyRequestInfoResponse;

      jest.spyOn(commonService, 'copyRequestInfo').mockResolvedValue(mockResponse);
      jest.spyOn(navigator.clipboard, 'writeText');

      // Act
      await service.copyLetsTalkRequestInfo(requestId, matchId, logInfoDetails, operatorsList);

      // Assert
      expect(commonService.copyRequestInfo).toHaveBeenCalledWith({
        requestId,
        matchId,
        logInfoDetails
      });
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  describe('getOperatorName', () => {
    it('should return correct operator name for TRADER type', () => {
      // Arrange
      const matchId = 456;
      const selectedOperator: OperatorInfo[] = [
        { 
          operatorId: 1, 
          userName: 'Trader1', 
          operatorType: OperatorType.TRADER,
          matchId: matchId,
          groupName: 'Group A'
        }
      ];
      const operatorsList: OperatorInfo[] = [
        { 
          operatorId: 1, 
          userName: 'Trader1', 
          operatorType: OperatorType.TRADER,
          matchId: matchId,
          groupName: 'Group A'
        },
        { 
          operatorId: 2, 
          userName: 'Suspender1', 
          operatorType: OperatorType.SUSPENDER,
          matchId: matchId,
          groupName: 'Group A'
        }
      ];

      // Act
      const result = (service as any).getOperatorName(selectedOperator, operatorsList, OperatorType.TRADER);

      // Assert
      expect(result).toBe('Trader1');
    });

    it('should return empty string when no matching operator found', () => {
      // Arrange
      const matchId = 456;
      const selectedOperator: OperatorInfo[] = [
        { 
          operatorId: 3, 
          userName: 'Trader2', 
          operatorType: OperatorType.TRADER,
          matchId: matchId,
          groupName: 'Group A'
        }
      ];
      const operatorsList: OperatorInfo[] = [
        { 
          operatorId: 1, 
          userName: 'Trader1', 
          operatorType: OperatorType.TRADER,
          matchId: matchId,
          groupName: 'Group A'
        },
        { 
          operatorId: 2, 
          userName: 'Suspender1', 
          operatorType: OperatorType.SUSPENDER,
          matchId: matchId,
          groupName: 'Group A'
        }
      ];

      // Act
      const result = (service as any).getOperatorName(selectedOperator, operatorsList, OperatorType.TRADER);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('getAcceptType', () => {
    it('should return AA for AUTO_ACCEPT', () => {
      // Act
      const result = (service as any).getAcceptType(AcceptType.AUTO_ACCEPT);

      // Assert
      expect(result).toBe('AA');
    });

    it('should return SA for SECOND_ACCEPT', () => {
      // Act
      const result = (service as any).getAcceptType(AcceptType.SECOND_ACCEPT);

      // Assert
      expect(result).toBe('SA');
    });

    it('should return PA for PENDING_ACCEPT', () => {
      // Act
      const result = (service as any).getAcceptType(AcceptType.PENDING_ACCEPT);

      // Assert
      expect(result).toBe('PA');
    });

    it('should return empty string for unknown accept type', () => {
      // Act
      const result = (service as any).getAcceptType(999);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('getMinTime', () => {
    it('should return formatted time with accept type when both highlightAcceptType and highlightMinTime exist', () => {
      // Arrange
      const logInfoDetail: LogInfoDetail = {
        matchId: 456,
        highlightAcceptType: AcceptType.AUTO_ACCEPT,
        highlightMinTime: new Date('2024-03-20T10:30:00'),
        voidFromTime: new Date('2024-03-20T10:00:00'),
        voidToTime: new Date('2024-03-20T11:00:00'),
        transVoidToTime: new Date('2024-03-20T11:00:00'),
        liveScores: '1-0',
        singleCount: 5,
        mainParlayCount: 2,
        cancelCashOutCount: 1,
        cashOutCount: 0,
        settleCount: 0,
        highlightMaxTime: new Date('2024-03-20T11:00:00'),
        highlightMinTimeValue: 0,
        highlightMaxTimeValue: 0
      } as unknown as LogInfoDetail;

      // Act
      const result = (service as any).getMinTime(logInfoDetail);

      // Assert
      expect(result).toBe('10:30:00.000 AM - AA');
    });

    it('should return dash when highlightAcceptType or highlightMinTime is missing', () => {
      // Arrange
      const logInfoDetail: LogInfoDetail = {
        matchId: 456,
        highlightAcceptType: null,
        highlightMinTime: null,
        voidFromTime: new Date('2024-03-20T10:00:00'),
        voidToTime: new Date('2024-03-20T11:00:00'),
        transVoidToTime: new Date('2024-03-20T11:00:00'),
        liveScores: '1-0',
        singleCount: 5,
        mainParlayCount: 2,
        cancelCashOutCount: 1,
        cashOutCount: 0,
        settleCount: 0,
        highlightMaxTime: new Date('2024-03-20T11:00:00'),
        highlightMinTimeValue: 0,
        highlightMaxTimeValue: 0
      } as unknown as LogInfoDetail;

      // Act
      const result = (service as any).getMinTime(logInfoDetail);

      // Assert
      expect(result).toBe('-');
    });
  });
});
