import { DuplicateTicketsModel } from '../../../add-request/app/add-request/models/event-duplicate-tickets.model';
import { RequestDetailModel, RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { AbnormalFilterBy } from '../../../utility/constants/config';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidPageDuplicateTicketsModel } from './models/void-page-duplicate-tickets.model';
import { VoidPageService } from './services/void-page.service';
import { VoidDuplicateTicketsComponent } from './void-duplicate-tickets.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('VoidDuplicateTicketsComponent', () => {
  let component: VoidDuplicateTicketsComponent;
  let fixture: ComponentFixture<VoidDuplicateTicketsComponent>;
  let ticketsService: TicketsService;
  let voidPageService: VoidPageService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        VoidDuplicateTicketsComponent,
        { provide: TicketsService, useValue: { loadVoidTicketsFullOnPagingChange: jest.fn() } },
        {
          provide: VoidPageCommonService, useValue: {
            onClickShowVoidTickets: jest.fn(), exportTickets: jest.fn(),
            onClickShowTemplateMessage: jest.fn(), onClickCopyLicenseesToClipboard: jest.fn(),
            onClickVoidAllMatches: jest.fn()
          }
        },
        {
          provide: VoidPageService, useValue: {
            getIssueTypes: jest.fn(), getBasicVoidPageItemsData: jest.fn(),
            loadUnderneathVoidPageItemsData: jest.fn()
          }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VoidDuplicateTicketsComponent);
    component = fixture.componentInstance;
    ticketsService = TestBed.inject(TicketsService) as jest.Mocked<TicketsService>;
    voidPageService = TestBed.inject(VoidPageService) as jest.Mocked<VoidPageService>;
    voidPageCommonService = TestBed.inject(VoidPageCommonService) as jest.Mocked<VoidPageCommonService>;
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
    voidPageService.getBasicVoidPageItemsData = jest.fn().mockReturnValue(voidItem);
    component.requestDetail = requestDetail;
    component.primitiveProperty = new CommonPrimitiveProperty();
    await component.ngOnInit();

    expect(voidPageService.getBasicVoidPageItemsData).toHaveBeenCalled();
    expect(voidPageService.getIssueTypes).toHaveBeenCalled();
    expect(component.primitiveProperty.userName).toBe('sa');
  });

  it('#onClickShowVoidTickets should called voidPageCommonService.onClickShowVoidTickets', async () => {
    await component.onClickShowVoidTickets(null);

    expect(voidPageCommonService.onClickShowVoidTickets).toHaveBeenCalledTimes(1);
  });

  it('#onPagingTicketsChange should called voidPageCommonService.loadVoidTicketsFullOnPagingChange', async () => {
    await component.onPagingTicketsChange(null);

    expect(ticketsService.loadVoidTicketsFullOnPagingChange).toHaveBeenCalledTimes(1);
  });

  it('#exportTickets should called voidPageCommonService.exportTickets', async () => {
    await component.exportTickets(null);

    expect(voidPageCommonService.exportTickets).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should called voidPageCommonService.onClickShowTemplateMessage', async () => {
    await component.onClickShowTemplateMessage(null);

    expect(voidPageCommonService.onClickShowTemplateMessage).toHaveBeenCalledTimes(1);
  });

  it('#onClickCopyLicenseesToClipboard should called voidPageCommonService.onClickCopyLicenseesToClipboard', async () => {
    component.onClickCopyLicenseesToClipboard(null);

    expect(voidPageCommonService.onClickCopyLicenseesToClipboard).toHaveBeenCalledTimes(1);
  });

  it('#onClickVoidAllMatches should called voidPageCommonService.onClickVoidAllMatches', async () => {
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
