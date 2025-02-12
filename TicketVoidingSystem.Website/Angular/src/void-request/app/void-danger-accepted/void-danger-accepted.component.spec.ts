import { RedCardModel } from '../../../add-request/app/add-request/models/event-red-card.model';
import { RequestDetailModel, RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidMatch } from '../models/void-match.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidPageService } from './services/void-page.service';
import { VoidDangerAcceptedComponent } from './void-danger-accepted.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueryList } from '@angular/core';
import { MessageAreaComponent } from '../message-area/message-area.component';

describe('VoidDangerAcceptedComponent', () => {
  let component: VoidDangerAcceptedComponent;
  let fixture: ComponentFixture<VoidDangerAcceptedComponent>;
  let ticketsService: TicketsService;
  let voidPageService: VoidPageService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        VoidDangerAcceptedComponent,
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
            getIssueTypes: jest.fn(), getBasicVoidMatchesData: jest.fn(),
            loadUnderneathVoidMatchesData: jest.fn()
          }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VoidDangerAcceptedComponent);
    component = fixture.componentInstance;
    ticketsService = TestBed.inject(TicketsService) as jest.Mocked<TicketsService>;
    voidPageService = TestBed.inject(VoidPageService) as jest.Mocked<VoidPageService>;
    voidPageCommonService = TestBed.inject(VoidPageCommonService) as jest.Mocked<VoidPageCommonService>;
  });

  it('VoidDangerAcceptedComponent should init match snapshot', async () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should called voidPageService.getBasicVoidPageItemsData', async () => {
    const requestDetail = new RequestDetailViewModel();
    requestDetail.request = new RequestDetailModel();
    requestDetail.request.issueTypeId = Number(IssueTypeConstant.EARLY_KICK_OFF);
    requestDetail.dangerAcceptedModels = [new RedCardModel()];
    const voidItem = new VoidMatch();
    voidItem.matchModel = new MatchModel();
    voidItem.subIssueType = new SubIssueType();
    document.body.getAttribute = jest.fn().mockReturnValue('sa');
    const mockGetBasicVoidPageItemsData = jest.fn().mockReturnValue([voidItem]);
    voidPageService.getBasicVoidMatchesData = mockGetBasicVoidPageItemsData;
    component.requestDetail = requestDetail;
    component.primitiveProperty = new CommonPrimitiveProperty();
    await component.ngOnInit();

    expect(mockGetBasicVoidPageItemsData).toHaveBeenCalled();
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
    component.messageAreaComponents = new QueryList<MessageAreaComponent>();
    component.messageAreaComponents.toArray = jest.fn().mockReturnValue([]);

    expect(voidPageCommonService.onClickVoidAllMatches).toHaveBeenCalledTimes(1);
  });
});
