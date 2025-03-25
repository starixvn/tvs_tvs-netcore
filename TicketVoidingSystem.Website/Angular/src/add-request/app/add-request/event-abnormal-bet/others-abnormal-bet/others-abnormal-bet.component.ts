import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OthersModel } from '../../others/others.model';

@Component({
    selector: 'others-abnormal-bet',
    templateUrl: './others-abnormal-bet.component.html',
    styleUrls: ['./others-abnormal-bet.component.scss'],
    standalone: true,
    imports: [FormsModule, CommonModule]
})
export class OthersAbnormalBetComponent {
  @Input() isEdit: boolean;
  @Input() model = new OthersModel();

  isCollapse: boolean;
}
