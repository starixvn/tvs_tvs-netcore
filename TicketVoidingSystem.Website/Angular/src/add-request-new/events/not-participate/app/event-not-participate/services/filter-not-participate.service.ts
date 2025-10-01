import { inject, Injectable } from '@angular/core';
import groupBy from 'lodash/groupBy';
import { ItemsSelect } from '../../../../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../../../../utility/components/multiple-selection/multiple-selection.model';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { NotParticipateBetTypeModel, NotParticipateBetTypeViewModel } from '../models/not-participate-bet-type.model';
import { ItemsSelectService } from '../../../../../../utility/components/multiple-selection/items-select.service';

@Injectable()
export class FilterNotParticipateService {
  private readonly addRequestApiService = inject(AddRequestApiService);

  public initDefaultFilter(): FilterNotParticipateModel {
    const model = new FilterNotParticipateModel();
    model.betTypeMultipleSelection = this.initDefaultBetTypeSelection();

    return model;
  }

  public async getNotParticipateBetTypes(matchId: number): Promise<NotParticipateBetTypeViewModel> {
    return this.addRequestApiService.getNotParticipateBetTypes(matchId);
  }

  public renderBetTypes(models: NotParticipateBetTypeModel[]): ItemsSelect[] {
    let items = [];
    const groupBetTypes = groupBy(models, 'parentId');
    for (const parentId in groupBetTypes) {
      const model = groupBetTypes[parentId].map(x => ItemsSelectService.initItemsSelect(0, x.betTypeId.toString(), x.betTypeName, false, true, true, []));
      items = items.concat(ItemsSelectService.initItemsSelect(parseInt(parentId), parentId, groupBetTypes[parentId][0].parentName, false, true, true, model));
    }

    return items;
  }

  public initDefaultBetTypeSelection(): MultipleSelection {
    const multipleSelection = new MultipleSelection();
    this.initDefaultBetTypeProperties(multipleSelection);
    multipleSelection.items = [];
    return multipleSelection;
  }

  private initDefaultBetTypeProperties(model: MultipleSelection): void {
    model.checkAllCheckBoxText = 'All';
    model.allItemsCheckedText = 'All';
    model.noneItemCheckedText = 'Select an option';
    model.maxWidth = '300px';
    model.numberItemsDisplay = 1;
    model.buttonHeight = '29.5px';
    model.isDefaultSelectAll = false;
  }
}