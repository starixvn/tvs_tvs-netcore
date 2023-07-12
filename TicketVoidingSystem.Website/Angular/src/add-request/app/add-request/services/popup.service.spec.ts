import { NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "../../../../utility/components/modal/modal.service";
import { PopupService } from "./popup.service";

describe('PopupService', () => {
  let popupService: PopupService;

  beforeEach(() => {
    popupService = new PopupService(null);
  });
  
  it('#showError should call #modalService.open', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = jest.fn();
    popupService = new PopupService(modalService);

    popupService.showError(null, () => {});

    expect(modalService.open).toHaveBeenCalledTimes(1);
  });
  
  it('#showAddedRequestSuccessful should call #modalService.open', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = jest.fn();
    popupService = new PopupService(modalService);

    popupService.showAddedRequestSuccessful(null, () => {});

    expect(modalService.open).toHaveBeenCalledTimes(1);
  });
  
  it('#showEditedRequestSuccessful should call #modalService.open', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = jest.fn();
    popupService = new PopupService(modalService);

    popupService.showEditedRequestSuccessful(null, () => {});

    expect(modalService.open).toHaveBeenCalledTimes(1);
  });
  
  it('#showSaveRequestError should call #modalService.open', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    const mockModalServiceOpen = jest.fn();
    modalService.open = mockModalServiceOpen;
    popupService = new PopupService(modalService);

    popupService.showSaveRequestError(null, null);

    expect(modalService.open).toHaveBeenCalledTimes(1);
    mockModalServiceOpen.mock.calls[0][1]();
  });
  
  it('#showConfirm should call #modalService.open', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.confirm = jest.fn();
    popupService = new PopupService(modalService);

    popupService.showConfirm(null);

    expect(modalService.confirm).toHaveBeenCalledTimes(1);
  });
  
  it('#showAddedRequestSuccessfulWithMatches should call #modalService.open', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = jest.fn();
    popupService = new PopupService(modalService);

    popupService.showAddedRequestSuccessfulWithMatches(1, '1', () => {});

    expect(modalService.open).toHaveBeenCalledTimes(1);
  });
});