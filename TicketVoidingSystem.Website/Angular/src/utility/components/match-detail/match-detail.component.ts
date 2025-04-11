import { Component, Input } from '@angular/core';
import { Product } from '../../../utility/constants/config';
import { MatchModel } from '../../../utility/models/match.model';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss'],
  imports: [DatePipe]
})

export class MatchDetailComponent {
  @Input() matchDetail: MatchModel;
  @Input() isShowMatch: boolean;
  @Input() product: number;

  isBitCoinProduct(): boolean {
    return this.product === Product.BITCOIN;
  }
}
