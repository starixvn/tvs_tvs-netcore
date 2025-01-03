import { Component, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { HdpFilterBetType } from '../../models/hdp-filter-betType.model';
import { HdpFilterBetTypeService } from './hdp-filter-bet-type.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';

@Component({
  selector: 'hdp-filter-bet-type',
  templateUrl: './hdp-filter-bet-type.component.html',
  styleUrls: ['./hdp-filter-bet-type.component.scss']
})
export class HdpFilterBetTypeComponent implements OnChanges {
  @Input() sportTypeId: number;
  @Input() issueTypeId: string;
  @Input() filterBetType: FilterBetType;
  @Output() changeEvent = new EventEmitter();

  allFilterBetType: HdpFilterBetType[];
  filterBetTypeId: string;
  betTypeSelected: HdpFilterBetType;

  constructor(
    private readonly hdpFilterBetTypeService: HdpFilterBetTypeService
  ) { }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['sportTypeId']) {
      this.allFilterBetType = await this.hdpFilterBetTypeService.GetHdpFilterBetTypes(this.sportTypeId, this.issueTypeId);
      if(this.filterBetType.filterBetTypeId) {
        this.hdpFilterBetTypeService.loadDataEditPage(this.allFilterBetType, this.filterBetType);
        this.filterBetTypeId = this.filterBetType.filterBetTypeId;
        this.betTypeSelected = this.allFilterBetType.find(x => x.betType === this.filterBetType.filterBetTypeId);
      }
      else {
        this.refreshAllFilterBetType();
      }
    }
  }

  private refreshAllFilterBetType() {
    if (this.allFilterBetType) {
      this.filterBetTypeId = this.allFilterBetType?.[0].betType;
      this.allFilterBetType[0].isChecked = true;
    }
    this.onChangeItemSelect();
  }

  onChangeBetType(event: HdpFilterBetType) {
    const indexEvent = this.allFilterBetType.indexOf(event);
    this.allFilterBetType.forEach(x => {
      x.isChecked = false;
    })
    this.allFilterBetType[indexEvent].isChecked = true;
    this.betTypeSelected = event;
    this.onChangeItemSelect();
  }

  onChangeItemSelect() {
    this.hdpFilterBetTypeService.updateFilterBetTypeData(this.allFilterBetType, this.filterBetType)
    this.changeEvent.emit();
  }

  iddShowFilterBetType() {
    return StaticService.isWrongHDP(this.issueTypeId) || StaticService.isWrongOU(this.issueTypeId);
  }
}
