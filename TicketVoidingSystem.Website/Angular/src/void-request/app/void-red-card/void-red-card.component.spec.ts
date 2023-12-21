import { ElementRef, NgModule, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { Shallow } from 'shallow-render';
import { RequestDetailModel, RequestDetailViewModel, RequestEventModel } from '../../../edit-request/app/request.model';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { CommonService } from '../../../utility/services/common.service';
import { LogInfoNewComponent } from '../log-info-new/log-info-new.component';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { VoidMatch } from '../models/void-match.model';
import { CheckRequestService } from '../services/check-request.service';
import { PopupService } from '../services/popup.service';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { AffectedLicensee } from './../../../void-single-bet/app/models/affected-licensee.model';
import { SubmitVoidService } from './services/submit-void.service';
import { TicketsService } from './services/tickets.service';
import { VoidPageService } from './services/void-page.service';
import { VoidRedCardComponent } from './void-red-card.component';

class Helper {
  static readonly fakeRequestId = 50121;
  static readonly addRequestSelector = 'add-request';
  static readonly fakeRequestDetailModel: RequestDetailModel = {
    actionId: 1,
    decidedBy: null,
    isTest: false,
    isVoided: false,
    issueTypeId: 11,
    mistakenBy: null,
    operators: [],
    provider: null,
    remark: 'test',
    requestedBy: "sa",
    source: null,
    sportType: 2,
    voidedBy: null,
    userId: 1,
    requestId: 0
  };
  static readonly fakeRequestEventModel: RequestEventModel = {
    awayId: 18486,
    subIssueTypeId: 27,
    eventDate: new Date(),
    finalAwayScore: null,
    finalHomeScore: null,
    homeId: 1983,
    htAwayScore: null,
    htHomeScore: null,
    kickOffTime: new Date('1752-12-16 01:00:00.000'),
    leagueId: 78717,
    matchId: 32784859,
    parentId: 0,
    transIds: '107661343669',
    globalShowTime: new Date('2020-12-16 02:00:00.000'),
    filterFromTransTime: new Date('2020-12-16 03:00:00.000'),
    filterToTransTime: new Date('2020-12-16 04:00:00.000'),
    filterBy: 1,
    singleCount: 1,
    minSingleTransId: 109271486445,
    maxSingleTransId: 109271486446,
    voidFromTime:new Date('2020-12-16 00:00:00.000'),
    voidToTime: new Date('2020-12-16 00:00:00.000'),
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: Helper.fakeRequestId,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: Helper.fakeRequestEventModel,
    playerNames: [],
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    redCardModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: [],
    duplicateTicketsModel: null,
    notParticipateModels: []
  };
  static getFakeAffectedLicensee(): AffectedLicensee {
    return {
      licenseesName: 'abc',
      show: true
    };
  }
  static getFakeAffectedLicenseeWithNameIsNull(): AffectedLicensee {
    return {
      licenseesName: '',
      show: true
    };
  }
}

describe('VoidRedCardComponent', () => {
  @NgModule({
    declarations: [
      LogInfoNewComponent,
      TicketsListComponent,
      TemplateMessageComponent
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
      ClipboardService,
      CommonService,
      ElementRef
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<VoidRedCardComponent>;

  beforeEach(async () => {
    shallow = new Shallow(VoidRedCardComponent, AppModuleTest).dontMock(NgbModule);

  });

  it('VoidRedCardComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();
    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should emit when call expected function', async () => {
    // Arrange
    const mockGetBasicVoidMatchesData = jest.fn();
    const mockGetIssueTypes = jest.fn();
    const mockLoadUnderneathVoidMatchesData = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageService, {
        getBasicVoidMatchesData: mockGetBasicVoidMatchesData,
        loadUnderneathVoidMatchesData: mockLoadUnderneathVoidMatchesData,
      })
      .mock(CommonService, {
        getIssueTypes: mockGetIssueTypes,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();
    const element = document.createElement('user-name');
    element.setAttribute('id', 'user-name');
    element.setAttribute('user-name', 'name');
    document.body.appendChild(element);
    // Action
    await instance.ngOnInit();

    // Assert
    expect(mockGetIssueTypes).toHaveBeenCalled();
    expect(mockGetBasicVoidMatchesData).toHaveBeenCalled();
    expect(mockLoadUnderneathVoidMatchesData).toHaveBeenCalled();
    expect(instance.isLoadedBasicData).toBeTruthy();
  });

  it('#onClickShowVoidTickets should return when isShowTicketFull & isRequestModified are incorrect', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTicketFull = false;
    voidMatch.isLoadedTicketFull = true;
    const mockIsRequestModified = jest.fn().mockImplementation(() => Promise.resolve(false));
    const mockToggleTicketsArea = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageService, {
        toggleTicketsArea: mockToggleTicketsArea,
      })
      .mock(CheckRequestService, {
        isRequestModified: mockIsRequestModified,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();

    // Action
    await instance.onClickShowVoidTickets(voidMatch);

    // Assert
    expect(mockIsRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should return when isShowTicketFull is incorrect but isRequestModified is incorrect', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTicketFull = false;
    const mockIsRequestModified = jest.fn().mockImplementation(() => Promise.resolve(true));
    const { instance } = await shallow
      .mock(CheckRequestService, {
        isRequestModified: mockIsRequestModified,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();

    // Action
    await instance.onClickShowVoidTickets(voidMatch);

    // Assert
    expect(mockIsRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should call #mockLoadVoidTicketsFullOnFirstTime when isShowTicketFull is correct & isLoadedTicketFull is incorrect', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTicketFull = true;
    voidMatch.isLoadedTicketFull = false;
    const mockToggleTicketsArea = jest.fn();
    const mockLoadVoidTicketsFullOnFirstTime = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageService, {
        toggleTicketsArea: mockToggleTicketsArea,
      })
      .mock(TicketsService, {
        loadVoidTicketsFullOnFirstTime: mockLoadVoidTicketsFullOnFirstTime,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();

    // Action
    await instance.onClickShowVoidTickets(voidMatch);

    // Assert
    expect(mockToggleTicketsArea).toHaveBeenCalledTimes(1);
    expect(mockLoadVoidTicketsFullOnFirstTime).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should not call #mockLoadVoidTicketsFullOnFirstTime when isShowTicketFull & isLoadedTicketFull are correct', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTicketFull = true;
    voidMatch.isLoadedTicketFull = true;
    const mockToggleTicketsArea = jest.fn();
    const mockLoadVoidTicketsFullOnFirstTime = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageService, {
        toggleTicketsArea: mockToggleTicketsArea,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();

    // Action
    await instance.onClickShowVoidTickets(voidMatch);

    // Assert
    expect(mockToggleTicketsArea).toHaveBeenCalledTimes(1);
    expect(mockLoadVoidTicketsFullOnFirstTime).toHaveBeenCalledTimes(0);
  });

  it('#onPagingTicketsChange should call #loadVoidTicketsFullOnPagingChange', async () => {
    // Arrange
    const mockLoadVoidTicketsFullOnPagingChange = jest.fn();
    const { instance } = await shallow
      .mock(TicketsService, {
        loadVoidTicketsFullOnPagingChange: mockLoadVoidTicketsFullOnPagingChange,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });

    // Action
    await instance.onPagingTicketsChange(null);

    // Assert
    expect(mockLoadVoidTicketsFullOnPagingChange).toHaveBeenCalledTimes(1);
  });

  it('#exportTickets should call #showWarningExportExcel when PagingItemsCount greater than 100000', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.pagingVoidTickets = new PagingModel();
    voidMatch.pagingVoidTickets.total = 100001;
    const mockShowWarningExportExcel = jest.fn();
    const { instance } = await shallow
      .mock(PopupService, {
        showWarningExportExcel: mockShowWarningExportExcel,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });

    // Action
    await instance.exportTickets(voidMatch);

    // Assert
    expect(mockShowWarningExportExcel).toHaveBeenCalledTimes(1);
  });

  it('#exportTickets should call #exportTicketsAsExcelFile when PagingItemsCount smaller than 100000', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.pagingVoidTickets = new PagingModel();
    voidMatch.pagingVoidTickets.total = 5000;
    const mockExportTicketsAsExcelFile = jest.fn();
    const { instance } = await shallow
      .mock(TicketsService, {
        exportTicketsAsExcelFile: mockExportTicketsAsExcelFile,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });

    // Action
    await instance.exportTickets(voidMatch);

    // Assert
    expect(mockExportTicketsAsExcelFile).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should call #exportTicketsAsExcelFile when isRequestModified is correct', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTemplateMessage = false;
    const mockIsRequestModified = jest.fn().mockImplementation(() => Promise.resolve(true));
    const { instance } = await shallow
      .mock(CheckRequestService, {
        isRequestModified: mockIsRequestModified,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();

    // Action
    await instance.onClickShowTemplateMessage(voidMatch);

    // Assert
    expect(mockIsRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should call #exportTicketsAsExcelFile when isRequestModified is incorrect', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTemplateMessage = false;
    const mockIsRequestModified = jest.fn().mockImplementation(() => Promise.resolve(false));
    const { instance } = await shallow
      .mock(CheckRequestService, {
        isRequestModified: mockIsRequestModified,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();

    // Action
    await instance.onClickShowTemplateMessage(voidMatch);

    // Assert
    expect(mockIsRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should unsubscribe #afterLoadUnderneathDataSubscription when isShowTemplateMessage is correct', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTemplateMessage = true;
    const afterLoadUnderneathDataSubscription = new Subscription();
    const spyAfterLoadUnderneathDataSubscription = jest.spyOn(afterLoadUnderneathDataSubscription, 'unsubscribe');
    const { instance } = await shallow
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance['afterLoadUnderneathDataSubscription'] = afterLoadUnderneathDataSubscription;

    // Action
    await instance.onClickShowTemplateMessage(voidMatch);

    // Assert
    expect(spyAfterLoadUnderneathDataSubscription).toHaveBeenCalledTimes(1);
  });

  it('#onClickCopyLicenseesToClipboard should call #checkLoadedFullDataBeforeShowMessageTemplate', async () => {
    // Arrange
    const mockCopyFromContent = jest.fn();
    window.alert = jest.fn();
    const { instance } = await shallow
    .mock(ClipboardService, {
      copyFromContent: mockCopyFromContent,
    })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });

    // Action
    instance.onClickCopyLicenseesToClipboard('');

    // Assert
    expect(window.alert).toHaveBeenCalledWith('The Licensee list has been copied to clipboard.');
  });

  it('#onClickVoidAllMatches call #tooTip.display when have not userPassword', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();
    instance.primitiveProperty.userPassword = null;
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();

    // Action
    instance.onClickVoidAllMatches();

    // Assert
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#onClickVoidAllMatches should unsubscribe #afterLoadUnderneathDataSubscription', async () => {
    // Arrange
    const afterLoadUnderneathDataSubscription = new Subscription();
    const spyAfterLoadUnderneathDataSubscription = jest.spyOn(afterLoadUnderneathDataSubscription, 'unsubscribe');
    const { instance } = await shallow
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();
    instance.primitiveProperty.userPassword = '123123';
    instance['afterLoadUnderneathDataSubscription'] = afterLoadUnderneathDataSubscription;

    // Action
    instance.onClickVoidAllMatches();

    // Assert
    expect(spyAfterLoadUnderneathDataSubscription).toHaveBeenCalledTimes(1);
  });

  it('#onClickVoidAllMatches should not unsubscribe #afterLoadUnderneathDataSubscription', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();
    instance.primitiveProperty.userPassword = '123123';
    instance['afterLoadUnderneathDataSubscription'] = null;

    // Action
    instance.onClickVoidAllMatches();
  });

  it('#checkLoadedFullDataBeforeShowMessageTemplate should return when #isRunningSubscriptionCallback is incorrect', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTemplateMessage = true;
    const mockToggleTemplateMessageArea = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageService, {
        toggleTemplateMessageArea: mockToggleTemplateMessageArea,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance['isRunningSubscriptionCallback'] = true;

    // Action
    await instance.checkLoadedFullDataBeforeShowMessageTemplate(voidMatch);

    // Assert
    expect(mockToggleTemplateMessageArea).toHaveBeenCalledTimes(0);
  });

  it('#checkLoadedFullDataBeforeShowMessageTemplate should return when #isRunningSubscriptionCallback is incorrect and isLoadedUnderneathData is correct', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTemplateMessage = true;
    const mockToggleTemplateMessageArea = jest.fn();
    const afterLoadUnderneathDataSubscription = new Subscription();
    const spyAfterLoadUnderneathDataSubscription = jest.spyOn(afterLoadUnderneathDataSubscription, 'unsubscribe');
    const { instance } = await shallow
      .mock(VoidPageService, {
        toggleTemplateMessageArea: mockToggleTemplateMessageArea,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();
    instance['afterLoadUnderneathDataSubscription'] = afterLoadUnderneathDataSubscription;
    instance['isRunningSubscriptionCallback'] = false;
    instance['isLoadedUnderneathData'] = true;

    // Action
    await instance.checkLoadedFullDataBeforeShowMessageTemplate(voidMatch);

    // Assert
    expect(spyAfterLoadUnderneathDataSubscription).toHaveBeenCalledTimes(1);
    expect(mockToggleTemplateMessageArea).toHaveBeenCalledTimes(1);
  });

  it('#checkLoadedFullDataBeforeShowMessageTemplate should return when isRunningSubscriptionCallback & isLoadedUnderneathData are correct', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.isShowTemplateMessage = true;
    const mockToggleTemplateMessageArea = jest.fn();
    const { instance } = await shallow
      .mock(VoidPageService, {
        toggleTemplateMessageArea: mockToggleTemplateMessageArea,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();
    instance['isRunningSubscriptionCallback'] = false;
    instance['isLoadedUnderneathData'] = false;

    // Action
    await instance.checkLoadedFullDataBeforeShowMessageTemplate(voidMatch);

    // Assert
    expect(mockToggleTemplateMessageArea).toHaveBeenCalledTimes(0);
  });

  it('#checkLoadedFullDataBeforeVoid should return when isRunningSubscriptionCallback is correct', async () => {
    // Arrange
    const mockVoidAllMatches = jest.fn();
    const { instance } = await shallow
      .mock(SubmitVoidService, {
        voidAllMatches: mockVoidAllMatches,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();
    instance['isRunningSubscriptionCallback'] = true;

    // Action
    await instance.checkLoadedFullDataBeforeVoid();

    // Assert
    expect(mockVoidAllMatches).toHaveBeenCalledTimes(0);
  });

  it('#checkLoadedFullDataBeforeVoid should return when isRunningSubscriptionCallback is correct & isLoadedUnderneathData is incorrect', async () => {
    // Arrange
    const mockVoidAllMatches = jest.fn();
    const { instance } = await shallow
      .mock(SubmitVoidService, {
        voidAllMatches: mockVoidAllMatches,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.primitiveProperty = new PrimitiveProperty();
    instance['isRunningSubscriptionCallback'] = true;
    instance['isLoadedUnderneathData'] = false;

    // Action
    await instance.checkLoadedFullDataBeforeVoid();

    // Assert
    expect(mockVoidAllMatches).toHaveBeenCalledTimes(0);
  });

  it('#checkLoadedFullDataBeforeVoid should call #voidAllMatches', async () => {
    // Arrange
    const mockVoidAllMatches = jest.fn();
    const afterLoadUnderneathDataSubscription = new Subscription();
    const spyAfterLoadUnderneathDataSubscription = jest.spyOn(afterLoadUnderneathDataSubscription, 'unsubscribe');
    const { instance } = await shallow
      .mock(SubmitVoidService, {
        voidAllMatches: mockVoidAllMatches,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.initialize = true;
    const templateMessageComponentQueryList = new QueryList<TemplateMessageComponent>();
    instance.templateMessageViewChildren.reset([...templateMessageComponentQueryList.toArray(), templateMessageComponent]);
    instance.primitiveProperty = new PrimitiveProperty();
    instance['isRunningSubscriptionCallback'] = false;
    instance['isLoadedUnderneathData'] = true;
    instance['afterLoadUnderneathDataSubscription'] = afterLoadUnderneathDataSubscription;

    // Action
    await instance.checkLoadedFullDataBeforeVoid();

    // Assert
    expect(spyAfterLoadUnderneathDataSubscription).toHaveBeenCalledTimes(1);
    expect(mockVoidAllMatches).toHaveBeenCalledTimes(1);
  });

  it('#checkLoadedFullDataBeforeVoid should not call #voidAllMatches', async () => {
    // Arrange
    const mockVoidAllMatches = jest.fn();
    const afterLoadUnderneathDataSubscription = new Subscription();
    const spyAfterLoadUnderneathDataSubscription = jest.spyOn(afterLoadUnderneathDataSubscription, 'unsubscribe');
    const { instance } = await shallow
      .mock(SubmitVoidService, {
        voidAllMatches: mockVoidAllMatches,
      })
      .render({
        bind: {
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.initialize = false;
    const templateMessageComponentQueryList = new QueryList<TemplateMessageComponent>();
    instance.templateMessageViewChildren.reset([...templateMessageComponentQueryList.toArray(), templateMessageComponent]);
    instance.primitiveProperty = new PrimitiveProperty();
    instance['isRunningSubscriptionCallback'] = false;
    instance['isLoadedUnderneathData'] = true;
    instance['afterLoadUnderneathDataSubscription'] = afterLoadUnderneathDataSubscription;

    // Action
    await instance.checkLoadedFullDataBeforeVoid();

    // Assert
    expect(spyAfterLoadUnderneathDataSubscription).toHaveBeenCalledTimes(0);
    expect(mockVoidAllMatches).toHaveBeenCalledTimes(0);
  });

  it('#isShowAffectedLicenseeArea should return expected', async () => {
    const testCase = [
      {affectedLicensee: Helper.getFakeAffectedLicensee(), chinaViewLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(),
        affectedInstantLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cashOutLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cancelAnimationFrame: Helper.getFakeAffectedLicenseeWithNameIsNull(), expected: true },
      {affectedLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), chinaViewLicensee: Helper.getFakeAffectedLicensee(),
        affectedInstantLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cashOutLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cancelAnimationFrame: Helper.getFakeAffectedLicenseeWithNameIsNull(), expected: true },
      {affectedLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), chinaViewLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(),
        affectedInstantLicensee: Helper.getFakeAffectedLicensee(), cashOutLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cancelAnimationFrame: Helper.getFakeAffectedLicenseeWithNameIsNull(), expected: true },
      {affectedLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), chinaViewLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(),
        affectedInstantLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cashOutLicensee: Helper.getFakeAffectedLicensee(), cancelAnimationFrame: Helper.getFakeAffectedLicenseeWithNameIsNull(), expected: true },
      {affectedLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), chinaViewLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(),
        affectedInstantLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cashOutLicensee: Helper.getFakeAffectedLicenseeWithNameIsNull(), cancelAnimationFrame: Helper.getFakeAffectedLicenseeWithNameIsNull(), expected: false },
    ];
    const voidMatch = new VoidMatch();
    const { instance } = await shallow.render();
    testCase.forEach(x => {
      voidMatch.affectedLicensee = x.affectedLicensee;
      voidMatch.chinaViewLicensee = x.chinaViewLicensee;
      voidMatch.affectedInstantLicensee = x.affectedInstantLicensee;
      voidMatch.cashOutLicensee = x.cashOutLicensee;
      voidMatch.cancelCashOutLicensee = x.cancelAnimationFrame;

      const actual = instance.isShowAffectedLicenseeArea(voidMatch);

      expect(actual).toBe(x.expected);
    });
  });
});
