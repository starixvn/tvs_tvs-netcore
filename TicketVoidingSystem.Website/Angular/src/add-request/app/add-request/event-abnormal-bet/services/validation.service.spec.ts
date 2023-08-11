import { PermissionManage } from '../../../../../utility/models/permission-manage.model';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { GroupNumber } from '../../../../../utility/components/bet-ids/bet-ids.model';
import { AbnormalFilterBy, TVSRequestActionType } from '../../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { AddRequestApiService } from '../../add-request-api.service';
import { ValidationMessage } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { ConfirmAbnormalBetComponent } from '../confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from '../confirm-abnormal-bet/confirm-abnormal-bet.model';
import { CheckTransIdsViewModel, PrimitiveProperty, ValidationAbnormalBet } from '../event-abnormal-bet.model';
import { LeagueEventAbnormalComponent } from '../league-event-abnormal/league-event-abnormal.component';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from './validation.model';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeTransId = '1000002';
  static readonly fakeMatchId = 900000;
  static readonly fakeRequestId = 10222;
  static readonly fakeActionId = '5';
  static readonly fakeValidationMessageError: ValidationMessage = {
    isError: true,
    reason: '',
    isShowPopup: true,
    transIds: '',
    requestId: 1,
  };
  static readonly fakeValidationMessageNotError: ValidationMessage = {
    isError: false,
    reason: '',
    isShowPopup: true,
    transIds: '',
    requestId: 1,
  };
  static readonly fakeConfirmAbnormalBetModel: ConfirmAbnormalBetModel = {
    isOpenDialog: true,
    isHasWarningForAbnormalBet: true,
    isHasWarningEditTakeNoteRequest: false,
    isEditingByAnotherUser: false,
    transIds: '1022222',
    cn88Tickets: '2123122',
    ticketsOfVIPCustomer: '2123122',
    settledTickets:'2123122',
    ticketsOfCustomerClass201: '2123122',
    ticketsOfCustomerClass4K: '2123122',
    isHasWarningRemovedTickets: false,
    requestId: 0,
    requestedBy: '',
    listBetteam: 'aa',
    listBettype: 'bb'
  };
  static readonly fakeValidationBusinessRuleOutput: ValidationBusinessRuleOutput = {
    isValid: false,
    warningModel: Helper.fakeConfirmAbnormalBetModel,
    transInfoAddRequestModel: new TransInfoAddRequestModel()
  };
  static readonly fakeValidationBusinessRuleArgs: ValidationBusinessRuleArgs = {
    requestId: Helper.fakeRequestId,
    actionId: Helper.fakeActionId,
    betIdsComponent: new BetIdsComponent(null),
    leagueEventAbnormalComponent: new LeagueEventAbnormalComponent(null, null),
    permission: new PermissionManage(),
    filterBy: null,
    issueTypeId: '11',
    primitiveProps: new PrimitiveProperty(),
    subIssueTypeId: '',
    isValidateFromConfirmPopup: false
  };
  static readonly fakeValidationAbnormalBet: ValidationAbnormalBet = {
    invalidTransIds: Helper.fakeTransId,
    movedTransIds: Helper.fakeTransId,
    differentMatchTransIds: Helper.fakeTransId,
    settledTransIds: Helper.fakeTransId,
    unsupportedTransIds: Helper.fakeTransId,
    existingReqTransIds: Helper.fakeTransId,
    transIdsOfVIPCustomer: Helper.fakeTransId,
    cN88TransIds: Helper.fakeTransId,
    nonLiveTransIds: Helper.fakeTransId,
    differentLiveScoreTransIds: Helper.fakeTransId,
    transIdsOfCustomerClass201: Helper.fakeTransId,
    transIdsOfCustomerClass4K: Helper.fakeTransId,
    abWhiteListTransIds: Helper.fakeTransId,
    isHasWarningRemovedTickets: false,
    isHasUusTickets: true,
    listBetteam: 'aa',
    listBettype: 'bb'
  };
}

