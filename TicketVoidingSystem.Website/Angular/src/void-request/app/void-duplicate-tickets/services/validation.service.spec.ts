import { RequestDetailModel, RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateMessageComponent } from '../../../../utility/components/template-message/template-message/template-message.component';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { Result, SqlResult } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidPageDuplicateTicketsModel } from '../models/void-page-duplicate-tickets.model';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 111111,
    errorMsg: '',
  };
}

let validationService : ValidationService ;

beforeEach(() => {
  validationService = new ValidationService(null);
});

describe('ValidationService', () => {

  it('#isDuplicateTicketsMixParlay should return true', async () => {
    const actual = validationService.isDuplicateTicketsMixParlay(1);

    expect(actual).toBeTruthy();
  });

  it('#checkVoidBetPermission should return true', async () => {
    const mockResult = new SqlResult();
    mockResult.errCode = 0;
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    voidPageItem.detailViewModel.request = new RequestDetailModel();
    voidPageItem.detailViewModel.request.issueTypeId = 1;
    voidPageItem.filterBy = 0;
    voidPageItem.matchModel = new MatchModel();
    const commonService = new CommonService(null);
    commonService.checkVoidBetPermission = jest.fn().mockReturnValue(mockResult);

    const mockValidationService = new ValidationService(commonService);
    const actual = await mockValidationService.checkVoidBetPermission(voidPageItem);

    expect(actual.isSuccessful).toBeTruthy();
  });

  it('#checkVoidBetPermission should return false', async () => {
    const mockResult = new SqlResult();
    mockResult.errCode = 1;
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.detailViewModel = new RequestDetailViewModel();
    voidPageItem.detailViewModel.request = new RequestDetailModel();
    voidPageItem.detailViewModel.request.issueTypeId = 1;
    voidPageItem.filterBy = 1;
    const commonService = new CommonService(null);
    commonService.checkVoidBetPermission = jest.fn().mockReturnValue(mockResult);

    const mockValidationService = new ValidationService(commonService);
    const actual = await mockValidationService.checkVoidBetPermission(voidPageItem);

    expect(actual.isSuccessful).toBeFalsy();
  });

  it('#checkValidationBeforeVoid should return false when voidPageItem not valid', async () => {
    [null, undefined].forEach(x => {
      const mockValidationService = new ValidationService(null);
      const actual = mockValidationService.checkValidationBeforeVoid(x, null);

      expect(actual.isSuccessful).toBeFalsy();
    });
  });

  it('#checkValidationBeforeVoid should return false when voidPageItem has total = 0', async () => {
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.matchModel = new MatchModel();
    voidPageItem.voidTicketsMini.total = 0;
    const mockValidationService = new ValidationService(null);
    const actual = mockValidationService.checkValidationBeforeVoid(voidPageItem, null);

    expect(actual.isSuccessful).toBeFalsy();
  });

  it('#checkValidationBeforeVoid should return false when templateMessageComponent null', async () => {
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.matchModel = new MatchModel();
    voidPageItem.voidTicketsMini.total = 6;
    const mockValidationService = new ValidationService(null);
    const actual = mockValidationService.checkValidationBeforeVoid(voidPageItem, null);

    expect(actual.isSuccessful).toBeFalsy();
  });

  it('#checkValidationBeforeVoid should return false when templateMessageComponent.checkValidation false', async () => {
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.checkValidation = jest.fn().mockReturnValue(false);
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.voidTicketsMini.total = 6;
    voidPageItem.matchModel = new MatchModel();
    const mockValidationService = new ValidationService(null);
    const actual = mockValidationService.checkValidationBeforeVoid(voidPageItem, templateMessageComponent);

    expect(actual.isSuccessful).toBeFalsy();
  });

  it('#checkValidationBeforeVoid should return true when voidReason null', async () => {
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.checkValidation = jest.fn().mockReturnValue(true);
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.voidTicketsMini.total = 6;
    voidPageItem.filterBy = 0;
    voidPageItem.matchModel = new MatchModel();
    voidPageItem.voidReason = null;
    const mockValidationService = new ValidationService(null);
    const actual = mockValidationService.checkValidationBeforeVoid(voidPageItem, templateMessageComponent);

    expect(actual.isSuccessful).toBeTruthy();
  });

  it('#checkValidationBeforeVoid should return false when reasonEnglish empty', async () => {
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.checkValidation = jest.fn().mockReturnValue(true);
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.voidTicketsMini.total = 6;
    voidPageItem.filterBy = 0;
    voidPageItem.matchModel = new MatchModel();
    voidPageItem.voidReason = new VoidedReason();
    voidPageItem.voidReason.reasonEnglish = '';
    const mockValidationService = new ValidationService(null);
    const actual = mockValidationService.checkValidationBeforeVoid(voidPageItem, templateMessageComponent);

    expect(actual.isSuccessful).toBeFalsy();
  });

  it('#checkValidationBeforeVoid should return false when reasonChineseSimplified  empty', async () => {
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.checkValidation = jest.fn().mockReturnValue(true);
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.voidTicketsMini.total = 6;
    voidPageItem.filterBy = 0;
    voidPageItem.matchModel = new MatchModel();
    voidPageItem.voidReason = new VoidedReason();
    voidPageItem.voidReason.reasonEnglish = 'acs';
    voidPageItem.voidReason.reasonChineseSimplified = '';
    const mockValidationService = new ValidationService(null);
    const actual = mockValidationService.checkValidationBeforeVoid(voidPageItem, templateMessageComponent);

    expect(actual.isSuccessful).toBeFalsy();
  });

  it('#checkValidationBeforeVoid should return true', async () => {
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.checkValidation = jest.fn().mockReturnValue(true);
    const voidPageItem = new VoidPageDuplicateTicketsModel();
    voidPageItem.voidTicketsMini = new TicketsModel();
    voidPageItem.voidTicketsMini.total = 6;
    voidPageItem.filterBy = 1;
    voidPageItem.matchModel = new MatchModel();
    voidPageItem.voidReason = new VoidedReason();
    voidPageItem.voidReason.reasonEnglish = 'acs';
    voidPageItem.voidReason.reasonChineseSimplified = 'abac';
    const mockValidationService = new ValidationService(null);
    const actual = mockValidationService.checkValidationBeforeVoid(voidPageItem, templateMessageComponent);

    expect(actual.isSuccessful).toBeTruthy();
  });
});