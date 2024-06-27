import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { RequestDetailModel, RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { LicenseeAffectedListComponent } from '../../../utility/components/licensee-affected-list/licensee-affected-list.component';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { MessageAreaComponent } from '../message-area/message-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from '../services/popup.service';
import { SubmitVoidService } from '../services/submit-void.service';
import { TicketsService } from '../services/tickets.service';
import { VoidPageCommonService } from '../services/void-page-common.service';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { VoidAbnormalBetModel } from './models/void-abnormal-bet.model';
import { VoidPageService } from './services/void-page.service';
import { VoidAbnormalBetComponent } from './void-abnormal-bet.component';
import { PasswordAreaComponent } from '../password-area/password-area.component';

class Helper {
}

describe('VoidNotParticipateComponent', () => {
  @NgModule({
    declarations: [
      TicketsListComponent,
      TemplateMessageComponent,
      LicenseeAffectedListComponent,
      MessageAreaComponent,
      PasswordAreaComponent
    ],
    imports: [
      FormsModule,
      NgbModule,
      ToolTipModule,
    ],
    providers: [
      VoidPageService,
      TicketsService,
      PopupService,
      SubmitVoidService,
      CheckRequestService,
      VoidPageCommonService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<VoidAbnormalBetComponent>;

  beforeEach(() => {
    shallow = new Shallow(VoidAbnormalBetComponent, AppModuleTest).dontMock(NgbModule);
  });

  it('VoidNotParticipateComponent should init match snapshot', async () => {
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should called voidPageService.getBasicVoidPageItemsData', async () => {
    const requestDetail = new RequestDetailViewModel();
    requestDetail.request = new RequestDetailModel();
    requestDetail.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET);
    const voidItem = new VoidAbnormalBetModel();
    voidItem.matchModel = new MatchModel();
    voidItem.subIssueType = new SubIssueType();
    document.body.getAttribute = jest.fn().mockReturnValue('sa');
    const mockLoadUnderneathVoidPageItemsData = jest.fn();
    const mockGetBasicVoidPageItemsData = jest.fn().mockReturnValue([voidItem]);
    const mockGetIssueTypes = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageService, {
        loadUnderneathVoidPageItemsData: mockLoadUnderneathVoidPageItemsData,
        getBasicVoidPageItemsData: mockGetBasicVoidPageItemsData,
        getIssueTypes: mockGetIssueTypes,
      })
      .render({
        bind: {
          requestDetail: requestDetail
        }
      });
    instance.primitiveProperty = new CommonPrimitiveProperty();
    await instance.ngOnInit();

    expect(mockGetBasicVoidPageItemsData).toHaveBeenCalled();
    expect(mockGetIssueTypes).toHaveBeenCalled();
    expect(instance.primitiveProperty.userName).toBe('sa');
  });

  it('#onClickShowVoidTickets should called voidPageCommonService.onClickShowVoidTickets', async () => {
    const mockOnClickShowVoidTickets = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageCommonService, { onClickShowVoidTickets: mockOnClickShowVoidTickets })
      .render();
    await instance.onClickShowVoidTickets(null);

    expect(mockOnClickShowVoidTickets).toHaveBeenCalledTimes(1);
  });

  it('#onPagingTicketsChange should called voidPageCommonService.loadVoidTicketsFullOnPagingChange', async () => {
    const mockLoadVoidTicketsFullOnPagingChange = jest.fn();
    const { instance } = await shallow
      .mock(TicketsService, { loadVoidTicketsFullOnPagingChange: mockLoadVoidTicketsFullOnPagingChange })
      .render();
    await instance.onPagingTicketsChange(null);

    expect(mockLoadVoidTicketsFullOnPagingChange).toHaveBeenCalledTimes(1);
  });

  it('#exportTickets should called voidPageCommonService.exportTickets', async () => {
    const mockExportTickets = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageCommonService, { exportTickets: mockExportTickets })
      .render();
    await instance.exportTickets(null);

    expect(mockExportTickets).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should called voidPageCommonService.onClickShowTemplateMessage', async () => {
    const mockOnClickShowTemplateMessage = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageCommonService, { onClickShowTemplateMessage: mockOnClickShowTemplateMessage })
      .render();
    await instance.onClickShowTemplateMessage(null);

    expect(mockOnClickShowTemplateMessage).toHaveBeenCalledTimes(1);
  });

  it('#onClickCopyLicenseesToClipboard should called voidPageCommonService.onClickCopyLicenseesToClipboard', async () => {
    const mockOnClickCopyLicenseesToClipboard = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageCommonService, { onClickCopyLicenseesToClipboard: mockOnClickCopyLicenseesToClipboard })
      .render();
    instance.onClickCopyLicenseesToClipboard(null);

    expect(mockOnClickCopyLicenseesToClipboard).toHaveBeenCalledTimes(1);
  });

  it('#onClickVoidAllMatches should called voidPageCommonService.onClickVoidAllMatches', async () => {
    const mockOnClickVoidAllMatches = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageCommonService, { onClickVoidAllMatches: mockOnClickVoidAllMatches })
      .render();
    instance.onClickVoidAllMatches();

    expect(mockOnClickVoidAllMatches).toHaveBeenCalledTimes(1);
  });
});
