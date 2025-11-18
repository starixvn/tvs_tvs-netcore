import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLeagueComponent } from '../../../utility/components/event-league/event-league.component';
import { AddRemarkModel } from '../models/add-remark.model';
import { TEXT } from '../../../utility/constants/text';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { OthersComponent } from './others/others.component';
import cloneDeep from 'lodash/cloneDeep';
import { AppService } from '../app.service';
import { AddRemarkService } from './add-remark.service';

@Component({
  standalone: true,
  selector: 'add-remark',
  templateUrl: './add-remark.component.html',
  styleUrl: './add-remark.component.scss',
  imports: [CommonModule, EventLeagueComponent, OthersComponent]
})
export class AddRemarkComponent implements OnInit {
  @Input() model: AddRemarkModel;
  @Input() isEdit: boolean;
  @ViewChild('leagueEvent') leagueEvent: EventLeagueComponent;
  @ViewChild('othersComponent') othersComponent: OthersComponent;

  tooltip = new Tooltip();
  tooltipVarMessage = TEXT.SELECTED_VAR_OPTIONS;

  element = inject(ElementRef);
  appService = inject(AppService);
  addRemarkService = inject(AddRemarkService);
  
  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {

  }

  getTitle(): string {
    return this.isEdit ? `Edit Remark - ${this.model.remarkId}` : "Add New Remark";
  }
  
  async changeMatchEvent(): Promise<void> {
    this.model.matchId = this.leagueEvent.selectedMatch.matchId;
    this.model.iptv = await this.getIpTv();
    this.model = cloneDeep(this.model);
    this.othersComponent.reloadData();
  }

  private async getIpTv() {
    const matchId = this.leagueEvent.selectedMatch.matchId === this.leagueEvent.selectedMatch.parentId
    ? this.leagueEvent.selectedMatch.matchId
    : this.leagueEvent.selectedMatch.parentId;
    
    return await this.appService.getIptv(matchId, this.leagueEvent.selectedMatch.eventDate);
  }

  closeClick(): void {
    this.model.isOpen = false;
  }

  changeVarCheckValue(isVarChecked: boolean): void {
    this.model.isCheckedVar = isVarChecked;
    this.model.isHighLightVarCheck = false;
  }

  resetData(): void {
    this.model = new AddRemarkModel();
    this.leagueEvent.updateUndefinedMatchAndLeague();

  }

  async saveRemark(): Promise<void> {
    console.log('saveRemark', this.model);
    if(!this.leagueEvent.isMatchIdValid() || this.addRemarkService.inValidCheckVar(this.model, this.tooltip) ) {
      return;
    }
    this.othersComponent.isOpenConfirmAddRemark = true;
  }

  async confirmAddRemark(): Promise<void> {
    const remarkId = await this.addRemarkService.addRemark(this.model);
    if (remarkId > 0) {
      this.othersComponent.isOpenConfirmAddRemark = false;
      this.resetData();
    }
  }
}
