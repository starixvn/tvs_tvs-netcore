import { Component, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { NotParticipateBetTypeModel, Player } from '../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from '../services/filter-not-participate.service';
import { FilterNotParticipateItemComponent } from './filter-not-participate-item/filter-not-participate-item.component';

@Component({
  selector: 'filter-not-participate',
  templateUrl: './filter-not-participate.component.html',
  styleUrls: ['./filter-not-participate.component.scss'],
  standalone: true,
  imports: [FormsModule, FilterNotParticipateItemComponent]
})
export class FilterNotParticipateComponent {
  @Input() isEdit: boolean;
  @Input() models: FilterNotParticipateModel[];
  @Input() matchId: number;
  @Input() isVoided: boolean;
  @Input() originalPlayers: Player[];
  @Input() originalBetTypes: NotParticipateBetTypeModel[];
  @Output() changeFilterEvent = new EventEmitter();
  @ViewChildren('filterItem') filterItemComponents: QueryList<FilterNotParticipateItemComponent>;

  private readonly filterService = inject(FilterNotParticipateService);
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
    this.originalPlayers.forEach(x => x.disabled = this.models.some(y => y.playerId === x.playerId));
    this.originalPlayers = _.cloneDeep(this.originalPlayers);
  }
}
