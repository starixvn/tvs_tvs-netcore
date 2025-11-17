import { inject, Injectable } from '@angular/core';
import { AddRemarkModel } from '../models/add-remark.model';
import { Tooltip } from '../../..//utility/components/tooltip/tooltip.model';
import { TEXT } from '../../..//utility/constants/text';
import { AddRemarkQuery, AddRemarkResultData } from '../models/add-remark-query.model';
import { Guid } from 'guid-typescript';
import { AddRequestStore } from '../../..//add-request-new/services/add-request.store';
import { AppService } from '../app.service';
import { Result } from '../../../utility/models/result';
import { PopupService } from '../../../add-request-new/services/popup.service';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';

@Injectable({
  providedIn: 'root'
})
export class AddRemarkService {
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly appService = inject(AppService);
  private readonly popupService = inject(PopupService);
  private readonly modalService = inject(ModalService);

  inValidData(model: AddRemarkModel, tooltip: Tooltip): boolean {
    if (!model.isCheckedVar) {
      tooltip.display('var-check', TEXT.SELECTED_VAR_OPTIONS);
      return true;
    }
    return false;
  }

  async addRemark(model: AddRemarkModel): Promise<number> {
    const query: AddRemarkQuery = {
      ...model,
      guid: `AddRemark-${Guid.create().toString()}`,
      sessionTime: this.addRequestStore.getTimeFilterTicket()
    };

    const result = await this.appService.addRemark(query);
    return this.handleAfterAddRemark(result);
  }

  private handleAfterAddRemark(result: Result<AddRemarkResultData>): number {
    if (!result.isSuccessful) {
      this.popupService.showError(result.errorMsg, TEXT.ADD_REMARK_RESULT_TITLE);
      return null;
    }

    this.showAddRemarkSuccessful(result.data.remarkId);
    return result.data.remarkId;
  }

  private showAddRemarkSuccessful(remarkId: number): void {
    this.modalService.confirm(
      {
        title: TEXT.ADD_REMARK_RESULT_TITLE,
        message: `<div>Remark No.<strong>${remarkId}</strong> added successfully</div>`,
        type: ModalType.Alert
      }
    );
  }
}
