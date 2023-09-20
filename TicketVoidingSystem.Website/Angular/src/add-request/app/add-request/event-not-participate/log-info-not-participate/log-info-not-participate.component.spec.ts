import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { LogInfoNotParticipateComponent } from './log-info-not-participate.component';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeLogInfoNotParticipate: LogInfoNotParticipate = {
    matchId: 1,
    filterNotParticipates: [],
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: []
  };
}

describe('LogInfoNotParticipateComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
    providers: [
      ModalService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LogInfoNotParticipateComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoNotParticipateComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('LogInfoNotParticipateComponent init should match snapshot', async () => {
    const component = new LogInfoNotParticipateComponent(null);
    expect(component).toMatchSnapshot();
  });

  it('displayFullDateTimeFormat should return time', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoNotParticipate
      }
    });
    const actual = instance.displayFullDateTimeFormat(new Date(Helper.fromDate));

    expect(actual).toBe('2021/12/18 12:08:49.737 PM');
  });

  it('countInfoContent should return info CashOut', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoNotParticipate
      }
    });
    const actual = instance['countInfoContent'](1, 2, 0);

    expect(actual).toBe(' (Cash Out: <strong>1</strong>, Settled: <strong>2</strong>)');
  });

  it('openPopupTransIds should call modal Service', async () => {
    const mockModalOpen = jest.fn();
    const { instance } = await shallow
    .mock(ModalService, { open: mockModalOpen })
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoNotParticipate
      }
    });
    instance['openPopupTransIds'](0, '');

    expect(mockModalOpen).toHaveBeenCalledTimes(1);
  });

  it('isShowCountInfo should return false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoNotParticipate
      }
    });
    const actual = instance['isShowCountInfo'](0, 0, 0);

    expect(actual).toBeFalsy();
  });

  it('displayTransId should return 12312', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoNotParticipate
      }
    });
    const actual = instance.displayTransId(1, '12312');

    expect(actual).toBe('12312');
  });

  it('displayTransId should return -', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoNotParticipate
      }
    });
    const actual = instance.displayTransId(0, '');

    expect(actual).toBe('-');
  });

});