import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterBetType } from '../..//events/wrong-hdp/app/event-wrong-hdp/models/filter-with-hdp.model';
import { HdpFilterBetTypeService } from './hdp-filter-bet-type.service';
import { HdpFilterBetType } from '../..//models/hdp-filter-betType.model';

@Component({
  selector: 'hdp-filter-bet-type',
  templateUrl: './hdp-filter-bet-type.component.html',
  styleUrls: ['./hdp-filter-bet-type.component.scss'],
  standalone: true,
  imports: [FormsModule, NgSelectModule]
})
export class HdpFilterBetTypeComponent implements OnChanges {
  @Input() sportTypeId: number;
  @Input() issueTypeId: string;
  @Input() filterBetType: FilterBetType;
  @Input() isDisabled: boolean;
  @Output() changeEvent = new EventEmitter();

  allFilterBetType: HdpFilterBetType[];
  filterBetTypeId: string;
  betTypeSelected: HdpFilterBetType;
  private readonly hdpFilterBetTypeService = inject(HdpFilterBetTypeService);

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['sportTypeId']) {
      this.allFilterBetType = await this.hdpFilterBetTypeService.GetHdpFilterBetTypes(this.sportTypeId, this.issueTypeId);
      if (this.filterBetType.filterBetTypeId) {
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
    if (this.allFilterBetType?.length > 0) {
      this.filterBetTypeId = this.allFilterBetType[0].betType;
      this.allFilterBetType[0].isChecked = true;
    }
    this.onChangeFilter();
  }

  onChangeBetType(event: HdpFilterBetType) {
    const indexEvent = this.allFilterBetType.indexOf(event);
    this.allFilterBetType.forEach(x => {
      x.isChecked = false;
    })
    this.allFilterBetType[indexEvent].isChecked = true;
    this.betTypeSelected = event;
    this.filterBetType.filterBetTypeId = event.betType;
    this.onChangeFilter();
  }

  onChangeFilter() {
    this.hdpFilterBetTypeService.updateAllFilterBetTypeData(this.allFilterBetType, this.filterBetType);
    this.changeEvent.emit();
  }
}
