import { TooltipComponent } from './tooltip.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
@NgModule({
    imports: [CommonModule, TooltipComponent],
    exports: [TooltipComponent],
    providers: []
})
export class ToolTipModule {}
