import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolTipModule } from './../tooltip/tooltip.module';
import { MultipleSelectionComponent } from './multiple-selection.component';
import { TreeViewComponent } from './tree-view/tree-view.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, ToolTipModule, MultipleSelectionComponent, TreeViewComponent],
  exports: [
    MultipleSelectionComponent,
    TreeViewComponent
  ],
  providers: []
})
export class MultipleSelectionModule {}
