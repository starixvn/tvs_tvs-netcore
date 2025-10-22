import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash/cloneDeep';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingModel } from '../../../utility/components/paging/paging.model';
import { TEXT} from '../../../utility/constants/text';
import { CheckingPermissionModel } from '../../../utility/models/checking-permission.model';
import { MatchModel } from '../../../utility/models/match.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { GetTicketsQuery, MarkedTicketQuery, TicketDetailQuery } from '../models/query.model';
import { ResultMarkTicketModel } from '../models/result.model';
import { TicketsModel } from '../tickets-list/tickets.model';
import { AllMarkedTicketModel } from './all-marked-ticket-list/all-marked-ticket.model';
import { FilterTicketsComponent } from './filter-tickets/filter-tickets.component';
import { FilterSearchBy } from './filter-tickets/filter.model';
import { MarkUnmarkTicketComponent } from './mark-unmark-ticket.component';
import { TicketsListService } from '../tickets-list/tickets-list.service';

class Helper {
  static readonly fakeResultUpdateMarkedTicket = {
    errorCode: 0,
    errorMsg: ''
  } as ResultMarkTicketModel;

  static readonly confirmModalMark = {
    title: 'Mark/Unmark Tickets',
    message: TEXT.CONFIRM_MARK_TICKET,
    type: ModalType.Confirm
  };

