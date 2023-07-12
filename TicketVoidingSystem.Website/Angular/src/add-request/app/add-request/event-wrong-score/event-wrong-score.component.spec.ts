import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { AcceptType, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { AllowanceTime } from '../../../../utility/models/allowance-time.model';
import { MatchInfo } from '../../../../utility/models/event.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { BlockUiModule } from '../../../../utility/modules/block-ui/block-ui.module';
import { ModalService } from '../../../../utility/modules/modal/modal.service';
import { PipeModule } from '../../../../utility/modules/pipes/pipe.module';
import { ToolTipModule } from '../../../../utility/modules/tooltip/tooltip.module';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { ConfirmAbnormalBetModel } from '../event-abnormal-bet/confirm-abnormal-bet/confirm-abnormal-bet.model';
import { ValidationBusinessRuleOutput } from '../event-abnormal-bet/services/validation.model';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../filter/filter.model';
import { WrongScoreModel } from '../models/event-wrong-score.model';
import { ValidationMessage } from '../models/get-log-info.model';
import { ConfirmWrongScoreComponent } from './confirm-wrong-score/confirm-wrong-score.component';
import { ConfirmWrongScoreModel } from './confirm-wrong-score/confirm-wrong-score.model';
import { EventWrongScoreComponent } from './event-wrong-score.component';
import { PrimitiveProperty } from './event-wrong-score.model';
import { FilterWrongScoreComponent } from './filter-wrong-score/filter-wrong-score.component';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { WrongScoreService } from './services/wrong-score.service';
import { WrongScoreInfoComponent } from './wrong-score-info/wrong-score-info.component';

class Helper {
  static readonly fakeTransId = '111102';
  static readonly fakeRequestId = 1212;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeAllowanceTime: AllowanceTime = {
    aaTime: 1,
    paTime: 1,
    saTime: 1,
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
  static readonly fakeLogInfoDetail: LogInfoDetail =
    {
      matchId: 12345,
      liveScores: '0 - 0',
      voidFromTime: new Date(Helper.fakeFromDateTime),
      voidToTime: new Date(Helper.fakeToDateTime),
      singleCount: 1,
      mainParlayCount: 1,
      cancelCashOutCount: 1,
      cashOutCount: 3,
      settleCount: 1,
      scoreOfMatch: '',
      scoreNormalTicket: '',
      instantlySettleCount: 2,
      highlightAcceptType: AcceptType.AUTO_ACCEPT,
      highlightMinTime: new Date(Helper.fakeToDateTime)
    };
  static readonly fakeValidationMessage: ValidationMessage[] = [
    {
      isError: false,
      reason: '',
    }
  ];
  static readonly fakeWrongScoreModel: WrongScoreModel[] = [{
    scoreId: 5464,
    isActive: true,
    wrongScore: '0-1',
    subIssueTypeId: 5,
    filterBy: 1,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    actualScore: '',
    matchId: 900000,
    isChecked: true,
    eventDate: null,
    voidFromTime: Helper.fakeFromDateTime,
    voidToTime: Helper.fakeToDateTime,
  },
  {
    scoreId: 5465,
    isActive: false,
    wrongScore: '2-1',
    subIssueTypeId: 5,
    filterBy: 1,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    actualScore: '',
    matchId: 900000,
    isChecked: true,
    eventDate: null,
    voidFromTime: Helper.fakeFromDateTime,
    voidToTime: Helper.fakeToDateTime,
  }];
  static readonly fakeValidationBusinessRuleOutputSuccessful: ValidationBusinessRuleOutput = {
    isValid: true,
    warningModel: new ConfirmAbnormalBetModel(),
    transInfoAddRequestModel: null
  };
  static readonly fakeValidationBusinessRuleOutputError: ValidationBusinessRuleOutput = {
    isValid: false,
    warningModel: new ConfirmAbnormalBetModel(),
    transInfoAddRequestModel: null
  };

  static initHtml(): void {
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    element.setAttribute('user-name', 'sa');
    document.body.appendChild(element);
  }
}

describe('EventWrongScoreComponent', () => {
  @NgModule({
    declarations: [
      LeagueEventRedCardComponent,
      ConfirmWrongScoreComponent,
      WrongScoreInfoComponent,
      FilterWrongScoreComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule,
      BlockUiModule,
      PipeModule
    ],
    providers: [
      ValidationService,
      SaveRequestService,
      AddRequestStore,
      AddRequestApiService,
      WrongScoreService,
      LogInfoService,
      ModalService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventWrongScoreComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventWrongScoreComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#EventWrongScoreComponent init should match snapshot', async () => {
    // Arrange
    const { fixture, instance } = await shallow
      .mock(LogInfoService, { getLogInfo: jest.fn() })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false,
        }
      });
    instance.ngOnInit = jest.fn();

    // Action
    expect(fixture).toMatchSnapshot();
  });

  it('#updateWrongScoreModels should update correct data', async () => {
    // Arrange
    const originWrongScoreModels = _.clone(Helper.fakeWrongScoreModel);
    originWrongScoreModels.push(new WrongScoreModel());
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance['callApiGetWrongScores'] = jest.fn().mockImplementation(() => Promise.resolve(originWrongScoreModels));

    // Action
    await instance.updateWrongScoreModels();

    // Assert
    expect(instance.wrongScoreModels.length).toEqual(3);
  });

  it('#updateByOriginWrongScoreModel should update correct data', async () => {
    // Arrange
    const originWrongScoreModels = _.clone(Helper.fakeWrongScoreModel);
    originWrongScoreModels.push(new WrongScoreModel());
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance['callApiGetWrongScores'] = jest.fn().mockImplementation(() => Promise.resolve(originWrongScoreModels));

    // Action
    instance.updateByOriginWrongScoreModel(originWrongScoreModels);

    // Assert
    expect(instance.wrongScoreModels.length).toEqual(3);
  });

  it('#updateByOriginWrongScoreModel should update correct data when #originWrongScoreModels have new score', async () => {
    // Arrange
    const originWrongScoreModels = _.clone(Helper.fakeWrongScoreModel);
    originWrongScoreModels.push(new WrongScoreModel());
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.wrongScoreModels = [];

    // Action
    instance.updateByOriginWrongScoreModel(originWrongScoreModels);

    // Assert
    expect(instance.wrongScoreModels.length).toEqual(3);
  });

  it('#resetData should set wrongScoreModels to be empty', async () => {
    // Arrange
    const fakeShallow = new Shallow(EventWrongScoreComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
    const { instance } = await fakeShallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });

    // Action
    instance.resetData();

    // Assert
    expect(instance.wrongScoreModels.length).toBe(0);
  });

  it('#getWrongScores should call #callApiGetWrongScores', async () => {
    // Arrange
    const fakeShallow = new Shallow(EventWrongScoreComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
    const { instance } = await fakeShallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    instance['callApiGetWrongScores'] = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeWrongScoreModel));

    // Action
    await instance.getWrongScores(1);

    // Assert
    expect(instance.wrongScoreModels.length).toBeGreaterThan(0);
    expect(instance['callApiGetWrongScores']).toHaveBeenCalledTimes(1);
  });

  it('#getWrongScores should call #callApiGetWrongScores but return no score', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    instance['callApiGetWrongScores'] = jest.fn().mockImplementation(() => Promise.resolve([]));

    // Action
    await instance.getWrongScores(1);

    // Assert
    expect(instance['callApiGetWrongScores']).toHaveBeenCalledTimes(1);
  });

  it('#getWrongScores should call #callApiGetWrongScores', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    instance['callApiGetWrongScores'] = jest.fn().mockImplementation(() => Promise.resolve([]));
    instance.updateMatchId.emit = jest.fn();

    // Action
    await instance.getWrongScores(null);

    // Assert
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(0);
    expect(instance['callApiGetWrongScores']).toHaveBeenCalledTimes(1);
  });

  it('#callApiGetWrongScores should call #getWrongScores', async () => {
    // Arrange
    const mockGetWrongScores = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeWrongScoreModel));
    const { instance } = await shallow
      .mock(AddRequestApiService, { getWrongScores: mockGetWrongScores, })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });

    // Action
    const result = await instance['callApiGetWrongScores'](111);

    // Assert
    expect(mockGetWrongScores).toHaveBeenCalled();
    expect(result).toEqual(Helper.fakeWrongScoreModel);
  });

  it('#triggerCloseEvent should call #changeSavingRequestStatus', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus, })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });

    // Action
    instance.triggerCloseEvent();

    // Assert
    expect(mockChangeSavingRequestStatus).toHaveBeenCalled();
  });

  it('#saveRequest should call #saveRequestService.saveRequest when request was voided', async () => {
    // Arrange
    const mockSaveRequest = jest.fn();
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => true);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    const mockIsHasWarningSettledTicket = jest.fn().mockImplementation(() => true);
    const filter = Helper.fakeFilterModel;
    filter.isVoided = true;
    const { instance } = await shallow
      .mock(SaveRequestService, { saveRequest: mockSaveRequest, })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(ValidationService, {
        isValidationHasWarningTicket: mockIsValidationHasWarningTicket,
        isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest,
        isHasWarningSettledTicket: mockIsHasWarningSettledTicket,
        isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false)
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: filter,
          isEdit: true
        }
      });
    instance['checkIfRequestHasWarning'] = jest.fn();
    instance['validateVarCheck'] = jest.fn().mockImplementation(() => true);

    // Action
    await instance.saveRequest();

    // Assert
    expect(instance['checkIfRequestHasWarning']).toHaveBeenCalledTimes(1);
  });

  it('#saveRequest should call #saveWhenRequestNotVoided when request was not voided', async () => {
    // Arrange
    const mockSaveRequest = jest.fn();
    const filter = Helper.fakeFilterModel;
    filter.isVoided = false;
    const { instance } = await shallow
      .mock(SaveRequestService, { saveRequest: mockSaveRequest, })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })

      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: filter,
          isEdit: true
        }
      });
    instance['saveWhenRequestNotVoided'] = jest.fn();
    instance['validateVarCheck'] = jest.fn().mockImplementation(() => true);

    // Action
    await instance.saveRequest();

    // Assert
    expect(instance['saveWhenRequestNotVoided']).toHaveBeenCalledTimes(1);
  });

  it('#saveRequest should return when validateVarCheck false', async () => {
    // Arrange
    const mockGetFilterByBaseOnSubIssueType = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    instance['validateVarCheck'] = jest.fn().mockImplementation(() => false);

    // Action
    await instance.saveRequest();

    // Assert
    expect(instance['validateVarCheck']).toHaveBeenCalledTimes(1);
  });

  it('#onYesConfirmAddRequest should call #saveWhenRequestNotVoided when request was not voided', async () => {
    // Arrange
    const mockOnYesConfirmAddRequest = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(SaveRequestService, { onYesConfirmAddRequest: mockOnYesConfirmAddRequest, })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    instance['createSaveRequestArg'] = jest.fn();

    // Action
    await instance.onYesConfirmAddRequest();

    // Assert
    expect(mockOnYesConfirmAddRequest).toHaveBeenCalledTimes(1);
  });

  it('#openConfirmWrongScore should call update correct #confirmWrongScoreModel', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    instance['createValidationBusinessRuleArgs'] = jest.fn();
    instance.confirmWrongScoreModel = new ConfirmWrongScoreModel();

    // Action
    instance['openConfirmWrongScore'](true, true, true, true);

    // Assert
    expect(instance.confirmWrongScoreModel.isOpenDialog).toBeTruthy();
    expect(instance.confirmWrongScoreModel.isHasWarningForWrongScore).toBeTruthy();
    expect(instance.confirmWrongScoreModel.isHasWarningEditTakeNoteRequest).toBeTruthy();
  });

  it('#saveWhenRequestNotVoided should call #openConfirmWrongScore when isHasWarningForWrongScore', async () => {
    // Arrange
    const mockOpenConfirmWrongScore = jest.fn();
    const mockGetSelectedWrongScores = jest.fn();
    const mockCheckValidationBeforeSaveRequest = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeValidationBusinessRuleOutputSuccessful));
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => true);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    const mockIsHasWarningSettledTicket = jest.fn().mockImplementation(() => true);

    const { instance } = await shallow
      .mock(SaveRequestService, { checkValidationBeforeSaveRequest: mockCheckValidationBeforeSaveRequest, })
      .mock(ValidationService, {
        isValidationHasWarningTicket: mockIsValidationHasWarningTicket,
        isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest,
        isHasWarningSettledTicket: mockIsHasWarningSettledTicket,
        isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false),
        isEditingByAnotherUser: jest.fn().mockImplementation(() => false)
      })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: mockGetSelectedWrongScores
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    instance['createValidationBusinessRuleArgs'] = jest.fn();
    instance['openConfirmWrongScore'] = mockOpenConfirmWrongScore;

    // Action
    await instance['saveWhenRequestNotVoided']();

    // Assert
    expect(mockOpenConfirmWrongScore).toHaveBeenCalledTimes(1);
    expect(mockCheckValidationBeforeSaveRequest).toHaveBeenCalledTimes(1);
    expect(mockIsValidationHasWarningTicket).toHaveBeenCalledTimes(1);
    expect(mockIsHasWarningEditTakeNoteRequest).toHaveBeenCalledTimes(1);
    expect(mockGetSelectedWrongScores).toHaveBeenCalled();
  });

  it('#saveWhenRequestNotVoided should call #openConfirmWrongScore when isHasWarningForWrongScore & isHasWarningEditTakeNoteRequest not right', async () => {
    // Arrange
    const mockOpenConfirmWrongScore = jest.fn();
    const mockCheckValidationBeforeSaveRequest = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeValidationBusinessRuleOutputSuccessful));
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => false);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => true);
    const mockIsHasWarningSettledTicket = jest.fn().mockImplementation(() => true);
    const mockChangeSavingRequestStatus = jest.fn();
    const mockGetSelectedWrongScores = jest.fn();

    const { instance } = await shallow
      .mock(SaveRequestService, {
        checkValidationBeforeSaveRequest: mockCheckValidationBeforeSaveRequest,
      })
      .mock(ValidationService, {
        isValidationHasWarningTicket: mockIsValidationHasWarningTicket,
        isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest,
        isHasWarningSettledTicket: mockIsHasWarningSettledTicket,
        isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false),
        isEditingByAnotherUser: jest.fn().mockImplementation(() => false)
      })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: mockGetSelectedWrongScores
      })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    instance['createValidationBusinessRuleArgs'] = jest.fn();
    instance['openConfirmWrongScore'] = mockOpenConfirmWrongScore;

    // Action
    await instance['saveWhenRequestNotVoided']();

    // Assert
    expect(mockOpenConfirmWrongScore).toHaveBeenCalledTimes(1);
    expect(mockCheckValidationBeforeSaveRequest).toHaveBeenCalledTimes(1);
    expect(mockIsValidationHasWarningTicket).toHaveBeenCalledTimes(1);
    expect(mockIsHasWarningEditTakeNoteRequest).toHaveBeenCalledTimes(1);
    expect(mockGetSelectedWrongScores).toHaveBeenCalled();
  });

  it('#saveWhenRequestNotVoided should call #openConfirmWrongScore when isHasWarningForWrongScore & isHasWarningEditTakeNoteRequest not right', async () => {
    // Arrange
    const mockGetSelectedWrongScores = jest.fn();
    const mockSaveRequest = jest.fn();
    const mockCheckValidationBeforeSaveRequest = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeValidationBusinessRuleOutputSuccessful));
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => false);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    const mockIsHasWarningSettledTicket = jest.fn().mockImplementation(() => true);
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(SaveRequestService, {
        checkValidationBeforeSaveRequest: mockCheckValidationBeforeSaveRequest,
        saveRequest: mockSaveRequest,
      })
      .mock(ValidationService, {
        isValidationHasWarningTicket: mockIsValidationHasWarningTicket,
        isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest,
        isHasWarningSettledTicket: mockIsHasWarningSettledTicket,
        isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false),
        isEditingByAnotherUser: jest.fn().mockImplementation(() => false)
      })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: mockGetSelectedWrongScores
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    instance['createValidationBusinessRuleArgs'] = jest.fn();
    instance['createSaveRequestArg'] = jest.fn();
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);

    // Action
    await instance['saveWhenRequestNotVoided']();

    // Assert
    expect(mockCheckValidationBeforeSaveRequest).toHaveBeenCalledTimes(1);
    expect(mockIsValidationHasWarningTicket).toHaveBeenCalledTimes(1);
    expect(mockIsHasWarningEditTakeNoteRequest).toHaveBeenCalledTimes(1);
    expect(mockGetSelectedWrongScores).toHaveBeenCalled();
  });

  it('#saveWhenRequestNotVoided should call #addRequestStore.changeSavingRequestStatus', async () => {
    // Arrange
    const mockCheckValidationBeforeSaveRequest = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeValidationBusinessRuleOutputError));
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(SaveRequestService, { checkValidationBeforeSaveRequest: mockCheckValidationBeforeSaveRequest })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });
    instance['createValidationBusinessRuleArgs'] = jest.fn();

    // Action
    await instance['saveWhenRequestNotVoided']();

    // Assert
    expect(mockCheckValidationBeforeSaveRequest).toBeCalled();
    expect(mockChangeSavingRequestStatus).toBeCalled();
  });

  it('#createSaveRequestArg should call update correct data', async () => {
    // Arrange
    const mockGetSelectedWrongScores = jest.fn();
    const mockGetSelectedWrongScoreComponents = jest.fn();
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: mockGetSelectedWrongScoreComponents,
        getSelectedWrongScores: mockGetSelectedWrongScores
      })
      .mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });

    // Action
    instance['createSaveRequestArg']();

    // Assert
    expect(mockGetSelectedWrongScores).toHaveBeenCalled();
    expect(mockGetSelectedWrongScoreComponents).toHaveBeenCalledTimes(1);
  });

  it('#createValidationBusinessRuleArgs should call update correct data', async () => {
    // Arrange
    const mockGetSelectedWrongScores = jest.fn();
    const mockGetSelectedWrongScoreComponents = jest.fn();
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: mockGetSelectedWrongScoreComponents,
        getSelectedWrongScores: mockGetSelectedWrongScores,
      })
      .mock(ValidationService, { isSubTypeFilterByAcceptedTime: jest.fn().mockImplementation(() => false) })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });

    // Action
    instance['createValidationBusinessRuleArgs']();

    // Assert
    expect(mockGetSelectedWrongScores).toHaveBeenCalled();
    expect(mockGetSelectedWrongScoreComponents).toHaveBeenCalledTimes(1);
  });

  it('#ngOnInit should call #getFilterWrongScore', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.getAllowanceTimeSubject.subscribe = jest.fn();
    const wrongScoreService = new WrongScoreService(null, null);
    wrongScoreService.getFilterWrongScore = jest.fn();

    const component = new EventWrongScoreComponent(null, null, addRequestStore, null, null, wrongScoreService, null, null);
    component.isEdit = true;
    component.wrongScoreModels = Helper.fakeWrongScoreModel;
    component.filter = Helper.fakeFilterModel;
    component.primitiveProps = new PrimitiveProperty();
    component.updateWrongScoreModels = jest.fn();

    await component.ngOnInit();

    expect(wrongScoreService.getFilterWrongScore).toHaveBeenCalledTimes(1);
    expect(component.updateWrongScoreModels).toHaveBeenCalledTimes(1);
  });

  it('#ngOnInit should call #initDefaultFilterWrongScore', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeAllowanceTime(new AllowanceTime());
    addRequestStore.changeSavingRequestStatus = jest.fn();
    const wrongScoreService = new WrongScoreService(null, null);
    wrongScoreService.initDefaultFilterWrongScore = jest.fn();

    const component = new EventWrongScoreComponent(null, null, addRequestStore, null, null, wrongScoreService, null, null);
    component.isEdit = false;
    component.wrongScoreModels = Helper.fakeWrongScoreModel;
    component.filter = Helper.fakeFilterModel;
    component.primitiveProps = new PrimitiveProperty();

    await component.ngOnInit();

    expect(wrongScoreService.initDefaultFilterWrongScore).toHaveBeenCalledTimes(1);
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('isShowCountInfo should return true', async () => {
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    const actual = instance['isShowCountInfo'](1, 2, 1);

    expect(actual).toBeTruthy();
  });

  it('isShowCountInfo should return false', async () => {
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    const actual = instance['isShowCountInfo'](0, 0, 0);

    expect(actual).toBeFalsy();
  });

  it('countInfoContent should return info CashOut', async () => {
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance['isShowCashOutCount'] = jest.fn().mockImplementation(() => true);
    instance['isShowSettleCount'] = jest.fn().mockImplementation(() => false);
    const actual = instance['countInfoContent'](1, 0, 2);

    expect(actual).toBe(' (Cash Out: <strong>1</strong>, Instantly Settled: <strong>2</strong>)');
  });

  it('countInfoContent should return info Settle', async () => {
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    const actual = instance['countInfoContent'](1, 0, 2);

    expect(actual).toBe(' (Cash Out: <strong>1</strong>, Instantly Settled: <strong>2</strong>)');
  });

  it('countInfoContent should return string have not info', async () => {
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    const actual = instance['countInfoContent'](0, 0, 0);

    expect(actual).toBe(' ()');
  });

  it('displayFullDateTimeFormat should return time', async () => {
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      }).mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    const actual = instance.displayFullDateTimeFormat(new Date(Helper.fakeFromDateTime));

    expect(actual).toBe('2020/10/08 09:44:46.361 PM');
  });

  it('#isShowLogInfoFilterByAcceptedTime should return true', async () => {
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = Helper.fakeWrongScoreModel;
    instance.primitiveProps = new PrimitiveProperty();
    instance.primitiveProps.filterBy = 2;

    const actual = instance.isShowLogInfoFilterByAcceptedTime();

    expect(actual).toBe(true);
  });

  it('#isShowLogInfoFilterByAcceptedTime should return false', async () => {
    // Arrange
    const fakeWrongScoreModel = Helper.fakeWrongScoreModel;
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });

    instance.primitiveProps = new PrimitiveProperty();
    instance.primitiveProps.filterBy = 3;

    const actual = instance.isShowLogInfoFilterByAcceptedTime();

    expect(actual).toBeFalsy();
  });

  it('#changeMatchEvent should emit updateMatchId', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.resetData = jest.fn();
    instance.updateMatchId.emit = jest.fn();

    instance.changeMatchEvent(new MatchInfo());

    expect(instance.resetData).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should not emit updateMatchId', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.resetData = jest.fn();
    instance.updateMatchId.emit = jest.fn();

    instance.changeMatchEvent(null);

    expect(instance.resetData).toHaveBeenCalledTimes(0);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(0);
  });

  it('#handleSearchEvent should return since validateCommonData false', async () => {
    // Arrange
    const mockClearDataValidation = jest.fn();
    const mockValidateCommonData = jest.fn().mockImplementation(() => false);
    const mockGetSelectedWrongScoreComponents = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(LogInfoService, { clearDataValidation: mockClearDataValidation })
      .mock(ValidationService, { validateCommonData: mockValidateCommonData })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });

    instance.handleSearchEvent();

    expect(mockClearDataValidation).toHaveBeenCalledTimes(1);
    expect(mockValidateCommonData).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should called #getLogInfo', async () => {
    // Arrange
    const mockClearDataValidation = jest.fn();
    const mockValidateCommonData = jest.fn().mockImplementation(() => false);
    const mockGetLogInfo = jest.fn();

    const { instance } = await shallow
      .mock(LogInfoService, {
        clearDataValidation: mockClearDataValidation,
        getLogInfo: mockGetLogInfo
      })
      .mock(ValidationService, { validateCommonData: mockValidateCommonData })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
        createMainWrongScoreModel: jest.fn()
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });

    instance.primitiveProps = new PrimitiveProperty();
    instance.primitiveProps.filterBy = TVSRequestFilterBy.CHECK_TIME;

    instance.handleSearchEvent();

    expect(mockClearDataValidation).toHaveBeenCalled();
  });

  it('#handleSearchEvent should called #getWrongScores', async () => {
    // Arrange
    const mockClearDataValidation = jest.fn();
    const mockValidateCommonData = jest.fn().mockImplementation(() => true);
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
        createMainWrongScoreModel: jest.fn()
      })
      .mock(ValidationService, { validateCommonData: mockValidateCommonData })
      .mock(LogInfoService, {
        clearDataValidation: mockClearDataValidation,
        getLogInfo: mockGetLogInfo
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.primitiveProps.filterBy = TVSRequestFilterBy.TRANS_TIME;
    instance.getWrongScores = jest.fn();

    instance.handleSearchEvent();

    expect(mockClearDataValidation).toHaveBeenCalled();
    expect(mockValidateCommonData).toHaveBeenCalledTimes(1);
    expect(instance.getWrongScores).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should not called #clearDataValidation', async () => {
    const mockClearDataValidation = jest.fn();

    const { instance } = await shallow
      .mock(LogInfoService, {
        clearDataValidation: mockClearDataValidation,
      })
      .mock(ValidationService, {
        validateCommonData: jest.fn(),
      })
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = null;

    instance.handleSearchEvent();

    expect(mockClearDataValidation).toHaveBeenCalledTimes(0);
  });

  it('#getHighlightMinTimeClass should return highlight-min-aa', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = Helper.fakeWrongScoreModel;
    instance.wrongScoreModels[0].logInfoDetail.highlightAcceptType = AcceptType.AUTO_ACCEPT;

    // Action
    const actual = instance.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-aa');
    expect(instance.acceptTypeName).toBe('AA');
  });

  it('#getHighlightMinTimeClass should return highlight-min-sa', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = Helper.fakeWrongScoreModel;
    instance.wrongScoreModels[0].logInfoDetail.highlightAcceptType = AcceptType.SECOND_ACCEPT;

    // Action
    const actual = instance.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-sa');
    expect(instance.acceptTypeName).toBe('SA');
  });

  it('#getHighlightMinTimeClass should return highlight-min-pa', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = Helper.fakeWrongScoreModel;
    instance.wrongScoreModels[0].logInfoDetail.highlightAcceptType = AcceptType.PENDING_ACCEPT;

    // Action
    const actual = instance.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-pa');
    expect(instance.acceptTypeName).toBe('PA');
  });

  it('#getHighlightMinTimeClass should return -', async () => {
    // Arrange
    const fakeWrongScoreModel = Helper.fakeWrongScoreModel[0];
    fakeWrongScoreModel.logInfoDetail.highlightAcceptType = AcceptType.PENDING_ACCEPT;
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: [fakeWrongScoreModel],
          filter: Helper.fakeFilterModel,
        }
      });

    // Action
    const actual = instance.getHighlightMinTimeClass(null);

    // Assert
    expect(actual).toBe('');
  });

  it('#displayMinTime should return -', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = null;

    // Action
    const actual = instance.displayMinTime(null);

    // Assert
    expect(actual).toBe('-');
  });

  it('#displayMinTime should return expected time', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = Helper.fakeWrongScoreModel;
    instance.getHighlightMinTimeClass(new Date("2020-10-08 09:44:46.361 PM"));
    // Action
    const actual = instance.displayMinTime(new Date("2020-10-08 09:44:46.361 PM"));

    // Assert
    expect(actual).toBe('09:44:46.361 PM - PA');
  });

  it('#changeVarCheckValue should update isCheckedVar', async () => {
    // Arrange
    const fakeWrongScoreModel = Helper.fakeWrongScoreModel[0];
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: [fakeWrongScoreModel],
          filter: Helper.fakeFilterModel,
        }
      });

    instance.primitiveProps = new PrimitiveProperty();

    // Action
    instance.changeVarCheckValue(true);

    // Assert
    expect(instance.primitiveProps.isCheckedVar).toBeTruthy();
    expect(instance.primitiveProps.isHighLightVarCheck).toEqual(false);

  });

  it('#validateVarCheck should return false', async () => {
    // Arrange
    const fakeWrongScoreModel = Helper.fakeWrongScoreModel[0];
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: [fakeWrongScoreModel],
          filter: Helper.fakeFilterModel,
        }
      });

    instance.isShowVarCheck = jest.fn().mockImplementation(() => true);
    instance.tooltip.display = jest.fn();

    [null, undefined].forEach(x => {
      instance.primitiveProps = new PrimitiveProperty();
      instance.primitiveProps.isCheckedVar = x;

      // Action
      const actual = instance.validateVarCheck();

      // Assert
      expect(actual).toEqual(false);
    });
  });

  it('#validateVarCheck should return true', async () => {
    // Arrange
    const fakeWrongScoreModel = Helper.fakeWrongScoreModel[0];
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: [fakeWrongScoreModel],
          filter: Helper.fakeFilterModel,
        }
      });
    instance.isShowVarCheck = jest.fn().mockImplementation(() => false);
    instance.tooltip.display = jest.fn();

    // Action
    const actual = instance.validateVarCheck();

    // Assert
    expect(actual).toEqual(true);
  });

  it('#updateStatusButtonSaveRequest should have call changeSavingRequestStatus from AddRequestStore', async () => {
    // Arrange
    const fakeWrongScoreModel = Helper.fakeWrongScoreModel[0];
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: [fakeWrongScoreModel],
          filter: Helper.fakeFilterModel,
        }
      });
    instance.primitiveProps = new PrimitiveProperty();

    // Action
    instance.updateStatusButtonSaveRequest();

    // Assert
    expect(mockChangeSavingRequestStatus).toHaveBeenCalled();
  });

  it('#checkIfRequestHasWarning should call #openConfirmWrongScore when isValidationHasWarningTicket true', async () => {
    // Arrange
    const fakeWrongScoreModel = Helper.fakeWrongScoreModel[0];
    const mockIsHasWarningSettledTicket = jest.fn().mockImplementation(() => false);
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => true);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    const mockIsEditingByAnotherUser = jest.fn().mockImplementation(() => false);
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(ValidationService, { isHasWarningSettledTicket: mockIsHasWarningSettledTicket })
      .mock(ValidationService, { isValidationHasWarningTicket: mockIsValidationHasWarningTicket })
      .mock(ValidationService, { isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest })
      .mock(ValidationService, { isEditingByAnotherUser: mockIsEditingByAnotherUser })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: [fakeWrongScoreModel],
          filter: Helper.fakeFilterModel,
        }
      });
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);
    instance['openConfirmWrongScore'] = jest.fn();
    instance.primitiveProps = new PrimitiveProperty();

    // Action
    await instance['checkIfRequestHasWarning']();

    // Assert
    expect(mockIsHasWarningSettledTicket).toHaveBeenCalledTimes(1);
    expect(mockIsValidationHasWarningTicket).toHaveBeenCalledTimes(1);
    expect(mockIsHasWarningEditTakeNoteRequest).toHaveBeenCalledTimes(1);
    expect(mockIsEditingByAnotherUser).toHaveBeenCalledTimes(1);
    expect(instance['openConfirmWrongScore']).toHaveBeenCalledTimes(1);
  });

  it('#checkIfRequestHasWarning should call #openConfirmWrongScore when isHasWarningEditTakeNoteRequest true', async () => {
    // Arrange
    const fakeWrongScoreModel = Helper.fakeWrongScoreModel[0];
    const mockIsHasWarningSettledTicket = jest.fn().mockImplementation(() => false);
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => false);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => true);
    const mockIsEditingByAnotherUser = jest.fn().mockImplementation(() => false);
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(ValidationService, { isHasWarningSettledTicket: mockIsHasWarningSettledTicket })
      .mock(ValidationService, { isValidationHasWarningTicket: mockIsValidationHasWarningTicket })
      .mock(ValidationService, { isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest })
      .mock(ValidationService, { isEditingByAnotherUser: mockIsEditingByAnotherUser })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: [fakeWrongScoreModel],
          filter: Helper.fakeFilterModel,
        }
      });
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);
    instance['openConfirmWrongScore'] = jest.fn();
    instance.primitiveProps = new PrimitiveProperty();

    // Action
    await instance['checkIfRequestHasWarning']();

    // Assert
    expect(mockIsHasWarningSettledTicket).toHaveBeenCalledTimes(1);
    expect(mockIsValidationHasWarningTicket).toHaveBeenCalledTimes(1);
    expect(mockIsHasWarningEditTakeNoteRequest).toHaveBeenCalledTimes(1);
    expect(mockIsEditingByAnotherUser).toHaveBeenCalledTimes(1);
    expect(instance['openConfirmWrongScore']).toHaveBeenCalledTimes(1);
  });

  it('#checkIfRequestHasWarning should call #saveRequestService.saveRequest', async () => {
    // Arrange
    const mockIsHasWarningSettledTicket = jest.fn().mockImplementation(() => false);
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => false);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    const mockIsEditingByAnotherUser = jest.fn().mockImplementation(() => false);
    const mockSaveRequest = jest.fn().mockImplementation(() => false);
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(ValidationService, {
        isHasWarningSettledTicket: mockIsHasWarningSettledTicket,
        isValidationHasWarningTicket: mockIsValidationHasWarningTicket,
        isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest,
        isEditingByAnotherUser: mockIsEditingByAnotherUser
      })
      .mock(SaveRequestService, { saveRequest: mockSaveRequest })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
        }
      });
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);

    instance.wrongScoreModels = Helper.fakeWrongScoreModel;
    instance['createSaveRequestArg'] = jest.fn();
    instance.primitiveProps = new PrimitiveProperty();

    // Action
    await instance['checkIfRequestHasWarning']();

    // Assert
    expect(mockIsHasWarningSettledTicket).toHaveBeenCalledTimes(1);
    expect(mockIsValidationHasWarningTicket).toHaveBeenCalledTimes(1);
    expect(mockIsHasWarningEditTakeNoteRequest).toHaveBeenCalledTimes(1);
    expect(mockIsEditingByAnotherUser).toHaveBeenCalledTimes(1);
    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#getTimeSelectedScore should return expected time', async () => {
    // Arrange
    const mockGetFilterByBaseOnSubIssueType = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();

    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = Helper.fakeWrongScoreModel;
    instance.getHighlightMinTimeClass(new Date("2020-10-08 09:44:46.361 PM"));
    // Action
    const actual = instance.getTimeSelectedScore(Helper.fakeWrongScoreModel);
    // Assert
    expect(actual).toBe('2020/10/08 09:44:46.361 PM - 2020/10/09 09:44:46.361 PM');
  });

  it('#getParlayCountSelectedScore should return expected ParlayCount', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });

    // Action
    const actual = instance.getParlayCountSelectedScore(Helper.fakeWrongScoreModel);

    // Assert
    expect(actual).toBe(2);
  });

  it('#getSingleCountSelectedScore should return expected SingleCount', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });

    // Action
    const actual = instance.getSingleCountSelectedScore(Helper.fakeWrongScoreModel);

    // Assert
    expect(actual).toBe(2);
  });

  it('#getCancelCashOutCountSelectedScore should return expected CancelCashOutCount', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });

    // Action
    const actual = instance.getCancelCashOutCountSelectedScore(Helper.fakeWrongScoreModel);

    // Assert
    expect(actual).toBe(2);
  });

  it('#isShowLogInfoSelectedScores should return false', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = Helper.fakeWrongScoreModel;
    instance.wrongScoreModels[0].isChecked = false;
    instance.wrongScoreModels[1].isChecked = false;

    // Action
    const actual = instance.isShowLogInfoSelectedScores(instance.wrongScoreModels);

    // Assert
    expect(actual).toBeFalsy();
  });

  it('#isShowLogInfoSelectedScores should return true', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(WrongScoreService, {
        getFilterByBaseOnSubIssueType: jest.fn(),
        getSelectedWrongScoreComponents: jest.fn(),
        getSelectedWrongScores: jest.fn(),
      })
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          wrongScoreModels: Helper.fakeWrongScoreModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.wrongScoreModels = Helper.fakeWrongScoreModel;
    instance.wrongScoreModels[0].isChecked = true;
    instance.wrongScoreModels[1].isChecked = true;

    // Action
    const actual = instance.isShowLogInfoSelectedScores(instance.wrongScoreModels);

    // Assert
    expect(actual).toBe(true);
  });
});
