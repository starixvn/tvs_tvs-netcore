import { Component, Input, SimpleChanges } from '@angular/core';
import { BetTeamAddRequest } from '../advanced-mode/advanced-mode.model';
import { BetTypeAddRequest } from '../group-bet-types/group-bet-types.model';
import { ControlsAllBetTypesQuery, ControlsAllBetTypesLists } from './controls-all-bet-types.model';

@Component({
  selector: 'controls-all-bet-types',
  templateUrl: './controls-all-bet-types.component.html',
  styleUrls: ['./controls-all-bet-types.component.scss']
})
export class ControlsAllBetTypesComponent {
  @Input() changedBetTypes: BetTypeAddRequest[] = [];
  @Input() betTeams: BetTeamAddRequest[];
  @Input() controlsAllBetTypesQueryList?: ControlsAllBetTypesQuery[];

  isShowContent: boolean;
  controlsAllBetTypesLists = ControlsAllBetTypesLists.MultipleSelectionList;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['changedBetTypes']) {
      this.updateControlsAllBetTypesList();
      this.updateShowControlsAllBetTypes();
      this.isShowContent = this.isShowControlsAllBetTypes();
    }
  }
  
  private isShowControlsAllBetTypes(){
    return this.controlsAllBetTypesLists.filter(x => x.isShow).length > 0;
  }

  public updateByControlAllBetType(itemList: string[], type: string) {
    this.betTeams.forEach(betTeam => {
      const selection = betTeam.selections.find(x => x.name === type);
      if(selection) {
        this.updateBetTeam(betTeam, type, itemList)
      } 
    });
  }

  public updateControlsAllBetTypesList(){
    if(this.controlsAllBetTypesQueryList){
      this.controlsAllBetTypesQueryList.forEach(x => {
        const controlsAllBetTypesSelected = this.controlsAllBetTypesLists.find(item => item.type === x.type);
        controlsAllBetTypesSelected.items.updateItemChecked(x.values.split(','));
      })
    }
    
    this.controlsAllBetTypesQueryList = [];
  }

  private updateBetTeam(betTeam: BetTeamAddRequest, type: string, itemList: string[]){
    betTeam.selections.find(x => x.name === type).multiSelection.updateItemChecked(itemList);
  }

  private updateShowControlsAllBetTypes(){
    this.controlsAllBetTypesLists.forEach(x => {
      x.isShow = this.checkShowAllBetTypeMap(x.type);
    })
  }

  private checkShowAllBetTypeMap(type: string): boolean{
    return this.betTeams.filter(betTeam => betTeam.isShow && betTeam.selections.find(y => y.name === type)).length > 0;
  }
}
