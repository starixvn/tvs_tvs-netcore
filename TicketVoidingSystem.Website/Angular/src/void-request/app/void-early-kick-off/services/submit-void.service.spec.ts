import { SubmitVoidService } from './submit-void.service';
import { PasswordService } from '../../../../utility/services/password.service';
import { RequestDetailViewModel, RequestDetailModel, RequestEventModel } from '../../../../edit-request/app/request.model';
import { Result } from '../../../../utility/models/result';
import { AppService } from '../../app.service';
import { CheckRequestService } from '../../services/check-request.service';
import { ValidationService } from './validation.service';
import { PopupService } from '../../services/popup.service';
import { TemplateMessageComponent } from '../../../../utility/components/template-message/template-message/template-message.component';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidPageEarlyKickOffModel } from '../models/void-page-early-kick-off.model';
import { BetID } from '../../../../utility/models/bet-id.model';
import { SubIssueType } from '../../../../utility/models/issue-type.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';

class Helper {
  static readonly fakeRequestId = 50121;
  static readonly addRequestSelector = 'add-request';
  static readonly fakeResultSuccessful: Result<null> = {
    isSuccessful: true,
    errorCode: undefined,
    errorMsg: '',
  };
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 110,
    errorMsg: '',
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: 0,
    lastModifiedDate: undefined,
    request: new RequestDetailModel,
    event: new RequestEventModel,
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    redCardModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: [],
    duplicateTicketsModel: null,
    messages: [],
    earlyKickOffModels: []
  };
}

