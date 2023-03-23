import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { CheckingPermissionModel } from '../../models/checking-permission.model';
import { CommonService } from '../../services/common.service';
import { IModal, ModalType } from './modal';
import { ModalContentComponent } from './modal-content/modal-content.component';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalReference: NgbModalRef;

  constructor(
    config: NgbModalConfig,
    private readonly ngbModal: NgbModal,
    private readonly commonService: CommonService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(data: IModal, closeEvent?: () => void) {
    const modalContent = this.openModalContent();
    modalContent.data = data;
    modalContent.close.subscribe(() => {
      this.executeMethodUndefinedable(closeEvent);
    });
  }

  confirm(data: IModal, onYes?: () => void, onNo?: () => void) {
    data.title =
      _.isNull(data.title) || _.isUndefined(data.title)
        ? 'Confirm'
        : data.title;
    data.type = ModalType.Confirm;
    const modalContent = this.openModalContent();
    modalContent.data = data;
    modalContent.confirm.subscribe(() => {
      this.executeMethodUndefinedable(onYes);
    });

    modalContent.close.subscribe(() => {
      this.executeMethodUndefinedable(onNo);
    });
  }

  confirmWithThreeButton(data: IModal, onYes?: () => void, onNo?: () => void,  onCancel?: () => void) {
    data.title =
      _.isNull(data.title) || _.isUndefined(data.title)
        ? 'Confirm'
        : data.title;
    data.type = ModalType.ConfirmThreeButton;
    const modalContent = this.openModalContent();
    modalContent.data = data;
    modalContent.confirmYes.subscribe(() => {
      this.executeMethodUndefinedable(onYes);
    });

    modalContent.confirmNo.subscribe(() => {
      this.executeMethodUndefinedable(onNo);
    });

    modalContent.close.subscribe(() => {
      this.executeMethodUndefinedable(onCancel);
    });
  }

  warning(message: string) {
    this.open({
      title: 'Warning',
      message,
      type: ModalType.Alert
    });
  }

  async confirmPermission(query: CheckingPermissionModel, data: IModal, onYes?: () => void, onNo?: () => void) {
    const result = await this.commonService.checkVoidBetPermission(query);
    if (result.errCode !== 0 && query.action) {
      const modalContent = this.openModalContent();
      data.message = result.errMsg;
      modalContent.data = data;
      modalContent.confirm.subscribe(() => {
        this.executeMethodUndefinedable(onNo);
      });
    } else {
      this.executeMethodUndefinedable(onYes);
    }
  }

  openModalContent() {
    this.modalReference = this.ngbModal.open(ModalContentComponent, { centered: true });
    return this.modalReference.componentInstance;
  }

  close() {
    if (this.modalReference) {
      this.modalReference.close();
    }
  }

  private executeMethodUndefinedable(method?: () => void): void {
    if (!_.isUndefined(method)) {
      method();
    }
  }
}