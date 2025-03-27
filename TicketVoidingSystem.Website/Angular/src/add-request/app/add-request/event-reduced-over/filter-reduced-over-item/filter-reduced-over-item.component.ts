import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { MultipleSelectionComponent } from 'src/utility/components/multiple-selection/multiple-selection.component';
import { NgSelectMixtureComponent } from 'src/utility/components/ng-select-mixture/ng-select-mixture.component';
import { TooltipComponent } from 'src/utility/components/tooltip/tooltip.component';
import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { FilterReducedOverService } from '../services/filter-reduced-over.service';
import { ValidationService } from '../services/validation.service';
import { PrimitivePropertyItem } from './filter-reduced-over-item.model';

@Component({
  selector: 'filter-reduced-over-item',
  templateUrl: './filter-reduced-over-item.component.html',
  styleUrls: ['./filter-reduced-over-item.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, TooltipComponent, NgSelectMixtureComponent, MultipleSelectionComponent]
})
export class FilterReducedOverItemComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() model: FilterReducedOverModel;
  @Input() isVoided: boolean;
  @Input() index: number;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() originalReducedOverBetTypes: ReducedOverBetType[];
  @Input() originalPlayers: OddsInfo[];
  @Output() addItemEvent = new EventEmitter();
  @Output() removeItemEvent = new EventEmitter<number>();
  @Output() changeFilterEvent = new EventEmitter();
  tooltip = new Tooltip();

  primitivePropertyItem = new PrimitivePropertyItem();
  private readonly element = inject(ElementRef);
  private readonly validationService = inject(ValidationService);
  private readonly filterService = inject(FilterReducedOverService);

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
    if (this.isVoided) {
      this.updateStatusControl(true);
    }

    this.updateCheckedBetTypes(this.model.betTypeIds);
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public isValid(): boolean {
    return this.validationService.isAllFieldsHaveValue(this.model, this.index, this.primitivePropertyItem, this.tooltip);
  }

  public isValidSingleDecimalRuns(value: string, elementClass: string): boolean {
    return this.validationService.isValidSingleDecimalRuns(value, `${elementClass}${this.index}`, this.tooltip);
  }

  public isValidOnlyNumberWicketOver(value: string, elementClass: string): boolean {
    return this.validationService.isValidOnlyNumberWicketOver(value, `${elementClass}${this.index}`, this.tooltip);
  }

  public updateCheckedBetTypes(checkedBetTypeIds: string[]) {
    this.resetValue(checkedBetTypeIds);
    if (checkedBetTypeIds.length > 0) {
      this.updateStatusControlByCheckedBetTypes(checkedBetTypeIds);
      this.renderPlayerByBetType(checkedBetTypeIds);
    } else {
      this.updateStatusControl(true);
    }
    this.model.betTypeIds = checkedBetTypeIds;
  }

  private renderPlayerByBetType(checkedBetTypeIds: string[]): void {
    const firstReducedOverBetType = this.originalReducedOverBetTypes.find(x => x.betTypeId.toString() === checkedBetTypeIds[0]);
    if (firstReducedOverBetType) {
      this.primitivePropertyItem.isDisabledPlayer = !firstReducedOverBetType.isHasPlayer;
      if (firstReducedOverBetType.isHasPlayer) {
        const playersOfCheckedBetTypes = this.originalPlayers.filter(x => checkedBetTypeIds.includes(x.betTypeId.toString()));
        this.model.playerMultipleSelection.items = this.filterService.renderPlayer(playersOfCheckedBetTypes);
        this.model.playerMultipleSelection.items.forEach(x => x.checkBySelectedItem(this.model.playerIds));
        this.model.playerMultipleSelection.isCheckAll = this.model.playerMultipleSelection.items.every(x => x.allChildIsChecked());
        this.model.playerMultipleSelection.selectionTitle = this.model.playerMultipleSelection.getDisplayedItems();
      } else {
        this.model.playerMultipleSelection.items = [];
      }
    }
  }

  public updateCheckedPlayers(checkedPlayerIds: string[]): void {
    this.model.playerIds = checkedPlayerIds;
  }

  public addBetTypeItem(): void {
    if (!this.isVoided) {
      this.addItemEvent.emit();
    }
  }

  public removeBetTypeItem(index: number): void {
    if (!this.isVoided) {
      this.removeItemEvent.emit(index);
    }
  }

  public resetValue(newBetTypeIds: string[]): void {
    if (!_.isEqual(this.model.betTypeIds, newBetTypeIds)) {
      this.model.wicketOver = null;
      this.model.runs = null;
      this.model.playerIds = [];
      this.model.live = false;
      this.model.nonLive = false;
    }
  }

  private updateStatusControl(isDisabled: boolean): void {
    this.primitivePropertyItem.isDisabledWicketOver = isDisabled;
    this.primitivePropertyItem.isDisabledPlayer = isDisabled;
    this.primitivePropertyItem.isDisabledRuns = isDisabled;
    this.primitivePropertyItem.isDisabledLive = isDisabled;
    this.primitivePropertyItem.isDisabledNonLive = isDisabled;
  }

  private updateStatusControlByCheckedBetTypes(checkedBetTypeIds: string[]): void {
    const reducedOverModel = this.originalReducedOverBetTypes.find(x => x.betTypeId.toString() === _.first(checkedBetTypeIds));
    this.primitivePropertyItem.isDisabledWicketOver = !reducedOverModel?.isHasOverWicket;
    this.primitivePropertyItem.isDisabledRuns = !reducedOverModel?.isHasRuns;
    this.primitivePropertyItem.isDisabledPlayer = !reducedOverModel?.isHasPlayer;
    this.primitivePropertyItem.isDisabledNonLive = false;
    this.primitivePropertyItem.isDisabledLive = false;
  }
}
