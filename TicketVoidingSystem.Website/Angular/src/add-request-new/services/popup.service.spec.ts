import { TestBed } from '@angular/core/testing';
import { ModalType } from '../../utility/components/modal/modal.model';
import { ModalService } from '../../utility/components/modal/modal.service';
import { TEXT } from '../../utility/constants/text';
import { Result } from '../../utility/models/result';
import { TestingModule } from '../../utility/modules/testing.module';
import { StaticService } from '../../utility/services/static.service';
import { AddRequestQuery } from '../models/add-request.query';
import { AddRequestResultModel } from '../models/request.model';
import { PopupService } from './popup.service';

describe('PopupService', () => {
  let service: PopupService;
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [PopupService]
    });

    service = TestBed.inject(PopupService);
    modalService = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showError', () => {
    it('should call modalService.open with error type', () => {
      // Arrange
      const messageContent = 'Test error message';
      jest.spyOn(modalService, 'open');

      // Act
      service.showError(messageContent);

      // Assert
      expect(modalService.open).toHaveBeenCalledWith(
        {
          title: TEXT.ADD_REQUEST_RESULT_TITLE,
          message: `Error: ${messageContent}`,
          type: ModalType.Error
        }
      );
    });
  });

  describe('showAddedRequestSuccessful', () => {
    it('should show success message with match IDs and marked tickets for normal account', () => {
      // Arrange
      const query = {
        issueTypeId: '1',
        abnormalBetInfo: { transIds: '123,456' }
      } as AddRequestQuery;

      const addRequestResult = {
        requestId: 'REQ123',
        matchId: 'MATCH123',
        markedTicketsSuccessful: ['123', '456']
      } as unknown as AddRequestResultModel;

      const onOkCallback = jest.fn();
      jest.spyOn(modalService, 'open');
      jest.spyOn(StaticService, 'isAbnormalAccount').mockReturnValue(false);
      jest.spyOn(StaticService, 'isArchivedTicket').mockReturnValue(false);
      jest.spyOn(StaticService, 'isRecoverTicket').mockReturnValue(false);
      jest.spyOn(StaticService, 'isAbnormalBet').mockReturnValue(false);

      // Act
      service.showAddedRequestSuccessful(query, addRequestResult, onOkCallback);

      // Assert
      expect(modalService.open).toHaveBeenCalledWith(
        {
          title: TEXT.ADD_REQUEST_RESULT_TITLE,
          message: expect.stringContaining('REQ123'),
          type: ModalType.Alert
        },
        onOkCallback
      );
    });

    it('should show success message without match IDs for abnormal account', () => {
      // Arrange
      const query = {
        issueTypeId: '1',
        abnormalBetInfo: { transIds: '123,456' }
      } as AddRequestQuery;

      const addRequestResult = {
        requestId: 'REQ123',
        matchId: 'MATCH123',
        markedTicketsSuccessful: ['123', '456']
      } as unknown as AddRequestResultModel;

      const onOkCallback = jest.fn();
      jest.spyOn(modalService, 'open');
      jest.spyOn(StaticService, 'isAbnormalAccount').mockReturnValue(true);

      // Act
      service.showAddedRequestSuccessful(query, addRequestResult, onOkCallback);

      // Assert
      expect(modalService.open).toHaveBeenCalledWith(
        {
          title: TEXT.ADD_REQUEST_RESULT_TITLE,
          message: expect.not.stringContaining('Match'),
          type: ModalType.Alert
        },
        onOkCallback
      );
    });
  });

  describe('showEditedRequestSuccessful', () => {
    it('should show success message for edited request', () => {
      // Arrange
      const query = {
        issueTypeId: '1',
        abnormalBetInfo: { transIds: '123,456' }
      } as AddRequestQuery;

      const addRequestResult = {
        requestId: 'REQ123',
        markedTicketsSuccessful: ['123', '456']
      } as unknown as AddRequestResultModel;

      const onOkCallback = jest.fn();
      jest.spyOn(modalService, 'open');

      // Act
      service.showEditedRequestSuccessful(addRequestResult, onOkCallback);

      // Assert
      expect(modalService.open).toHaveBeenCalledWith(
        {
          title: TEXT.EDIT_REQUEST_RESULT_TITLE,
          message: expect.stringContaining('REQ123'),
          type: ModalType.Alert
        },
        onOkCallback
      );
    });
  });

  describe('showSaveRequestError', () => {
    it('should show error message with marked tickets info', () => {
      // Arrange
      const query = {
        issueTypeId: '1',
        abnormalBetInfo: { transIds: '123,456' }
      } as AddRequestQuery;

      const addResult = {
        data: {
          markedTicketsSuccessful: ['123', '456']
        } as unknown as AddRequestResultModel,
        errorMsg: 'Test error message'
      } as Result<AddRequestResultModel>;

      const titleMessage = 'Error Title';
      jest.spyOn(modalService, 'open');

      // Act
      service.showSaveRequestError(addResult.errorMsg, titleMessage);

      // Assert
      expect(modalService.open).toHaveBeenCalledWith(
        {
          title: titleMessage,
          message: expect.stringContaining('Test error message'),
          type: ModalType.Error
        },
        expect.any(Function)
      );
    });
  });

  describe('showConfirm', () => {
    it('should show confirm dialog with callbacks', () => {
      // Arrange
      const messageContent = 'Test confirm message';
      const onYesCallback = jest.fn();
      const onNoCallback = jest.fn();
      jest.spyOn(modalService, 'confirm');

      // Act
      service.showConfirm(messageContent, onYesCallback, onNoCallback);

      // Assert
      expect(modalService.confirm).toHaveBeenCalledWith(
        {
          title: 'Confirm',
          message: messageContent,
          type: ModalType.Confirm
        },
        onYesCallback,
        onNoCallback
      );
    });
  });

  describe('showPermissionError', () => {
    it('should show permission error message', () => {
      // Arrange
      const errorMessage = 'Permission denied';
      jest.spyOn(modalService, 'open');

      // Act
      service.showPermissionError(errorMessage);

      // Assert
      expect(modalService.open).toHaveBeenCalledWith(
        {
          title: 'Permission',
          message: errorMessage,
          type: ModalType.Error
        },
        expect.any(Function)
      );
    });
  });
});