describe('SubmitVoidService', () => {
  let service: SubmitVoidService;
  let validationService: ValidationService;
  let popupService: PopupService;
  let checkRequestService: CheckRequestService;
  let appService: AppService;
  let passwordService: PasswordService;

  beforeEach(() => {
    validationService = new ValidationService(null);
    popupService = new PopupService(null);
    checkRequestService = new CheckRequestService(null, null);
    appService = new AppService(null);
    passwordService = new PasswordService();
    passwordService.hash = jest.fn();
  });

  it('#voidAllMatches should call #showVoidBetConfirm when #checkValidationBeforeVoid successful', async () => {
    // Arrange
    const mockCheckValidationBeforeVoid = jest.fn().mockImplementation(() => Helper.fakeResultSuccessful );
    const mockShowVoidBetConfirm = jest.fn();
    const primitiveProperty = new PrimitiveProperty();
    const voidMatch = new VoidPageEarlyKickOffModel();
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    voidMatch.voidTicketsMini = new TicketsModel();
    voidMatch.voidTicketsMini.total = 110;
    validationService.checkValidationBeforeVoid = mockCheckValidationBeforeVoid;
    popupService.showVoidBetConfirm = mockShowVoidBetConfirm;
    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);

    // Action
    await service.voidAllMatches([templateMessageComponent], [voidMatch], null, primitiveProperty);

    // Assert
    expect(mockCheckValidationBeforeVoid).toHaveBeenCalledTimes(1);
    expect(mockShowVoidBetConfirm).toHaveBeenCalledTimes(1);
  });

  it('#voidAllMatches should not call #showVoidBetConfirm when #checkValidationBeforeVoid not successful', async () => {
    // Arrange
    const mockCheckValidationBeforeVoid = jest.fn().mockImplementation(() => Helper.fakeResultError );
    const mockShowVoidBetConfirm = jest.fn();
    const primitiveProperty = new PrimitiveProperty();
    const voidMatch = new VoidPageEarlyKickOffModel();
    voidMatch.voidTicketsMini = new TicketsModel();
    voidMatch.voidTicketsMini.total = 110;
    validationService.checkValidationBeforeVoid = mockCheckValidationBeforeVoid;
    popupService.showVoidBetConfirm = mockShowVoidBetConfirm;

    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);

    // Action
    await service.voidAllMatches(null, [voidMatch], null, primitiveProperty);

    // Assert
    expect(mockCheckValidationBeforeVoid).toHaveBeenCalledTimes(1);
    expect(mockShowVoidBetConfirm).toHaveBeenCalledTimes(0);
  });

  it('#checkRequestModified should call #reCheckVoidBetPermission when isRequestModified is false', async () => {
    // Arrange
    const mockIsRequestModified = jest.fn().mockImplementation(() => Promise.resolve(false));
    const mockReCheckVoidBetPermission = jest.fn();
    const primitiveProperty = new PrimitiveProperty();
    const voidMatch = new VoidPageEarlyKickOffModel();
    const requestDetailViewModel = new RequestDetailViewModel();
    checkRequestService.isRequestModified = mockIsRequestModified;

    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    service['reCheckVoidBetPermission'] = mockReCheckVoidBetPermission;

    // Action
    await service['checkRequestModified']([voidMatch], requestDetailViewModel, primitiveProperty);

    // Assert
    expect(mockIsRequestModified).toHaveBeenCalledTimes(1);
    expect(mockReCheckVoidBetPermission).toHaveBeenCalledTimes(1);
  });

  it('#checkRequestModified should not call #reCheckVoidBetPermission when isRequestModified is true', async () => {
    // Arrange
    const mockIsRequestModified = jest.fn().mockImplementation(() => Promise.resolve(true));
    const mockReCheckVoidBetPermission = jest.fn();
    const primitiveProperty = new PrimitiveProperty();
    const voidMatch = new VoidPageEarlyKickOffModel();
    const requestDetailViewModel = new RequestDetailViewModel();
    checkRequestService.isRequestModified = mockIsRequestModified;

    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    service['reCheckVoidBetPermission'] = mockReCheckVoidBetPermission;

    // Action
    await service['checkRequestModified']([voidMatch], requestDetailViewModel, primitiveProperty);

    // Assert
    expect(mockIsRequestModified).toHaveBeenCalledTimes(1);
    expect(mockReCheckVoidBetPermission).toHaveBeenCalledTimes(0);
  });

  it('#reCheckVoidBetPermission should call #processVoid', async () => {
    // Arrange
    const mockCheckVoidBetPermission = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    const mockProcessVoid = jest.fn();
    validationService.checkVoidBetPermission = mockCheckVoidBetPermission;
    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    service['processVoid'] = mockProcessVoid;

    // Action
    await service['reCheckVoidBetPermission'](null, Helper.fakeRequestDetailViewModel, null);

    // Assert
    expect(mockCheckVoidBetPermission).toHaveBeenCalledTimes(1);
    expect(mockProcessVoid).toHaveBeenCalledTimes(1);
  });

  it('#reCheckVoidBetPermission should call #showWarningVoidBetPermission', async () => {
    // Arrange
    const mockCheckVoidBetPermission = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultError));
    const mockShowWarningVoidBetPermission = jest.fn();
    validationService.checkVoidBetPermission = mockCheckVoidBetPermission;
    popupService.showWarningVoidBetPermission = mockShowWarningVoidBetPermission;
    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);

    // Action
    await service['reCheckVoidBetPermission'](null, Helper.fakeRequestDetailViewModel, null);

    // Assert
    expect(mockCheckVoidBetPermission).toHaveBeenCalledTimes(1);
    expect(mockShowWarningVoidBetPermission).toHaveBeenCalledTimes(1);
  });

  it('#processVoid should call #showSubmitVoidRequestSuccess', async () => {
    // Arrange
    const mockInsertQueue = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    const mockShowSubmitVoidRequestSuccess = jest.fn();
    popupService.showSubmitVoidRequestSuccess = mockShowSubmitVoidRequestSuccess;
    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    service['insertQueue'] = mockInsertQueue;

    // Action
    await service['processVoid'](null, Helper.fakeRequestDetailViewModel, new PrimitiveProperty());

    // Assert
    expect(mockInsertQueue).toHaveBeenCalledTimes(1);
    expect(mockShowSubmitVoidRequestSuccess).toHaveBeenCalledTimes(1);
  });

  it('#processVoid should call #showSubmitVoidRequestError', async () => {
    // Arrange
    const mockInsertQueue = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultError));
    const mockShowSubmitVoidRequestError = jest.fn();
    popupService.showSubmitVoidRequestError = mockShowSubmitVoidRequestError;
    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    service['insertQueue'] = mockInsertQueue;

    // Action
    await service['processVoid'](null, Helper.fakeRequestDetailViewModel, new PrimitiveProperty());

    // Assert
    expect(mockInsertQueue).toHaveBeenCalledTimes(1);
    expect(mockShowSubmitVoidRequestError).toHaveBeenCalledTimes(1);
  });

  it('#insertQueue should call #createFailResult', async () => {
    // Arrange
    const mockInsertQueue = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultError));
    appService.insertQueue = mockInsertQueue;
    const voidMatch = new VoidPageEarlyKickOffModel();
    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    service['getVoidQuery'] = jest.fn();

    // Action
    await service['insertQueue']([voidMatch], null, null, null);

    // Assert
    expect(mockInsertQueue).toHaveBeenCalledTimes(1);
  });

  it('#insertQueue should not call #createFailResult', async () => {
    // Arrange
    const mockInsertQueue = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    appService.insertQueue = mockInsertQueue;
    const voidMatch = new VoidPageEarlyKickOffModel();
    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    service['getVoidQuery'] = jest.fn();

    // Action
    await service['insertQueue']([voidMatch], null, null, null);

    // Assert
    expect(mockInsertQueue).toHaveBeenCalledTimes(1);
  });

  it('#getVoidQuery should return expected model', async () => {
    // Arrange
    const voidMatch = new VoidPageEarlyKickOffModel();
    voidMatch.voidReason = new VoidedReason();
    voidMatch.matchModel = new MatchModel();
    voidMatch.subIssueType = new SubIssueType();
    voidMatch.voidTicketsMini = new TicketsModel();
    const mockBetID: BetID = {
      transId: '2',
      siteDbGroupId: 0,
      matchId: 0
    };
    voidMatch.voidTicketsMini.uncheckedTransIds = ['1', '0'];
    voidMatch.voidTicketsMini.cricketTickets = [new BetID(), mockBetID];
    voidMatch.voidTicketsMini.singleTickets = [new BetID (),mockBetID];
    voidMatch.voidTicketsMini.parlayTickets = [new BetID(), mockBetID];
    voidMatch.voidTicketsMini.cancelCashOutTickets = [new BetID()];
    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);

    // Action
    const result = service['getVoidQuery'](voidMatch, Helper.fakeRequestDetailViewModel, null, null);

    // Assert
    expect(result.requestId).toEqual(Helper.fakeRequestDetailViewModel.requestId);
  });
});
