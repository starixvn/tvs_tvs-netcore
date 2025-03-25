import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OthersModel } from '../../others/others.model';

@Component({
  selector: 'abnormal-accounts-other',
  templateUrl: './abnormal-accounts-other.component.html',
  styleUrls: ['./abnormal-accounts-other.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AbnormalAccountOtherComponent {
  @Input() isEdit: boolean;
  @Input() model = new OthersModel();
  isCollapse: boolean;
}
