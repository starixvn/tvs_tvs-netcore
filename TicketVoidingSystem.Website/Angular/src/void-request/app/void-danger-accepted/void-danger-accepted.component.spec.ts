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
import { TestingModule } from '../../../utility/modules/testing.module';

describe('VoidDangerAcceptedComponent', () => {
  let component: VoidDangerAcceptedComponent;
  let fixture: ComponentFixture<VoidDangerAcceptedComponent>;
  let ticketsService: TicketsService;
  let voidPageService: VoidPageService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [VoidPageService, VoidPageCommonService, TicketsService]
    }).compileComponents();

    fixture = TestBed.createComponent(VoidDangerAcceptedComponent);
    ticketsService = fixture.debugElement.injector.get(TicketsService);
    voidPageService = fixture.debugElement.injector.get(VoidPageService);
    voidPageCommonService = fixture.debugElement.injector.get(VoidPageCommonService);
    component = fixture.componentInstance;
    component.messageAreaComponents = {} as QueryList<MessageAreaComponent>;
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
    component.requestDetail = requestDetail;
    component.primitiveProperty = new CommonPrimitiveProperty();
    voidPageService.getIssueTypes = jest.fn().mockReturnValue({});
    voidPageService.getBasicVoidMatchesData = jest.fn().mockReturnValue([voidItem]);
    voidPageService.loadUnderneathVoidMatchesData = jest.fn();
    await component.ngOnInit();

    expect(voidPageService.getBasicVoidMatchesData).toHaveBeenCalled();
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
    component.messageAreaComponents = new QueryList<MessageAreaComponent>();
    component.messageAreaComponents.toArray = jest.fn().mockReturnValue([]);

    component.onClickVoidAllMatches();

    expect(voidPageCommonService.onClickVoidAllMatches).toHaveBeenCalledTimes(1);
  });
});
