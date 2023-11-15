import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { AffectedLicensee } from '../../../utility/models/affected-licensee.model';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckRequestService } from './check-request.service';
import { LoadDataService } from './load-data.service';
import { PopupService } from './popup.service';
import { TicketsService } from './tickets.service';
import { VoidPageCommonService } from './void-page-common.service';

describe('VoidPageCommonService', () => {
  let clipboardService: ClipboardService;
  let popupService: PopupService;
  let ticketsService: TicketsService;
  let checkRequestService: CheckRequestService;
  let loadDataService: LoadDataService;
  let voidPageCommonService: VoidPageCommonService;

  beforeEach(() => {
    clipboardService = new ClipboardService(null, null, null);
    popupService = new PopupService(null);
    ticketsService = new TicketsService(null);
    checkRequestService = new CheckRequestService(null, null);
    loadDataService = new LoadDataService(null, null, null);
    voidPageCommonService = new VoidPageCommonService(clipboardService, popupService, ticketsService, checkRequestService, loadDataService);
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

  it('#isShowAffectedLicenseeArea should return true when only have affectedLicensee', async () => {
    const item = new VoidPageCommonItem();
    item.affectedLicensee = new AffectedLicensee();
    item.chinaViewLicensee = new AffectedLicensee();
    item.affectedInstantLicensee = new AffectedLicensee();
    item.cashOutLicensee = new AffectedLicensee();
    item.affectedLicensee.show = true;
    item.affectedLicensee.licenseesName = '123123';
    const actual = voidPageCommonService.isShowAffectedLicenseeArea(item);

    expect(actual).toBeTruthy();
  });

  it('#isShowAffectedLicenseeArea should return true when only have chinaViewLicensee', async () => {
    const item = new VoidPageCommonItem();
    item.affectedLicensee = new AffectedLicensee();
    item.chinaViewLicensee = new AffectedLicensee();
    item.affectedInstantLicensee = new AffectedLicensee();
    item.cashOutLicensee = new AffectedLicensee();
    item.chinaViewLicensee.show = true;
    item.chinaViewLicensee.licenseesName = '123123';
    const actual = voidPageCommonService.isShowAffectedLicenseeArea(item);

    expect(actual).toBeTruthy();
  });

  it('#isShowAffectedLicenseeArea should return true when only have affectedInstantLicensee', async () => {
    const item = new VoidPageCommonItem();
    item.affectedLicensee = new AffectedLicensee();
    item.chinaViewLicensee = new AffectedLicensee();
    item.affectedInstantLicensee = new AffectedLicensee();
    item.cashOutLicensee = new AffectedLicensee();
    item.affectedInstantLicensee.show = true;
    item.affectedInstantLicensee.licenseesName = '123123';
    const actual = voidPageCommonService.isShowAffectedLicenseeArea(item);

    expect(actual).toBeTruthy();
  });

  it('#isShowAffectedLicenseeArea should return true when only have cashOutLicensee', async () => {
    const item = new VoidPageCommonItem();
    item.affectedLicensee = new AffectedLicensee();
    item.chinaViewLicensee = new AffectedLicensee();
    item.affectedInstantLicensee = new AffectedLicensee();
    item.cashOutLicensee = new AffectedLicensee();
    item.cashOutLicensee.show = true;
    item.cashOutLicensee.licenseesName = '123123';
    const actual = voidPageCommonService.isShowAffectedLicenseeArea(item);

    expect(actual).toBeTruthy();
  });

  it('#isShowAffectedLicenseeArea should return false', async () => {
    const item = new VoidPageCommonItem();
    item.affectedLicensee = new AffectedLicensee();
    item.chinaViewLicensee = new AffectedLicensee();
    item.affectedInstantLicensee = new AffectedLicensee();
    item.cashOutLicensee = new AffectedLicensee();
    const actual = voidPageCommonService.isShowAffectedLicenseeArea(item);

    expect(actual).toBeFalsy();
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