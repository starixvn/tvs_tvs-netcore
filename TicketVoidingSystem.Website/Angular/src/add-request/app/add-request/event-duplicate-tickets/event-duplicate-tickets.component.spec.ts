import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { AbnormalFilterBy } from '../../../../utility/constants/config';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventAbnormalComponent } from '../event-abnormal-bet/league-event-abnormal/league-event-abnormal.component';
import { FilterModel } from '../filter/filter.model';
import { DuplicateTicketsModel } from '../models/event-duplicate-tickets.model';
import { PopupService } from '../services/popup.service';
import { EventDuplicateTicketsComponent } from './event-duplicate-tickets.component';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { AddRequestApiService } from '../add-request-api.service';

class Helper {
  static readonly fakeTransId = '123456789';
  static readonly fakeMatchId = 90000000;

  static readonly fakeDuplicateTicketsModel: DuplicateTicketsModel = {
    matchId: Helper.fakeMatchId,
    transIds: Helper.fakeTransId,
    filterBy: null,
    subIssueTypeId: 1,
    orgTransIds: '1312'
  };
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '2020-11-09 12:08:49.737',
    issueTypeId: '11',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  };
}

describe('EventDuplicateTicketsComponent', () => {
  @NgModule({
    declarations: [
      BetIdsComponent,
      LeagueEventAbnormalComponent
    ],
    imports: [
      BlockUiModule,
      FormsModule,
      ToolTipModule
    ],
    providers: [
      ValidationService,
      SaveRequestService,
      AddRequestStore,
      PopupService,
      CommonService,
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventDuplicateTicketsComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventDuplicateTicketsComponent, AppModuleTest);
  });

  it('#EventDuplicateTicketsComponent init should match snapshot', async () => {
    const { fixture, instance } = await shallow
      .mock(AddRequestApiService, {getPermissionAddRequest: jest.fn()})
      .render({
        bind: {
          duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.ngOnInit = jest.fn();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should be call #getPermissionManageRequest when edit request', async () => {
    const mockGetPermissionManageRequest = jest.fn();
    const mockChangeAbnormalFilterBy = jest.fn();
    const { instance } = await shallow
      .mock(CommonService, { getPermissionManageRequest: mockGetPermissionManageRequest })
      .mock(AddRequestStore, { changeAbnormalFilterBy: mockChangeAbnormalFilterBy })
      .mock(AddRequestApiService, {getPermissionAddRequest: jest.fn()})
      .render({
        bind: {
          duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
          filter: Helper.fakeFilterModel,
        }
      });
    [true, false].forEach(async x => {
      instance.isEdit = x;
      await instance.ngOnInit();

      expect(mockGetPermissionManageRequest).toHaveBeenCalled();
    });
  });

  it('#afterFocusOutBetIds should call #getMatchAndCheckValidTransIds', async () => {
    const { instance } = await shallow
      .mock(AddRequestApiService, {getPermissionAddRequest: jest.fn()})
      .render({
        bind: {
          duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.isCancelAfterFocusOutBetIdsEvent = false;
    instance['checkValidBusinessRule'] = jest.fn();
    await instance.afterFocusOutBetIds();

    expect(instance['checkValidBusinessRule']).toHaveBeenCalledTimes(1);
  });

  it('#afterFocusOutBetIds should not call #getMatchAndCheckValidTransIds', async () => {
    const { instance } = await shallow
      .mock(AddRequestApiService, {getPermissionAddRequest: jest.fn()})
      .render({
        bind: {
          duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.isCancelAfterFocusOutBetIdsEvent = true;
    instance['checkValidBusinessRule'] = jest.fn();
    await instance.afterFocusOutBetIds();

    expect(instance['checkValidBusinessRule']).toHaveBeenCalledTimes(0);
  });

  it('#saveRequest should not call #saveRequestService.saveRequest', async () => {
    const mockSaveRequest = jest.fn();
    const { instance } = await shallow
      .mock(ValidationService, { isFilterMixParlay: jest.fn().mockReturnValue(true) })
      .mock(SaveRequestService, { saveRequest: mockSaveRequest })
      .mock(AddRequestApiService, {getPermissionAddRequest: jest.fn()})
      .render({
        bind: {
          duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.triggerFocusOutBetIds = jest.fn();
    instance.betIdsComponent.getAllBetIds = jest.fn();
    instance.isCancelAfterFocusOutBetIdsEvent = true;
    instance['checkValidBusinessRule'] = jest.fn();
    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#removeInvalidTransIds should call #betIdsComponent.removeTransId', async () => {
    const { instance } = await shallow
      .mock(AddRequestApiService, {getPermissionAddRequest: jest.fn()})
      .render({
        bind: {
          duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.removeTransId = jest.fn();
    instance.removeInvalidTransIds();

    expect(instance.betIdsComponent.removeTransId).toHaveBeenCalledTimes(1);
  });

  it('#triggerCloseEvent should call #saveWhenRequestNotVoided', async () => {
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .mock(AddRequestApiService, {getPermissionAddRequest: jest.fn()})
      .render({
        bind: {
          duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.triggerCloseEvent();

    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#changeFilterBy should call #addRequestStore.changeAbnormalFilterBy', async () => {
    const mockChangeAbnormalFilterBy = jest.fn();
    const fakeFilterModel = Helper.fakeFilterModel;
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
    .mock(AddRequestStore, { changeAbnormalFilterBy: mockChangeAbnormalFilterBy })
    .mock(AddRequestApiService, {getPermissionAddRequest: jest.fn()})
    .render({
      bind: {
        duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.changeFilterBy(1);

    expect(instance.duplicateTicketsModel.filterBy).toBe(1);
    expect(mockChangeAbnormalFilterBy).toHaveBeenCalled();
  });

  it('#checkValidBusinessRule should call #validationService.checkValidBusinessRule when filter single', async () => {
    const mockCheckValidBusinessRule = jest.fn().mockReturnValue(true);
    const { instance } = await shallow
      .mock(ValidationService, { checkValidBusinessRule: mockCheckValidBusinessRule })
      .mock(ValidationService, { isFilterMixParlay: jest.fn().mockReturnValue(false) })
      .mock(AddRequestApiService, { getPermissionAddRequest: jest.fn() })
      .render({
        bind: {
          duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.updateMatchId.emit = jest.fn();
    instance.leagueEventComponent = new LeagueEventAbnormalComponent(null, null);
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.getAllBetIds = jest.fn();
    instance.duplicateTicketsModel.filterBy = AbnormalFilterBy.SINGLE;
    const actual = await instance['checkValidBusinessRule']();

    expect(mockCheckValidBusinessRule).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#checkValidBusinessRule should call #validationService.checkValidBusinessRule when filter parlay', async () => {
    const mockCheckValidBusinessRule = jest.fn().mockReturnValue(true);
    const { instance } = await shallow
      .mock(ValidationService, { checkValidBusinessRule: mockCheckValidBusinessRule })
      .mock(ValidationService, { isFilterMixParlay: jest.fn().mockReturnValue(false) })
      .mock(AddRequestApiService, { getPermissionAddRequest: jest.fn() })
      .render({
        bind: {
          duplicateTicketsModel: Helper.fakeDuplicateTicketsModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.updateMatchId.emit = jest.fn();
    instance.leagueEventComponent = new LeagueEventAbnormalComponent(null, null);
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.getAllBetIds = jest.fn();
    instance.duplicateTicketsModel.filterBy = AbnormalFilterBy.MIX_PARLAY;
    const actual = await instance['checkValidBusinessRule']();

    expect(mockCheckValidBusinessRule).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(0);
    expect(actual).toBeTruthy();
  });
});
