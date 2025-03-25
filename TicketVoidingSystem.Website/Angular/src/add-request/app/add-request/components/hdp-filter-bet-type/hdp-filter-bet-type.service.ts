import { Injectable } from '@angular/core';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';
import { HdpFilterBetType } from '../../models/hdp-filter-betType.model';

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

  private initAllBetType(allFilterBetType: HdpFilterBetType[]) {
    allFilterBetType.forEach(x => {
      x.selections?.forEach(selection => selection.value = selection.items[0].value);
    });
  }

  private reSetDataFilter(filterBetType: FilterBetType, betTypeId: string){
    filterBetType.filterBetIdX = '';
    filterBetType.filterBetIdY = '';
    filterBetType.filterBetTypeId = betTypeId;
  }

  updateAllFilterBetTypeData(allFilterBetType: HdpFilterBetType[], filterBetType: FilterBetType) {
    if (allFilterBetType.length > 0) {
      const betTypeSelected = allFilterBetType.find(x => x.isChecked);
      this.reSetDataFilter(filterBetType, betTypeSelected.betType)
      betTypeSelected.selections?.forEach(x => {
        this.updateFilterBetTypeData(filterBetType, x.xmlAttribute, x.value);
      });
      betTypeSelected.inputs?.forEach(x => {
        this.updateFilterBetTypeData(filterBetType, x.xmlAttribute, x.value);
      });
    }
  }

  updateFilterBetTypeData(filterBetType: FilterBetType, attribute: string, value: string){
    switch (attribute.toLowerCase()) {
      case 'betidx':
        filterBetType.filterBetIdX = value;
        break;
      case 'betidy':
        filterBetType.filterBetIdY = value;
        break;
      case '_xxx':
        filterBetType.filterBetIdX = this.getValueBetIdTypeXxx(value);
        break;
      case 'yy':
        filterBetType.filterBetIdY = this.getValueBetIdTypeYy(value);
        break;
      default:
        filterBetType.filterBetIdX = "";
        filterBetType.filterBetIdY = "";
    }
  }

  getValueBetIdTypeYy(value: string): string {
    return value ? value.padStart(2, '0') : '';
  }

  getValueBetIdTypeXxx(value: string): string {
    return value ? `_${value.padStart(3, '0')}` : '____';
  }

  loadDataEditPage(allFilterBetType: HdpFilterBetType[], filterBetType: FilterBetType) {
    const betTypeSelected = allFilterBetType.find(x => x.betType === filterBetType.filterBetTypeId);
    betTypeSelected.isChecked = true;
    betTypeSelected.selections?.forEach(x => {
      x.value = this.getInputFilterBetTypeEdit(filterBetType, x.xmlAttribute);
    });
    betTypeSelected.inputs?.forEach(x => {
      x.value = this.getInputFilterBetTypeEdit(filterBetType, x.xmlAttribute);
    });
  }

  getInputFilterBetTypeEdit(filterBetType: FilterBetType, attribute: string){
    switch (attribute.toLowerCase()) {
      case 'betidx':
        return filterBetType.filterBetIdX;
      case 'betidy':
        return filterBetType.filterBetIdY;
      case '_xxx':
        let valueInputX = filterBetType.filterBetIdX;
        valueInputX.replaceAll('_', '');
        return isNaN(parseInt(valueInputX, 10)) ? "" : parseInt(valueInputX, 10).toString();
      case 'yy':
        let valueInputY = filterBetType.filterBetIdY;
        return isNaN(parseInt(valueInputY, 10)) ? "" : parseInt(valueInputY, 10).toString();
      default:
        return "";
    }
  }
}
