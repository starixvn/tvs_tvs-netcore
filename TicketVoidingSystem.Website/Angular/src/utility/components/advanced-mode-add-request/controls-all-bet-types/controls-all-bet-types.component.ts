import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlsAllBetTypes } from './controls-all-bet-types.model';

@Component({
  selector: 'controls-all-bet-types',
  templateUrl: './controls-all-bet-types.component.html',
  styleUrls: ['./controls-all-bet-types.component.scss']
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
