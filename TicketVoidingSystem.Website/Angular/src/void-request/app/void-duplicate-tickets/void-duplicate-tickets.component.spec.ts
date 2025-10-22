import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicateTicketsModel } from '../../../add-request-new/models/event-duplicate-tickets.model';
import { RequestDetailModel, RequestDetailViewModel } from '../../../add-request-new/models/request-detail.model';
import { AbnormalFilterBy } from '../../../utility/constants/config';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidPageDuplicateTicketsModel } from './models/void-page-duplicate-tickets.model';
import { VoidPageService } from './services/void-page.service';
import { VoidDuplicateTicketsComponent } from './void-duplicate-tickets.component';

describe('VoidDuplicateTicketsComponent', () => {
  let component: VoidDuplicateTicketsComponent;
  let fixture: ComponentFixture<VoidDuplicateTicketsComponent>;
  let ticketsService: TicketsService;
  let voidPageService: VoidPageService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [VoidPageService]
    }).compileComponents();

    fixture = TestBed.createComponent(VoidDuplicateTicketsComponent);
    component = fixture.componentInstance;
    ticketsService = fixture.debugElement.injector.get(TicketsService);
    voidPageService = fixture.debugElement.injector.get(VoidPageService);
    voidPageCommonService = fixture.debugElement.injector.get(VoidPageCommonService);
    component = fixture.componentInstance;
  });

  it('VoidDuplicateTicketsComponent should init match snapshot', async () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should called voidPageService.getBasicVoidPageItemsData', async () => {
    const requestDetail = new RequestDetailViewModel();
    requestDetail.request = new RequestDetailModel();
    requestDetail.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    requestDetail.duplicateTicketsModel = new DuplicateTicketsModel();
    requestDetail.duplicateTicketsModel.filterBy = AbnormalFilterBy.MIX_PARLAY;
    const voidItem = new VoidPageDuplicateTicketsModel();
    voidItem.matchModel = new MatchModel();
    voidItem.subIssueType = new SubIssueType();
    document.body.getAttribute = jest.fn().mockReturnValue('sa');
    component.requestDetail = requestDetail;
    component.primitiveProperty = new CommonPrimitiveProperty();
    voidPageService.getIssueTypes = jest.fn().mockReturnValue({});
    voidPageService.getBasicVoidPageItemsData = jest.fn().mockReturnValue(voidItem);
    voidPageService.loadUnderneathVoidPageItemsData = jest.fn();
    await component.ngOnInit();

    expect(voidPageService.getBasicVoidPageItemsData).toHaveBeenCalled();
    expect(voidPageService.getIssueTypes).toHaveBeenCalled();
    expect(component.primitiveProperty.userName).toBe('sa');
  });

  it('#onClickShowVoidTickets should called voidPageCommonService.onClickShowVoidTickets', async () => {
    voidPageCommonService.onClickShowVoidTickets = jest.fn();
    await component.onClickShowVoidTickets(null);

    expect(voidPageCommonService.onClickShowVoidTickets).toHaveBeenCalledTimes(1);
  });

  it('#onPagingTicketsChange should called voidPageCommonService.loadVoidTicketsFullOnPagingChange', async () => {
    ticketsService.loadVoidTicketsFullOnPagingChange = jest.fn();
    await component.onPagingTicketsChange(null);

    expect(ticketsService.loadVoidTicketsFullOnPagingChange).toHaveBeenCalledTimes(1);
  });

  it('#exportTickets should called voidPageCommonService.exportTickets', async () => {
    voidPageCommonService.exportTickets = jest.fn();
    await component.exportTickets(null);

    expect(voidPageCommonService.exportTickets).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should called voidPageCommonService.onClickShowTemplateMessage', async () => {
    voidPageCommonService.onClickShowTemplateMessage = jest.fn();
    await component.onClickShowTemplateMessage(null);

    expect(voidPageCommonService.onClickShowTemplateMessage).toHaveBeenCalledTimes(1);
  });

  it('#onClickVoidAllMatches should called voidPageCommonService.onClickVoidAllMatches', async () => {
    voidPageCommonService.onClickVoidAllMatches = jest.fn();
    component.onClickVoidAllMatches();

    expect(voidPageCommonService.onClickVoidAllMatches).toHaveBeenCalledTimes(1);
  });

  it('#isDuplicateTicketsMixParlay should return true', async () => {
    component.requestDetail = new RequestDetailViewModel();
    component.requestDetail.request = new RequestDetailModel();
    component.requestDetail.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    component.requestDetail.duplicateTicketsModel = new DuplicateTicketsModel();
    component.requestDetail.duplicateTicketsModel.filterBy = AbnormalFilterBy.MIX_PARLAY;

    const actual = component.isDuplicateTicketsMixParlay();

    expect(actual).toBeTruthy();
  });

  it('#isDuplicateTicketsMixParlay should return false when filter by single', async () => {
    component.requestDetail = new RequestDetailViewModel();
    component.requestDetail.request = new RequestDetailModel();
    component.requestDetail.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    component.requestDetail.duplicateTicketsModel = new DuplicateTicketsModel();
    component.requestDetail.duplicateTicketsModel.filterBy = AbnormalFilterBy.SINGLE;

    const actual = component.isDuplicateTicketsMixParlay();

    expect(actual).toBeFalsy();
  });

  it('#isDuplicateTicketsMixParlay should return false when issuetype is Redcard', async () => {
    component.requestDetail = new RequestDetailViewModel();
    component.requestDetail.request = new RequestDetailModel();
    component.requestDetail.request.issueTypeId = Number(IssueTypeConstant.RED_CARD);
    component.requestDetail.duplicateTicketsModel = new DuplicateTicketsModel();
    component.requestDetail.duplicateTicketsModel.filterBy = AbnormalFilterBy.MIX_PARLAY;

    const actual = component.isDuplicateTicketsMixParlay();

    expect(actual).toBeFalsy();
  });
});
