import { Component, Input } from '@angular/core';

import { MatchViewModel } from './match.viewmodel';

@Component({
    selector: 'match-detail',
    templateUrl: './match-detail.component.html',
    styleUrls: ['./match-detail.component.scss']
})

export class MatchDetailComponent {
    @Input() matchDetail: MatchViewModel;
    @Input() isShowMatch: boolean;
}