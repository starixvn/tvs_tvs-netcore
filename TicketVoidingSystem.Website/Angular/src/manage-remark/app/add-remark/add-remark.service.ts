import { inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { Tooltip } from '../../..//utility/components/tooltip/tooltip.model';
import { TEXT } from '../../..//utility/constants/text';
import { PopupService } from '../../../add-request-new/services/popup.service';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { Result } from '../../../utility/models/result';
import { AppService } from '../app.service';
import { AddRemarkQuery, AddRemarkResultData } from '../models/add-remark-query.model';
import { AddRemarkModel } from '../models/add-remark.model';

@Injectable({
  providedIn: 'root'
})
export class AddRemarkService {
  private readonly appService = inject(AppService);
  private readonly popupService = inject(PopupService);
  private readonly modalService = inject(ModalService);

  inValidCheckVar(model: AddRemarkModel, tooltip: Tooltip): boolean {
    if (isNull(model.isCheckedVar) || isUndefined(model.isCheckedVar)) {
      model.isHighLightVarCheck = true;
      tooltip.display('check-var', TEXT.SELECTED_VAR_OPTIONS);
      return true;
    }

    return false;
  }

  async addRemark(model: AddRemarkModel, isEdit: boolean, isTest: boolean): Promise<number> {
    const query: AddRemarkQuery = {
      ...model,
      isTest: isTest,
      guid: isEdit ? null : `AddRemark-${Guid.create().toString()}`,
    };

    const result = isEdit ? await this.appService.editRemark(query) : await this.appService.addRemark(query);
    return this.handleAfterAddRemark(result, isEdit);
  }

  private async handleAfterAddRemark(result: Result<AddRemarkResultData>, isEdit: boolean): Promise<number> {
    const title = isEdit ? TEXT.EDIT_REMARK_RESULT_TITLE : TEXT.ADD_REMARK_RESULT_TITLE;
    if (!result.isSuccessful) {
      this.popupService.showError(result.errorMsg, title);
      return null;
    }

    await this.showAddRemarkSuccessful(result.data.remarkId, isEdit);
    return result.data.remarkId;
  }

  private showAddRemarkSuccessful(remarkId: number, isEdit: boolean): Promise<void> {
    return new Promise<void>((resolve) => {
      const title = isEdit ? TEXT.EDIT_REMARK_RESULT_TITLE : TEXT.ADD_REMARK_RESULT_TITLE;
      const message = isEdit ? `<div>Remark No.<strong>${remarkId}</strong> edited successfully</div>` : `<div>Remark No.<strong>${remarkId}</strong> added successfully</div>`;
      this.modalService.open(
        {
          title: title,
          message: message,
          type: ModalType.Alert
        },
        () => {
          resolve();
        }
      );
    });
  }

  async deleteRemark(remarkId: number): Promise<boolean> {
    const result = await this.appService.deleteRemark(remarkId);
    return this.handleAfterDeleteRemark(result, remarkId);
  }

  private async handleAfterDeleteRemark(result: Result<void>, remarkId: number): Promise<boolean> {
    if (!result?.isSuccessful) {
      this.popupService.showError(result?.errorMsg || 'Delete remark failed', TEXT.DELETE_REMARK_RESULT_TITLE);
      return false;
    }

    await this.showDeleteRemarkSuccessful(remarkId);
    return true;
  }

  private showDeleteRemarkSuccessful(remarkId: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const message = `<div>Remark No.<strong>${remarkId}</strong> deleted successfully</div>`;
      this.modalService.open(
        {
          title: TEXT.DELETE_REMARK_RESULT_TITLE,
          message: message,
          type: ModalType.Alert
        },
        () => {
          resolve();
        }
      );
    });
  }
}
