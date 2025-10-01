import { inject, Injectable } from '@angular/core';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { ItemsSelect } from '../../../../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../../../../utility/components/multiple-selection/multiple-selection.model';
import { NgSelectMixtureItem } from '../../../../../../utility/components/ng-select-mixture/ng-select-mixture-item.model';
import { NgSelectMixtureModel } from '../../../../../../utility/components/ng-select-mixture/ng-select-mixture.model';
import { CommonService } from '../../../../../../utility/services/common.service';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { GroupReducedOverConstant } from '../constants/bet-type-reduced-over.constant';
import { GroupReducedOverBetType, ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';

@Injectable()
export class FilterReducedOverService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly commonService = inject(CommonService);

  public initDefaultFilter(reducedOverBetTypes: ReducedOverBetType[]): FilterReducedOverModel {
    const model = new FilterReducedOverModel();
    model.betTypeNgSelectMixtureModel = this.initBetTypeNgSelectMixtureModel(reducedOverBetTypes);
    model.playerMultipleSelection = this.initDefaultPlayerSelection();

    return model;
  }

  public async getReducedOverBetTypes(matchId: number): Promise<ReducedOverBetType[]> {
    return this.addRequestApiService.getReducedOverBetTypes(matchId);
  }

  public renderGroupReducedOverBetTypes(betTypes: ReducedOverBetType[]): GroupReducedOverBetType[] {
    const groupBetTypes: GroupReducedOverBetType[] = [];
    const singleBetTypeItems: GroupReducedOverBetType[] = betTypes.filter(x =>
      x.parentId !== GroupReducedOverConstant.ALL_HOME_OE &&
      x.parentId !== GroupReducedOverConstant.ALL_AWAY_OE &&
      x.parentId !== GroupReducedOverConstant.OTHERS_OE_BET_TYPE
    ) as GroupReducedOverBetType[];
    groupBetTypes.push(...singleBetTypeItems);
    if (betTypes.some(x => x.parentId === GroupReducedOverConstant.ALL_HOME_OE)) {
      groupBetTypes.push(this.createGroupReducedOverBetTypeWithItem(GroupReducedOverConstant.ALL_HOME_OE, betTypes));
    }
    if (betTypes.some(x => x.parentId === GroupReducedOverConstant.ALL_AWAY_OE)) {
      groupBetTypes.push(this.createGroupReducedOverBetTypeWithItem(GroupReducedOverConstant.ALL_AWAY_OE, betTypes));
    }
    if (betTypes.some(x => x.parentId === GroupReducedOverConstant.OTHERS_OE_BET_TYPE)) {
      groupBetTypes.push(this.createGroupReducedOverBetTypeWithItem(GroupReducedOverConstant.OTHERS_OE_BET_TYPE, betTypes));
    }
    return groupBetTypes;
  }

  private createGroupReducedOverBetTypeWithItem(parentId: number, betTypes: ReducedOverBetType[]): GroupReducedOverBetType {
    return {
      betTypeId: parentId,
      betTypeName: this.getGroupName(parentId),
      items: betTypes.filter(x => x.parentId === parentId)
    } as GroupReducedOverBetType;
  }

  private getGroupName(id: number): string {
    switch (id) {
      case GroupReducedOverConstant.ALL_HOME_OE:
        return 'All Home OE Bet Types';
      case GroupReducedOverConstant.ALL_AWAY_OE:
        return 'All Away OE Bet Types';
      case GroupReducedOverConstant.OTHERS_OE_BET_TYPE:
        return 'Other OE Bet Types';
      default:
        return '';
    }
  }

  public initDefaultBetTypeNgSelectMixtureModel(): NgSelectMixtureModel {
    const ngSelectMixtureModel = new NgSelectMixtureModel();
    this.initDefaultBetTypeProperties(ngSelectMixtureModel);
    ngSelectMixtureModel.items = [];

    return ngSelectMixtureModel;
  }

  public initBetTypeNgSelectMixtureModel(betTypes: ReducedOverBetType[]): NgSelectMixtureModel {
    const ngSelectMixtureModel = new NgSelectMixtureModel();
    this.initDefaultBetTypeProperties(ngSelectMixtureModel);
    ngSelectMixtureModel.items = this.initBetTypeItems(betTypes);

    return ngSelectMixtureModel;
  }

  public initDefaultPlayerSelection(): MultipleSelection {
    const multipleSelection = new MultipleSelection();
    this.initDefaultPlayerProperties(multipleSelection);
    multipleSelection.items = [];
    return multipleSelection;
  }

  public async getPlayers(matchId: number, betTypes: string): Promise<OddsInfo[]> {
    return this.commonService.getOddsInfoSpecialBetTypes({ matchId: matchId?.toString(), betTypes: betTypes });
  }

  public renderPlayer(oddsInfoList: OddsInfo[]): ItemsSelect[] {
    const model = oddsInfoList.map(x => new ItemsSelect(0, x.playerId.toString(), x.playerName, false, true, true, []));
    model.forEach(x => x.checkFromChilds());
    return model;
  }

  private initBetTypeItems(betTypes: ReducedOverBetType[]): NgSelectMixtureItem[] {
    const items: NgSelectMixtureItem[] = [];
    betTypes.forEach(group => {
      const temp = [];
      group.items?.forEach(itemSelect => {
        temp.push(new NgSelectMixtureItem(itemSelect.betTypeId.toString(), itemSelect.betTypeName, itemSelect.parentId, false, true, true, []));
      });
      items.push(new NgSelectMixtureItem(group.betTypeId.toString(), group.betTypeName, group.parentId, false, true, true, temp));
    });

    return items;
  }

  private initDefaultBetTypeProperties(model: NgSelectMixtureModel): void {
    model.allItemsCheckedText = 'All';
    model.noneItemCheckedText = 'Select bet type';
    model.maxWidth = '300px';
    model.numberItemsDisplay = 1;
  }

  private initDefaultPlayerProperties(model: MultipleSelection): void {
    model.checkAllCheckBoxText = 'All';
    model.allItemsCheckedText = 'All';
    model.noneItemCheckedText = 'Select player';
    model.maxWidth = '200px';
    model.numberItemsDisplay = 1;
    model.buttonHeight = '29.5px';
    model.isDefaultSelectAll = false;
  }
}