import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolTipModule } from './../tooltip/tooltip.module';
import { NgSelectMixtureComponent } from './ng-select-mixture.component';
import { NgSelectTreeViewComponent } from './ng-select-tree-view/ng-select-tree-view.component';

@NgModule({
  imports: [CommonModule, BrowserModule, FormsModule, NgbModule, ToolTipModule],
  declarations: [
    NgSelectMixtureComponent,
    NgSelectTreeViewComponent,
  ],
  exports: [
    NgSelectMixtureComponent,
    NgSelectTreeViewComponent
  ],
  providers: []
})
export class NgSelectMixtureModule {}
