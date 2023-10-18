import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Selection } from 'src/utility/models/selection.model';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { FilterNotParticipateModel } from '../../models/filter-not-participate.model';
import { Player } from '../../models/player.model';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'filter-not-participate-item',
  templateUrl: './filter-not-participate-item.component.html',
  styleUrls: ['./filter-not-participate-item.component.scss']
})
export class FilterNotParticipateItemComponent {
  @Input() isEdit: boolean;
  @Input() model: FilterNotParticipateModel;
  @Input() allFilterItem: FilterNotParticipateModel[];
  @Input() isVoided: boolean;
  @Input() index: number;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() originalPlayers: Player[];
  @Output() addItemEvent = new EventEmitter();
  @Output() changeBetTypeEvent = new EventEmitter();
  @Output() removeItemEvent = new EventEmitter<number>();
  @Output() changeFilterEvent = new EventEmitter();
  tooltip = new Tooltip();

  public readonly groupBetTypes: Selection[] = [
    {
      name: '1 Inns',
      value: '1',
      group: 'All'
    },
    {
      name: '2 Inns',
      value: '2',
      group: 'All'
    },
    {
      name: 'FT',
      value: '3',
      group: 'All'
    }
  ];

  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService) {
    this.tooltip.element = this.element;
  }

  public changeFilter(): void {
    this.changeBetTypeEvent.emit();
    this.changeFilterEvent.emit();
  }

  public isValid(): boolean {
    return this.validationService.isAllFieldsHaveValue(this.model, this.index, this.tooltip);
  }

  // public updateCheckedPlayer(playerId: number): void {
  //   this.originalPlayers.find(x => x.playerId === playerId.toString()).disabled = true;
  // }

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

  // public isDisableOption(): boolean {
  //   return this.allFilterItem.some(x => x.playerId === this.model.playerId);
  // }
}