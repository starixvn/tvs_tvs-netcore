import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlockUiDirective } from './block-ui.directive';
import { BlockUiService } from './block-ui.service';

@NgModule({
    declarations: [
    ],
    exports: [
        BlockUiDirective
    ],
    imports: [
        CommonModule,
        BlockUiDirective
    ],
    providers: [
        BlockUiService
    ]
})
export class BlockUiModule { }
