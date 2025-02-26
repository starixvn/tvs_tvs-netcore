import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'password-area',
  templateUrl: './password-area.component.html',
  styleUrls: ['./password-area.component.scss'],
  imports: [FormsModule]
})
export class PasswordAreaComponent {
  @Input('primitiveProperty') primitiveProperty: CommonPrimitiveProperty;
  @Output() clickVoidAllEvent = new EventEmitter<boolean>();

  public onClickVoidAllMatches(): void {
    this.clickVoidAllEvent.emit();
  }
}
