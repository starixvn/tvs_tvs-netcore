import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { TicketCountOtherSportsComponent } from '../../../add-request/app/add-request/ticket-count-other-sports/ticket-count-other-sports.component';
import { AcceptType } from '../../../utility/constants/config';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { PipeModule } from '../../../utility/pipes/pipe.module';
import { LogInfoNewComponent } from './log-info-new.component';

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
  @NgModule({
    declarations: [
      TicketCountOtherSportsComponent
    ],
    imports: [
      PipeModule,
      NgbModule,
      FormsModule
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LogInfoNewComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoNewComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('LogInfoNewComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render({
      bind: {
        logInfoDetail: Helper.fakeLogInfoDetail,
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('#getHighlightMinTimeClass should return highlight-min-aa', async () => {
    // Arrange
    const logInfoDetail = Helper.fakeLogInfoDetail;
    logInfoDetail.highlightAcceptType = AcceptType.AUTO_ACCEPT;
    logInfoDetail.highlightMinTime = new Date();
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetail: logInfoDetail,
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-aa');
    expect(instance.acceptTypeName).toBe('AA');
  });

  it('#getHighlightMinTimeClass should return highlight-min-sa', async () => {
    // Arrange
    const logInfoDetail = Helper.fakeLogInfoDetail;
    logInfoDetail.highlightAcceptType = AcceptType.SECOND_ACCEPT;
    logInfoDetail.highlightMinTime = new Date();
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetail: logInfoDetail,
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-sa');
    expect(instance.acceptTypeName).toBe('SA');
  });

  it('#getHighlightMinTimeClass should return highlight-min-pa', async () => {
    // Arrange
    const logInfoDetail = Helper.fakeLogInfoDetail;
    logInfoDetail.highlightAcceptType = AcceptType.PENDING_ACCEPT;
    logInfoDetail.highlightMinTime = new Date();
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetail: logInfoDetail,
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-pa');
    expect(instance.acceptTypeName).toBe('PA');
  });

  it('#getHighlightMinTimeClass should return -', async () => {
    // Arrange
    const logInfoDetail = Helper.fakeLogInfoDetail;
    logInfoDetail.highlightAcceptType = null;
    logInfoDetail.highlightMinTime = null;
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetail: logInfoDetail,
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(null);

    // Assert
    expect(actual).toBe('');
  });

  it('#displayMinTime should return -', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetail: Helper.fakeLogInfoDetail,
      }
    });

    // Action
    const actual = instance.displayMinTime(null);

    // Assert
    expect(actual).toBe('-');
  });

  it('#displayMinTime should return expected time', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetail: Helper.fakeLogInfoDetail,
      }
    });

    // Action
    const actual = instance.displayMinTime(new Date("2020-10-08 09:44:46.361 PM"));

    // Assert
    expect(actual).toBe('09:44:46.361 PM');
  });

  it('displayTransId should return 12312', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetail: Helper.fakeLogInfoDetail,
      }
    });
    const actual = instance.displayTransId(1, '12312');

    expect(actual).toBe('12312');
  });

  it('displayTransId should return -', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetail: Helper.fakeLogInfoDetail,
      }
    });
    const actual = instance.displayTransId(0, '');

    expect(actual).toBe('-');
  });
});
