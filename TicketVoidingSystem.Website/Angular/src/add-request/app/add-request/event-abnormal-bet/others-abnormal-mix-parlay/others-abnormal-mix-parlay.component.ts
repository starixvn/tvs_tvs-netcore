import { Component, Input } from '@angular/core';
import { OthersModel } from '../../others/others.model';

@Component({
  selector: 'others-abnormal-mix-parlay',
  templateUrl: './others-abnormal-mix-parlay.component.html',
  styleUrls: ['./others-abnormal-mix-parlay.component.scss']
})
export class OthersAbnormalMixParlayComponent {
  @Input() isEdit: boolean;
  @Input() model = new OthersModel();
  
  isCollapse: boolean;
}
