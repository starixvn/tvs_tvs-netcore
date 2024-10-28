import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { ValidationMessage } from '../../models/get-log-info.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { FilterWrongOfferedNameComponent } from '../filter-wrong-offered-name/filter-wrong-offered-name.component';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let mockService: ValidationService;
  let mockCheckAddPermissionService: CheckAddPermissionService;

  beforeEach(() => {
    mockCheckAddPermissionService = new CheckAddPermissionService(null);
    mockService = new ValidationService(mockCheckAddPermissionService);
  });

  it('#isAccountHasAddRequestPermission should return result from #checkPermissionService.isAccountHasAddRequestPermission', async () => {
    [true, false].forEach(x => {
      mockCheckAddPermissionService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(x);

      const actual = mockService.isAccountHasAddRequestPermission('action', true, true, new PermissionAddRequest());

      expect(actual).toBe(x);
    });
  });

  it('#validateCommonData should return expected result', async () => {
    [
      { event: true, filter: true, expected: true },
      { event: true, filter: false, expected: false },
      { event: false, filter: true, expected: false },
      { event: false, filter: false, expected: false }
    ].forEach(x => {
      const eventLeague = new EventLeagueComponent(null, null, null);
      const filterWrongOfferedNameComponent = new FilterWrongOfferedNameComponent(null, null, null, null, null, null);
      eventLeague.isMatchIdValid = jest.fn().mockReturnValue(x.event);
      filterWrongOfferedNameComponent.isValidity = jest.fn().mockReturnValue(x.filter);

      mockCheckAddPermissionService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(x);

      const actual = mockService.validateCommonData(eventLeague, filterWrongOfferedNameComponent);

      expect(actual).toBe(x.expected);
    });
  });

  it('#isValidLogInfoEvent should return true', async () => {
    const logInfoEvent = new LogInfoWrongOfferedName();
    logInfoEvent.messageValidationLogInfo = [{ isError: false }, { isError: false }] as ValidationMessage[];

    const actual = mockService.isValidLogInfoEvent(logInfoEvent);

    expect(actual).toBeTruthy();
  });

  it('#isValidLogInfoEvent should return true', async () => {
    const logInfoEvent = new LogInfoWrongOfferedName();
    logInfoEvent.messageValidationLogInfo = [{ isError: true }, { isError: false }] as ValidationMessage[];

    const actual = mockService.isValidLogInfoEvent(logInfoEvent);

    expect(actual).toBeFalsy();
  });

  it('isAutoCheckedCurrency should return expected', async () => {
    [
      { subIssueTypeId: SubIssueTypeConstant.TEAM_NAME_CHINESE, expected: true },
      { subIssueTypeId: SubIssueTypeConstant.LEAGUE_NAME_CHINESE, expected: true },
      { subIssueTypeId: SubIssueTypeConstant.TEAM_NAME_ENGLISH, expected: false },
      { subIssueTypeId: SubIssueTypeConstant.LEAGUE_NAME_ENGLISH, expected: false }
    ].forEach(item => {
      const actual = mockService['isSubTypeChinese'](item.subIssueTypeId.toString());
      expect(actual).toEqual(item.expected);
    });
  });
});
