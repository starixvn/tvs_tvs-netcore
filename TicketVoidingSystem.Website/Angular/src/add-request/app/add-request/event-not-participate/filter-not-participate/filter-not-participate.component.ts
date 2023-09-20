import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { NotParticipateBetType } from '../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from '../services/filter-not-participate.service';

@Component({
  selector: 'filter-not-participate',
  templateUrl: './filter-not-participate.component.html',
  styleUrls: ['./filter-not-participate.component.scss']
})
export class FilterNotParticipateComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() models: FilterNotParticipateModel[];
  @Input() matchId: number;
  @Input() isVoided: boolean;
  @Input() originalNotParticipateBetTypes: NotParticipateBetType[];
  @Input() originalPlayers: OddsInfo[];
  @Output() changeFilterEvent = new EventEmitter();
  @ViewChildren('filterItem') filterItemComponents: QueryList<FilterNotParticipateComponent>;

  constructor(private readonly filterService: FilterNotParticipateService) { }

  ngOnInit(): void {
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public isValid(): boolean {
    return this.filterItemComponents.toArray().every(x => x.isValid());
  }

  public addBetTypeItem(): void {
    this.models.push(this.filterService.initDefaultFilter());
    this.updateStatusItem();
  }

  public changeBetTypeItem(): void {
    this.updateStatusItem();
  }

  public removeBetTypeItem(index: number): void {
    this.models.splice(index, 1);
    this.updateStatusItem();
  }

  private updateStatusItem(): void {
    this.originalNotParticipateBetTypes.forEach(x => x.disabled = this.models.some(y => y.betTypeId === x.betTypeId));
    this.originalNotParticipateBetTypes = _.cloneDeep(this.originalNotParticipateBetTypes);
  }
}
