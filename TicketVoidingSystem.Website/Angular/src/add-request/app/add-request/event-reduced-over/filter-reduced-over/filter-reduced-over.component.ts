import { Component, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { FilterReducedOverItemComponent } from '../filter-reduced-over-item/filter-reduced-over-item.component';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { FilterReducedOverService } from '../services/filter-reduced-over.service';

@Component({
  selector: 'filter-reduced-over',
  templateUrl: './filter-reduced-over.component.html',
  styleUrls: ['./filter-reduced-over.component.scss'],
  standalone: true,
  imports: [FilterReducedOverItemComponent, FormsModule]
})
export class FilterReducedOverComponent {
  @Input() isEdit: boolean;
  @Input() models: FilterReducedOverModel[];
  @Input() matchId: number;
  @Input() isVoided: boolean;
  @Input() groupReducedOverBetTypes: ReducedOverBetType[];
  @Input() originalReducedOverBetTypes: ReducedOverBetType[];
  @Input() originalPlayers: OddsInfo[];
  @Output() changeFilterEvent = new EventEmitter();
  @ViewChildren('filterItem') filterItemComponents: QueryList<FilterReducedOverItemComponent>;
  private readonly filterService = inject(FilterReducedOverService);

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public isValid(): boolean {
    return this.filterItemComponents.toArray().every(x => x.isValid());
  }

  public addBetTypeItem(): void {
    this.models.push(this.filterService.initDefaultFilter(this.groupReducedOverBetTypes));
  }

  public removeBetTypeItem(index: number): void {
    this.models.splice(index, 1);
  }
}
