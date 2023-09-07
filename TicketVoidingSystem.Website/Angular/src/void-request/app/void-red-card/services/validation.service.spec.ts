
import { ValidationService } from './validation.service';
import * as _ from 'lodash';
import { PagingModel } from '../../../../utility/components/paging/paging/paging.model';
import { Message } from '../../../../utility/components/template-message/messages/message';
import { TemplateMessageComponent } from '../../../../utility/components/template-message/template-message/template-message.component';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { LABELS } from '../../../../utility/constants/labels';
import { AffectedLicensee } from '../../../../utility/models/affected-licensee.model';
import { SubIssueType } from '../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { SqlResult } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { ResultModelService } from '../../../../utility/services/result-model.service';
import { VoidMatch } from '../../models/void-match.model';
import { TicketsModel } from '../../tickets-list/tickets.model';

class Helper {
  static readonly fakeRequestId = 50121;
  static readonly fakeVoidMatch: VoidMatch = {
    subIssueType: new SubIssueType(),
    displayIssueTypeName: '',
    matchModel: new MatchModel(),
    voidTicketsMini: new TicketsModel(),
    voidReason: new VoidedReason(),
    templateValue: new TemplateValue(),
    logInfoDetail: new LogInfoDetail(),
    voidTicketsFull: new TicketsModel(),
    pagingVoidTickets: new PagingModel(),
    isShowTicketFull: true,
    isLoadedTicketFull: true,
    isBlockBetList: true,
    affectedLicensee: new AffectedLicensee(),
    affectedInstantLicensee: new AffectedLicensee(),
    chinaViewLicensee: new AffectedLicensee(),
    cashOutLicensee: new AffectedLicensee(),
    isShowTemplateMessage: true,
    templateMessage: new Message(),
    isCheckedEarlyEvent: false,
    isAllLiveTickets: false,
    isMainMatch: false,
    isPoolHouseAffected: false
  };
  static readonly fakeSqlResultError: SqlResult = {
    errCode: 1,
    errMsg: 'error',
    isSuccessful: false,
  };
  static readonly fakeSqlResultSuccessful: SqlResult = {
    errCode: 0,
    errMsg: '',
    isSuccessful: true,
  };
}

