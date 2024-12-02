import { AdvancedModeAddRequestComponent } from '../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { ValidationMessage } from '../../models/get-log-info.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { FilterOtherIssuesComponent } from '../filter-other-issues/filter-other-issues.component';
import { FilterOtherIssuesModel } from '../models/filter-other-isssues.model';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';
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
      { event: true, filter: true, advancedMode: true, expected: true },
      { event: true, filter: false, advancedMode: true, expected: false },
      { event: false, filter: true, advancedMode: true, expected: false },
      { event: false, filter: false, advancedMode: true, expected: false },
      { event: true, filter: true, advancedMode: true, expected: true },
      { event: true, filter: true, advancedMode: false, expected: false }
    ].forEach(x => {
      const eventLeague = new EventLeagueComponent(null, null, null);
      const filterOtherIssuesComponent = new FilterOtherIssuesComponent(null, null);
      eventLeague.isMatchIdValid = jest.fn().mockReturnValue(x.event);
      filterOtherIssuesComponent.isValidity = jest.fn().mockReturnValue(x.filter);
      const advancedMode = new AdvancedModeAddRequestComponent();
      advancedMode.isValidity = jest.fn().mockReturnValue(x.advancedMode);

      mockCheckAddPermissionService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(x);

      const actual = mockService.validateCommonData(eventLeague, filterOtherIssuesComponent, advancedMode);

      expect(actual).toBe(x.expected);
    });
  });

  it('#isValidLogInfoEvent should return true', async () => {
    const logInfoEvent = new LogInfoOtherIssues();
    logInfoEvent.messageValidationLogInfo = [{ isError: false }, { isError: false }] as ValidationMessage[];

    const actual = mockService.isValidLogInfoEvent(logInfoEvent);

    expect(actual).toBeTruthy();
  });

  it('#isValidLogInfoEvent should return true', async () => {
    const logInfoEvent = new LogInfoOtherIssues();
    logInfoEvent.messageValidationLogInfo = [{ isError: true }, { isError: false }] as ValidationMessage[];

    const actual = mockService.isValidLogInfoEvent(logInfoEvent);

    expect(actual).toBeFalsy();
  });

  it('#isFromTimeSameOrBeforeToTime should return false', async () => {
    const model: FilterOtherIssuesModel = {
      fromDateTime: '2020-10-10 10:44:46.361 PM',
      toDateTime: '2020-10-09 09:44:46.361 PM'
    }
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = mockService.isFromTimeSameOrBeforeToTime(model, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('isSubTypeRestart should return expected', async () => {
    [
      { subIssueTypeId: SubIssueTypeConstant.RESTART, expected: true },
      { subIssueTypeId: SubIssueTypeConstant.MAIN_CORNER, expected: false }
    ].forEach(item => {
      const actual = mockService['isSubTypeRestart'](item.subIssueTypeId.toString());
      expect(actual).toEqual(item.expected);
    });
  });
});
