import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EarlyKickOffModel } from '../../../add-request-new/models/event-eko.model';
import { RequestDetailModel, RequestDetailViewModel } from '../../../add-request-new/models/request-detail.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { VoidPageEarlyKickOffModel } from './models/void-page-early-kick-off.model';
import { VoidPageService } from './services/void-page.service';
import { VoidEarlyKickOffComponent } from './void-early-kick-off.component';

describe('VoidEarlyKickOffComponent', () => {
  let component: VoidEarlyKickOffComponent;
  let fixture: ComponentFixture<VoidEarlyKickOffComponent>;
  let ticketsService: TicketsService;
  let voidPageService: VoidPageService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [VoidPageService],
    }).compileComponents();

    fixture = TestBed.createComponent(VoidEarlyKickOffComponent);
    component = fixture.componentInstance;
    ticketsService = fixture.debugElement.injector.get(TicketsService);
    voidPageService = fixture.debugElement.injector.get(VoidPageService);
    voidPageCommonService = fixture.debugElement.injector.get(VoidPageCommonService);
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
    voidPageService.getIssueTypes = jest.fn().mockResolvedValue({});
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

  it('#onClickCopyLicenseesToClipboard should called voidPageCommonService.onClickCopyLicenseesToClipboard', async () => {
    voidPageCommonService.onClickCopyLicenseesToClipboard = jest.fn();
    component.onClickCopyLicenseesToClipboard(null);

    expect(voidPageCommonService.onClickCopyLicenseesToClipboard).toHaveBeenCalledTimes(1);
  });

  it('#onClickVoidAllMatches should called voidPageCommonService.onClickVoidAllMatches', async () => {
    voidPageCommonService.onClickVoidAllMatches = jest.fn();
    component.onClickVoidAllMatches();

    expect(voidPageCommonService.onClickVoidAllMatches).toHaveBeenCalledTimes(1);
  });
});
