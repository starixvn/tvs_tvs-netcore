import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from "../../add-request.store";
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { WrongScoreInfoComponent } from '../wrong-score-info/wrong-score-info.component';
import { LogInfoService } from './log-info.service';
import { SaveRequestArg } from './save-request.model';
import { SaveRequestService } from './save-request.service';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from './validation.model';
import { ValidationService } from './validation.service';

describe('SaveRequestService', () => {
  let validationService: ValidationService;
  let addRequestService: AddRequestService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let saveRequestService: SaveRequestService;

  beforeEach(() => {
    addRequestService = new AddRequestService(null, null, null);
    validationService = new ValidationService();
    logInfoService = new LogInfoService(null, null);
    popupService = new PopupService(null);
    saveRequestService = new SaveRequestService(validationService, addRequestService, logInfoService, popupService);
  });

  it('#onYesConfirmAddRequest should call saveRequest', async () => {
    // Arrange
    const fakeValidationBusinessRuleOutput = { isValid: true } as ValidationBusinessRuleOutput;
    saveRequestService.checkValidationBeforeSaveRequest = jest.fn().mockImplementation(() => fakeValidationBusinessRuleOutput);
    saveRequestService.saveRequest = jest.fn();

    await saveRequestService.onYesConfirmAddRequest(new SaveRequestArg());

    expect(saveRequestService.saveRequest).toBeCalledTimes(1);
  });

  it('#onYesConfirmAddRequest should call saveRequest', async () => {
    // Arrange
    const fakeValidationBusinessRuleOutput = { isValid: false } as ValidationBusinessRuleOutput;
    saveRequestService.checkValidationBeforeSaveRequest = jest.fn().mockImplementation(() => fakeValidationBusinessRuleOutput);
    saveRequestService.saveRequest = jest.fn();
    popupService.showError = jest.fn();
    const fakeArg = { addRequestStore: new AddRequestStore() } as SaveRequestArg;
    fakeArg.addRequestStore.changeSavingRequestStatus = jest.fn();

    await saveRequestService.onYesConfirmAddRequest(fakeArg);

    expect(popupService.showError).toBeCalledTimes(1);
    expect(fakeArg.addRequestStore.changeSavingRequestStatus).toBeCalledTimes(1);
    expect(fakeArg.addRequestStore.changeSavingRequestStatus).toBeCalledWith(false);
  });

  it('#onYesConfirmAddRequest should call #showError', async () => {
    // Arrange
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeSavingRequestStatus = jest.fn();
    const mockPopupService = new PopupService(null);
    mockPopupService.showError = jest.fn();
    const mockSaveRequestService = new SaveRequestService(null, null, null, mockPopupService);
    mockSaveRequestService.checkValidationBeforeSaveRequest = jest.fn().mockReturnValue({ isValid: false } as ValidationBusinessRuleOutput);
    const fakeArg = { addRequestStore: new AddRequestStore() } as SaveRequestArg;
    fakeArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    fakeArg.isVoided = false;

    await mockSaveRequestService.onYesConfirmAddRequest(fakeArg);

    expect(mockPopupService.showError).toBeCalledTimes(1);
    expect(fakeArg.addRequestStore.changeSavingRequestStatus).toBeCalledTimes(1);
    expect(fakeArg.addRequestStore.changeSavingRequestStatus).toBeCalledWith(false);
  });

  it('#saveRequest should call #executeSaveRequest', async () => {
    // Arrange
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeBlockingUiStatus = jest.fn();
    const fakeSaveRequestArg = { isEdit: true, addRequestStore: addRequestStore, primitiveProps: { isBlock: true } as PrimitiveProperty } as SaveRequestArg;
    const spyExecuteSaveRequest = jest.spyOn(addRequestService, 'executeSaveRequest').mockImplementation();
    const mockSaveRequestService = new SaveRequestService(null, addRequestService, null, null);
    mockSaveRequestService['initAddRequestQuery'] = jest.fn().mockImplementation(() => new AddRequestQuery());
    await mockSaveRequestService.saveRequest(fakeSaveRequestArg);

    expect(spyExecuteSaveRequest).toBeCalledTimes(1);
  });

  it('#checkValidationBeforeSaveRequest should return false', async () => {
    // Arrange
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const fakeValidationBusinessRuleArgs = { addRequestStore: new AddRequestStore(), tooltip: tooltip } as ValidationBusinessRuleArgs;
    validationService.validateCommonData = jest.fn().mockImplementation(() => false);

    const result = await saveRequestService.checkValidationBeforeSaveRequest(fakeValidationBusinessRuleArgs);

    expect(result.isValid).toBe(false);
  });

  it('#checkValidationBeforeSaveRequest should return false when have not actual score', async () => {
    // Arrange
    const fakeLeagueEventComponent = new EventLeagueComponent(null, null, null);
    fakeLeagueEventComponent.selectedMatch = new MatchModel();
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const fakeValidationBusinessRuleArgs = {
      addRequestStore: new AddRequestStore(),
      wrongScoreInfoComponents: [],
      primitiveProps: { isBlock: true, actualScore: '' } as PrimitiveProperty,
      leagueEventWrongScoreComponent: fakeLeagueEventComponent,
      tooltip: tooltip
    } as ValidationBusinessRuleArgs;
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isValidAllScores = jest.fn().mockImplementation(() => true);

    const result = await saveRequestService.checkValidationBeforeSaveRequest(fakeValidationBusinessRuleArgs);

    expect(result.isValid).toBe(false);
  });

  it('#checkValidationBeforeSaveRequest should return false', async () => {
    // Arrange
    const fakeLeagueEventComponent = new EventLeagueComponent(null, null, null);
    fakeLeagueEventComponent.selectedMatch = new MatchModel();
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const fakeValidationBusinessRuleArgs = {
      addRequestStore: new AddRequestStore(),
      wrongScoreInfoComponents: [],
      primitiveProps: { isBlock: true, actualScore: '1231' } as PrimitiveProperty,
      leagueEventWrongScoreComponent: fakeLeagueEventComponent,
      tooltip: tooltip
    } as ValidationBusinessRuleArgs;
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isValidAllScores = jest.fn().mockImplementation(() => false);
    const mockLogInfoService = new LogInfoService(null, null);
    mockLogInfoService.clearDataValidation = jest.fn();
    mockLogInfoService.getLogInfo = jest.fn();
    const mockSaveRequest = new SaveRequestService(validationService, null, mockLogInfoService, null);

    const result = await mockSaveRequest.checkValidationBeforeSaveRequest(fakeValidationBusinessRuleArgs);

    expect(result.isValid).toBe(false);
  });

  it('#checkValidationBeforeSaveRequest should return true', async () => {
    // Arrange
    const fakeLeagueEventComponent = new EventLeagueComponent(null, null, null);
    fakeLeagueEventComponent.selectedMatch = new MatchModel();
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const fakeValidationBusinessRuleArgs = {
      addRequestStore: new AddRequestStore(),
      wrongScoreInfoComponents: [],
      primitiveProps: { isBlock: true, actualScore: '1-1' } as PrimitiveProperty,
      leagueEventWrongScoreComponent: fakeLeagueEventComponent,
      tooltip: tooltip
    } as ValidationBusinessRuleArgs;
    const component = new WrongScoreInfoComponent(null, null, null, null, null);
    fakeValidationBusinessRuleArgs.wrongScoreInfoComponents = [component];
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isValidAllScores = jest.fn().mockImplementation(() => true);
    logInfoService.clearDataValidation = jest.fn();
    logInfoService.getLogInfo = jest.fn();

    const result = await saveRequestService.checkValidationBeforeSaveRequest(fakeValidationBusinessRuleArgs);

    expect(logInfoService.clearDataValidation).toBeCalledTimes(1);
    expect(logInfoService.getLogInfo).toBeCalledTimes(1);
    expect(result.isValid).toBe(true);
  });
});