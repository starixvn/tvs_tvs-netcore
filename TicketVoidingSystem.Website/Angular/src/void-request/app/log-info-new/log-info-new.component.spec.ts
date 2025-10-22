import { AcceptType } from '../../../utility/constants/config';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { LogInfoNewComponent } from './log-info-new.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

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

describe('LogInfoNewComponent', () => {
  let component: LogInfoNewComponent;
  let fixture: ComponentFixture<LogInfoNewComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(LogInfoNewComponent);
    component = fixture.componentInstance;
    component.logInfoDetail = Helper.fakeLogInfoDetail;
  });

  it('#LogInfoNewComponent init should match snapshot', async () => {
    expect(fixture).toMatchSnapshot();
  });

  it('#getHighlightMinTimeClass should return highlight-min-aa', async () => {
    // Arrange
    const logInfoDetail = Helper.fakeLogInfoDetail;
    logInfoDetail.highlightAcceptType = AcceptType.AUTO_ACCEPT;
    logInfoDetail.highlightMinTime = new Date();
    component.logInfoDetail = logInfoDetail;

    // Action
    const actual = component.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-aa');
    expect(component.acceptTypeName).toBe('AA');
  });

  it('#getHighlightMinTimeClass should return highlight-min-sa', async () => {
    // Arrange
    const logInfoDetail = Helper.fakeLogInfoDetail;
    logInfoDetail.highlightAcceptType = AcceptType.SECOND_ACCEPT;
    logInfoDetail.highlightMinTime = new Date();
    component.logInfoDetail = logInfoDetail;

    // Action
    const actual = component.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-sa');
    expect(component.acceptTypeName).toBe('SA');
  });

  it('#getHighlightMinTimeClass should return highlight-min-pa', async () => {
    // Arrange
    const logInfoDetail = Helper.fakeLogInfoDetail;
    logInfoDetail.highlightAcceptType = AcceptType.PENDING_ACCEPT;
    logInfoDetail.highlightMinTime = new Date();
    component.logInfoDetail = logInfoDetail;

    // Action
    const actual = component.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-pa');
    expect(component.acceptTypeName).toBe('PA');
  });

  it('#getHighlightMinTimeClass should return -', async () => {
    // Arrange
    const logInfoDetail = Helper.fakeLogInfoDetail;
    logInfoDetail.highlightAcceptType = null;
    logInfoDetail.highlightMinTime = null;
    component.logInfoDetail = logInfoDetail;

    // Action
    const actual = component.getHighlightMinTimeClass(null);

    // Assert
    expect(actual).toBe('');
  });

  it('#displayMinTime should return -', async () => {
    // Arrange & Action
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
