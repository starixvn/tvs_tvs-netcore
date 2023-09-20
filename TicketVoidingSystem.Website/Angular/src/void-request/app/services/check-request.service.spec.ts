import { NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ModalType } from "../../../utility/components/modal/modal.model";
import { ModalService } from "../../../utility/components/modal/modal.service";
import { AppService } from "../app.service";
import { RequestLastModifiedDate } from "../models/request-last-modified-date.model";
import { CheckRequestService } from "./check-request.service";

class Helper {
  static readonly url = 'http://localhost:60196/';

}

describe('CheckRequestService', () => {
  let checkRequestService: CheckRequestService;

  beforeEach(() => {
    checkRequestService = new CheckRequestService(null, null);
  });

  it('#isRequestModified should return true', async () => {
    const appService = new AppService(null);
    appService.getLastModifiedDate = jest.fn().mockImplementation(() => Promise.resolve(new RequestLastModifiedDate()));
    checkRequestService = new CheckRequestService(appService, null);
    checkRequestService['showWarningPopupRequestModified'] = jest.fn();

    const result = await checkRequestService.isRequestModified(null, null);

    expect(result).toBeTruthy();
  });

  it('#isRequestModified should return false', async () => {
    const lastModifiedDate = new Date();
    const fakeRequestLastModifiedDate = new RequestLastModifiedDate();
    fakeRequestLastModifiedDate.lastModifiedDate = lastModifiedDate;
    const appService = new AppService(null);
    appService.getLastModifiedDate = jest.fn().mockImplementation(() => Promise.resolve(fakeRequestLastModifiedDate));
    checkRequestService = new CheckRequestService(appService, null);
    checkRequestService['showWarningPopupRequestModified'] = jest.fn();

    const result = await checkRequestService.isRequestModified(null, lastModifiedDate);

    expect(result).toBe(false);
  });

  it('#showWarningPopupRequestModified should handle correctly', async () => {
    const mockOpen = jest.fn();
    const openModal = {
      title: 'Warning',
      message: 'The request was changed. You are about to back the page and check again.',
      type: ModalType.Warning
    };
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = mockOpen;
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    checkRequestService = new CheckRequestService(null, modalService);
    checkRequestService['showWarningPopupRequestModified']();

    expect(mockOpen.mock.calls[0][0]).toStrictEqual(openModal);

    mockOpen.mock.calls[0][1]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});