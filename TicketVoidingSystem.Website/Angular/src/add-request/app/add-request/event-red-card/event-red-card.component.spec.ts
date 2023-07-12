import { ElementRef, NgModule, QueryList, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Shallow } from 'shallow-render';
import { TVSRequestFilterBy } from '../../../../utility/constants/config';
import { AllowanceTime } from '../../../../utility/models/allowance-time.model';
import { MatchInfo } from '../../../../utility/models/event.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { BlockUiModule } from '../../../../utility/modules/block-ui/block-ui.module';
import { ToolTipModule } from '../../../../utility/modules/tooltip/tooltip.module';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { RedCardModel } from '../models/event-red-card.model';
import { ValidationMessage } from '../models/get-log-info.model';
import { ConfirmRedCardComponent } from './confirm-red-card/confirm-red-card.component';
import { EventRedCardComponent } from './event-red-card.component';
import { PrimitiveProperty } from './event-red-card.model';
import { FilterTimeAreaComponent } from './filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowanceComponent } from './filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from './filter-time-with-allowance/filter-time-with-allowance.model';
import { LeagueEventRedCardComponent } from './league-event-red-card/league-event-red-card.component';
import { LogInfoRedCardComponent } from './log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from './log-info-red-card/log-info-red-card.model';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation-service';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeAllowanceTime: AllowanceTime = {
    aaTime: 1,
    paTime: 1,
    saTime: 1,
  };
  static readonly fakeFilterTimeWithAllowance: FilterTimeWithAllowance = {
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime,
    aaTime: 1,
    paTime: 12,
    saTime: 12,
  };
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  };
  static readonly fakeRedCardModel: RedCardModel = {
    matchId: 39420383,
    filterBy: TVSRequestFilterBy.CHECK_TIME,
    filterFromTransTime: null,
    filterToTransTime: null,
    aaTime: 1,
    paTime: 2,
    saTime: 1,
    isMainMatch: true,
    matchEvent: '',
    matchType: 1,
    subIssueTypeId: 5,
    subIssueTypeName: '',
    logInfoDetail: null,
    leagueName: ''
  };
  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: 12345,
    liveScores: '0 - 0',
    voidFromTime: new Date(Helper.fakeFromDateTime),
    voidToTime: new Date(Helper.fakeToDateTime),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    instantlySettleCount: 2,
    scoreOfMatch: '',
    scoreNormalTicket: '',
    cancelCashOutCount: 1
  };
  static readonly fakeValidationMessage: ValidationMessage[] = [
    {
      isError: false,
      reason: '',
    }
  ];
  static readonly fakeLogInfoRedCard: LogInfoRedCard = {
    matchId: 1111,
    isMainMatch: true,
    leagueName: '',
    eventName: '',
    subIssueTypeId: 7,
    voidTimeArea: Helper.fakeFilterTimeWithAllowance,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: Helper.fakeValidationMessage
  };
}

