import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';

@Component({
  selector: 'password-area',
  templateUrl: './password-area.component.html',
  styleUrls: ['./password-area.component.scss']
})
export class PasswordAreaComponent {
  @Input('primitiveProperty') primitiveProperty: CommonPrimitiveProperty;
  @Output() clickVoidAllEvent = new EventEmitter<boolean>();

  public onClickVoidAllMatches(): void{
    this.clickVoidAllEvent.emit();
  }
}
