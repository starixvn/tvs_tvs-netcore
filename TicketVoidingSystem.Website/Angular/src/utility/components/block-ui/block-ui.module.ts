import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockUiComponent } from './block-ui.component';
import { BlockUiDirective } from './block-ui.directive';
import { BlockUiService } from './block-ui.service';

@NgModule({
    declarations: [
        BlockUiComponent,
        BlockUiDirective
    ],
    exports: [
        BlockUiComponent,
        BlockUiDirective
    ],
    imports: [
        CommonModule
    ],
    providers: [
        BlockUiService
    ]
})
export class BlockUiModule { }
