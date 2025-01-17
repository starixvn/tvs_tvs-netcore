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
      let filterData = [];
      const betTypeSelected = allFilterBetType.find(x => x.isChecked);
      betTypeSelected.selections?.forEach(x => filterData.push(x.value));
      betTypeSelected.inputs?.forEach(x => filterData.push(x.value));

      filterBetType.filterBetIdX = filterData.length > 0 ? filterData[0] : "";
      filterBetType.filterBetIdY = filterData.length > 1 ? this.getValueBetIdTypeYy(filterData[1]) : "";
      filterBetType.filterBetTypeId = betTypeSelected.betType;      
    }
  }

  getValueBetIdTypeYy(value: string): string {
    if (!value) {
      return '';
    }

    return value.padStart(2, '0');
  }

  loadDataEditPage(allFilterBetType: HdpFilterBetType[], filterBetType: FilterBetType){
    const betTypeSelected = allFilterBetType.find(x => x.betType === filterBetType.filterBetTypeId);
    betTypeSelected.isChecked = true;
    if(betTypeSelected.selections?.length > 0 && betTypeSelected.inputs?.length > 0){
      betTypeSelected.selections[0].value = filterBetType.filterBetIdX;
      betTypeSelected.inputs[0].value = filterBetType.filterBetIdY;
    }
    else{
      if(betTypeSelected.selections?.length > 0){
        betTypeSelected.selections[0].value = filterBetType.filterBetIdX;
      }
      if(betTypeSelected.selections?.length > 1){
        betTypeSelected.selections[1].value = filterBetType.filterBetIdY;
      }
      if(betTypeSelected.inputs?.length > 0){
        betTypeSelected.inputs[0].value = filterBetType.filterBetIdX;
      }
      if(betTypeSelected.inputs?.length > 1){
        betTypeSelected.inputs[1].value = parseInt(filterBetType.filterBetIdY, 10).toString();
      }
    }
  }
}
