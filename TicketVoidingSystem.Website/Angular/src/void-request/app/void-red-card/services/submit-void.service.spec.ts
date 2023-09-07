import { DuplicateTicketsModel } from './../../../../add-request/app/add-request/models/event-duplicate-tickets.model';
import { SubmitVoidService } from './submit-void.service';
import { TemplateMessageComponent } from '../../../../utility/components/template-message/template-message/template-message.component';
import { BetID } from '../../../../utility/models/bet-id.model';
import { SubIssueType } from '../../../../utility/models/issue-type.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { Result } from '../../../../utility/models/result';
import { PasswordService } from '../../../../utility/services/password.service';
import { AppService } from '../../app.service';
import { VoidMatch } from '../../models/void-match.model';
import { CheckRequestService } from '../../services/check-request.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { ValidationService } from './validation.service';
import { PopupService } from '../../services/popup.service';
import { RequestDetailModel, RequestDetailViewModel, RequestEventModel } from '../../../../edit-request/app/request.model';

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
    duplicateTicketsModel: new DuplicateTicketsModel,
    messages: []
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
    service = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#voidAllMatches should call #showVoidBetConfirm when #checkValidationBeforeVoid return model successful', async () => {
    // Arrange
    const mockCheckValidationBeforeVoid = jest.fn().mockImplementation(() => Helper.fakeResultSuccessful );
    const mockShowVoidBetConfirm = jest.fn();
    const mockGetWarningInTemplateMessage = jest.fn().mockReturnValue("message");
    const primitiveProperty = new PrimitiveProperty();
    const voidMatch = new VoidMatch();
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    voidMatch.voidTicketsMini = new TicketsModel();
    voidMatch.voidTicketsMini.total = 110;
    validationService.checkValidationBeforeVoid = mockCheckValidationBeforeVoid;
    popupService.showVoidBetConfirm = mockShowVoidBetConfirm;
    popupService.getWarningInTemplateMessage = mockGetWarningInTemplateMessage;

    // Action
    await service.voidAllMatches([templateMessageComponent], [voidMatch], null, primitiveProperty);

    // Assert
    expect(mockCheckValidationBeforeVoid).toHaveBeenCalledTimes(1);
    expect(mockShowVoidBetConfirm).toHaveBeenCalledTimes(1);
    expect(mockGetWarningInTemplateMessage).toHaveBeenCalledTimes(1);

  });

  it('#voidAllMatches should not call #showVoidBetConfirm when #checkValidationBeforeVoid return model successful', async () => {
    // Arrange
    const mockCheckValidationBeforeVoid = jest.fn().mockImplementation(() => Helper.fakeResultError );
    const mockShowVoidBetConfirm = jest.fn();
    const primitiveProperty = new PrimitiveProperty();
    const voidMatch = new VoidMatch();
    voidMatch.voidTicketsMini = new TicketsModel();
    voidMatch.voidTicketsMini.total = 110;
    validationService.checkValidationBeforeVoid = mockCheckValidationBeforeVoid;
    popupService.showVoidBetConfirm = mockShowVoidBetConfirm;

    const mockSubmitVoidService = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);

    // Action
    await mockSubmitVoidService.voidAllMatches(null, [voidMatch], null, primitiveProperty);

    // Assert
    expect(mockCheckValidationBeforeVoid).toHaveBeenCalledTimes(1);
    expect(mockShowVoidBetConfirm).toHaveBeenCalledTimes(0);
  });

  it('#checkRequestModified should call #reCheckVoidBetPermission', async () => {
    // Arrange
    const mockIsRequestModified = jest.fn().mockImplementation(() => Promise.resolve(false));
    const mockReCheckVoidBetPermission = jest.fn();
    const primitiveProperty = new PrimitiveProperty();
    const voidMatch = new VoidMatch();
    const requestDetailViewModel = new RequestDetailViewModel();
    checkRequestService.isRequestModified = mockIsRequestModified;

    const mockSubmitVoidService = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    mockSubmitVoidService['reCheckVoidBetPermission'] = mockReCheckVoidBetPermission;

    // Action
    await mockSubmitVoidService['checkRequestModified']([voidMatch], requestDetailViewModel, primitiveProperty);

    // Assert
    expect(mockIsRequestModified).toHaveBeenCalledTimes(1);
    expect(mockReCheckVoidBetPermission).toHaveBeenCalledTimes(1);
  });

  it('#checkRequestModified should not call #reCheckVoidBetPermission', async () => {
    // Arrange
    const mockIsRequestModified = jest.fn().mockImplementation(() => Promise.resolve(true));
    const mockReCheckVoidBetPermission = jest.fn();
    const primitiveProperty = new PrimitiveProperty();
    const voidMatch = new VoidMatch();
    const requestDetailViewModel = new RequestDetailViewModel();
    checkRequestService.isRequestModified = mockIsRequestModified;

    const mockSubmitVoidService = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    mockSubmitVoidService['reCheckVoidBetPermission'] = mockReCheckVoidBetPermission;

    // Action
    await mockSubmitVoidService['checkRequestModified']([voidMatch], requestDetailViewModel, primitiveProperty);

    // Assert
    expect(mockIsRequestModified).toHaveBeenCalledTimes(1);
    expect(mockReCheckVoidBetPermission).toHaveBeenCalledTimes(0);
  });

  it('#reCheckVoidBetPermission should call #processVoid', async () => {
    // Arrange
    const mockCheckVoidBetPermission = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    const mockProcessVoid = jest.fn();
    validationService.checkVoidBetPermission = mockCheckVoidBetPermission;
    const mockSubmitVoidService = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    mockSubmitVoidService['processVoid'] = mockProcessVoid;

    // Action
    await mockSubmitVoidService['reCheckVoidBetPermission'](null, Helper.fakeRequestDetailViewModel, null);

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
    const mockSubmitVoidService = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);

    // Action
    await mockSubmitVoidService['reCheckVoidBetPermission'](null, Helper.fakeRequestDetailViewModel, null);

    // Assert
    expect(mockCheckVoidBetPermission).toHaveBeenCalledTimes(1);
    expect(mockShowWarningVoidBetPermission).toHaveBeenCalledTimes(1);
  });

  it('#processVoid should call #showSubmitVoidRequestSuccess', async () => {
    // Arrange
    const mockInsertQueue = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    const mockShowSubmitVoidRequestSuccess = jest.fn();
    popupService.showSubmitVoidRequestSuccess = mockShowSubmitVoidRequestSuccess;
    const mockSubmitVoidService = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    mockSubmitVoidService['insertQueue'] = mockInsertQueue;

    // Action
    await mockSubmitVoidService['processVoid'](null, Helper.fakeRequestDetailViewModel, new PrimitiveProperty());

    // Assert
    expect(mockInsertQueue).toHaveBeenCalledTimes(1);
    expect(mockShowSubmitVoidRequestSuccess).toHaveBeenCalledTimes(1);
  });

  it('#processVoid should call #showSubmitVoidRequestError', async () => {
    // Arrange
    const mockInsertQueue = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultError));
    const mockShowSubmitVoidRequestError = jest.fn();
    popupService.showSubmitVoidRequestError = mockShowSubmitVoidRequestError;
    const mockSubmitVoidService = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    mockSubmitVoidService['insertQueue'] = mockInsertQueue;

    // Action
    await mockSubmitVoidService['processVoid'](null, Helper.fakeRequestDetailViewModel, new PrimitiveProperty());

    // Assert
    expect(mockInsertQueue).toHaveBeenCalledTimes(1);
    expect(mockShowSubmitVoidRequestError).toHaveBeenCalledTimes(1);
  });

  it('#insertQueue should call #createFailResult', async () => {
    // Arrange
    const mockInsertQueue = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultError));
    appService.insertQueue = mockInsertQueue;
    const voidMatch = new VoidMatch();
    const mockSubmitVoidService = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    mockSubmitVoidService['getVoidQuery'] = jest.fn();

    // Action
    await mockSubmitVoidService['insertQueue']([voidMatch], null, null, null);

    // Assert
    expect(mockInsertQueue).toHaveBeenCalledTimes(1);
  });

  it('#insertQueue should not call #createFailResult', async () => {
    // Arrange
    const mockInsertQueue = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultSuccessful));
    appService.insertQueue = mockInsertQueue;
    const voidMatch = new VoidMatch();
    const mockSubmitVoidService = new SubmitVoidService(validationService, popupService, checkRequestService, appService, passwordService);
    mockSubmitVoidService['getVoidQuery'] = jest.fn();

    // Action
    await mockSubmitVoidService['insertQueue']([voidMatch], null, null, null);

    // Assert
    expect(mockInsertQueue).toHaveBeenCalledTimes(1);
  });

  it('#getVoidQuery should return expected model', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
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

    // Action
    const result = service['getVoidQuery'](voidMatch, Helper.fakeRequestDetailViewModel, null, null);

    // Assert
    expect(result.requestId).toEqual(Helper.fakeRequestDetailViewModel.requestId);
  });
});
