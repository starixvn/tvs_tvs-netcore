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
  @ViewChild('leagueEvent') leagueEvent: EventLeagueComponent;

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
  
  async changeMatchEvent(): Promise<void> {
    this.model.matchId = this.leagueEvent.matchId;
    this.model.iptv = await this.getIpTv();
    this.model = cloneDeep(this.model);
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
  }

  async saveRemark(): Promise<void> {
    const remarkId = await this.addRemarkService.addRemark(this.model);
    if (remarkId) {
      this.resetData();
    }
  }
}
