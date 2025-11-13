import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLeagueComponent } from '../../../utility/components/event-league/event-league.component';
import { AddRemarkModel } from '../models/add-remark.model';
import { TEXT } from '../../../utility/constants/text';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { OthersComponent } from './others/others.component';
import clone from 'lodash/clone';

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

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {

  }
  
  changeMatchEvent(): void {
    this.model.matchId = this.leagueEvent.matchId;
    this.model = clone(this.model);
  }

  closeClick(): void {
    this.model.isOpen = false;
  }

  changeVarCheckValue(isVarChecked: boolean): void {
    this.model.isCheckedVar = isVarChecked;
    this.model.isHighLightVarCheck = false;
  }
}
