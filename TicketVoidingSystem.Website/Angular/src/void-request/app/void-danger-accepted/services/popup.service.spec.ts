import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalType } from '../../../../utility/components/modal/modal';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { TemplateMessageComponent } from '../../../../utility/components/template-message/template-message/template-message.component';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { LABELS } from '../../../../utility/constants/labels';
import { TEXT } from '../../../../utility/constants/text';
import { MatchModel } from '../../../../utility/models/match.model';
import { Result } from '../../../../utility/models/result';
import { VoidMatch } from '../../models/void-match.model';
import { PopupService } from './popup.service';

class Helper {
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 111111,
    errorMsg: '',
  };
}

describe('PopupService', () => {
  let popupService: PopupService;
  let modalService: ModalService;

  beforeEach(() => {
    popupService = new PopupService(null);
    modalService = new ModalService(new NgbModalConfig(null), null, null);
  });

  it('#showVoidBetConfirm should call expected function', async () => {
    // Arrange
    const spyModalServiceConfirm = jest.spyOn(modalService, 'confirm').mockImplementation(() => {});
    const confirmModal = {
      title: 'Void Bet Confirm',
      message: `<div>${LABELS.CONFIRM_VOID_ALL_TICKETS}</div>`,
    };
    const mockPopupService = new PopupService(modalService);
    mockPopupService['getWarningInTemplateMessage'] = jest.fn().mockImplementation(() => '');

    // Action
    mockPopupService.showVoidBetConfirm(null, null, () => {});

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(spyModalServiceConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    spyModalServiceConfirm.mock.calls[0][2]();
  });

  it('#showWarningVoidBetPermission should call expected function', async () => {
    // Arrange
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => {});
    const confirmModal = {
      title: 'Warning!',
      message: '',
      type: ModalType.Warning
    };
    const mockPopupService = new PopupService(modalService);
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.location.reload = jest.fn();

    // Action
    mockPopupService.showWarningVoidBetPermission('');

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
  });

  it('#showWarningExportExcel should call expected function', async () => {
    // Arrange
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => {});
    const confirmModal = {
      title: 'Export Excel Result',
      message: LABELS.EXPORT_LARGE_FILE,
      type: ModalType.Warning
    };
    const mockPopupService = new PopupService(modalService);

    // Action
    mockPopupService.showWarningExportExcel();

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
  });

  it('#showSubmitVoidRequestSuccess should call expected function', async () => {
    // Arrange
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => {});
    const confirmModal = {
      title: 'Confirmation Result ',
      message: TEXT.REQUEST_CONFIRMED_SUCCESSFULLY,
      type: ModalType.Alert
    };
    const mockPopupService = new PopupService(modalService);
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.close = jest.fn();

    // Action
    mockPopupService.showSubmitVoidRequestSuccess();

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    expect(window.close).toHaveBeenCalledTimes(1);
  });

  it('#showSubmitVoidRequestError should call expected function when input wrong password', async () => {
    // Arrange
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => {});
    const confirmModal = {
      title: 'Error',
      message: Helper.fakeResultError.errorMsg,
      type: ModalType.Error
    };
    const mockPopupService = new PopupService(modalService);
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.close = jest.fn();

    // Action
    mockPopupService.showSubmitVoidRequestError(Helper.fakeResultError);

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    expect(window.close).toHaveBeenCalledTimes(1);
  });

  it('#showSubmitVoidRequestError should call expected function when input correct password', async () => {
    // Arrange
    const spyModalServiceConfirm = jest.spyOn(modalService, 'open').mockImplementation(() => {});
    const confirmModal = {
      title: 'Error',
      message: Helper.fakeResultError.errorMsg,
      type: ModalType.Error
    };
    const fakeResultError = Helper.fakeResultError;
    fakeResultError.errorCode = 121;
    const mockPopupService = new PopupService(modalService);
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.close = jest.fn();

    // Action
    mockPopupService.showSubmitVoidRequestError(Helper.fakeResultError);

    // Assert
    expect(spyModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(spyModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(spyModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);

    spyModalServiceConfirm.mock.calls[0][1]();
    expect(window.close).toHaveBeenCalledTimes(0);
  });

  it('#showSubmitVoidRequestError should return message when #getMatchesHaveWarning return list matchId', async () => {
    // Arrange
    popupService['getMatchesHaveWarning'] = jest.fn().mockImplementation(() => [1,2]);

    // Action
    const result = popupService['getWarningInTemplateMessage'](null, null);

    // Assert

    expect(result.length).toBeGreaterThan(0);
  });

  it('#showSubmitVoidRequestError should return message when #getMatchesHaveWarning return empty array', async () => {
    // Arrange
    popupService['getMatchesHaveWarning'] = jest.fn().mockImplementation(() => []);

    // Action
    const result = popupService['getWarningInTemplateMessage'](null, null);

    // Assert

    expect(result.length).toBe(0);
  });

  it('#getMatchesHaveWarning should return expect list match', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.matchModel = new MatchModel();
    voidMatch.matchModel.matchId = 90000;

    const templateMessageComponent = new TemplateMessageComponent(null, null);
    templateMessageComponent.value = new TemplateValue();
    templateMessageComponent.value.matchId = voidMatch.matchModel.matchId;
    templateMessageComponent.isHasWarningForDynamicInput = jest.fn().mockImplementation(() => true);

    // Action
    const result = popupService['getMatchesHaveWarning']([voidMatch], [templateMessageComponent]);

    // Assert

    expect(result).toEqual([voidMatch.matchModel.matchId]);
  });
});