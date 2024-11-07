import { NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "../../../../utility/components/modal/modal.service";
import { Result } from "../../../../utility/models/result";
import { AddRequestQuery } from '../models/add-request.query';
import { AddRequestResultModel } from '../models/request.model';
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
    let addRequestResult = {requestId: 1} as AddRequestResultModel;
    popupService = new PopupService(modalService);
    popupService['getMarkTicketsContent'] = jest.fn()
    let query = new AddRequestQuery();
    popupService.showAddedRequestSuccessful(query, addRequestResult, () => {});

    expect(modalService.open).toHaveBeenCalledTimes(1);
  });
  
  it('#showEditedRequestSuccessful should call #modalService.open', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = jest.fn();
    let addRequestResult = {requestId: 1, markedTicketsSuccessful: [3]} as AddRequestResultModel;
    popupService = new PopupService(modalService);
    popupService['getMarkTicketsContent'] = jest.fn()
    popupService.showEditedRequestSuccessful(null, addRequestResult, () => {});

    expect(modalService.open).toHaveBeenCalledTimes(1);
  });
  
  it('#showSaveRequestError should call #modalService.open', async () => {
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    const mockModalServiceOpen = jest.fn();
    let addResult = {data: null} as Result<AddRequestResultModel>;
    modalService.open = mockModalServiceOpen;
    popupService = new PopupService(modalService);
    popupService['getMarkTicketsContent'] = jest.fn()
    popupService.showSaveRequestError(null, addResult, null);

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
});