import { SubIssueType } from './../../../../../utility/models/issue-type.model';
import * as _ from 'lodash';
import { AbnormalFilterBy } from '../../../../../utility/constants/config';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalBetModel } from '../../models/abnormal-bet.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { OthersModel } from '../../others/others.model';
import { ConfirmAbnormalBetComponent } from '../confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from '../confirm-abnormal-bet/confirm-abnormal-bet.model';
import { PrimitiveProperty } from '../event-abnormal-bet.model';
import { LeagueEventAbnormalComponent } from '../league-event-abnormal/league-event-abnormal.component';
import { SaveRequestArg } from './save-request.model';
import { SaveRequestService } from './save-request.service';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';

class Helper {
  static readonly url = 'http://localhost:60196/';
  static readonly fakeRequestId = 10222;
  static readonly fakeTransId = '100000002';
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  };
  static readonly fakeConfirmAbnormalBetModel: ConfirmAbnormalBetModel = {
    isOpenDialog: true,
    isHasWarningForAbnormalBet: true,
    isHasWarningEditTakeNoteRequest: false,
    isEditingByAnotherUser: false,
    requestId: 0,
    requestedBy: '',
    transIds: '1022222',
    cn88Tickets: '2123122',
    ticketsOfVIPCustomer: '2123122',
    settledTickets:'2123122',
    ticketsOfCustomerClass201: '2123122',
    ticketsOfCustomerClass4K: '2123122',
    isHasWarningRemovedTickets: false,
    listBettype : 'aa',
    listBetteam : 'bb'
  };
  static readonly fakeSaveRequestArg: SaveRequestArg = {
    requestId: Helper.fakeRequestId,
    isEdit: false,
    transIds: '',
    filter: Helper.fakeFilterModel,
    abnormalBetModel: new AbnormalBetModel(),
    others: new OthersModel(),
    confirmAbnormalBetModel: Helper.fakeConfirmAbnormalBetModel,
    leagueEventAbnormalComponent: null,
    confirmAbnormalBetComponent: null,
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
    args.filter.subIssueTypeId = '1';
    const mockSubIssueType: SubIssueType = {
      subIssueTypeId: 1,
      issueTypeId: 0,
      subIssueTypeName: '123',
      subIssueTypeNameCS: ''
    };
    args.filter.subIssueTypes = [mockSubIssueType];
    args.abnormalBetModel = new AbnormalBetModel();
    args.leagueEventAbnormalComponent = new LeagueEventAbnormalComponent(null, null);
    args.confirmAbnormalBetComponent = new ConfirmAbnormalBetComponent();
    args.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    mockSaveRequestService = new SaveRequestService(null);
    const result = mockSaveRequestService['initAddRequestQuery'](args);

    expect(result.issueTypeId).toEqual(args.filter.issueTypeId);
    expect(result.actionId).toEqual(args.filter.action);
    expect(result.isTest).toEqual(args.filter.isTest);
    expect(result.sportType).toEqual(args.leagueEventAbnormalComponent.selectedSportTypeId);
    expect(result.isVoided).toEqual(args.filter.isVoided);
    expect(result.mistakenBy).toEqual(args.others.mistakenBy);
  });

  it('#initAddRequestQuery should return expected model when isAbnormalBetMixParlay true', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    args.filter.issueTypeId = '11';
    args.filter.subIssueTypeId = '1';
    args.filterBy = AbnormalFilterBy.MIX_PARLAY;
    args.abnormalBetModel = new AbnormalBetModel();
    args.leagueEventAbnormalComponent = new LeagueEventAbnormalComponent(null, null);
    args.confirmAbnormalBetComponent = new ConfirmAbnormalBetComponent();
    args.primitiveProps.transInfoAddRequestModel = null;
    mockSaveRequestService = new SaveRequestService(null);
    args.filter.subIssueTypes = null;
    const result = mockSaveRequestService['initAddRequestQuery'](args);

    expect(result.issueTypeId).toEqual(args.filter.issueTypeId);
    expect(result.actionId).toEqual(args.filter.action);
    expect(result.isTest).toEqual(args.filter.isTest);
    expect(result.isVoided).toEqual(args.filter.isVoided);
  });

  it('#getTransIdsForSaveRequest should return transId when have only ticketsOfCustomerClass201', async () => {
    const confirmAbnormalBetComponent = new ConfirmAbnormalBetComponent();
    const fakeConfirmAbnormalBetModel = _.clone(Helper.fakeConfirmAbnormalBetModel);
    confirmAbnormalBetComponent.isRemoveCustomerClass201 = true;
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass201 = '1000022' + Helper.fakeTransId;
    mockSaveRequestService = new SaveRequestService(null);
    const result = mockSaveRequestService['getTransIdsForSaveRequest'](Helper.fakeConfirmAbnormalBetModel, confirmAbnormalBetComponent, Helper.fakeTransId);

    expect(result).toEqual(Helper.fakeTransId);
  });

  it('#getTransIdsForSaveRequest should return transId when have not ticketsOfCustomerClass1', async () => {
    const confirmAbnormalBetComponent = new ConfirmAbnormalBetComponent();
    confirmAbnormalBetComponent.isRemoveCustomerClass201 = false;
    mockSaveRequestService = new SaveRequestService(null);
    const result = mockSaveRequestService['getTransIdsForSaveRequest'](Helper.fakeConfirmAbnormalBetModel, confirmAbnormalBetComponent, Helper.fakeTransId);

    expect(result).toEqual(Helper.fakeTransId);
  });
});
