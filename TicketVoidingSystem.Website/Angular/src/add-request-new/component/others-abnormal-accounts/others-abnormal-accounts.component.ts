import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OthersModel } from '../others/others.model';

@Component({
  selector: 'others-abnormal-accounts',
  templateUrl: './others-abnormal-accounts.component.html',
  styleUrls: ['./others-abnormal-accounts.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class OthersAbnormalAccountComponent {
  @Input() isEdit: boolean;
  @Input() model = new OthersModel();
  isCollapse: boolean;
}
