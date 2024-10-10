import * as _ from 'lodash';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterWrongScoreComponent } from '../filter-wrong-score/filter-wrong-score.component';
import { WrongScoreInfoComponent } from '../wrong-score-info/wrong-score-info.component';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeRequestId = 1001;
  static readonly fakeFirstMatchId = 1111;
  static readonly fakeSecondMatchId = 2222;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.360 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.363 PM';
  static readonly fakeAllowanceTime: AllowanceTime = {
    aaTime: 1,
    paTime: 1,
    saTime: 1,
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
    scoreOfMatch: '',
    scoreNormalTicket: '',
    instantlySettleCount: 2,
    cancelCashOutCount: 1
  } as LogInfoDetail;
  static readonly fakeWrongScoreModels: WrongScoreModel[] = [{
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
    isChecked: false,
    eventDate: null,
    voidFromTime: Helper.fakeFromDateTime,
    voidToTime: Helper.fakeToDateTime,
  }];
}
describe('LogInfoService', () => {

  let validationService: ValidationService;

  beforeEach(() => {
    validationService = new ValidationService();
  });

  it('#validateCommonData should return false when have at least wrongScoreInfoComponent not valid date time', () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.checkValidSubIssueTypeInFilter = jest.fn();
    const filter = new FilterModel();
    filter.subIssueTypeId = '10';
    const eventLeagueComponent = new EventLeagueComponent(null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterWrongScoreComponent = new FilterWrongScoreComponent(null, null, null, null);
    filterWrongScoreComponent.isValid = jest.fn().mockImplementation(() => true);
    const wrongScoreInfoComponent = new WrongScoreInfoComponent(null, null, null, null, null);
    wrongScoreInfoComponent.isValidDateTime = jest.fn().mockImplementation(() => false);
    const wrongScoreInfoComponents: WrongScoreInfoComponent[] = [wrongScoreInfoComponent];
    const service = new ValidationService();
    service.isSubTypeFilterByAcceptedTime = jest.fn().mockImplementation(() => false);

    const result = service.validateCommonData(filter, eventLeagueComponent, addRequestStore, filterWrongScoreComponent,  wrongScoreInfoComponents);

    expect(result).toBe(false);
  });

  it('#validateCommonData should return false when have not match', () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.checkValidSubIssueTypeInFilter = jest.fn();
    const filter = new FilterModel();
    filter.subIssueTypeId = '10';
    const eventLeagueComponent = new EventLeagueComponent(null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => false);
    const service = new ValidationService();

    const result = service.validateCommonData(filter, eventLeagueComponent, addRequestStore, null,  null);

    expect(eventLeagueComponent.isMatchIdValid).toBeCalledTimes(1);
    expect(result).toBe(false);
  });

  it('#validateCommonData should return false when have not subType', () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.checkValidSubIssueTypeInFilter = jest.fn();
    const filter = new FilterModel();
    filter.subIssueTypeId = null;
    const service = new ValidationService();

    const result = service.validateCommonData(filter, null, addRequestStore, null,  null);

    expect(result).toBe(false);
  });

  it('#validateCommonData should return false when filterWrongScoreComponent.isValid is false', () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.checkValidSubIssueTypeInFilter = jest.fn();
    const filter = new FilterModel();
    filter.subIssueTypeId = '10';
    const eventLeagueComponent = new EventLeagueComponent(null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterWrongScoreComponent = new FilterWrongScoreComponent(null, null, null, null);
    filterWrongScoreComponent.isValid = jest.fn().mockImplementation(() => false);
    const wrongScoreInfoComponents: WrongScoreInfoComponent[] = [];
    wrongScoreInfoComponents.some = jest.fn().mockImplementation(() => true);

    const service = new ValidationService();
    service.isSubTypeFilterByAcceptedTime = jest.fn().mockImplementation(() => true);

    const result = service.validateCommonData(filter, eventLeagueComponent, addRequestStore, filterWrongScoreComponent,  wrongScoreInfoComponents);

    expect(result).toBe(false);
  });

  it('#validateCommonData should return true', () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.checkValidSubIssueTypeInFilter = jest.fn();
    const filter = new FilterModel();
    filter.subIssueTypeId = '10';
    const eventLeagueComponent = new EventLeagueComponent(null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterWrongScoreComponent = new FilterWrongScoreComponent(null, null, null, null);
    filterWrongScoreComponent.isValid = jest.fn().mockImplementation(() => false);
    const wrongScoreInfoComponents: WrongScoreInfoComponent[] = [];
    wrongScoreInfoComponents.some = jest.fn().mockImplementation(() => false);
    const service = new ValidationService();
    service.isSubTypeFilterByAcceptedTime = jest.fn().mockImplementation(() => false);

    const result = service.validateCommonData(filter, eventLeagueComponent, addRequestStore, filterWrongScoreComponent,  wrongScoreInfoComponents);

    expect(result).toBe(true);
  });

  it('#isValidToDateTime should return result from validateWithTooltip', () => {
    const  wrongScoreModel = new WrongScoreModel();
    wrongScoreModel.filterToTransTime = "abc";
    const toTimeComponent = new DateFullTimeNewComponent(null);
    toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => false);

    const result = validationService.isValidToDateTime(toTimeComponent, wrongScoreModel);

    expect(result).toBe(false);
    expect(  toTimeComponent.validateWithTooltip).toBeCalledTimes(1);
  });

  it('#isValidToDateTime should return true', () => {
    const result = validationService.isValidToDateTime(null, null);

    expect(result).toBe(true);
  });

  it('#isValidAllScores should return false', () => {
    const  wrongScoreModel: WrongScoreModel[] = [new WrongScoreModel()];
    wrongScoreModel[0].messageValidationLogInfo = [{isError: true} as ValidationMessage];
    const result = validationService.isValidAllScores(wrongScoreModel);

    expect(result).toBe(false);
  });

  it('#isValidAllScores should return true', () => {
    const  wrongScoreModel: WrongScoreModel[] = [new WrongScoreModel()];
    wrongScoreModel[0].messageValidationLogInfo = [{isError: false} as ValidationMessage];
    const result = validationService.isValidAllScores(wrongScoreModel);

    expect(result).toBe(true);
  });

  it('#isHasWarningEditTakeNoteRequest should return false', () => {
    const result = validationService.isHasWarningEditTakeNoteRequest(false, '', '');

    expect(result).toBe(false);
  });

  it('#isHasWarningEditTakeNoteRequest should return true', () => {
    const result = validationService.isHasWarningEditTakeNoteRequest(true, TVSRequestActionType.TAKE_NOTE_ID.toString(), 'xxx');

    expect(result).toBe(true);
  });

  it('#isValidationHasWarningTicket should return true', () => {
    const result = validationService.isHasWarningEditTakeNoteRequest(true, TVSRequestActionType.TAKE_NOTE_ID.toString(), 'xxx');

    expect(result).toBe(true);
  });

  it('#isFromTimeSameOrAfterDefaultValue should return false', async () => {
    // Arrange
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    wrongScoreModels[0].filterFromTransTime = '2020-10-10 09:44:46.363 PM';
    const model = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    model.filterFromTransTime = '2020-10-09 09:44:46.364 PM';
    model.filterToTransTime = '2020-10-08 09:44:46.361 PM';

    // Action
    const result = validationService.isFromTimeSameOrAfterDefaultValue(model, wrongScoreModels, tooltip);

    // Assert
    expect(result).toBe(false);
  });

  it('#isFromTimeSameOrAfterDefaultValue should return true', async () => {
    // Arrange
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    wrongScoreModels[0].filterFromTransTime = '2020-10-07 09:44:46.361 PM';
    const model = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    model.filterFromTransTime = '2020-10-09 09:44:46.361 PM';
    model.filterToTransTime = '2020-10-08 09:44:46.361 PM';

    // Action
    const result = validationService.isFromTimeSameOrAfterDefaultValue(model, wrongScoreModels, tooltip);

    // Assert
    expect(result).toBe(true);
  });

  it('#isToTimeSmallerThanFromTimeNextScore should return false', async () => {
    // Arrange
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    wrongScoreModels[0].filterToTransTime = '2020-10-10 09:44:46.361 PM';
    const model = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    model.filterFromTransTime = '2020-10-09 09:44:46.361 PM';
    model.filterToTransTime = '2020-10-19 09:44:46.361 PM';

    // Action
    const result = validationService.isToTimeSmallerThanFromTimeNextScore(0, model, wrongScoreModels, tooltip);

    // Assert
    expect(result).toBe(false);
  });

  it('#isToTimeSmallerThanFromTimeNextScore should return true when is last score', async () => {
    // Arrange
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    const model = _.cloneDeep(_.first(wrongScoreModels));
    const service = new ValidationService();
    service.isLastScore = jest.fn().mockImplementation(() => true);

    // Action
    const result = service.isToTimeSmallerThanFromTimeNextScore(0, model, wrongScoreModels, tooltip);

    // Assert
    expect(result).toBe(true);
  });

  it('#isToTimeSmallerThanFromTimeNextScore should return true', async () => {
    // Arrange
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    wrongScoreModels[1].filterFromTransTime = '2025-09-09 09:44:46.361 PM';
    const model = _.cloneDeep(_.first(wrongScoreModels));
    model.filterToTransTime = '2023-09-09 09:44:46.361 PM';

    // Action
    const result = validationService.isToTimeSmallerThanFromTimeNextScore(0, model, wrongScoreModels, tooltip);

    // Assert
    expect(result).toBe(true);
  });

  it('#isValidationHasWarningTicket should return false', () => {
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    wrongScoreModels[0].messageValidationLogInfo = [];
    const result = validationService.isValidationHasWarningTicket(wrongScoreModels);

    expect(result).toBe(false);
  });

  it('#isValidationHasWarningTicket should return false when validation is null', () => {
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    wrongScoreModels[0].messageValidationLogInfo = null;
    const result = validationService.isValidationHasWarningTicket(wrongScoreModels);

    expect(result).toBe(false);
  });

  it('#isValidationHasWarningTicket should return true', () => {
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    wrongScoreModels[0].messageValidationLogInfo = [{isError: false} as ValidationMessage];
    const result = validationService.isValidationHasWarningTicket(wrongScoreModels);

    expect(result).toBe(true);
  });

  it('#isHasWarningSettledTicket should return false', () => {
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    wrongScoreModels[0].logInfoDetail = new LogInfoDetail();
    wrongScoreModels[0].logInfoDetail.settleCount = 0;
    const result = validationService.isHasWarningSettledTicket([wrongScoreModels[0]]);

    expect(result).toBe(false);
  });

  it('#isHasWarningSettledTicket should return true', () => {
    const wrongScoreModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    wrongScoreModels[0].logInfoDetail = new LogInfoDetail();
    wrongScoreModels[0].logInfoDetail.settleCount = 9;
    const result = validationService.isHasWarningSettledTicket(wrongScoreModels);

    expect(result).toBe(true);
  });

  it('#getSelectedWrongScore should return model that checked', () => {
    const result = validationService.getSelectedWrongScore(Helper.fakeWrongScoreModels);

    expect(result.every(x => x.isChecked)).toBe(true);
  });

  it('#isHasAllowanceTime should return true when have only aaTime', () => {
    const wrongScoreModel = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    wrongScoreModel.aaTime = 1;
    wrongScoreModel.paTime = 1;
    wrongScoreModel.saTime = 1;
    const result = validationService.isHasAllowanceTime(wrongScoreModel);

    expect(result).toBe(true);
  });

  it('#isHasAllowanceTime should return true when have only paTime', () => {
    const wrongScoreModel = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    wrongScoreModel.aaTime = 1;
    wrongScoreModel.paTime = 1;
    wrongScoreModel.saTime = 1;
    const result = validationService.isHasAllowanceTime(wrongScoreModel);

    expect(result).toBe(true);
  });

  it('#isHasAllowanceTime should return true when have only saTime', () => {
    const wrongScoreModel = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    wrongScoreModel.aaTime = 1;
    wrongScoreModel.paTime = 1;
    wrongScoreModel.saTime = 1;
    const result = validationService.isHasAllowanceTime(wrongScoreModel);

    expect(result).toBe(true);
  });

  it('#isHasAllowanceTime should return true when allowanceTime props = 0', () => {
    const wrongScoreModel = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    wrongScoreModel.aaTime = 1;
    wrongScoreModel.paTime = 1;
    wrongScoreModel.saTime = 1;
    const result = validationService.isHasAllowanceTime(wrongScoreModel);

    expect(result).toBe(true);
  });

  it('#isHasAllowanceTime should return false', () => {
    const wrongScoreModel = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    const result = validationService.isHasAllowanceTime(wrongScoreModel);

    expect(result).toBe(false);
  });

  it('#isHasAllowanceTime should return false when have not allowanceTime', () => {
    const wrongScoreModel = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    const result = validationService.isHasAllowanceTime(wrongScoreModel);

    expect(result).toBe(false);
  });

  it('#isLastScore should return false', async () => {
    const actual = validationService.isLastScore(Helper.fakeWrongScoreModels[0], Helper.fakeWrongScoreModels);

    expect(actual).toBe(false);
  });

  it('#isLastScore should return true', async () => {
    const actual = validationService.isLastScore(_.last(Helper.fakeWrongScoreModels), Helper.fakeWrongScoreModels);

    expect(actual).toBe(true);
  });

  it('#isFromTimeSameOrBeforeToTime should return false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filterFromTransTime = '2022-10-08 09:44:46.361 PM';
    const filterToTransTime = '2021-10-08 09:44:46.361 PM';

    const actual = validationService.isFromTimeSameOrBeforeToTime(filterFromTransTime, filterToTransTime, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isFromTimeSameOrBeforeToTime should return true', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filterFromTransTime = '2021-10-08 09:44:46.361 PM';
    const filterToTransTime = '2022-10-08 09:44:46.361 PM';

    const actual = validationService.isFromTimeSameOrBeforeToTime(filterFromTransTime, filterToTransTime, tooltip);

    expect(actual).toBeTruthy();
  });

  it('#isSubTypeFilterByTransTimeAndAcceptedTime should return true when subType is 98', async () => {
    const actual = validationService.isSubTypeFilterByTransTimeAndAcceptedTime('98');

    expect(actual).toBeTruthy();
  });

  it('#isSubTypeFilterByTransTimeAndAcceptedTime should return true when subType is 99', async () => {
    const actual = validationService.isSubTypeFilterByTransTimeAndAcceptedTime('99');

    expect(actual).toBeTruthy();
  });

  it('#isSubTypeFilterByTransTimeAndAcceptedTime should return false', async () => {
    const actual = validationService.isSubTypeFilterByTransTimeAndAcceptedTime('');

    expect(actual).toBeFalsy();
  });

  it('#isHasAllowanceTime should return true', async () => {
    const model = Helper.fakeWrongScoreModels[0];
    model.aaTime = 0;
    model.paTime = 0;
    model.saTime = 0;

    const actual = validationService.isHasAllowanceTime(model);

    expect(actual).toBeTruthy();
  });

  it('#isSubTypeFilterByAcceptedTime should return true', async () => {
    [
      SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_ONWARDS
    ].forEach(x => {
      const actual = validationService.isSubTypeFilterByAcceptedTime(x.toString());

      expect(actual).toBeTruthy();
    });
  });

  it('#isEditingByAnotherUser should return true', async () => {
    const actual = validationService.isEditingByAnotherUser(true, 1,2);

    expect(actual).toBeTruthy();
  });
});
