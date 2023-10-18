import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { Player } from '../models/player.model';
import { FilterNotParticipateService } from '../services/filter-not-participate.service';

@Component({
  selector: 'filter-not-participate',
  templateUrl: './filter-not-participate.component.html',
  styleUrls: ['./filter-not-participate.component.scss']
})
export class FilterNotParticipateComponent {
  @Input() isEdit: boolean;
  @Input() models: FilterNotParticipateModel[];
  @Input() matchId: number;
  @Input() isVoided: boolean;
  @Input() originalPlayers: Player[];
  @Output() changeFilterEvent = new EventEmitter();
  @ViewChildren('filterItem') filterItemComponents: QueryList<FilterNotParticipateComponent>;

  constructor(private readonly filterService: FilterNotParticipateService) { }

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
    this.originalPlayers.forEach(x => x.disabled = this.models.some(y => y.playerId.toString() === x.playerId));
    this.originalPlayers = _.cloneDeep(this.originalPlayers);
  }
}
