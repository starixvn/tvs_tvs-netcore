import { Injectable } from '@angular/core';
import { CommonService } from '../../../../../utility/services/common.service';
import { HdpFilterBetType } from '../../models/hdp-filter-betType.model';
import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';

@Injectable({
  providedIn: 'root'
})
export class HdpFilterBetTypeService {
  constructor(
    private readonly commonService: CommonService
  ) { }

  async GetHdpFilterBetTypes(sportId: number, issueTypeId: string) {
    const allFilterBetTypes = await this.commonService.getHdpFilterBetTypes(sportId.toString(), Number(issueTypeId));
    this.initAllBetType(allFilterBetTypes);

    return allFilterBetTypes;
  }

  private initAllBetType(allFilterBetType: HdpFilterBetType[]){
    allFilterBetType[0].isChecked = true;
    allFilterBetType.forEach(x => {
      x.selections?.forEach(selection => selection.value = selection.items[0].value);
    });
  }

  updateFilterBetTypeData(allFilterBetType: HdpFilterBetType[], filterBetType: FilterBetType){
    if(allFilterBetType.length > 0){
      const betTypeSelected = allFilterBetType.find(x => x.isChecked);
      filterBetType.filterBetIdX = betTypeSelected.selections?.[0]?.value ?? "";
      filterBetType.filterBetIdY = betTypeSelected.selections?.[1]?.value ?? "";
      filterBetType.filterBetTypeId = betTypeSelected.betType;      
    }
  }

  loadDataEditPage(allFilterBetType: HdpFilterBetType[], filterBetType: FilterBetType){
    const betTypeSelected = allFilterBetType.find(x => x.betType === filterBetType.filterBetTypeId);
    betTypeSelected.isChecked = true;
    if(betTypeSelected.selections?.length > 0){
      betTypeSelected.selections[0].value = filterBetType.filterBetIdX;
    }
    if(betTypeSelected.selections?.length > 1){
      betTypeSelected.selections[1].value = filterBetType.filterBetIdY;
    }
  }
}
