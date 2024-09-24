import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TicketCountOtherSportsComponent } from './ticket-count-other-sports.component';
import { PipeModule } from "../../../../utility/pipes/pipe.module";

@NgModule({
    imports: [CommonModule, PipeModule],
    declarations: [TicketCountOtherSportsComponent],
    exports: [TicketCountOtherSportsComponent],
    providers: []
})
export class TicketCountOtherSportsModule {}
