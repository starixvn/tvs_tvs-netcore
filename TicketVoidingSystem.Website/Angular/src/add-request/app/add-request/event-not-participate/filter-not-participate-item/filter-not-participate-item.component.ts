import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OddsInfo } from 'src/utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { Tooltip } from 'src/utility/components/tooltip/tooltip.model';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { NotParticipateBetType } from '../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from '../services/filter-not-participate.service';
import { ValidationService } from '../services/validation.service';
import { PrimitivePropertyItem } from './filter-not-participate-item.model';

@Component({
  selector: 'filter-not-participate-item',
  templateUrl: './filter-not-participate-item.component.html',
  styleUrls: ['./filter-not-participate-item.component.scss']
})
export class FilterNotParticipateItemComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() model: FilterNotParticipateModel;
  @Input() isVoided: boolean;
  @Input() index: number;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() originalNotParticipateBetTypes: NotParticipateBetType[];
  @Input() originalPlayers: OddsInfo[];
  @Output() addItemEvent = new EventEmitter();
  @Output() removeItemEvent = new EventEmitter<number>();
  @Output() changeFilterEvent = new EventEmitter();
  tooltip = new Tooltip();

  primitivePropertyItem = new PrimitivePropertyItem();

  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService,
    private readonly filterService: FilterNotParticipateService) {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
    if (this.isVoided) {
      this.primitivePropertyItem.isDisabledPlayer = false;
    }
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public isValid(): boolean {
    return this.validationService.isAllFieldsHaveValue(this.model, this.index, this.primitivePropertyItem, this.tooltip);
  }

  public updateCheckedBetTypes(selectedBetType: NotParticipateBetType){
    this.model.playerIds = [];
    this.primitivePropertyItem.isDisabledPlayer = false;
    this.renderPlayerByBetType(selectedBetType.betTypeId);
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

  private renderPlayerByBetType(betTypeId: number): void {
    const playersOfCheckedBetTypes = this.originalPlayers.filter(x => x.betTypeId === betTypeId.toString());
    this.model.playerMultipleSelection.items = this.filterService.renderPlayer(playersOfCheckedBetTypes);
    this.model.playerMultipleSelection.items.forEach(x => x.checkBySelectedItem(this.model.playerIds));
    this.model.playerMultipleSelection.isCheckAll = this.model.playerMultipleSelection.items.every(x => x.allChildIsChecked());
    this.model.playerMultipleSelection.selectionTitle = this.model.playerMultipleSelection.getDisplayedItems();
  }
}