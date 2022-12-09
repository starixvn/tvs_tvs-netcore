import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DecimalOnlyDirective, MultipleDecimalDirective } from '../directives/numbers-only.directive';
import { ToolTipModule } from './../tooltip/tooltip.module';
import { AdvancedModeComponent } from './advanced-mode/advanced-mode.component';
import { AdvancedModeService } from './advanced-mode/advanced-mode.service';
import { GroupBetTypesComponent } from './group-bettypes/group-bettypes.component';
import { MultipleSelectComponent } from './multiple-selection/multiple-select.component';
import { TreeViewComponent } from './multiple-selection/tree-view.component';

@NgModule({
  imports: [CommonModule, BrowserModule, FormsModule, NgbModule, ToolTipModule],
  declarations: [
    AdvancedModeComponent,
    GroupBetTypesComponent,
    MultipleSelectComponent,
    TreeViewComponent,
    DecimalOnlyDirective,
    MultipleDecimalDirective,
  ],
  exports: [
    AdvancedModeComponent,
    GroupBetTypesComponent,
    MultipleSelectComponent,
    TreeViewComponent,
    MultipleDecimalDirective
  ],
  providers: [AdvancedModeService]
})
export class AdvancedModeModule {}