describe('ValidationService', () => {
  let validationService: ValidationService;
  let commonService: CommonService;
  beforeEach(() => {
    commonService = new CommonService(null);
    validationService = new ValidationService(commonService);
  });

  it('should be created', () => {
    expect(validationService).toBeTruthy();
  });
  it('#checkValidationBeforeVoid should return result when have not matchHasTickets', async () => {
    // Action
    const result = validationService.checkValidationBeforeVoid([], null);

    // Assert
    expect(result.errorCode).toBe(1);
    expect(result.errorMsg).toBe(LABELS.ALL_TICKETS_VOIDED);
  });

  it('#checkValidationBeforeVoid should return result when have not messageComponent', async () => {
    // Action
    const result = validationService.checkValidationBeforeVoid([Helper.fakeVoidMatch], []);

    // Assert
    expect(result.errorCode).toBe(1);
    expect(result.errorMsg).toBe(`${LABELS.INVALID_TEMPLATE_MESSAGE} (MatchId: ${Helper.fakeVoidMatch.matchModel.matchId})`);
  });

  it('#checkValidationBeforeVoid should return result when #messageComponent.checkValidation is false', async () => {
    // Arrange
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.checkValidation = jest.fn().mockImplementation(() => false);
    // Action
    const result = validationService.checkValidationBeforeVoid([Helper.fakeVoidMatch], [templateMessageComponent]);

    // Assert
    expect(result.errorCode).toBe(1);
    expect(result.errorMsg).toBe(`${LABELS.INVALID_TEMPLATE_MESSAGE} (MatchId: ${Helper.fakeVoidMatch.matchModel.matchId})`);
  });

  it('#checkValidationBeforeVoid should return result when #voidReason.reasonEnglish is empty', async () => {
    // Arrange
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.checkValidation = jest.fn().mockImplementation(() => true);
    const fakeVoidMatch = _.clone(Helper.fakeVoidMatch);
    fakeVoidMatch.voidReason = new VoidedReason();
    fakeVoidMatch.voidReason.reasonEnglish = '';
    validationService['mapValidMessageToVoidMatch'] = jest.fn();

    // Action
    const result = validationService.checkValidationBeforeVoid([fakeVoidMatch], [templateMessageComponent]);

    // Assert
    expect(result.errorCode).toBe(1);
    expect(result.errorMsg).toBe(`${LABELS.INPUT_REASON} (MatchId: ${Helper.fakeVoidMatch.matchModel.matchId})`);
  });

  it('#checkValidationBeforeVoid should return result successful', async () => {
    // Arrange
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.checkValidation = jest.fn().mockImplementation(() => true);
    const fakeVoidMatch = _.clone(Helper.fakeVoidMatch);
    fakeVoidMatch.voidReason = new VoidedReason();
    fakeVoidMatch.voidReason.reasonEnglish = 'reason';
    fakeVoidMatch.voidReason.reasonChineseSimplified = 'reason';
    const expected = ResultModelService.createSuccessResult();

    // Action
    const result = validationService.checkValidationBeforeVoid([Helper.fakeVoidMatch], [templateMessageComponent]);

    // Assert
    expect(result.errorCode).toBe(expected.errorCode);
    expect(result.errorMsg).toBe(expected.errorMsg);
  });

  it('#checkVoidBetPermission should return error', async () => {
    // Arrange    
    const fakeVoidMatch = _.clone(Helper.fakeVoidMatch);
    fakeVoidMatch.voidReason = new VoidedReason();
    fakeVoidMatch.voidReason.reasonEnglish = 'reason';
    fakeVoidMatch.voidReason.reasonChineseSimplified = 'reason';
    fakeVoidMatch.voidTicketsMini.cancelCashOutTickets = [];
    fakeVoidMatch.voidTicketsMini.cricketTickets = [];
    fakeVoidMatch.voidTicketsMini.singleTickets = [];
    fakeVoidMatch.voidTicketsMini.parlayTickets = [];

    validationService['getTicketsForCheckPermission'] = jest.fn().mockImplementation(() => []);
    const spyCommonServiceCheckVoidBetPermission = jest.spyOn(commonService, 'checkVoidBetPermission').mockImplementation(() => Promise.resolve(Helper.fakeSqlResultError));

    // Action
    const result = await validationService.checkVoidBetPermission([Helper.fakeVoidMatch]);

    // Assert
    expect(spyCommonServiceCheckVoidBetPermission).toHaveBeenCalledTimes(1);
    expect(result.errorCode).toBe(1);
    expect(result.errorMsg).toBe(Helper.fakeSqlResultError.errMsg);
  });

  it('#checkVoidBetPermission should return error', async () => {
    // Arrange    
    const fakeVoidMatch = _.clone(Helper.fakeVoidMatch);
    fakeVoidMatch.voidReason = new VoidedReason();
    fakeVoidMatch.voidReason.reasonEnglish = 'reason';
    fakeVoidMatch.voidReason.reasonChineseSimplified = 'reason';
    validationService['getTicketsForCheckPermission'] = jest.fn().mockImplementation(() => []);
    const spyCommonServiceCheckVoidBetPermission = jest.spyOn(commonService, 'checkVoidBetPermission').mockImplementation(() => Promise.resolve(Helper.fakeSqlResultSuccessful));
    // Action
    const result = await validationService.checkVoidBetPermission([Helper.fakeVoidMatch]);

    // Assert
    expect(spyCommonServiceCheckVoidBetPermission).toHaveBeenCalledTimes(1);
    expect(result.errorCode).toBe(0);
    expect(result.errorMsg).toBe('');
  });

  it('#mapValidMessageToVoidMatch should update model', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    const templateMessageComponent = new TemplateMessageComponent(null, null);

    // Action
    validationService['mapValidMessageToVoidMatch'](voidMatch, templateMessageComponent);

    // Assert
    expect(voidMatch.templateMessage).toBe(templateMessageComponent.message);
  });
});
