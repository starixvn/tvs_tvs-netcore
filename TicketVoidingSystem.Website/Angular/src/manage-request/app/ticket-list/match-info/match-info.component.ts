import { MatchModel } from '../../../../utility/models/match.model';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.scss']
})
export class MatchInfoComponent {
  @Input() match = new MatchModel();
}
