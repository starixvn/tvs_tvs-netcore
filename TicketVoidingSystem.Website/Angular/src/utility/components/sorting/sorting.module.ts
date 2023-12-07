import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SortingComponent } from './sorting/sorting.component';



@NgModule({
  declarations: [
    SortingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SortingComponent
  ]
})
export class SortingModule { }
