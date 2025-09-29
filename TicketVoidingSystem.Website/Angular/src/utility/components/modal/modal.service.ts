import { Injectable, inject } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { CheckingPermissionModel } from '../../models/checking-permission.model';
import { CommonService } from '../../services/common.service';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { IModal, ModalType } from './modal.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalReference: NgbModalRef;
  config = inject(NgbModalConfig);
  ngbModal = inject(NgbModal);
  commonService = inject(CommonService);

  constructor() {
    this.config.backdrop = 'static';
    this.config.keyboard = false;
  }

  open(data: IModal, closeEvent?: () => void) {
    const modalContent = this.openModalContent();
    modalContent.data = data;
    modalContent.close.subscribe(() => {
      this.executeMethodUndefinable(closeEvent);
    });
  }

  confirm(data: IModal, onYes?: () => void, onNo?: () => void) {
    data.title =
      isNull(data.title) || isUndefined(data.title)
        ? 'Confirm'
        : data.title;
    data.type = ModalType.Confirm;
    const modalContent = this.openModalContent();
    modalContent.data = data;
    modalContent.confirm.subscribe(() => {
      this.executeMethodUndefinable(onYes);
    });

    modalContent.close.subscribe(() => {
      this.executeMethodUndefinable(onNo);
    });
  }

  confirmWithThreeButton(data: IModal, onYes?: () => void, onNo?: () => void,  onCancel?: () => void) {
    data.title =
      isNull(data.title) || isUndefined(data.title)
        ? 'Confirm'
        : data.title;
    data.type = ModalType.ConfirmThreeButton;
    const modalContent = this.openModalContent();
    modalContent.data = data;
    modalContent.confirmYes.subscribe(() => {
      this.executeMethodUndefinable(onYes);
    });

    modalContent.confirmNo.subscribe(() => {
      this.executeMethodUndefinable(onNo);
    });

    modalContent.close.subscribe(() => {
      this.executeMethodUndefinable(onCancel);
    });
  }

  async confirmPermission(query: CheckingPermissionModel, data: IModal, onYes?: () => void, onNo?: () => void) {
    const result = await this.commonService.checkVoidBetPermission(query);
    if (result.errCode !== 0 && query.action) {
      const modalContent = this.openModalContent();
      data.message = result.errMsg;
      modalContent.data = data;
      modalContent.confirm.subscribe(() => {
        this.executeMethodUndefinable(onNo);
      });
    } else {
      this.executeMethodUndefinable(onYes);
    }
  }

  private openModalContent() {
    this.modalReference = this.ngbModal.open(ModalContentComponent, { centered: true });
    return this.modalReference.componentInstance;
  }

  close() {
    if (this.modalReference) {
      this.modalReference.close();
    }
  }

  private executeMethodUndefinable(method?: () => void): void {
    if (!isUndefined(method)) {
      method();
    }
  }
}