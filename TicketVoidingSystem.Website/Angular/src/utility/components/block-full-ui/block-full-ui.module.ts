import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BlockFullUiComponent } from "./block-full-ui.component";


@NgModule({
  imports: [CommonModule, BlockFullUiComponent],
  exports: [BlockFullUiComponent],
  providers: []
})
export class BlockFullUiModule {}
