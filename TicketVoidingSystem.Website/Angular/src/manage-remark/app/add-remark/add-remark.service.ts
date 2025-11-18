import { inject, Injectable } from '@angular/core';
import { AddRemarkModel } from '../models/add-remark.model';
import { Tooltip } from '../../..//utility/components/tooltip/tooltip.model';
import { TEXT } from '../../..//utility/constants/text';
import { AddRemarkQuery, AddRemarkResultData } from '../models/add-remark-query.model';
import { Guid } from 'guid-typescript';
import { AddRequestStore } from '../../../add-request-new/services/add-request.store';
import { AppService } from '../app.service';
import { Result } from '../../../utility/models/result';
import { PopupService } from '../../../add-request-new/services/popup.service';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

@Injectable({
  providedIn: 'root'
})
export class AddRemarkService {
  private readonly addRequestStore = inject(AddRequestStore);
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

  async addRemark(model: AddRemarkModel): Promise<number> {
    const query: AddRemarkQuery = {
      ...model,
      guid: model.isEdit ? null : `AddRemark-${Guid.create().toString()}`,
      sessionTime: this.addRequestStore.getTimeFilterTicket()
    };

    const result = model.isEdit ? await this.appService.editRemark(query) : await this.appService.addRemark(query);
    return await this.handleAfterAddRemark(result, model.isEdit);
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
}
