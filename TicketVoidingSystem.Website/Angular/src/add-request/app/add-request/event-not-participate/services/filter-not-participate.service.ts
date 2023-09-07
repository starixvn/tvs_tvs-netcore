import { Injectable } from '@angular/core';
import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { ItemsSelect } from '../../../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';
import { NgSelectMixtureModel } from '../../../../../utility/components/ng-select-mixture/ng-select-mixture.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { NotParticipateBetType } from '../models/not-participate-bet-type.model';

@Injectable({
  providedIn: 'root'
})
export class FilterNotParticipateService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly commonService: CommonService
  ) {}

  public initDefaultFilter(): FilterNotParticipateModel {
    const model = new FilterNotParticipateModel();
    model.playerMultipleSelection = this.initDefaultPlayerSelection();

    return model;
  }

  public async getNotParticipateBetTypes(matchId: number): Promise<NotParticipateBetType[]> {
    return this.addRequestApiService.getNotParticipateBetTypes(matchId);
  }

  public initDefaultBetTypeNgSelectMixtureModel(): NgSelectMixtureModel {
    const ngSelectMixtureModel = new NgSelectMixtureModel();
    this.initDefaultBetTypeProperties(ngSelectMixtureModel);
    ngSelectMixtureModel.items = [];

    return ngSelectMixtureModel;
  }

  public initDefaultPlayerSelection(): MultipleSelection {
    const multipleSelection = new MultipleSelection();
    this.initDefaultPlayerProperties(multipleSelection);
    multipleSelection.items = [];
    return multipleSelection;
  }

  public async getPlayers(matchId: number, betTypes: string): Promise<OddsInfo[]> {
    return this.commonService.GetOddsInfoSpecialBetTypes({matchId: matchId?.toString(), betTypes: betTypes});
  }

  public renderPlayer(oddsInfoList: OddsInfo[]): ItemsSelect[] {
    const model = oddsInfoList.map(x => new ItemsSelect(0, x.playerId, x.playerName, false, true, true, []));
    model.forEach(x => x.checkFromChilds());
    return model;
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