import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultipleSelectAdvancedModeModule } from '../advanced-mode/multiple-selection/multiple-select.module';
import { ToolTipModule } from './../tooltip/tooltip.module';
import { AdvancedModeAddRequestComponent } from './advanced-mode-add-request.component';
import { AdvancedModeComponent } from './advanced-mode/advanced-mode.component';
import { GroupBetTypesComponent } from './group-bet-types/group-bet-types.component';
import { ControlsAllBetTypesComponent } from './controls-all-bet-types/controls-all-bet-types.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    ToolTipModule,
    MultipleSelectAdvancedModeModule,
  ],
  declarations: [
    AdvancedModeAddRequestComponent,
    GroupBetTypesComponent,
    AdvancedModeComponent,
    ControlsAllBetTypesComponent
  ],
  exports: [
    AdvancedModeAddRequestComponent,
    GroupBetTypesComponent,
    AdvancedModeComponent,
    ControlsAllBetTypesComponent
  ]
})
export class AdvancedModeAddRequestModule {}
