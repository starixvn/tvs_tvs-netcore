import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestDetailModel, RequestDetailViewModel } from '../../../add-request-new/models/request-detail.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { TestingModule } from '../../../utility/modules/testing.module';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { BasicRequestInfo } from '../models/basic-request-info.model';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { CheckVoidPermissionService } from '../services/check-void-permission.service';
import { InsertQueueService } from '../services/insert-queue.service';
import { LoadDataService } from '../services/load-data.service';
import { LogChangeContentService } from '../services/log-change-content.service';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { TemplateService } from './../../../utility/components/template-message/template-message/services/template.service';
import { CheckRequestService } from './../services/check-request.service';
import { PopupService } from './../services/popup.service';
import { SubmitVoidService } from './../services/submit-void.service';
import { VoidPageService } from './services/void-page.service';
import { VoidAbnormalBetComponent } from './void-abnormal-bet.component';

describe('VoidAbnormalBetComponent', () => {
  let component: VoidAbnormalBetComponent;
  let fixture: ComponentFixture<VoidAbnormalBetComponent>;
  let ticketsService: TicketsService;
  let voidPageService: VoidPageService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [VoidPageService, VoidPageCommonService, PopupService, TemplateService, CheckRequestService,
        SubmitVoidService, LoadDataService, InsertQueueService, CheckVoidPermissionService, LogChangeContentService]
    }).compileComponents();

    fixture = TestBed.createComponent(VoidAbnormalBetComponent);
    component = fixture.componentInstance;
    ticketsService = fixture.debugElement.injector.get(TicketsService);
    voidPageService = fixture.debugElement.injector.get(VoidPageService);
    voidPageCommonService = fixture.debugElement.injector.get(VoidPageCommonService);
  });

  it('VoidAbnormalBetComponent should init match snapshot', async () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should called getIssueTypes& getBasicVoidPageItemsData', async () => {
    const requestDetail = new RequestDetailViewModel();
    requestDetail.request = new RequestDetailModel();
    requestDetail.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET);
    document.body.getAttribute = jest.fn().mockReturnValue('sa');
    voidPageService.loadUnderneathVoidPageItemsData = jest.fn();
    voidPageService.getBasicVoidPageItemsData =  jest.fn();
    voidPageService.getIssueTypes = jest.fn();
    const baseModel = {id: 1, subIssueTypeId: 3, matchId: 8465378} as BasicRequestInfo;
    voidPageService['initBasicRequestInfo'] = jest.fn().mockReturnValue(baseModel);
    component.requestDetail = requestDetail;
    component.primitiveProperty = new CommonPrimitiveProperty();

    await component.ngOnInit();

    expect(voidPageService.getBasicVoidPageItemsData).toHaveBeenCalled();
    expect(voidPageService.getIssueTypes).toHaveBeenCalled();
    expect(component.primitiveProperty.userName).toBe('sa');
  });

  it('#onClickShowVoidTickets should called voidPageCommonService.onClickShowVoidTickets', async () => {
    voidPageCommonService.onClickShowVoidTickets = jest.fn();;

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
    component.messageAreaComponents = new QueryList<MessageAreaComponent>();

    component.onClickVoidAllMatches();

    expect(voidPageCommonService.onClickVoidAllMatches).toHaveBeenCalledTimes(1);
  });
});
