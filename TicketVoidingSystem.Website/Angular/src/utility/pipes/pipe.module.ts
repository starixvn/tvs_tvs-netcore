import { SanitizeHtmlPipe } from './sanitize-html.pipe';

import { NgModule } from '@angular/core';

@NgModule({
    imports: [],
    declarations: [SanitizeHtmlPipe],
    exports: [SanitizeHtmlPipe],
    providers: []
})
export class PipeModule {}
