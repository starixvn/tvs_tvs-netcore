import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { LABELS } from '../../../utility/constants/labels';
import { TEXT } from '../../../utility/constants/text';
import { Result } from '../../../utility/models/result';
import { PopupService } from './popup.service';
import { TestBed } from '@angular/core/testing';

class Helper {
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 111111,
    errorMsg: '',
  };
}

describe('PopupService', () => {
  let popupService: PopupService;
  let modalService: jest.Mocked<ModalService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PopupService,
        { provide: ModalService, useValue: { open: jest.fn(), confirm: jest.fn() } }
      ]
    });
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;
    popupService = TestBed.inject(PopupService);
  });

  it('#showVoidBetConfirm should call expected function', async () => {
    const spyModalServiceConfirm = jest.spyOn(modalService, 'confirm').mockImplementation(() => { });
    const confirmModal = {
      title: 'Void Bet Confirm',
      message: `message`,
    };
    popupService['getWarningInTemplateMessage'] = jest.fn().mockImplementation(() => '');
    popupService.showVoidBetConfirm('message', () => { });

    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    spyModalServiceConfirm.mock.calls[0][2]();
  });

  it('#showWarningVoidBetPermission should call expected function', async () => {
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => { });
    const confirmModal = {
      title: 'Warning!',
      message: 'message',
      type: ModalType.Warning
    };
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.location.reload = jest.fn();

    popupService.showWarningVoidBetPermission('message');

    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
  });

  it('#showWarningExportExcel should call modalServiceConfirm', async () => {
    const spyModalServiceOpen = jest.spyOn(modalService, 'open').mockImplementation(() => { });
    const confirmModal = {
      title: 'Export Excel Result',
      message: LABELS.EXPORT_LARGE_FILE,
      type: ModalType.Warning
    };

    popupService.showWarningExportExcel();

    expect(spyModalServiceOpen).toHaveBeenCalledTimes(1);
    expect(spyModalServiceOpen.mock.calls[0][0]).toStrictEqual(confirmModal);
  });

  it('#showSubmitVoidRequestSuccess should call expected function', async () => {
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => { });
    const confirmModal = {
      title: 'Confirmation Result ',
      message: TEXT.REQUEST_CONFIRMED_SUCCESSFULLY,
      type: ModalType.Alert
    };
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.close = jest.fn();

    popupService.showSubmitVoidRequestSuccess();

    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    expect(window.close).toHaveBeenCalledTimes(1);
  });

  it('#showSubmitVoidRequestError should call expected function when input wrong password', async () => {
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => { });
    const confirmModal = {
      title: 'Error',
      message: Helper.fakeResultError.errorMsg,
      type: ModalType.Error
    };
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.close = jest.fn();

    popupService.showSubmitVoidRequestError(Helper.fakeResultError);

    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    expect(window.close).toHaveBeenCalledTimes(1);
  });
});