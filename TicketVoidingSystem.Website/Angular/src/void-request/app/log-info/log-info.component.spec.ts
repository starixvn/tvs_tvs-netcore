import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { TicketCountOtherSportsComponent } from '../../../add-request/app/add-request/ticket-count-other-sports/ticket-count-other-sports.component';
import { AcceptType, TVSRequestFilterBy } from '../../../utility/constants/config';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { PipeModule } from '../../../utility/pipes/pipe.module';
import { LogInfoComponent } from './log-info.component';


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

  let shallow: Shallow<LogInfoComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('LogInfoComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render({
      bind: {
        logInfoDetails: [Helper.fakeLogInfoDetail],
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('displayScoreLabel should be return "Wrong Score: "', async () => {
    const { instance } = await shallow.render({
      bind: {
        logInfoDetails: [Helper.fakeLogInfoDetail],
      }
    });
    instance.isWrongScore = jest.fn().mockReturnValue(true);
    [
      TVSRequestFilterBy.TRANS_TIME,
      TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME
    ].forEach(x => {
      const actual = instance.displayScoreLabel(x);

      expect(actual).toBe('Wrong Score: ');
    });
  });

  it('displayScoreLabel should be return "Live Score: "', async () => {
    const { instance } = await shallow.render({
      bind: {
        logInfoDetails: [Helper.fakeLogInfoDetail],
      }
    });

    const actual = instance.displayScoreLabel(TVSRequestFilterBy.CHECK_TIME);

    expect(actual).toBe('Live Score: ');
  });

  it('displayVoidTimeLabel should be return "Void Trans Time: "', async () => {
    const { instance } = await shallow.render({
      bind: {
        logInfoDetails: [Helper.fakeLogInfoDetail],
      }
    });
    instance.isWrongScore = jest.fn().mockReturnValue(true);
    [
      TVSRequestFilterBy.TRANS_TIME,
      TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME
    ].forEach(x => {
      const actual = instance.displayVoidTimeLabel(x);

      expect(actual).toBe('Void Trans Time (GMT-4): ');
    });
  });

  it('displayVoidTimeLabel should be return "Void Accept Time (GMT-4): "', async () => {
    const { instance } = await shallow.render({
      bind: {
        logInfoDetails: [Helper.fakeLogInfoDetail],
      }
    });
    instance.isWrongScore = jest.fn().mockReturnValue(true);
    const actual = instance.displayVoidTimeLabel(TVSRequestFilterBy.CHECK_TIME);

    expect(actual).toBe('Void Accept Time (GMT-4): ');
  });

  it('displayVoidTimeLabel should be return "Void time (GMT-4): "', async () => {
    const { instance } = await shallow.render({
      bind: {
        logInfoDetails: [Helper.fakeLogInfoDetail],
      }
    });
    instance.isWrongScore = jest.fn().mockReturnValue(false);

    const actual = instance.displayVoidTimeLabel(TVSRequestFilterBy.CHECK_TIME);

    expect(actual).toBe('Void time (GMT-4): ');
  });

  it('#getHighlightMinTimeClass should return highlight-min-aa', async () => {
    // Arrange
    const logInfoDetails = Helper.fakeLogInfoDetail;
    logInfoDetails.highlightAcceptType = AcceptType.AUTO_ACCEPT;
    logInfoDetails.highlightMinTime = new Date();
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetails: [logInfoDetails],
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(logInfoDetails);

    // Assert
    expect(actual).toBe('highlight-min-aa');
    expect(instance.acceptTypeName).toBe('AA');

  });

  it('#getHighlightMinTimeClass should return highlight-min-sa', async () => {
    // Arrange
    const logInfoDetails = Helper.fakeLogInfoDetail;
    logInfoDetails.highlightAcceptType = AcceptType.SECOND_ACCEPT;
    logInfoDetails.highlightMinTime = new Date();
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetails: [logInfoDetails],
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(logInfoDetails);

    // Assert
    expect(actual).toBe('highlight-min-sa');
    expect(instance.acceptTypeName).toBe('SA');

  });

  it('#getHighlightMinTimeClass should return highlight-min-pa', async () => {
    // Arrange
    const logInfoDetails = Helper.fakeLogInfoDetail;
    logInfoDetails.highlightAcceptType = AcceptType.PENDING_ACCEPT;
    logInfoDetails.highlightMinTime = new Date();
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetails: [logInfoDetails],
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(logInfoDetails);

    // Assert
    expect(actual).toBe('highlight-min-pa');
    expect(instance.acceptTypeName).toBe('PA');

  });

  it('#getHighlightMinTimeClass should return -', async () => {
    // Arrange
    const logInfoDetails = Helper.fakeLogInfoDetail;
    logInfoDetails.highlightAcceptType = null;
    logInfoDetails.highlightMinTime = null;
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetails: [logInfoDetails],
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(logInfoDetails);

    // Assert
    expect(actual).toBe('');
  });

  it('#displayMinTime should return "-"', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        logInfoDetails: [Helper.fakeLogInfoDetail],
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
        logInfoDetails: [Helper.fakeLogInfoDetail],
      }
    });

    // Action
    const actual = instance.displayMinTime(new Date("2020-10-08 09:44:46.361 PM"));

    // Assert
    expect(actual).toBe('09:44:46.361 PM');
  });
});
