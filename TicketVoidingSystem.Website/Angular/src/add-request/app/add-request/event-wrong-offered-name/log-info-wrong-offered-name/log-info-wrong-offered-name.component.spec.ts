import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { FilterModel } from '../../filter/filter.model';
import { WrongOfferedNameModel } from '../../models/event-wrong-offered-name.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { GroupModel } from '../../pool-house-ticket/tickets/group-tickets.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { LogInfoWrongOfferedNameComponent } from './log-info-wrong-offered-name.component';
class Helper {
  static readonly fakeWrongOfferedNameModel: WrongOfferedNameModel = {
    currencyIds: '1,2',
    licenseeNames: 'licensee1,licensee2',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    subIssueTypeId: 1
  } as WrongOfferedNameModel;
  static readonly fakeLogInfoWrongOfferedName: LogInfoWrongOfferedName = {
    matchId: 1,
    filterWrongOfferedName: new FilterWrongOfferedNameModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
  } as LogInfoWrongOfferedName;
  static readonly fakeFilterWrongOfferedName: FilterWrongOfferedNameModel = {
    currencyIds: [],
    licenseeNames: []
  } as FilterWrongOfferedNameModel;
}

describe('LogInfoWrongOfferedNameComponent', () => {
  let mockComponent: LogInfoWrongOfferedNameComponent;
  let mockModalService: ModalService;

  beforeEach(() => {
    mockModalService = new ModalService(new NgbModalConfig(null), null, null);
    mockComponent = new LogInfoWrongOfferedNameComponent(mockModalService);
    mockComponent.logInfo = Helper.fakeLogInfoWrongOfferedName;
  });

  it('LogInfoWrongOfferedNameComponent init should match snapshot', async () => {
    expect(mockComponent).toMatchSnapshot();
  });

  it('clickHeader init should update isCollapse', async () => {
    mockComponent.logInfo.isCollapse = false;
    mockComponent.clickHeader();

    expect(mockComponent.logInfo.isCollapse).toBe(true);
  });

  it('isShowMessage should return true when messageValidationLogInfo have not error', async () => {
    mockComponent.logInfo.messageValidationLogInfo = [{ isError: false }] as ValidationMessage[];
    const actual = mockComponent.isShowMessage();

    expect(actual).toBeTruthy();
  });

  it('isShowMessage should return false when messageValidationLogInfo have error', async () => {
    mockComponent.logInfo.messageValidationLogInfo = [{ isError: true }] as ValidationMessage[];
    const actual = mockComponent.isShowMessage();

    expect(actual).toBeFalsy();
  });

  it('isShowMessage should return false', async () => {
    [undefined, [], null].forEach((message) => {
      mockComponent.logInfo.messageValidationLogInfo = message;
      const actual = mockComponent.isShowMessage();

      expect(actual).toBeFalsy();
    });
  });

  it('emitSearchEvent should emit #searchTicketEvent', async () => {
    mockComponent.searchTicketEvent.emit = jest.fn();
    mockComponent.emitSearchEvent();

    expect(mockComponent.searchTicketEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('openPopupTransIds should call #modalService.open', async () => {
    mockModalService.open = jest.fn();
    mockComponent.openPopupTransIds(1, '1,2');

    expect(mockModalService.open).toHaveBeenCalledTimes(1);
  });

  it('getIssueTypeId should return issue type number', async () => {
    mockComponent.filter = new FilterModel();
    mockComponent.filter.issueTypeId = '1';
    const actual = mockComponent.getIssueTypeId();

    expect(actual).toBe(1);
  });

  it('getSubIssueTypeId should return issue type number', async () => {
    mockComponent.filter = new FilterModel();
    mockComponent.filter.subIssueTypeId = '1';
    const actual = mockComponent.getSubIssueTypeId();

    expect(actual).toBe(1);
  });

  it('isNotShowTemplateMessage should return false', async () => {
    [undefined, [], null].forEach((groups) => {
      mockComponent.logInfo.tableTicketsModel = new TicketsModel();
      mockComponent.logInfo.tableTicketsModel.groups = groups;
      const actual = mockComponent.isShowTemplateMessage();

      expect(actual).toBeFalsy();
    });
  });

  it('isNotShowTemplateMessage should return true', async () => {
    mockComponent.logInfo.tableTicketsModel = new TicketsModel();
    mockComponent.logInfo.tableTicketsModel.groups = [{ tickets: [] } as GroupModel];
    const actual = mockComponent.isShowTemplateMessage();

    expect(actual).toBeTruthy();
  });
});