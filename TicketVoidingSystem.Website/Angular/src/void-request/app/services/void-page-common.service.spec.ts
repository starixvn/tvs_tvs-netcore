import { TestBed } from '@angular/core/testing';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckRequestService } from './check-request.service';
import { LoadDataService } from './load-data.service';
import { PopupService } from './popup.service';
import { TicketsService } from './tickets.service';
import { VoidPageCommonService } from './void-page-common.service';

describe('VoidPageCommonService', () => {
  let clipboardService: jest.Mocked<ClipboardService>;
  let popupService: jest.Mocked<PopupService>;
  let ticketsService: jest.Mocked<TicketsService>;
  let checkRequestService: jest.Mocked<CheckRequestService>;
  let loadDataService: jest.Mocked<LoadDataService>;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ TestingModule ],
      providers: [
        VoidPageCommonService,
        { provide: ClipboardService, useValue: { copyFromContent: jest.fn() } },
        { provide: PopupService, useValue: { showWarningExportExcel: jest.fn() } },
        { provide: TicketsService, useValue: { exportTicketsAsExcelFile: jest.fn() } },
        { provide: CheckRequestService, useValue: { isRequestModified: jest.fn() } },
        { provide: LoadDataService, useValue: { onClickShowVoidTickets: jest.fn(), checkLoadedFullDataBeforeVoid: jest.fn(), onClickShowTemplateMessage: jest.fn() } }
      ]
    });
    clipboardService = TestBed.inject(ClipboardService) as jest.Mocked<ClipboardService>;
    popupService = TestBed.inject(PopupService) as jest.Mocked<PopupService>;
    ticketsService = TestBed.inject(TicketsService) as jest.Mocked<TicketsService>;
    checkRequestService = TestBed.inject(CheckRequestService) as jest.Mocked<CheckRequestService>;
    loadDataService = TestBed.inject(LoadDataService) as jest.Mocked<LoadDataService>;
    voidPageCommonService = TestBed.inject(VoidPageCommonService);
  });

  it('#showWarningExportExcel should called #popupService.showWarningExportExcel', async () => {
    const spyShowWarningExportExcel = jest.spyOn(popupService, 'showWarningExportExcel').mockImplementation();
    voidPageCommonService.showWarningExportExcel();

    expect(spyShowWarningExportExcel).toHaveBeenCalledTimes(1);
  });

  it('#isRequestModified should called #checkRequestService.isRequestModified', async () => {
    const spyIsRequestModified = jest.spyOn(checkRequestService, 'isRequestModified').mockImplementation();
    await voidPageCommonService['isRequestModified'](null, null);

    expect(spyIsRequestModified).toHaveBeenCalledTimes(1);
  });

  it('#exportTickets should called #popupService.showWarningExportExcel', async () => {
    const spyShowWarningExportExcel = jest.spyOn(popupService, 'showWarningExportExcel').mockImplementation();
    const item = new VoidPageCommonItem();
    item.pagingVoidTickets = new PagingModel();
    item.pagingVoidTickets.total = 2000000;
    await voidPageCommonService.exportTickets(item, null);

    expect(spyShowWarningExportExcel).toHaveBeenCalledTimes(1);
  });

  it('#exportTickets should called #popupService.showWarningExportExcel', async () => {
    const spyExportTicketsAsExcelFile = jest.spyOn(ticketsService, 'exportTicketsAsExcelFile').mockImplementation();
    const item = new VoidPageCommonItem();
    item.pagingVoidTickets = new PagingModel();
    item.pagingVoidTickets.total = 2;
    await voidPageCommonService.exportTickets(item, null);

    expect(spyExportTicketsAsExcelFile).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowVoidTickets should called #loadDataService.onClickShowVoidTickets', async () => {
    const spyOnClickShowVoidTickets = jest.spyOn(loadDataService, 'onClickShowVoidTickets').mockImplementation();
    await voidPageCommonService.onClickShowVoidTickets(null, null, null);

    expect(spyOnClickShowVoidTickets).toHaveBeenCalledTimes(1);
  });

  it('#checkLoadedFullDataBeforeVoid should called #loadDataService.checkLoadedFullDataBeforeVoid', async () => {
    const spyCheckLoadedFullDataBeforeVoid = jest.spyOn(loadDataService, 'checkLoadedFullDataBeforeVoid').mockImplementation();
    await voidPageCommonService.checkLoadedFullDataBeforeVoid(null, null, null, null);

    expect(spyCheckLoadedFullDataBeforeVoid).toHaveBeenCalledTimes(1);
  });

  it('#onClickShowTemplateMessage should called #loadDataService.onClickShowTemplateMessage', async () => {
    const spyOnClickShowTemplateMessage = jest.spyOn(loadDataService, 'onClickShowTemplateMessage').mockImplementation();
    await voidPageCommonService.onClickShowTemplateMessage(null, null, null, null);

    expect(spyOnClickShowTemplateMessage).toHaveBeenCalledTimes(1);
  });

  it('#onClickCopyLicenseesToClipboard should called #clipboardService.copyFromContent', async () => {
    const spyCopyFromContent = jest.spyOn(clipboardService, 'copyFromContent').mockImplementation();
    window.alert = jest.fn();
    voidPageCommonService.onClickCopyLicenseesToClipboard(null);

    expect(spyCopyFromContent).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  it('#onClickVoidAllMatches call #tooTip.display when have not userPassword', async () => {
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.userPassword = null;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    voidPageCommonService.onClickVoidAllMatches(null, [], null, primitiveProperty, tooltip);

    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#onClickVoidAllMatches should unsubscribe #afterLoadUnderneathDataSubscription', async () => {
    const afterLoadUnderneathDataSubscription = new Subscription();
    const spyAfterLoadUnderneathDataSubscription = jest.spyOn(afterLoadUnderneathDataSubscription, 'unsubscribe');
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.userPassword = '123123';

    voidPageCommonService.onClickVoidAllMatches(null, [], afterLoadUnderneathDataSubscription, primitiveProperty, null);

    expect(spyAfterLoadUnderneathDataSubscription).toHaveBeenCalledTimes(1);
  });

  it('#onClickVoidAllMatches should not unsubscribe #afterLoadUnderneathDataSubscription', async () => {
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.userPassword = '123123';

    voidPageCommonService.onClickVoidAllMatches(null, [], null, primitiveProperty, null);
  });
});