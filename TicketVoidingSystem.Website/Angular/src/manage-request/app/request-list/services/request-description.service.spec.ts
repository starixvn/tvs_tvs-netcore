import { TestBed } from '@angular/core/testing';
import { RequestDescriptionService } from './request-description.service';
import { CommonService } from '../../../../utility/services/common.service';
import { ClipboardService } from 'ngx-clipboard';
import { AppComponent } from '../../app.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { SportType } from '../../../../utility/constants/sport.constant';
import { FilterOddsTypeConstant } from '../../../../add-request/app/add-request/event-wrong-odds-sports-book/models/filter-wrong-odds-sports-book.model';
import { TVSRequestFilterBy } from '../../../../utility/constants/config';
import { CopyRequestInfoResponse } from '../../../../utility/models/copy-request-info.query';

class Helper {
  static readonly fakeRequestId = 123;
  static readonly fakeMatchId = 456;
  static readonly fakeRequestDetailId = 789;
  static readonly fakeIssueTypeId = 1;
  static readonly fakeSubIssueTypeId = 6;
  static readonly fakeCopyRequestInfoResponse = {
    requestInfo: {
      requestId: Helper.fakeRequestId,
      matchId: Helper.fakeMatchId,
      issueTypeId: Helper.fakeIssueTypeId,
      subIssueTypeId: Helper.fakeSubIssueTypeId,
      issueTypeName: 'Wrong Odds',
      subIssueTypeName: 'Wrong Handicap',
      leagueName: 'Premier League',
      matchEvent: 'Arsenal vs Chelsea',
      globalShowTime: new Date('2024-03-20T20:00:00'),
      voidFromTime: new Date('2024-03-20T20:00:00'),
      voidToTime: new Date('2024-03-20T21:00:00'),
      totalSingleCount: 5,
      totalParlayCount: 2,
      totalCancelCashOutCount: 1,
      liveStatus: ' live',
      filterBy: TVSRequestFilterBy.CHECK_TIME,
      isCheckedVar: true,
      sportType: SportType.SOCCER,
      liveScores: '2-1',
      mistakenBy: 'John',
      remark: 'Test remark',
      filterOddsType: FilterOddsTypeConstant.RANGE,
      fromOdds: '1.5',
      toOdds: '2.0',
      oddsValue: '1.5-2.0',
      correctOdds: '1.8',
      filterFavoriteType: 'h',
      favoriteValue: '1.5',
      actualMarket: '1.8',
      homeName: 'Arsenal',
      awayName: 'Chelsea',
      hdpValue: '-1.5',
      wrongMarket: 'Over 2.5',
      toOddsNotVoidHomeOver: '2.0',
      fromOddsNotVoidHomeOver: '1.5',
      toOddsNotVoidAwayUnder: '1.8',
      fromOddsNotVoidAwayUnder: '1.3',
      correctOddsHomeOver: '1.9',
      correctOddsAwayUnder: '1.7'
    },
    betTypeTickets: [
      {
        betTypeId: 1,
        betId: 1,
        betTypeName: '1X2',
        playerName: 'Player 1',
        ticketsCount: 2,
        inputtedRuns: '2.5'
      }
    ]
  } as CopyRequestInfoResponse;
}

