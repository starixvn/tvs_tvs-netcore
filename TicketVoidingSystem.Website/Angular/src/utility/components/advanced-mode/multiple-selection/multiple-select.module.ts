import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultipleSelectComponent } from './multiple-select.component';
import { TreeViewComponent } from './tree-view.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    MultipleSelectComponent,
    TreeViewComponent
  ],
  exports: [
    MultipleSelectComponent,
    TreeViewComponent
  ]
})
export class MultipleSelectAdvancedModeModule {}