describe('ValidationService', () => {
  let validationService: ValidationService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(() => {
    validationService = new ValidationService(addRequestApiService);
  });

  it('#checkValidBusinessRule should return validation model with error', async () => {
    // Arrange
    const mockIsHasBetId = jest.fn().mockImplementation(() => false);
    const mockUpdateUndefinedMatchAndLeague = jest.fn();
    const args = Helper.fakeValidationBusinessRuleArgs;
    args.betIdsComponent.isHasBetId = mockIsHasBetId;
    args.betIdsComponent.groupNumber.resetAllItemsToValid = jest.fn();
    args.betIdsComponent.groupNumber.checkDuplicatedItems = jest.fn();
    args.leagueEventAbnormalComponent.updateUndefinedMatchAndLeague = mockUpdateUndefinedMatchAndLeague;
    validationService['checkAbnormalBetTransIds'] = jest.fn().mockImplementation(() => null);
    const testCase = [AbnormalFilterBy.MIX_PARLAY, AbnormalFilterBy.SINGLE];
    testCase.forEach(async x => {
      args.filterBy = x;
      const result = await validationService.checkValidBusinessRule(args);

      expect(result.isValid).toBe(false);
    });
  });

  it('#checkValidBusinessRule should return validation with error when #checkAbnormalBetTransIds return null', async () => {
    // Arrange
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberResetAllItemsToValid = jest.fn();
    const mockGroupNumberCheckDuplicatedItems = jest.fn();
    const mockGroupNumberGetAllBetIds = jest.fn();
    const mockCheckAbnormalBetTransIds = jest.fn().mockImplementation(() => null);
    const mockIsAbnormalBetMixParlay = jest.fn().mockImplementation(() => false);
    const args = Helper.fakeValidationBusinessRuleArgs;
    args.filterBy = AbnormalFilterBy.MIX_PARLAY;
    args.leagueEventAbnormalComponent = null;
    args.betIdsComponent.isHasBetId = mockIsHasBetId;
    args.betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    args.betIdsComponent.groupNumber = new GroupNumber();
    args.betIdsComponent.groupNumber.resetAllItemsToValid = mockGroupNumberResetAllItemsToValid;
    args.betIdsComponent.groupNumber.checkDuplicatedItems = mockGroupNumberCheckDuplicatedItems;

    validationService['checkAbnormalBetTransIds'] = mockCheckAbnormalBetTransIds;
    validationService['isAbnormalBetMixParlay'] = mockIsAbnormalBetMixParlay;

    // Action
    const result = await validationService.checkValidBusinessRule(args);

    // Assert
    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberResetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberCheckDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(mockCheckAbnormalBetTransIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkValidBusinessRule should call #leagueEventAbnormalComponent.updateInfoWithOnlyOneMatch', async () => {
    // Arrange
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberResetAllItemsToValid = jest.fn();
    const mockGroupNumberCheckDuplicatedItems = jest.fn();
    const mockGroupNumberGetAllBetIds = jest.fn();
    const mockCheckAbnormalBetTransIds = jest.fn().mockImplementation(() => true);
    const mockIsAbnormalBetMixParlay = jest.fn().mockImplementation(() => false);
    const args = Helper.fakeValidationBusinessRuleArgs;
    args.filterBy = AbnormalFilterBy.MIX_PARLAY;
    args.leagueEventAbnormalComponent = new LeagueEventAbnormalComponent(null, null);
    args.leagueEventAbnormalComponent.updateInfoWithOnlyOneMatch = jest.fn();
    args.betIdsComponent.isHasBetId = mockIsHasBetId;
    args.betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    args.betIdsComponent.isAllBetIdsValid = jest.fn().mockImplementation(() => false);
    args.betIdsComponent.groupNumber = new GroupNumber();
    args.betIdsComponent.groupNumber.resetAllItemsToValid = mockGroupNumberResetAllItemsToValid;
    args.betIdsComponent.groupNumber.checkDuplicatedItems = mockGroupNumberCheckDuplicatedItems;
    validationService['highlightInvalidTransIds'] = jest.fn();
    validationService['updateValidation'] = jest.fn();
    validationService['getConfirmAbnormalBetModel'] = jest.fn();
    validationService['checkAbnormalBetTransIds'] = mockCheckAbnormalBetTransIds;
    validationService['isAbnormalBetMixParlay'] = mockIsAbnormalBetMixParlay;

    // Action
    const result = await validationService.checkValidBusinessRule(args);

    // Assert
    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberResetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberCheckDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(mockCheckAbnormalBetTransIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkValidBusinessRule should return validation with error when #betIdsComponent.isAllBetIdsValid is false', async () => {
    // Arrange
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberResetAllItemsToValid = jest.fn();
    const mockGroupNumberCheckDuplicatedItems = jest.fn();
    const mockGroupNumberGetAllBetIds = jest.fn();
    const mockBetIdsComponentIsAllBetIdsValid = jest.fn().mockImplementation(() => false);
    const mockCheckAbnormalBetTransIds = jest.fn().mockImplementation(() => true);
    const mockGetConfirmAbnormalBetModel = jest.fn();
    const mockHighlightInvalidTransIds = jest.fn();
    const mockIsAbnormalBetMixParlay = jest.fn().mockImplementation(() => true);

    const args = Helper.fakeValidationBusinessRuleArgs;
    args.betIdsComponent.isHasBetId = mockIsHasBetId;
    args.betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    args.betIdsComponent.isAllBetIdsValid = mockBetIdsComponentIsAllBetIdsValid;
    args.betIdsComponent.groupNumber = new GroupNumber();
    args.betIdsComponent.groupNumber.resetAllItemsToValid = mockGroupNumberResetAllItemsToValid;
    args.betIdsComponent.groupNumber.checkDuplicatedItems = mockGroupNumberCheckDuplicatedItems;
    validationService['checkAbnormalBetTransIds'] = mockCheckAbnormalBetTransIds;
    validationService['getConfirmAbnormalBetModel'] = mockGetConfirmAbnormalBetModel;
    validationService['highlightInvalidTransIds'] = mockHighlightInvalidTransIds;
    validationService['isAbnormalBetMixParlay'] = mockIsAbnormalBetMixParlay;
    validationService['updateValidation'] = jest.fn();
    // Action
    const result = await validationService.checkValidBusinessRule(args);

    // Assert
    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberResetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberCheckDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(mockBetIdsComponentIsAllBetIdsValid).toHaveBeenCalledTimes(1);
    expect(mockCheckAbnormalBetTransIds).toHaveBeenCalledTimes(1);
    expect(mockGetConfirmAbnormalBetModel).toHaveBeenCalledTimes(1);
    expect(mockHighlightInvalidTransIds).toHaveBeenCalledTimes(1);
    expect(validationService['checkAbnormalBetTransIds']).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#isValidationHasWarningTicket should return false when settledTickets is null', async () => {
    // Arrange
    const permission = new PermissionManage();
    const confirmModel = new ConfirmAbnormalBetModel();
    permission.manageRequestSettledTicketsHost = true;
    confirmModel.settledTickets = null;

    // Action
    const result = validationService.isValidationHasWarningTicket(permission, confirmModel);

    // Assert
    expect(result).toBe(false);
  });

  it('#isValidationHasWarningTicket should return false when have not transId', async () => {
    // Arrange
    const permission = new PermissionManage();
    const confirmModel = new ConfirmAbnormalBetModel();
    permission.manageRequestSettledTicketsHost = true;
    confirmModel.settledTickets = '';
    confirmModel.ticketsOfVIPCustomer = '';
    confirmModel.cn88Tickets = '';
    confirmModel.ticketsOfCustomerClass201 = '';
    confirmModel.ticketsOfCustomerClass4K = '';
    confirmModel.listBetteam = '';
    confirmModel.listBettype = '';

    // Action
    const result = validationService.isValidationHasWarningTicket(permission, confirmModel);

    // Assert
    expect(result).toBe(false);
  });

  it('#isValidationHasWarningTicket should return true when have settledTickets', async () => {
    // Arrange
    const permission = new PermissionManage();
    const confirmModel = new ConfirmAbnormalBetModel();
    permission.manageRequestSettledTicketsHost = true;
    confirmModel.settledTickets = '11111';

    // Action
    const result = validationService.isValidationHasWarningTicket(permission, confirmModel);

    // Assert
    expect(result).toBe(true);
  });

  it('#isHasWarningEditTakeNoteRequest should return true', async () => {
    // Arrange
    const actionIdTakeNote = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const actionIdManual = TVSRequestActionType.MANUAL_VOID_ID.toString();

    // Action
    const result = validationService.isHasWarningEditTakeNoteRequest(true, actionIdTakeNote, actionIdManual);

    // Assert
    expect(result).toBe(true);
  });

  it('#isHasWarningEditTakeNoteRequest should return false', async () => {
    // Arrange
    const actionIdTakeNote = TVSRequestActionType.TAKE_NOTE_ID.toString();

    // Action
    const result = validationService.isHasWarningEditTakeNoteRequest(true, actionIdTakeNote, actionIdTakeNote);

    // Assert
    expect(result).toBe(false);
  });

  it('#highlightFirstGroupError should not call function belong to groupNumber', async () => {
    // Arrange
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.updateInvalidItems = jest.fn();
    betIdsComponent.groupNumber.updateMoved = jest.fn();
    betIdsComponent.groupNumber.updateDifferent = jest.fn();
    const model = Helper.fakeValidationAbnormalBet;

    ['', null].forEach(x => {
      model.invalidTransIds = x;
      model.movedTransIds = x;
      model.differentMatchTransIds = x;
      model.settledTransIds = x;
      model.unsupportedTransIds = x;
      model.existingReqTransIds = x;
      model.nonLiveTransIds = x;
      model.differentLiveScoreTransIds = x;
      model.abWhiteListTransIds = x;

      // Action
      validationService['highlightFirstGroupError'](Helper.fakeValidationAbnormalBet, betIdsComponent, false);

      // Assert
      expect(betIdsComponent.groupNumber.updateInvalidItems).toHaveBeenCalledTimes(0);
      expect(betIdsComponent.groupNumber.updateMoved).toHaveBeenCalledTimes(0);
      expect(betIdsComponent.groupNumber.updateDifferent).toHaveBeenCalledTimes(0);
    });
  });
  it('#highlightSecondGroupError should not call function belong to groupNumber', async () => {
    // Arrange
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.updateInvalidItems = jest.fn();
    betIdsComponent.groupNumber.updateMoved = jest.fn();
    betIdsComponent.groupNumber.updateDifferent = jest.fn();
    const model = Helper.fakeValidationAbnormalBet;

    ['', null].forEach(x => {
      model.invalidTransIds = x;
      model.movedTransIds = x;
      model.differentMatchTransIds = x;
      model.settledTransIds = x;
      model.unsupportedTransIds = x;
      model.existingReqTransIds = x;
      model.nonLiveTransIds = x;
      model.differentLiveScoreTransIds = x;

      // Action
      validationService['highlightSecondGroupError'](Helper.fakeValidationAbnormalBet, betIdsComponent);

      // Assert
      expect(betIdsComponent.groupNumber.updateInvalidItems).toHaveBeenCalledTimes(0);
      expect(betIdsComponent.groupNumber.updateMoved).toHaveBeenCalledTimes(0);
      expect(betIdsComponent.groupNumber.updateDifferent).toHaveBeenCalledTimes(0);
    });
  });

  it('#highlightInvalidTransIds should call function belong to groupNumber', async () => {
    // Arrange
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.updateInvalidItems = jest.fn();
    betIdsComponent.groupNumber.updateMoved = jest.fn();
    betIdsComponent.groupNumber.updateDifferent = jest.fn();
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = Helper.fakeTransId;
    model.movedTransIds = Helper.fakeTransId;
    model.differentMatchTransIds = Helper.fakeTransId;
    model.settledTransIds = Helper.fakeTransId;
    model.unsupportedTransIds = Helper.fakeTransId;
    model.existingReqTransIds = Helper.fakeTransId;
    model.nonLiveTransIds = Helper.fakeTransId;
    model.differentLiveScoreTransIds = Helper.fakeTransId;
    model.abWhiteListTransIds = Helper.fakeTransId;

    // Action
    validationService['highlightInvalidTransIds'](Helper.fakeValidationAbnormalBet, betIdsComponent, false);

    // Assert
    expect(betIdsComponent.groupNumber.updateInvalidItems).toHaveBeenCalled();
    expect(betIdsComponent.groupNumber.updateMoved).toHaveBeenCalled();
    expect(betIdsComponent.groupNumber.updateDifferent).toHaveBeenCalled();
  });

  it('#getConfirmAbnormalBetModel should be return expected model', async () => {
    // Action
    const result = validationService['getConfirmAbnormalBetModel'](Helper.fakeValidationAbnormalBet);

    // Assert
    expect(result.settledTickets).toEqual(Helper.fakeValidationAbnormalBet.settledTransIds);
    expect(result.ticketsOfVIPCustomer).toEqual(Helper.fakeValidationAbnormalBet.transIdsOfVIPCustomer);
    expect(result.cn88Tickets).toEqual(Helper.fakeValidationAbnormalBet.cN88TransIds);
    expect(result.ticketsOfCustomerClass201).toEqual(Helper.fakeValidationAbnormalBet.transIdsOfCustomerClass201);
    expect(result.ticketsOfCustomerClass4K).toEqual(Helper.fakeValidationAbnormalBet.transIdsOfCustomerClass4K);
    expect(result.listBettype).toEqual(Helper.fakeValidationAbnormalBet.listBettype);
    expect(result.listBetteam).toEqual(Helper.fakeValidationAbnormalBet.listBetteam);
  });

  it('#isAbnormalBetMixParlay should return true', async () => {
    const args = new ValidationBusinessRuleArgs();
    args.issueTypeId = IssueTypeConstant.ABNORMAL_BET;
    args.filterBy = AbnormalFilterBy.MIX_PARLAY;
    const result = validationService['isAbnormalBetMixParlay'](args);

    expect(result).toBeTruthy();
  });

  it('#checkCanAddSettledTickets should return true', async () => {
    const permission = new PermissionManage();
    permission.manageRequestSettledTicketsHost  = true;
    const testCase = [
      TVSRequestActionType.MANUAL_VOID_ID.toString(),
      TVSRequestActionType.WAITING_ID.toString()
    ];
    testCase.forEach(x => {
      const result = validationService['checkCanAddSettledTickets'](permission, x);
      expect(result).toBeTruthy();
    });
  });

  it('#isEditingByAnotherUser should return true', async () => {
    const result = validationService.isEditingByAnotherUser(true, 1, 2);

    expect(result).toBeTruthy();
  });

  it('#checkCanShowButtonRemove should return true when have settledTransIds', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '';
    model.settledTransIds = '1,2,3';

    const result = validationService['checkCanShowButtonRemove'](model, false, '');

    expect(result).toBeTruthy();
  });

  it('#checkCanShowButtonRemove should return true when have unsupportedTransIds', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '';
    model.settledTransIds = '';
    model.unsupportedTransIds = '12321';

    const result = validationService['checkCanShowButtonRemove'](model, false, '');

    expect(result).toBeTruthy();
  });

  it('#checkCanShowButtonRemove should return true when have existingReqTransIds', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '';
    model.settledTransIds = '';
    model.unsupportedTransIds = '';
    model.existingReqTransIds = '123123';

    const result = validationService['checkCanShowButtonRemove'](model, false, '');

    expect(result).toBeTruthy();
  });

  it('#checkCanShowButtonRemove should return true when have nonLiveTransIds', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '';
    model.settledTransIds = '';
    model.unsupportedTransIds = '';
    model.existingReqTransIds = '';
    model.nonLiveTransIds = '12312';

    const result = validationService['checkCanShowButtonRemove'](model, false, '');

    expect(result).toBeTruthy();
  });

  it('#checkCanShowButtonRemove should return true when have differentLiveScoreTransIds', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '';
    model.settledTransIds = '';
    model.unsupportedTransIds = '';
    model.existingReqTransIds = '';
    model.nonLiveTransIds = '';
    model.differentLiveScoreTransIds = '12312';

    const result = validationService['checkCanShowButtonRemove'](model, false, '');

    expect(result).toBeTruthy();
  });

  it('#checkCanShowButtonRemove should return true when have abWhiteListTransIds', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '';
    model.settledTransIds = '';
    model.unsupportedTransIds = '';
    model.existingReqTransIds = '';
    model.nonLiveTransIds = '';
    model.differentLiveScoreTransIds = '';
    model.abWhiteListTransIds = '12312';

    const result = validationService['checkCanShowButtonRemove'](model, false, '');

    expect(result).toBeTruthy();
  });

  it('#checkCanShowButtonRemove should return true when have transIdsAreNotNumber', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '';
    model.settledTransIds = '';
    model.unsupportedTransIds = '';
    model.existingReqTransIds = '';
    model.nonLiveTransIds = '';
    model.differentLiveScoreTransIds = '';
    model.abWhiteListTransIds = '';

    const result = validationService['checkCanShowButtonRemove'](model, false, '12312');

    expect(result).toBeTruthy();
  });

  it('#checkCanShowButtonRemove should return false', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '';
    model.settledTransIds = '';
    model.unsupportedTransIds = '';
    model.existingReqTransIds = '';
    model.nonLiveTransIds = '';
    model.differentLiveScoreTransIds = '';
    model.abWhiteListTransIds = '';

    const result = validationService['checkCanShowButtonRemove'](model, false, '');

    expect(result).toBeFalsy();
  });

  it('#getInvalidTransIds should return list transId', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '1';
    model.settledTransIds = '2';
    model.unsupportedTransIds = '3';
    model.existingReqTransIds = '4';
    model.nonLiveTransIds = '5';
    model.differentLiveScoreTransIds = '6';
    model.abWhiteListTransIds = '7';

    const result = validationService['getInvalidTransIds'](model, false, '8');

    expect(result).toBe('1,2,3,4,5,6,7,8');
  });

  it('#getInvalidTransIds should return list transId empty', async () => {
    const model = Helper.fakeValidationAbnormalBet;
    model.invalidTransIds = '';
    model.settledTransIds = '';
    model.unsupportedTransIds = '';
    model.existingReqTransIds = '';
    model.nonLiveTransIds = '';
    model.differentLiveScoreTransIds = '';
    model.abWhiteListTransIds = '';

    const result = validationService['getInvalidTransIds'](model, false, '');

    expect(result).toBe('');
  });

  it('#checkAbnormalBetTransIds should return expected model', async () => {
    const expected = new CheckTransIdsViewModel();
    const model = Helper.fakeValidationBusinessRuleArgs;
    const mockAdRequestApiService = new AddRequestApiService(null);
    mockAdRequestApiService.checkValidTransIdsForAbnormalBet = jest.fn().mockImplementation(() => Promise.resolve(expected));
    const mockValidationService = new ValidationService(mockAdRequestApiService);
    mockValidationService['getTransInfo'] = jest.fn();
    [true, false].forEach(async x => {
      model.isValidateFromConfirmPopup = x;
      const result = await mockValidationService['checkAbnormalBetTransIds'](model, '', 1, 1, new ConfirmAbnormalBetComponent());
      expect(result).toStrictEqual(expected);
    });
  });

  it('#updateValidation should called #betIdsComponent.getAllBetIdsAreNotNumber', async () => {
    const mockValidationService = new ValidationService(null);
    Helper.fakeValidationBusinessRuleArgs.betIdsComponent.getAllBetIdsAreNotNumber = jest.fn();
    mockValidationService['updateValidation'](Helper.fakeValidationBusinessRuleArgs, Helper.fakeValidationAbnormalBet, false);

    expect(Helper.fakeValidationBusinessRuleArgs.betIdsComponent.getAllBetIdsAreNotNumber).toHaveBeenCalledTimes(1);
  });
});
