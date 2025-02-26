import { AcceptType, TVSRequestFilterBy } from '../../../utility/constants/config';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { LogInfoComponent } from './log-info.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';

class Helper {
  static readonly fakeLogInfoDetail: LogInfoDetail =
    {
      matchId: 12345,
      liveScores: '0 - 0',
      voidFromTime: new Date('2020-11-06 00:00:00.000'),
      voidToTime: new Date('2020-11-06 00:00:00.000'),
      singleCount: 1,
      mainParlayCount: 1,
      cashOutCount: 3,
      settleCount: 1,
      scoreOfMatch: '',
      scoreNormalTicket: '',
      instantlySettleCount: 2,
      cancelCashOutCount: 1
    } as LogInfoDetail;
}

describe('LogInfoComponent', () => {
  let component: LogInfoComponent;
  let fixture: ComponentFixture<LogInfoComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(LogInfoComponent);
    component = fixture.componentInstance;
    component.logInfoDetails = [Helper.fakeLogInfoDetail];
  });

  it('#LogInfoComponent init should match snapshot', async () => {
    expect(fixture).toMatchSnapshot();
  });

  it('#displayScoreLabel should be return "Wrong Score: "', async () => {
    component.isWrongScore = jest.fn().mockReturnValue(true);
    [
      TVSRequestFilterBy.TRANS_TIME
    ].forEach(x => {
      const actual = component.displayScoreLabel(x);
      expect(actual).toBe('Wrong Score: ');
    });
  });

  it('#displayScoreLabel should be return "Live Score: "', async () => {
    const actual = component.displayScoreLabel(TVSRequestFilterBy.CHECK_TIME);

    expect(actual).toBe('Live Score: ');
  });

  it('#displayVoidTimeLabel should be return Void Trans Time: ', () => {
    component.issueTypeId = Number(IssueTypeConstant.WRONG_SCORE);
    [
      TVSRequestFilterBy.TRANS_TIME,
      TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME
    ].forEach(x => {
      const actual = component.displayVoidTimeLabel(x);
      expect(actual).toBe('Void Trans Time (GMT-4): ');

    });
  });

  it('#displayVoidTimeLabel should be return Void Accept Time (GMT-4): ', async () => {
    component.isWrongScore = jest.fn().mockReturnValue(true);
    const actual = component.displayVoidTimeLabel(TVSRequestFilterBy.CHECK_TIME);

    expect(actual).toBe('Void Accept Time (GMT-4): ');
  });

  it('#displayVoidTimeLabel should be return Void time (GMT-4): ', () => {
    component.isWrongScore = jest.fn().mockReturnValue(false);
    const expected = 'Void time (GMT-4): ';
    const actual = component.displayVoidTimeLabel(TVSRequestFilterBy.CHECK_TIME);

    expect(actual).toEqual(expected);
  });

  it('#getHighlightMinTimeClass should return highlight-min-aa', async () => {
    // Arrange
    const logInfoDetails = Helper.fakeLogInfoDetail;
    logInfoDetails.highlightAcceptType = AcceptType.AUTO_ACCEPT;
    logInfoDetails.highlightMinTime = new Date();
    component.logInfoDetails = [logInfoDetails];

    // Action
    const actual = component.getHighlightMinTimeClass(logInfoDetails);

    // Assert
    expect(actual).toBe('highlight-min-aa');
    expect(component.acceptTypeName).toBe('AA');
  });

  it('#getHighlightMinTimeClass should return highlight-min-sa', async () => {
    // Arrange
    const logInfoDetails = Helper.fakeLogInfoDetail;
    logInfoDetails.highlightAcceptType = AcceptType.SECOND_ACCEPT;
    logInfoDetails.highlightMinTime = new Date();
    component.logInfoDetails = [Helper.fakeLogInfoDetail];

    // Action
    const actual = component.getHighlightMinTimeClass(logInfoDetails);

    // Assert
    expect(actual).toBe('highlight-min-sa');
    expect(component.acceptTypeName).toBe('SA');

  });

  it('#getHighlightMinTimeClass should return highlight-min-pa', async () => {
    // Arrange
    const logInfoDetails = Helper.fakeLogInfoDetail;
    logInfoDetails.highlightAcceptType = AcceptType.PENDING_ACCEPT;
    logInfoDetails.highlightMinTime = new Date();
    component.logInfoDetails = [Helper.fakeLogInfoDetail];

    // Action
    const actual = component.getHighlightMinTimeClass(logInfoDetails);

    // Assert
    expect(actual).toBe('highlight-min-pa');
    expect(component.acceptTypeName).toBe('PA');

  });

  it('#getHighlightMinTimeClass should return -', async () => {
    // Arrange
    const logInfoDetails = Helper.fakeLogInfoDetail;
    logInfoDetails.highlightAcceptType = null;
    logInfoDetails.highlightMinTime = null;
    component.logInfoDetails = [logInfoDetails];

    // Action
    const actual = component.getHighlightMinTimeClass(logInfoDetails);

    // Assert
    expect(actual).toBe('');
  });

  it('#displayMinTime should return "-"', async () => {
    // Arrange &A ction
    const actual = component.displayMinTime(null);

    // Assert
    expect(actual).toBe('-');
  });

  it('#displayMinTime should return expected time', async () => {
    // Arrange & Action
    const actual = component.displayMinTime(new Date("2020-10-08 09:44:46.361 PM"));

    // Assert
    expect(actual).toBe('09:44:46.361 PM');
  });
});
