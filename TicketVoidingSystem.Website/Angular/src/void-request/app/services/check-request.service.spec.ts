import { ModalType } from "../../../utility/components/modal/modal.model";
import { ModalService } from "../../../utility/components/modal/modal.service";
import { AppService } from "../app.service";
import { RequestLastModifiedDate } from "../models/request-last-modified-date.model";
import { CheckRequestService } from "./check-request.service";
import { TestBed } from "@angular/core/testing";

class Helper {
  static readonly url = 'http://localhost:60196/';
}

describe('CheckRequestService', () => {
  let appService: jest.Mocked<AppService>;
  let modalService: jest.Mocked<ModalService>;
  let checkRequestService: CheckRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CheckRequestService,
        { provide: AppService, useValue: { getLastModifiedDate: jest.fn() } },
        { provide: ModalService, useValue: { open: jest.fn() } }
      ]
    });
    appService = TestBed.inject(AppService) as jest.Mocked<AppService>;
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;
    checkRequestService = TestBed.inject(CheckRequestService);
  });

  it('#isRequestModified should return true', async () => {
    appService.getLastModifiedDate = jest.fn().mockImplementation(() => Promise.resolve(new RequestLastModifiedDate()));
    checkRequestService['showWarningPopupRequestModified'] = jest.fn();

    const result = await checkRequestService.isRequestModified(null, null);

    expect(result).toBeTruthy();
  });

  it('#isRequestModified should return false', async () => {
    const lastModifiedDate = new Date();
    const fakeRequestLastModifiedDate = new RequestLastModifiedDate();
    fakeRequestLastModifiedDate.lastModifiedDate = lastModifiedDate;
    appService.getLastModifiedDate = jest.fn().mockImplementation(() => Promise.resolve(fakeRequestLastModifiedDate));
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
    modalService.open = mockOpen;
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();
    checkRequestService['showWarningPopupRequestModified']();

    expect(mockOpen.mock.calls[0][0]).toStrictEqual(openModal);

    mockOpen.mock.calls[0][1]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});