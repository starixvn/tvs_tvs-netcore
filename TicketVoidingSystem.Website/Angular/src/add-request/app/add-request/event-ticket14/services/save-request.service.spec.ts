import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { EventTicket14Model } from '../../models/event-ticket-14.model';
import { OthersModel } from '../../others/others.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { SaveRequestService } from './save-request.service';

class Helper {
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeSaveRequestArg: SaveRequestArg = {
    requestId: 1111,
    isEdit: false,
    transIds: '',
    filter: Helper.fakeFilterModel,
    eventTicket14Model: new EventTicket14Model(),
    others: new OthersModel(),
    addRequestStore: new AddRequestStore(),
    filterBy: null,
    primitiveProps: new PrimitiveProperty
  };
}

describe('SaveRequestService', () => {
  let mockSaveRequestService: SaveRequestService;
  let mockAddRequestService: AddRequestService;

  beforeEach(() => {
    mockAddRequestService = new AddRequestService(null, null, null);
    mockAddRequestService.executeSaveRequest = jest.fn();
  });

  it('#executeSaveRequestApi should call #executeSaveRequest', async () => {
    const args = Helper.fakeSaveRequestArg;
    const spyExecuteSaveRequest = jest.spyOn(mockAddRequestService, 'executeSaveRequest').mockImplementation();
    mockSaveRequestService = new SaveRequestService(mockAddRequestService);
    mockSaveRequestService['initAddRequestQuery'] = jest.fn().mockImplementation(() => new AddRequestQuery());
    await mockSaveRequestService.executeSave(args);

    expect(spyExecuteSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#initAddRequestQuery should return expected model', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    args.eventTicket14Model = new EventTicket14Model();
    mockSaveRequestService = new SaveRequestService(null);
    const result = mockSaveRequestService['initAddRequestQuery'](args);

    expect(result.issueTypeId).toEqual(args.filter.issueTypeId);
    expect(result.actionId).toEqual(args.filter.action);
    expect(result.isTest).toEqual(args.filter.isTest);
    expect(result.isVoided).toEqual(args.filter.isVoided);
    expect(result.mistakenBy).toEqual(args.others.mistakenBy);
  });
});