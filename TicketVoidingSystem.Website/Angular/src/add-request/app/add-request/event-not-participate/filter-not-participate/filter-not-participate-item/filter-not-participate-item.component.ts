import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { Selection } from '../../../../../../utility/models/selection.model';
import { FilterNotParticipateModel } from '../../models/filter-not-participate.model';
import { NotParticipateBetTypeModel, Player } from '../../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from '../../services/filter-not-participate.service';
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
  @Input() originalBetTypes: NotParticipateBetTypeModel[];
  @Output() addItemEvent = new EventEmitter();
  @Output() changeBetTypeEvent = new EventEmitter();
  @Output() removeItemEvent = new EventEmitter<number>();
  @Output() changeFilterEvent = new EventEmitter();
  tooltip = new Tooltip();
  distincedPlayers: Player[] = [];
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
      group: 'All 2'
    }
  ];

  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService,
    private readonly filterService: FilterNotParticipateService) {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
    this.distincedPlayers = _.uniqBy(this.originalPlayers, 'playerId');
    this.renderBetTypesByPlayer(this.model.playerId);
  }

  public updateCheckedPlayer(selectedPlayer: Player){
    if (selectedPlayer) {
      this.changeBetTypeEvent.emit();
      this.renderBetTypesByPlayer(selectedPlayer.playerId);
      this.resetBetTypesValue(selectedPlayer.playerId);
    }
  }

  private renderBetTypesByPlayer(playerId: number): void {
    const betTypeIdsOfSelectedPlayers = this.originalPlayers.filter(x => x.playerId === playerId).map(x => x.betTypeId);
    const betTypesModelSelectedPlayers = this.originalBetTypes.filter(x => betTypeIdsOfSelectedPlayers.includes(x.betTypeId));
    this.model.betTypeMultipleSelection.items = this.filterService.renderBetTypes(betTypesModelSelectedPlayers);
    this.model.betTypeMultipleSelection.items.forEach(x => x.checkBySelectedItem(this.model.betTypeIds));
    this.model.betTypeMultipleSelection.isCheckAll = this.model.betTypeMultipleSelection.items.every(x => x.allChildIsChecked());
    this.model.betTypeMultipleSelection.selectionTitle = this.model.betTypeMultipleSelection.getDisplayedItems();
  }

  public changeFilter(): void {
    this.changeBetTypeEvent.emit();
    this.changeFilterEvent.emit();
  }

  public isValid(): boolean {
    return this.validationService.isAllFieldsHaveValue(this.model, this.index, this.tooltip);
  }

  public addBetTypeItem(): void {
    if (!this.isVoided) {
      this.addItemEvent.emit();
    }
  }


  public updateCheckedBetTypes(checkedPlayerIds: string[]): void {
    this.model.betTypeIds = checkedPlayerIds;
  }

  public removeBetTypeItem(index: number): void {
    if (!this.isVoided) {
      this.removeItemEvent.emit(index);
    }
  }

  private resetBetTypesValue(newPlayerId: number): void {
    if (this.model.playerId !== newPlayerId) {
      this.model.betTypeIds = [];
    }
  }
}