describe('RequestDescriptionService', () => {
  let service: RequestDescriptionService;
  let commonService: CommonService;
  let clipboardService: ClipboardService;
  let appComponent: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestDescriptionService,
        {
          provide: CommonService,
          useValue: {
            copyRequestInfo: jest.fn()
          }
        },
        {
          provide: ClipboardService,
          useValue: {
            copyFromContent: jest.fn()
          }
        },
        {
          provide: AppComponent,
          useValue: {
            logAccessAction: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(RequestDescriptionService);
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    clipboardService = TestBed.inject(ClipboardService) as jest.Mocked<ClipboardService>;
    appComponent = TestBed.inject(AppComponent) as jest.Mocked<AppComponent>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('copyToClipboard', () => {
    it('should copy request info to clipboard', async () => {
      // Arrange
      (commonService.copyRequestInfo as jest.Mock).mockResolvedValue(Helper.fakeCopyRequestInfoResponse);
      window.alert = jest.fn();

      // Act
      await service.copyToClipboard(Helper.fakeRequestId, Helper.fakeMatchId);

      // Assert
      expect(commonService.copyRequestInfo).toHaveBeenCalledWith({
        requestId: Helper.fakeRequestId,
        matchId: Helper.fakeMatchId,
        requestDetailId: undefined
      });
      expect(clipboardService.copyFromContent).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(`Request No.${Helper.fakeRequestId} has been copied to clipboard.`);
      expect(appComponent.logAccessAction).toHaveBeenCalledWith('CopyRequestInfo');
    });
  });

  describe('createContentCopy', () => {
    it('should create content for REDUCED_OVER issue type', () => {
      // Arrange
      const response = { ...Helper.fakeCopyRequestInfoResponse };
      response.requestInfo.issueTypeId = Number(IssueTypeConstant.REDUCED_OVER);

      // Act
      const result = (service as any).createContentCopy(response);

      // Assert
      expect(result).toContain('Hi CSD, please void livetickets for us');
      expect(result).toContain('Request No: 123');
    });

    it('should create content for WRONG_ODDS_SPORTS_BOOK issue type', () => {
      // Arrange
      const response = { ...Helper.fakeCopyRequestInfoResponse };
      response.requestInfo.issueTypeId = Number(IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK);

      // Act
      const result = (service as any).createContentCopy(response);

      // Assert
      expect(result).toContain('Wrong Odds: 1.5 -> 2.0');
      expect(result).toContain('Correct Odds: 1.8');
    });

    it('should create content for WRONG_HDP issue type', () => {
      // Arrange
      const response = { ...Helper.fakeCopyRequestInfoResponse };
      response.requestInfo.issueTypeId = Number(IssueTypeConstant.WRONG_HDP);

      // Act
      const result = (service as any).createContentCopy(response);

      // Assert
      expect(result).toContain('Wrong: Arsenal -1.5');
      expect(result).toContain('Correct: Chelsea -1.5');
    });
  });

  describe('isShowLiveScores', () => {
    it('should return true for soccer match with wrong odds handicap', () => {
      // Arrange
      const requestInfo = { ...Helper.fakeCopyRequestInfoResponse.requestInfo };
      requestInfo.issueTypeId = Number(IssueTypeConstant.WRONG_ODDS);
      requestInfo.subIssueTypeId = 6; // handicapSubIssueTypeId
      requestInfo.sportType = SportType.SOCCER;

      // Act
      const result = (service as any).isShowLiveScores(requestInfo);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false for non-soccer match', () => {
      // Arrange
      const requestInfo = { ...Helper.fakeCopyRequestInfoResponse.requestInfo };
      requestInfo.sportType = SportType.BASKETBALL;

      // Act
      const result = (service as any).isShowLiveScores(requestInfo);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('generateLiveScores', () => {
    it('should return live scores when available', () => {
      // Arrange
      const requestInfo = { ...Helper.fakeCopyRequestInfoResponse.requestInfo };
      requestInfo.liveScores = '2-1';

      // Act
      const result = (service as any).generateLiveScores(requestInfo);

      // Assert
      expect(result).toContain('Live Score: 2-1');
    });

    it('should return empty string when live scores not available', () => {
      // Arrange
      const requestInfo = { ...Helper.fakeCopyRequestInfoResponse.requestInfo };
      requestInfo.liveScores = null;

      // Act
      const result = (service as any).generateLiveScores(requestInfo);

      // Assert
      expect(result).toBe('Live Score: \n');
    });
  });

  describe('generateRemark', () => {
    it('should return remark for supported issue types', () => {
      // Arrange
      const requestInfo = { ...Helper.fakeCopyRequestInfoResponse.requestInfo };
      requestInfo.issueTypeId = Number(IssueTypeConstant.TECHNICAL_ERROR);
      requestInfo.remark = 'Test remark';

      // Act
      const result = (service as any).generateRemark(requestInfo);

      // Assert
      expect(result).toContain('Test remark');
    });

    it('should return empty string for unsupported issue types', () => {
      // Arrange
      const requestInfo = { ...Helper.fakeCopyRequestInfoResponse.requestInfo };
      requestInfo.issueTypeId = 999; // Unsupported issue type
      requestInfo.remark = 'Test remark';

      // Act
      const result = (service as any).generateRemark(requestInfo);

      // Assert
      expect(result).toBe('');
    });
  });

  describe('iddShowOnlyIssueTypeName', () => {
    it('should return true when subIssueTypeName is empty', () => {
      // Arrange
      const response = { ...Helper.fakeCopyRequestInfoResponse };
      response.requestInfo.subIssueTypeName = '';

      // Act
      const result = (service as any).iddShowOnlyIssueTypeName(response);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when subIssueTypeName equals issueTypeName', () => {
      // Arrange
      const response = { ...Helper.fakeCopyRequestInfoResponse };
      response.requestInfo.subIssueTypeName = response.requestInfo.issueTypeName;

      // Act
      const result = (service as any).iddShowOnlyIssueTypeName(response);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when subIssueTypeName differs from issueTypeName', () => {
      // Arrange
      const response = { ...Helper.fakeCopyRequestInfoResponse };
      response.requestInfo.subIssueTypeName = 'Different Name';

      // Act
      const result = (service as any).iddShowOnlyIssueTypeName(response);

      // Assert
      expect(result).toBeFalsy();
    });
  });
}); 