describe('EventRedCardComponent', () => {
  @NgModule({
    declarations: [
      LeagueEventRedCardComponent,
      ConfirmRedCardComponent,
      FilterTimeAreaComponent,
      LogInfoRedCardComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule,
      BlockUiModule,
    ],
    providers: [
      LogInfoService,
      ValidationService,
      SaveRequestService,
      AddRequestStore
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventRedCardComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventRedCardComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#EventRedCardComponent init should match snapshot', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();
    const mockChangeAllowanceTime = jest.fn();
    const { fixture, instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
        changeAllowanceTime: mockChangeAllowanceTime,
      })
      .mock(LogInfoService, {
        resetAllEventBeforeSearch: jest.fn(),
        getLogInfo: jest.fn(),
        resetIsCheckedVar : jest.fn()

      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          redCardModels: [Helper.fakeRedCardModel],
          isEdit: true,
        }
      });
    instance.ngOnInit = jest.fn();

    // Action
    expect(fixture).toMatchSnapshot();
  });

  it('#handleSearchEvent should be call #getLogInfo when have filterTimeWithAllowanceComponent', async () => {
    // Arrange
    const mockResetAllEventBeforeSearch = jest.fn();
    const mockValidateCommonData = jest.fn().mockImplementation(() => true);
    const mockGetLogInfo = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const mockChangeBlockingUiStatus = jest.fn();
    const mockResetIsCheckedVar = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
        changeBlockingUiStatus: mockChangeBlockingUiStatus
      })
      .mock(LogInfoService, {
        resetAllEventBeforeSearch: mockResetAllEventBeforeSearch,
        getLogInfo: mockGetLogInfo,
        resetIsCheckedVar: mockResetIsCheckedVar
      })
      .mock(ValidationService, {
        validateCommonData: mockValidateCommonData
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    const logInfoRedCardComponent = new LogInfoRedCardComponent(null, null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent.updateData = jest.fn();
    logInfoRedCardComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRedCardComponent>();
    instance.logInfoComponents.reset([...logInfoComponents.toArray(), logInfoRedCardComponent]);
    instance.mainEvent.isCheckedVar = false;

    // Action
    await instance.handleSearchEvent();

    // Assert
    expect(mockResetAllEventBeforeSearch).toHaveBeenCalled();
    expect(mockValidateCommonData).toHaveBeenCalled();
    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should be call #getLogInfo when have not filterTimeWithAllowanceComponent', async () => {
    // Arrange
    const mockResetAllEventBeforeSearch = jest.fn();
    const mockValidateCommonData = jest.fn().mockImplementation(() => true);
    const mockGetLogInfo = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const mockChangeBlockingUiStatus = jest.fn();
    const mockResetIsCheckedVar = jest.fn();

    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
        changeBlockingUiStatus: mockChangeBlockingUiStatus
      })
      .mock(LogInfoService, {
        resetAllEventBeforeSearch: mockResetAllEventBeforeSearch,
        getLogInfo: mockGetLogInfo,
        resetIsCheckedVar: mockResetIsCheckedVar
      })
      .mock(ValidationService, {
        validateCommonData: mockValidateCommonData
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    const logInfoRedCardComponent = new LogInfoRedCardComponent(null, null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent = null;
    logInfoRedCardComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRedCardComponent>();
    instance.logInfoComponents.reset([...logInfoComponents.toArray(), logInfoRedCardComponent]);
    instance.mainEvent.isCheckedVar = false;

    // Action
    await instance.handleSearchEvent();

    // Assert
    expect(mockResetAllEventBeforeSearch).toHaveBeenCalled();
    expect(mockValidateCommonData).toHaveBeenCalled();
    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should return when not valid', async () => {
    // Arrange
    const mockResetAllEventBeforeSearch = jest.fn();
    const mockValidateCommonData = jest.fn().mockImplementation(() => false);
    const mockGetLogInfo = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .mock(LogInfoService, {
        resetAllEventBeforeSearch: mockResetAllEventBeforeSearch,
        getLogInfo: mockGetLogInfo
      })
      .mock(ValidationService, {
        validateCommonData: mockValidateCommonData
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    await instance.handleSearchEvent();

    // Assert
    expect(mockResetAllEventBeforeSearch).toHaveBeenCalledTimes(1);
    expect(mockValidateCommonData).toHaveBeenCalledTimes(1);
    expect(mockGetLogInfo).toHaveBeenCalledTimes(0);
  });

  it('#changeMatchEvent should be call #resetAllEventBeforeSearch & emit updateMatchId', async () => {
    // Arrange
    const mockResetAllEventBeforeSearch = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .mock(LogInfoService, {
        resetAllEventBeforeSearch: mockResetAllEventBeforeSearch,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.mainEvent =  new LogInfoRedCard();
    instance.leagueEventRedCardComponent.selectedMatch = new MatchInfo();

    // Action
    instance.changeMatchEvent();

    // Assert
    expect(mockResetAllEventBeforeSearch).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should be call #resetAllEventBeforeSearch & emit updateMatchId when have not match', async () => {
    // Arrange
    const mockResetAllEventBeforeSearch = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .mock(LogInfoService, {
        resetAllEventBeforeSearch: mockResetAllEventBeforeSearch,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.mainEvent =  new LogInfoRedCard();
    instance.leagueEventRedCardComponent = null;

    // Action
    instance.changeMatchEvent();

    // Assert
    expect(mockResetAllEventBeforeSearch).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#isExistMatchEvent should be return false', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();
    instance.mainEvent =  new LogInfoRedCard();
    instance.mainEvent.matchId = undefined;

    // Action
    const actual = instance.isExistMatchEvent();

    // Assert
    expect(actual).toBe(false);
  });

  it('#isExistMatchEvent should be return true', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();
    instance.mainEvent =  new LogInfoRedCard();
    instance.mainEvent.matchId = 11;

    // Action
    const actual = instance.isExistMatchEvent();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#handleChangeDefaultFilterArea should be call #resetAllEventBeforeSearch', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();
    instance.primitiveProps = new PrimitiveProperty();

    // Action
    instance.handleChangeDefaultFilterArea();

    // Assert
    expect(instance.primitiveProps.isShowLogInfoMainMatch).toBe(false);
  });

  it('#saveRequest should be call #saveRequestService.saveRequest', async () => {
    // Arrange
    const mockSaveRequest = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .mock(SaveRequestService, {
        saveRequest: mockSaveRequest,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();

    // Action
    await instance.saveRequest();

    // Assert
    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSaveRequest should be call #saveRequestService.onClickConfirmSave', async () => {
    // Arrange
    const mockOnClickConfirmSave = jest.fn();
    const { instance } = await shallow
      .mock(SaveRequestService, {
        onClickConfirmSave: mockOnClickConfirmSave,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();

    // Action
    await instance.onClickConfirmSaveRequest();

    // Assert
    expect(mockOnClickConfirmSave).toHaveBeenCalledTimes(1);
  });

  it('#onClickCancelSaveRequest should be call #addRequestStore.changeSavingRequestStatus', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();
    const mockChangeAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeAllowanceTime: mockChangeAllowanceTime,
      })
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    instance.onClickCancelSaveRequest();

    // Assert
    expect(mockChangeSavingRequestStatus).toHaveBeenCalled();
  });

  it('#initSaveRequestInput should be update expected data', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();
    instance.requestId = Helper.fakeRequestId;

    // Action
    const actual = instance['initSaveRequestInput']();

    // Assert
    expect(actual.requestId).toEqual(Helper.fakeRequestId);
    expect(actual.isEdit).toEqual(false);
    expect(actual.filter).toEqual(Helper.fakeFilterModel);
  });

  it('#updateDefaultFilterTime should be update expected data', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.requestId = Helper.fakeRequestId;
    const filterAllowanceTime = Helper.fakeFilterTimeWithAllowance;
    const redCardModels = [Helper.fakeRedCardModel];
    const filterModel = Helper.fakeFilterModel;

    // Action
    instance['updateDefaultFilterTime'](filterAllowanceTime, redCardModels, filterModel);

    // Assert
    expect(filterAllowanceTime.fromDateTime).toEqual(Helper.fakeRedCardModel.filterFromTransTime);
    expect(filterAllowanceTime.toDateTime).toEqual(Helper.fakeRedCardModel.filterToTransTime);
  });

  it('#updateDefaultFilterTime should be update expected data when allowance time is null', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();
    instance.requestId = Helper.fakeRequestId;
    const filterAllowanceTime = Helper.fakeFilterTimeWithAllowance;
    const redCardModels = [Helper.fakeRedCardModel];
    const filterModel = _.clone(Helper.fakeFilterModel);

    // Action
    instance['updateDefaultFilterTime'](filterAllowanceTime, redCardModels, filterModel);

    // Assert
    expect(filterAllowanceTime.fromDateTime).toEqual(Helper.fakeRedCardModel.filterFromTransTime);
    expect(filterAllowanceTime.toDateTime).toEqual(Helper.fakeRedCardModel.filterToTransTime);
  });

  it('#updateMainEvent should be update expected data', async () => {
    // Arrange
    const mockChangeAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeAllowanceTime: mockChangeAllowanceTime,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    const redCardModels = [Helper.fakeRedCardModel];

    // Action
    instance['updateMainEvent'](fakeLogInfoRedCard, redCardModels);

    // Assert
    expect(fakeLogInfoRedCard.matchId).toEqual(Helper.fakeRedCardModel.matchId);
    expect(fakeLogInfoRedCard.subIssueTypeId).toEqual(Helper.fakeRedCardModel.subIssueTypeId);
    expect(fakeLogInfoRedCard.isMainMatch).toBeTruthy();
    expect(fakeLogInfoRedCard.eventName).toEqual(Helper.fakeRedCardModel.name);
    expect(fakeLogInfoRedCard.logInfoDetail).toEqual(Helper.fakeRedCardModel.logInfoDetail);
  });

  it('#ngOnInit should be call #updateDefaultFilterTime', async () => {
    // Arrange
    const mockChangeAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeAllowanceTime: mockChangeAllowanceTime,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: true,
          redCardModels: [Helper.fakeRedCardModel]
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();
    instance['updateDefaultFilterTime'] = jest.fn();
    instance['updateMainEvent'] = jest.fn();

    // Action
    instance.ngOnInit();

    // Assert
    expect(instance['updateDefaultFilterTime']).toHaveBeenCalled();
    expect(instance['updateMainEvent']).toHaveBeenCalled();
    expect(mockChangeAllowanceTime).toHaveBeenCalledTimes(1);
  });

  it('#ngOnChanges should call expected function', async() => {
    // Arrange
    const mockChangeAllowanceTime = jest.fn();
    const mockGetLogInfo = jest.fn();
    const mockResetAllEventBeforeSearch = jest.fn();
    const mockResetIsCheckedVar = jest.fn();

    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeAllowanceTime: mockChangeAllowanceTime,
      })
      .mock(LogInfoService, {
        resetAllEventBeforeSearch: mockResetAllEventBeforeSearch,
        getLogInfo: mockGetLogInfo,
        resetIsCheckedVar: mockResetIsCheckedVar
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          redCardModels: [Helper.fakeRedCardModel],
          isEdit: true,
        }
      });
    instance.handleChangeDefaultFilterArea = jest.fn();
    instance.mainEvent = Helper.fakeLogInfoRedCard;
    instance.filter.isChangeSubTypeManual = true;
    const changes = {
      'filter': new SimpleChange({}, {}, true)
    };

    // Action
    instance.ngOnChanges(changes);

    // Assert
    expect(instance.handleChangeDefaultFilterArea).toHaveBeenCalledTimes(1);
    expect(instance.filter.isChangeSubTypeManual).toBe(false);
    expect(mockResetIsCheckedVar).toBeCalled();
  });

  it('#ngOnDestroy should call #unsubscribe', async () => {
    // Arrange
    const mockChangeAllowanceTime = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, {
      changeAllowanceTime: mockChangeAllowanceTime,
    })
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        redCardModels: [Helper.fakeRedCardModel],
        isEdit: true,
      }
    });
    instance.getAllowanceTimeSubscription = new Subscription();
    instance.getAllowanceTimeSubscription.unsubscribe = jest.fn();

    // Action
    instance.ngOnDestroy();

    // Assert
    expect(instance.getAllowanceTimeSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
