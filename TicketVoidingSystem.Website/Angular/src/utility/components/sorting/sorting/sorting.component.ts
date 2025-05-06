import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss'],
  imports: [CommonModule]
})
export class SortingComponent {
  @Input() id: number;
  @Output() sortEvent = new EventEmitter<boolean>();
  isDesc: boolean = null;

  clickEvent(): void {
    this.isDesc =  !this.isDesc;
    this.sortEvent.emit(this.isDesc);
  }
}
