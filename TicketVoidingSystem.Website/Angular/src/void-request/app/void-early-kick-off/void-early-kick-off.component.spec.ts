import { EarlyKickOffModel } from '../../../add-request/app/add-request/models/event-eko.model';
import { RequestDetailModel, RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidPageEarlyKickOffModel } from './models/void-page-early-kick-off.model';
import { VoidPageService } from './services/void-page.service';
import { VoidEarlyKickOffComponent } from './void-early-kick-off.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('VoidEarlyKickOffComponent', () => {
  let component: VoidEarlyKickOffComponent;
  let fixture: ComponentFixture<VoidEarlyKickOffComponent>;
  let ticketsService: TicketsService;
  let voidPageService: VoidPageService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        VoidEarlyKickOffComponent,
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

    fixture = TestBed.createComponent(VoidEarlyKickOffComponent);
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
    requestDetail.request.issueTypeId = Number(IssueTypeConstant.EARLY_KICK_OFF);
    requestDetail.earlyKickOffModels = [new EarlyKickOffModel()];
    const voidItem = new VoidPageEarlyKickOffModel();
    voidItem.matchModel = new MatchModel();
    voidItem.subIssueType = new SubIssueType();
    document.body.getAttribute = jest.fn().mockReturnValue('sa');
    voidPageService.getBasicVoidPageItemsData = jest.fn().mockResolvedValue([voidItem]);
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
});