  static readonly confirmModalUnMark = {
    title: 'Mark/Unmark Tickets',
    message: TEXT.CONFIRM_UNMARK_TICKET,
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
  let component: MarkUnmarkTicketComponent;
  let fixture: ComponentFixture<MarkUnmarkTicketComponent>;
  let appService: AppService;
  let commonService: CommonService;
  let modalService: ModalService;
  let ticketsListService: TicketsListService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AppService,
        CommonService,
        ModalService,
        NgbModalConfig
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkUnmarkTicketComponent);
    appService = fixture.debugElement.injector.get(AppService);
    commonService = fixture.debugElement.injector.get(CommonService);
    modalService = fixture.debugElement.injector.get(ModalService);
    ticketsListService = fixture.debugElement.injector.get(TicketsListService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic UI Functions', () => {
    it('should call window.alert when copiedAffectLicensees is called', () => {
      window.alert = jest.fn();
      component.copiedAffectLicensees();
      expect(window.alert).toHaveBeenCalledWith("The Licensee list has been copied to clipboard.");
    });

    it('should update showLicensees to false when changeSearchBy is called', () => {
      component.changeSearchBy();
      expect(component.showLicensees).toBeFalsy();
    });

    it('should update isShowMatch to false when hideComponent is called', () => {
      component.hideComponent();
      expect(component.isShowMatch).toBeFalsy();
    });
  });

  describe('Match Info Functions', () => {
    it('should call commonService.getMatch when getMatchInfo is called with MATCH_ID search', async () => {
      const matchId = 99;
      commonService.getMatch = jest.fn();
      component.query = new GetTicketsQuery();
      component.query.searchBy = FilterSearchBy.MATCH_ID;
      component.match = new MatchModel();
      component.match.matchId = 1;

      await component.getMatchInfo(matchId);

      expect(commonService.getMatch).toHaveBeenCalledWith(matchId);
    });

    it('should not call commonService.getMatch when getMatchInfo is called with BET_IDS search', async () => {
      const matchId = 99;
      commonService.getMatch = jest.fn();
      component.query = new GetTicketsQuery();
      component.query.searchBy = FilterSearchBy.BET_IDS;
      component.match = new MatchModel();
      component.match.matchId = 1;

      await component.getMatchInfo(matchId);

      expect(commonService.getMatch).not.toHaveBeenCalled();
    });
  });

  describe('Ticket Management Functions', () => {
    it('should call appService.getTickets and update invalid/moved items', async () => {
      const query = new GetTicketsQuery();
      query.searchBy = FilterSearchBy.BET_IDS;
      const fakeTicketsModel = {
        invalidTransIds: '12312',
        markedTransIds: '12312',
        movedTransIds: '12312'
      } as TicketsModel;
      appService.getTickets = jest.fn().mockImplementation(() => Promise.resolve(fakeTicketsModel));
      component.ticketsModel = new TicketsModel();
      ticketsListService.initData = jest.fn();
      const mockUpdateInvalidItems = jest.fn();
      const mockUpdateMoved = jest.fn();
      component.filterTickets = {
        betIdsComponent: {
          groupNumber: {
            updateInvalidItems: mockUpdateInvalidItems,
            updateMoved: mockUpdateMoved
          }
        }
      } as unknown as FilterTicketsComponent;

      await component.getTickets(query);

      expect(appService.getTickets).toHaveBeenCalledWith(query);
    });

    it('should update isShowTickets to false when getTickets has exception', async () => {
      const query = new GetTicketsQuery();
      appService.getTickets = jest.fn().mockRejectedValue(new Error());
      component.ticketsModel = null;

      await component.getTickets(query);

      expect(appService.getTickets).toHaveBeenCalledWith(query);
      expect(component.isShowTickets).toBeFalsy();
    });
  });

  describe('Marked Tickets Functions', () => {
    it('should call appService.getAllMakerdTickets when getAllMarkedTickets is called', async () => {
      const query = new GetTicketsQuery();
      const fakeTicketsModel = new AllMarkedTicketModel();
      appService.getAllMakerdTickets = jest.fn().mockImplementation(() => Promise.resolve(fakeTicketsModel));
      component.pagingOfAllMarked = new PagingModel();

      await component.getAllMarkedTickets(query);

      expect(appService.getAllMakerdTickets).toHaveBeenCalledWith(query);
    });

    it('should call getAllMarkedTickets when searchEvent is called with ALL_MARKED search', async () => {
      const query = {
        searchBy: FilterSearchBy.ALL_MARKED,
        status: '0',
        matchId: '1'
      } as GetTicketsQuery;
      component.getAllMarkedTickets = jest.fn();

      await component.searchEvent(query);

      expect(component.getAllMarkedTickets).toHaveBeenCalledWith(query);
    });

    it('should call getTickets when searchEvent is called with BET_IDS search', async () => {
      const query = new GetTicketsQuery();
      query.searchBy = FilterSearchBy.BET_IDS;
      query.status = '1';
      query.matchId = '1';
      component.getMatchInfo = jest.fn();
      component.getTickets = jest.fn();

      await component.searchEvent(query);

      expect(component.getMatchInfo).toHaveBeenCalledWith(1);
      expect(component.getTickets).toHaveBeenCalledWith(query);
    });
  });

  describe('Ticket Detail Functions', () => {
    it('should call appService.getTicketsDetail and commonService.getMatch when getDetailTickets is called', async () => {
      const ticketDetailId = {
        matchId: '1',
        userId: 1212,
        createdDate: new Date(),
        pageIndex: 0,
        pageSize: 3000
      } as TicketDetailQuery;
      const fakeTicketsModel = new AllMarkedTicketModel();
      appService.getTicketsDetail = jest.fn().mockImplementation(() => Promise.resolve(fakeTicketsModel));
      commonService.getMatch = jest.fn().mockImplementation(() => Promise.resolve(new MatchModel()));
      component.pagingOfAllMarked = new PagingModel();
      ticketsListService.initData = jest.fn();

      await component.getDetailTickets(ticketDetailId);

      expect(appService.getTicketsDetail).toHaveBeenCalledWith(ticketDetailId);
      expect(commonService.getMatch).toHaveBeenCalledWith(1);
    });

    it('should call getDetailTickets when pagingEvent is called with ALL_MARKED search', async () => {
      component.query.searchBy = FilterSearchBy.ALL_MARKED;
      component.getDetailTickets = jest.fn();
      component.getTickets = jest.fn();
      component.ticketsModel.updateTicketsByUncheckTransIds = jest.fn();
      component.queryTicket = {
        pageIndex: 0,
        pageSize: 3000,
        matchId: '1',
        userId: 1212,
        createdDate: new Date()
      } as TicketDetailQuery;

      await component.pagingEvent();

      expect(component.getDetailTickets).toHaveBeenCalled();
    });

    it('should call getTickets when pagingEvent is called with BET_IDS search', async () => {
      component.query.searchBy = FilterSearchBy.BET_IDS;
      component.getDetailTickets = jest.fn();
      component.getTickets = jest.fn();
      component.ticketsModel.updateTicketsByUncheckTransIds = jest.fn();

      await component.pagingEvent();

      expect(component.getTickets).toHaveBeenCalledWith(component.query);
    });
  });

  describe('Paging Functions', () => {
    it('should call getAllMarkedTickets when pagingEventOfAllMarked is called', async () => {
      component.getAllMarkedTickets = jest.fn();

      await component.pagingEventOfAllMarked();

      expect(component.getAllMarkedTickets).toHaveBeenCalledWith(component.query);
    });

    it('should call getAllMarkedTickets when refreshAllMarkedTickets is called', async () => {
      modalService.open = jest.fn();
      component.getAllMarkedTickets = jest.fn();

      await component.refreshAllMarkedTickets();

      expect(component.getAllMarkedTickets).toHaveBeenCalledWith(component.query);
    });
  });

  describe('Export Functions', () => {
    it('should call modalService.open when exportExcel is called with large total', async () => {
      modalService.open = jest.fn();
      component.getAllMarkedTickets = jest.fn();
      component.paging.total = 200000;

      await component.exportExcel();

      expect(modalService.open).toHaveBeenCalled();
    });

    it('should call appService.exportExcelDetailTickets when exportExcel is called with ALL_MARKED search', async () => {
      appService.exportExcelDetailTickets = jest.fn();
      component.getAllMarkedTickets = jest.fn();
      component.paging.total = 10000;
      component.query = new GetTicketsQuery();
      component.query.searchBy = FilterSearchBy.ALL_MARKED;
      component.query.matchId = '1';
      component.query.markedBy = 'test';

      await component.exportExcel();

      expect(appService.exportExcelDetailTickets).toHaveBeenCalled();
    });

    it('should call appService.exportExcel when exportExcel is called with BET_IDS search', async () => {
      appService.exportExcel = jest.fn();
      component.getAllMarkedTickets = jest.fn();
      component.paging.total = 10000;
      component.query.searchBy = FilterSearchBy.BET_IDS;

      await component.exportExcel();

      expect(appService.exportExcel).toHaveBeenCalledWith(component.query);
    });
  });

  describe('Research Functions', () => {
    it('should call getAllMarkedTickets when researchMarkedTickets is called with ALL_MARKED search', async () => {
      component.query.searchBy = FilterSearchBy.ALL_MARKED;
      component.getAllMarkedTickets = jest.fn();
      component.getDetailTickets = jest.fn();

      component.researchMarkedTickets(true);

      expect(component.getAllMarkedTickets).toHaveBeenCalledWith(component.query);
    });

    it('should call getTickets when researchMarkedTickets is called with BET_IDS search', async () => {
      component.query.searchBy = FilterSearchBy.BET_IDS;
      component.getTickets = jest.fn();
      component.filterTickets = {
        clearBetId: jest.fn()
      } as any;

      [true, false].forEach(x => {
        component.researchMarkedTickets(x);
      });

      expect(component.getTickets).toHaveBeenCalledWith(component.query);
    });
  });

  describe('Update Functions', () => {
    it('should call modalService.confirm and updateMarkedTicket when updateMarkedTickets is called', async () => {
      const query = new MarkedTicketQuery();
      const mockModalServiceconfirm = jest.fn();
      const mockModalServiceconfirmPermission = jest.fn();
      modalService.confirm = mockModalServiceconfirm;
      modalService.confirmPermission = mockModalServiceconfirmPermission;
      appService.updateMarkedTicket = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultUpdateMarkedTicket));
      component.getAllMarkedTickets = jest.fn();
      component.paging.total = 200000;
      component.researchMarkedTickets = jest.fn();
      component.query = { status: '0' } as GetTicketsQuery;

      await component.updateMarkedTickets(query);

      expect(modalService.confirm).toHaveBeenCalled();
      expect(mockModalServiceconfirm.mock.calls[0][0]).toStrictEqual(Helper.confirmModalMark);
      mockModalServiceconfirm.mock.calls[0][1]();
      expect(mockModalServiceconfirmPermission.mock.calls[0][0]).toEqual(Helper.checkingPermissionModal);
      component['updateMarkedTicket'] = jest.fn();
      mockModalServiceconfirmPermission.mock.calls[0][2]();
      expect(component['updateMarkedTicket']).toHaveBeenCalledWith(query);
      mockModalServiceconfirmPermission.mock.calls[0][3]();
      expect(component.researchMarkedTickets).toHaveBeenCalledWith(false);
    });

    it('should call modalService.confirm and updateMarkedTicket when updateMarkedTickets is called with status 1', async () => {
      const checkingPermissionModal = Helper.checkingPermissionModal;
      checkingPermissionModal.action = false;
      const fakeResultUpdateMarkedTicket = Helper.fakeResultUpdateMarkedTicket;
      fakeResultUpdateMarkedTicket.isSuccessful = true;
      const mockModalServiceconfirm = jest.fn();
      const mockModalServiceconfirmPermission = jest.fn();
      const mockModalServiceOpen = jest.fn();
      modalService.confirm = mockModalServiceconfirm;
      modalService.open = mockModalServiceOpen;
      modalService.confirmPermission = mockModalServiceconfirmPermission;
      appService.updateMarkedTicket = jest.fn().mockImplementation(() => Promise.resolve(fakeResultUpdateMarkedTicket));
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
      expect(component.researchMarkedTickets).toHaveBeenCalledWith(false);
    });
  });

  describe('Error Handling Functions', () => {
    it('should return expected error message when replaceErrorMessageLockMatch is called', () => {
      const resultMarkTicketModel = new ResultMarkTicketModel();
      resultMarkTicketModel.errorCode = 101;
      resultMarkTicketModel.errorMsg = 'Failed';

      const actual = component['replaceErrorMessageLockMatch'](resultMarkTicketModel);

      expect(actual).toBe('Some tickets cannot be processed because: Failed');
    });

    it('should call appService.getTicketsDetail when getTicketsDetail is called', () => {
      const query = {
        matchId: '1',
        userId: 1212,
        createdDate: new Date()
      } as TicketDetailQuery;
      appService.getTicketsDetail = jest.fn();

      component.getTicketsDetail(query);

      expect(appService.getTicketsDetail).toHaveBeenCalledWith(query);
    });
  });

  describe('All Marked Tickets Functions', () => {
    it('should call updateAllMarkedTickets when confirmUpdateAllMarkedTickets is called', async () => {
      const confirmModal = {
        title: 'Mark/Unmark All Tickets',
        message: TEXT.CONFIRM_UNMARK_TICKET,
        type: ModalType.Confirm
      };
      appService.updateAllMarkedTickets = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultUpdateMarkedTicket));
      const mockModalServiceconfirm = jest.fn();
      const mockModalServiceOpen = jest.fn();
      modalService.confirm = mockModalServiceconfirm;
      modalService.open = mockModalServiceOpen;
      component['replaceErrorMessageLockMatch'] = jest.fn().mockImplementation(() => '');
      component['updateAllMarkedTickets'] = jest.fn();

      await component.confirmUpdateAllMarkedTickets(null);

      expect(mockModalServiceconfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
      mockModalServiceconfirm.mock.calls[0][1]();
      expect(component['updateAllMarkedTickets']).toHaveBeenCalledWith(null);
    });

    it('should call appService.updateAllMarkedTickets and refreshAllMarkedTickets when updateAllMarkedTickets is called', async () => {
      const fakeResultUpdateMarkedTicket = cloneDeep(Helper.fakeResultUpdateMarkedTicket);
      fakeResultUpdateMarkedTicket.isSuccessful = true;
      const openModal = {
        title: 'Mark ticket with Match',
        message: '',
        type: ModalType.Alert
      };
      appService.updateAllMarkedTickets = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeResultUpdateMarkedTicket));
      const mockModalServiceOpen = jest.fn();
      modalService.open = mockModalServiceOpen;
      component.refreshAllMarkedTickets = jest.fn();

      await component['updateAllMarkedTickets']([]);

      expect(appService.updateAllMarkedTickets).toHaveBeenCalledWith({ matches: [] });
      expect(mockModalServiceOpen.mock.calls[0][0]).toStrictEqual(openModal);
      mockModalServiceOpen.mock.calls[0][1]();
      expect(component.refreshAllMarkedTickets).toHaveBeenCalled();
    });

    it('should call getDetailTickets when updateAllMarkedTickets is called with unsuccessful result', async () => {
      const allMarkedTicketModel = {
        matchId: '111',
        userId: 112,
        createdDate: new Date()
      } as AllMarkedTicketModel;
      const fakeResultUpdateMarkedTicket = cloneDeep(Helper.fakeResultUpdateMarkedTicket);
      fakeResultUpdateMarkedTicket.isSuccessful = false;
      const openModal = {
        title: 'Mark ticket with Match',
        message: '',
        type: ModalType.Error
      };
      appService.updateAllMarkedTickets = jest.fn().mockImplementation(() => Promise.resolve(fakeResultUpdateMarkedTicket));
      const mockModalServiceOpen = jest.fn();
      modalService.open = mockModalServiceOpen;
      component.refreshAllMarkedTickets = jest.fn();
      component.getDetailTickets = jest.fn();
      component.queryTicket = {
        matchId: allMarkedTicketModel.matchId,
        userId: allMarkedTicketModel.userId,
        createdDate: allMarkedTicketModel.createdDate
      } as TicketDetailQuery;

      await component['updateAllMarkedTickets']([allMarkedTicketModel]);

      expect(appService.updateAllMarkedTickets).toHaveBeenCalledWith({ matches: [allMarkedTicketModel] });
      expect(mockModalServiceOpen.mock.calls[0][0]).toStrictEqual(openModal);
      mockModalServiceOpen.mock.calls[0][1]();
    });

    it('should call researchMarkedTickets when updateMarkedTicket is called', async () => {
      const query = new MarkedTicketQuery();
      const fakeResultUpdateMarkedTicket = cloneDeep(Helper.fakeResultUpdateMarkedTicket);
      fakeResultUpdateMarkedTicket.isSuccessful = false;
      const openModal = {
        title: 'Mark tickets result',
        message: '',
        type: ModalType.Error
      };
      appService.updateMarkedTicket = jest.fn().mockImplementation(() => Promise.resolve(fakeResultUpdateMarkedTicket));
      const mockModalServiceOpen = jest.fn();
      modalService.open = mockModalServiceOpen;
      component.researchMarkedTickets = jest.fn();

      await component['updateMarkedTicket'](query);

      expect(appService.updateMarkedTicket).toHaveBeenCalledWith(query);
      expect(mockModalServiceOpen.mock.calls[0][0]).toStrictEqual(openModal);
      mockModalServiceOpen.mock.calls[0][1]();
      expect(component.researchMarkedTickets).toHaveBeenCalledWith(true);
    });
  });
});