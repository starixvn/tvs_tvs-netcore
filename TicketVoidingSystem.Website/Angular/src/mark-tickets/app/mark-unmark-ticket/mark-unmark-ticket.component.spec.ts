import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { BetIdsComponent } from '../../../utility/components/bet-ids/bet-ids.component';
import { GroupNumber } from '../../../utility/components/bet-ids/bet-ids.model';
import { ModalType } from '../../../utility/components/modal/modal';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { LABELS } from '../../../utility/constants/labels';
import { CheckingPermissionModel } from '../../../utility/models/checking-permission.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { GetTicketsQuery, MarkedTicketQuery, TicketDetailId } from '../models/query.model';
import { ResultMarkTicketModel } from '../models/result.model';
import { TicketsModel } from '../tickets-list/tickets.model';
import { AllMarkedTicketModel } from './all-marked-ticket-list/all-marked-ticket.model';
import { FilterTicketsComponent } from './filter-tickets/filter-tickets.component';
import { FilterSearchBy } from './filter-tickets/filter.model';
import { MarkUnmarkTicketComponent } from './mark-unmark-ticket.component';

class Helper {
  static readonly fakeResultUpdateMarkedTicket = {
    errorCode: 0,
    errorMsg: ''
  } as ResultMarkTicketModel;

  static readonly confirmModalMark = {
    title: 'Mark/Unmark Tickets',
    message: LABELS.CONFIRM_MARK_TICKET,
    type: ModalType.Confirm
  };

  static readonly confirmModalUnMark = {
    title: 'Mark/Unmark Tickets',
    message: LABELS.CONFIRM_UNMARK_TICKET,
    type: ModalType.Confirm
  };

  static readonly checkingPermissionModal = {
    action: true,
    apikey: "mark-tickets-check-permission",
    isCashOutAsUnSettledTicket: null,
    isCheckForTVS: false,
    matchId: null,
    tickets: undefined,
  } as CheckingPermissionModel;

