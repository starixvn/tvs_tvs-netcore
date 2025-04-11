import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlsAllBetTypes } from './controls-all-bet-types.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultipleSelectComponent } from '../../advanced-mode/multiple-selection/multiple-select.component';

@Component({
  standalone: true,
  selector: 'controls-all-bet-types',
  templateUrl: './controls-all-bet-types.component.html',
  styleUrls: ['./controls-all-bet-types.component.scss'],
  imports: [CommonModule, FormsModule, MultipleSelectComponent]
})
export class ControlsAllBetTypesComponent {
  @Input() controlsAllBetTypesLists: ControlsAllBetTypes[] = []
  @Output() changeControlsAll = new EventEmitter<{itemList: string[], type: string}>();

  public isShowContent(){
    return this.controlsAllBetTypesLists.filter(x => x.isShow).length > 0;
  }
  
  public updateByControlAllBetType(itemList: string[], type: string) {
    this.changeControlsAll.emit({itemList: itemList, type: type});
  }
}
