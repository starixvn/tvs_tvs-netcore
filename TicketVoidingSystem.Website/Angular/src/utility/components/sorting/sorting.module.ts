import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SortingComponent } from './sorting/sorting.component';

@NgModule({
  imports: [
    CommonModule,
    SortingComponent
  ],
  exports: [
    SortingComponent
  ]
})
export class SortingModule { }
