import { Injectable } from '@angular/core';
import { AddRemarkModel } from '../models/add-remark.model';
import { Tooltip } from 'src/utility/components/tooltip/tooltip.model';
import { TEXT } from 'src/utility/constants/text';

@Injectable({
  providedIn: 'root'
})
export class AddRemarkService {
  inValidData(model: AddRemarkModel, tooltip: Tooltip): boolean {
    if(!model.isCheckedVar) {
      tooltip.display('var-check', TEXT.SELECTED_VAR_OPTIONS);
      return true;
    }
    return false;
  }
}