  static readonly openModal = {
    title: 'Mark tickets result',
    message: '',
    type: ModalType.Alert
  };
}
describe('MarkUnmarkTicketComponent', () => { 
  it('#copiedAffectLicenseees should call #window.alert', async () => {
    const component = new MarkUnmarkTicketComponent(null, null, null);
    window.alert = jest.fn();

    component.copiedAffectLicenseees();

    expect(window.alert).toBeCalledTimes(1);
  });
  
  it('#getMatchInfo should call #commonService.getMatch', async () => {
    const matchId = 99;
    const commonService = new CommonService(null);
    commonService.getMatch = jest.fn();
    const component = new MarkUnmarkTicketComponent(null, commonService, null);
    component.query = new GetTicketsQuery();
    component.query.searchBy = FilterSearchBy.MATCH_ID;
    component.match = new MatchModel();
    component.match.matchId = 1;

    await component.getMatchInfo(matchId);

    expect(commonService.getMatch).toBeCalledTimes(1);
  });
  
  it('#getMatchInfo should not call #commonService.getMatch', async () => {
    const matchId = 99;
    const commonService = new CommonService(null);
    commonService.getMatch = jest.fn();
    const component = new MarkUnmarkTicketComponent(null, commonService, null);
    component.query = new GetTicketsQuery();
    component.query.searchBy = FilterSearchBy.BETIDS;
    component.match = new MatchModel();
    component.match.matchId = 1;

    await component.getMatchInfo(matchId);

    expect(commonService.getMatch).toBeCalledTimes(0);
  });
  
  it('#getTickets should not call #updateMoved', async () => {
    const fakeTicketsModel = {
      invalidTransIds: '12312',
      markedTransIds: '12312',
      movedTransIds: '12312'
    } as TicketsModel;
    const appService = new AppService(null);
    appService.getTickets = jest.fn().mockImplementation(() => Promise.resolve(fakeTicketsModel));
    const component = new MarkUnmarkTicketComponent(appService, null, null);
    const query = new GetTicketsQuery();
    component.ticketsModel = new TicketsModel();
    component.ticketsModel.initData = jest.fn();
    component.query.searchBy = FilterSearchBy.BETIDS;
    component.filterTickets = new FilterTicketsComponent(null, null, null);
    component.filterTickets.betIdsComponent = new BetIdsComponent(null);
    component.filterTickets.betIdsComponent.groupNumber = new GroupNumber();
    component.filterTickets.betIdsComponent.groupNumber.updateInvalidItems = jest.fn();
    component.filterTickets.betIdsComponent.groupNumber.updateMoved = jest.fn();    

    await component.getTickets(query);

    expect(appService.getTickets).toBeCalledTimes(1);
    expect(component.filterTickets.betIdsComponent.groupNumber.updateInvalidItems).toHaveBeenCalled();
    expect(component.filterTickets.betIdsComponent.groupNumber.updateMoved).toHaveBeenCalled();
  });
  
  it('#getTickets should update isShowTickets false when has exception', async () => {
    const fakeTicketsModel = {
      invalidTransIds: '12312',
      markedTransIds: '12312',
      movedTransIds: '12312'
    } as TicketsModel;
    const appService = new AppService(null);
    appService.getTickets = jest.fn().mockImplementation(() => Promise.resolve(fakeTicketsModel));
    const component = new MarkUnmarkTicketComponent(appService, null, null);
    const query = new GetTicketsQuery();
    component.ticketsModel = null; 

    await component.getTickets(query);

    expect(appService.getTickets).toBeCalledTimes(1);
  });
  
  it('#getAllMarkedTickets should call #appService.getAllMakerdTickets', async () => {
    const fakeTicketsModel = new AllMarkedTicketModel();
    const appService = new AppService(null);
    appService.getAllMakerdTickets = jest.fn().mockImplementation(() => Promise.resolve(fakeTicketsModel));
    const component = new MarkUnmarkTicketComponent(appService, null, null);
    component.pagingOfAllMarked = new PagingModel();  

    await component.getAllMarkedTickets(new GetTicketsQuery());

    expect(appService.getAllMakerdTickets).toBeCalledTimes(1);
  });
  
  it('#searchEvent should call #getAllMarkedTickets', async () => {
    const query = {
      searchBy: FilterSearchBy.ALL_MARKED,
      status: '0',
      matchId: '1'
    } as GetTicketsQuery;
    const component = new MarkUnmarkTicketComponent(null, null, null);
    component.getAllMarkedTickets = jest.fn();

    await component.searchEvent(query);

    expect(component.getAllMarkedTickets).toBeCalledTimes(1);
  });
  
  it('#searchEvent should call #getTickets', async () => {
    const query = {
      searchBy: FilterSearchBy.BETIDS,
      status: '1',
      matchId: '1'
    } as GetTicketsQuery;
    const component = new MarkUnmarkTicketComponent(null, null, null);
    component.getMatchInfo = jest.fn();
    component.getTickets = jest.fn();

    await component.searchEvent(query);

    expect(component.getMatchInfo).toBeCalledTimes(1);
    expect(component.getTickets).toBeCalledTimes(1);
  });
  
  it('#getDetailTickets should call #appService.getTicketsDetail', async () => {
    const ticketDetailId = {
      matchId: '1',
      userId: 1212,
      createdDate: new Date()
    }  as TicketDetailId;
    const fakeTicketsModel = new AllMarkedTicketModel();
    const appService = new AppService(null);
    const commonService = new CommonService(null);
    appService.getTicketsDetail = jest.fn().mockImplementation(() => Promise.resolve(fakeTicketsModel));
    commonService.getMatch = jest.fn().mockImplementation(() => Promise.resolve(new MatchModel()));
    const component = new MarkUnmarkTicketComponent(appService, commonService, null);
    component.pagingOfAllMarked = new PagingModel();  
    component.ticketsModel.initData = jest.fn();

    await component.getDetailTickets(ticketDetailId);

    expect(appService.getTicketsDetail).toBeCalledTimes(1);
    expect(commonService.getMatch).toBeCalledTimes(1);
  });
  
  it('#pagingEvent should call #getDetailTickets', async () => {
    const component = new MarkUnmarkTicketComponent(null, null, null);
    component.query.searchBy = FilterSearchBy.ALL_MARKED;
    component.getDetailTickets = jest.fn();
    component.getTickets = jest.fn();
    component.ticketsModel.updateTicketsByUncheckTransIds = jest.fn();

    await component.pagingEvent();

    expect(component.getDetailTickets).toBeCalledTimes(1);
  });
  
  it('#pagingEvent should call #getTickets', async () => {
    const component = new MarkUnmarkTicketComponent(null, null, null);
    component.query.searchBy = FilterSearchBy.BETIDS;
    component.getDetailTickets = jest.fn();
    component.getTickets = jest.fn();
    component.ticketsModel.updateTicketsByUncheckTransIds = jest.fn();

    await component.pagingEvent();

    expect(component.getTickets).toBeCalledTimes(1);
  });
  
  it('#pagingEventOfAllMarked should call #getAllMarkedTickets', async () => {
    const component = new MarkUnmarkTicketComponent(null, null, null);
    component.getAllMarkedTickets = jest.fn();

    await component.pagingEventOfAllMarked();

    expect(component.getAllMarkedTickets).toBeCalledTimes(1);
  });
  
  it('#refreshAllMarkedTickets should call #getAllMarkedTickets', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = jest.fn();
    const component = new MarkUnmarkTicketComponent(null, null, modalService);
    component.getAllMarkedTickets = jest.fn();

    await component.refreshAllMarkedTickets();

    expect(component.getAllMarkedTickets).toBeCalledTimes(1);
  });
  
  it('#exportExcel should call #modalService.open', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = jest.fn();
    const component = new MarkUnmarkTicketComponent(null, null, modalService);
    component.getAllMarkedTickets = jest.fn();
    component.paging.total = 200000;

    await component.exportExcel();

    expect(modalService.open).toBeCalledTimes(1);
  });
  
  it('#exportExcel should call #appService.exportExcelDetailTickets', async () => {
    const appService = new AppService(null);
    appService.exportExcelDetailTickets = jest.fn();
    const component = new MarkUnmarkTicketComponent(appService, null, null);
    component.getAllMarkedTickets = jest.fn();
    component.paging.total = 10000;
    component.query.searchBy = FilterSearchBy.ALL_MARKED;
    await component.exportExcel();

    expect(appService.exportExcelDetailTickets).toBeCalledTimes(1);
  });
  
  it('#exportExcel should call #appService.exportExcel', async () => {
    const appService = new AppService(null);
    appService.exportExcel = jest.fn();
    const component = new MarkUnmarkTicketComponent(appService, null, null);
    component.getAllMarkedTickets = jest.fn();
    component.paging.total = 10000;
    component.query.searchBy = FilterSearchBy.BETIDS;

    await component.exportExcel();

    expect(appService.exportExcel).toBeCalledTimes(1);
  });
  
  it('#researchMarkedTickets should call #getAllMarkedTickets', async () => {
    const appService = new AppService(null);
    appService.exportExcel = jest.fn();
    const component = new MarkUnmarkTicketComponent(appService, null, null);
    component.query.searchBy = FilterSearchBy.ALL_MARKED;
    component.getAllMarkedTickets = jest.fn();
    component.getDetailTickets = jest.fn();
    
    component.researchMarkedTickets(true);

    expect(component.getAllMarkedTickets).toBeCalledTimes(1);
  });
  
  it('#researchMarkedTickets should call #getTickets', async () => {
    const appService = new AppService(null);
    appService.exportExcel = jest.fn();
    const component = new MarkUnmarkTicketComponent(appService, null, null);
    component.query.searchBy = FilterSearchBy.BETIDS;
    component.getTickets = jest.fn();
    component.filterTickets = new FilterTicketsComponent(null, null, null);
    component.filterTickets.clearBetId = jest.fn();
    
    [true, false].forEach(x => {
      component.researchMarkedTickets(x);

      expect(component.getTickets).toBeCalled();
    });
  });
  
  it('#updateMarkedTickets should call #modalService.open', async () => {
    const mockModalServiceconfirm = jest.fn();
    const mockModalServiceconfirmPermission = jest.fn();
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.confirm = mockModalServiceconfirm;
    modalService.confirmPermission = mockModalServiceconfirmPermission;
    const appService = new AppService(null);
    appService.updateMarkedTicket = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultUpdateMarkedTicket));
    const component = new MarkUnmarkTicketComponent(appService, null, modalService);
    component.getAllMarkedTickets = jest.fn();
    component.paging.total = 200000;
    component.researchMarkedTickets = jest.fn();
    component.query = { status: '0' } as GetTicketsQuery;

    await component.updateMarkedTickets(new MarkedTicketQuery());

    expect(modalService.confirm).toHaveBeenCalled();

    expect(mockModalServiceconfirm.mock.calls[0][0]).toStrictEqual(Helper.confirmModalMark);
    mockModalServiceconfirm.mock.calls[0][1]();

    expect(mockModalServiceconfirmPermission.mock.calls[0][0]).toEqual(Helper.checkingPermissionModal);

    component['updateMarkedTicket'] = jest.fn();
    mockModalServiceconfirmPermission.mock.calls[0][2]();
    expect(component['updateMarkedTicket']).toHaveBeenCalledTimes(1);

    mockModalServiceconfirmPermission.mock.calls[0][3]();
    expect(component.researchMarkedTickets).toHaveBeenCalledTimes(1);
  });
  
  it('#updateMarkedTickets should call #modalService.open when status is 1', async () => {
    const checkingPermissionModal = Helper.checkingPermissionModal;
    checkingPermissionModal.action = false;
    const fakeResultUpdateMarkedTicket = Helper.fakeResultUpdateMarkedTicket;
    fakeResultUpdateMarkedTicket.isSuccessful = true;
    const mockModalServiceconfirm = jest.fn();
    const mockModalServiceconfirmPermission = jest.fn();
    const mockModalServiceOpen = jest.fn();
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.confirm = mockModalServiceconfirm;
    modalService.open = mockModalServiceOpen;
    modalService.confirmPermission = mockModalServiceconfirmPermission;
    const appService = new AppService(null);
    appService.updateMarkedTicket = jest.fn().mockImplementation(() => Promise.resolve(fakeResultUpdateMarkedTicket));
    const component = new MarkUnmarkTicketComponent(appService, null, modalService);
    component.getAllMarkedTickets = jest.fn();
    component.paging.total = 200000;
    component.researchMarkedTickets = jest.fn();
    component.query = { status: '1' } as GetTicketsQuery;

    await component.updateMarkedTickets(new MarkedTicketQuery());

    expect(modalService.confirm).toHaveBeenCalled();

    expect(mockModalServiceconfirm.mock.calls[0][0]).toStrictEqual(Helper.confirmModalUnMark);
    mockModalServiceconfirm.mock.calls[0][1]();

    expect(mockModalServiceconfirmPermission.mock.calls[0][0]).toEqual(checkingPermissionModal);
    mockModalServiceconfirmPermission.mock.calls[0][2]();
    expect(appService.updateMarkedTicket).toHaveBeenCalledTimes(1);


    mockModalServiceconfirmPermission.mock.calls[0][3]();
    expect(component.researchMarkedTickets).toHaveBeenCalledTimes(1);
  });
  
  it('#replaceErrorMessageLockMatch should return expected', async () => {
    const resultMarkTicketModel = new ResultMarkTicketModel();
    resultMarkTicketModel.errorCode = 101;
    resultMarkTicketModel.errorMsg = 'Failed';
    const component = new MarkUnmarkTicketComponent(null, null, null);
    
    const actual = component['replaceErrorMessageLockMatch'](resultMarkTicketModel);

    expect(actual).toBe('Some tickets cannot be processed because: Failed');
  });
  
  it('#getTicketsDetail should call #appService.getTicketsDetail', async () => {
    const appService = new AppService(null);
    appService.getTicketsDetail = jest.fn();
    const component = new MarkUnmarkTicketComponent(appService, null, null);
    
    component.getTicketsDetail(null);

    expect(appService.getTicketsDetail).toBeCalledTimes(1);
  });
  
  it('#confirmUpdateAllMarkedTickets should call #updateAllMarkedTickets', async () => {
    const confirmModal = {
      title: 'Mark/Unmark All Tickets',
      message: LABELS.CONFIRM_UNMARK_TICKET,
      type: ModalType.Confirm
    };
    const appService = new AppService(null);
    appService.updateAllMarkedTickets = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultUpdateMarkedTicket));
    const mockModalServiceconfirm = jest.fn();
    const mockModalServiceOpen = jest.fn();
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.confirm = mockModalServiceconfirm;
    modalService.open = mockModalServiceOpen;
    const component = new MarkUnmarkTicketComponent(appService, null, modalService);
    component['replaceErrorMessageLockMatch'] = jest.fn().mockImplementation(() => '');
    component['updateAllMarkedTickets'] = jest.fn();

    await component.confirmUpdateAllMarkedTickets(null);
    
    expect(mockModalServiceconfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    mockModalServiceconfirm.mock.calls[0][1]();
    expect(component['updateAllMarkedTickets']).toBeCalledTimes(1);
  });
  
  it('#changeSearchBy should call update #showLicensees false', async () => {
    const component = new MarkUnmarkTicketComponent(null, null, null);    
    component.changeSearchBy();

    expect(component.showLicensees).toBeFalsy();
  });
  
  it('#hideComponent should call update #isShowMatch  false', async () => {
    const component = new MarkUnmarkTicketComponent(null, null, null);    
    component.hideComponent();

    expect(component.isShowMatch).toBeFalsy();
  });
  
  it('#updateAllMarkedTickets should call #appService.updateAllMarkedTickets', async () => {
    const fakeResultUpdateMarkedTicket = _.cloneDeep(Helper.fakeResultUpdateMarkedTicket);
    fakeResultUpdateMarkedTicket.isSuccessful = true;
    const openModal = {
      title: 'Mark ticket with Match',
      message: '',
      type: ModalType.Alert
    };
    const appService = new AppService(null);
    appService.updateAllMarkedTickets = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultUpdateMarkedTicket));
    const mockModalServiceOpen = jest.fn();
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = mockModalServiceOpen;
    const component = new MarkUnmarkTicketComponent(appService, null, modalService);
    component.refreshAllMarkedTickets = jest.fn();

    await component['updateAllMarkedTickets']([]);

    expect(appService.updateAllMarkedTickets).toBeCalledTimes(1);

    expect(mockModalServiceOpen.mock.calls[0][0]).toStrictEqual(openModal);
    mockModalServiceOpen.mock.calls[0][1]();

    expect(component.refreshAllMarkedTickets).toBeCalledTimes(1);
  });
  
  it('#updateAllMarkedTickets should call #getDetailTickets', async () => {
    const allMarkedTicketModel = {
      matchId: '111',
      userId: 112,
      createdDate: new Date()
    } as AllMarkedTicketModel;
    const fakeResultUpdateMarkedTicket = _.cloneDeep(Helper.fakeResultUpdateMarkedTicket);
    fakeResultUpdateMarkedTicket.isSuccessful = false;
    const openModal = {
      title: 'Mark ticket with Match',
      message: '',
      type: ModalType.Error
    };
    const appService = new AppService(null);
    appService.updateAllMarkedTickets = jest.fn().mockImplementation(() => Promise.resolve(fakeResultUpdateMarkedTicket));
    const mockModalServiceOpen = jest.fn();
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = mockModalServiceOpen;
    const component = new MarkUnmarkTicketComponent(appService, null, modalService);
    component.refreshAllMarkedTickets = jest.fn();
    component.getDetailTickets = jest.fn();
    jest.spyOn(_, 'includes').mockImplementation(() => true);
    component.queryTicket.matchId = allMarkedTicketModel.matchId;
    component.queryTicket.userId = allMarkedTicketModel.userId;
    component.queryTicket.createdDate = allMarkedTicketModel.createdDate;

    await component['updateAllMarkedTickets']([allMarkedTicketModel]);

    expect(appService.updateAllMarkedTickets).toBeCalledTimes(1);

    expect(mockModalServiceOpen.mock.calls[0][0]).toStrictEqual(openModal);
    mockModalServiceOpen.mock.calls[0][1]();
  });
  
  it('#updateMarkedTicket should call #researchMarkedTickets', async () => {
    const fakeResultUpdateMarkedTicket = _.cloneDeep(Helper.fakeResultUpdateMarkedTicket);
    fakeResultUpdateMarkedTicket.isSuccessful = false;
    const openModal = {
      title: 'Mark tickets result',
      message: '',
      type: ModalType.Error
    };
    const appService = new AppService(null);
    appService.updateMarkedTicket = jest.fn().mockImplementation(() => Promise.resolve(fakeResultUpdateMarkedTicket));
    const mockModalServiceOpen = jest.fn();
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = mockModalServiceOpen;
    const component = new MarkUnmarkTicketComponent(appService, null, modalService);
    component.researchMarkedTickets = jest.fn();

    await component['updateMarkedTicket'](new MarkedTicketQuery());

    expect(appService.updateMarkedTicket).toBeCalledTimes(1);

    expect(mockModalServiceOpen.mock.calls[0][0]).toStrictEqual(openModal);
    mockModalServiceOpen.mock.calls[0][1]();
    expect(component.researchMarkedTickets).toBeCalledTimes(1);
  });
});