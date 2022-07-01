import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonService } from "../../utility/services/common.service";
import { NavbarWebsiteComponent } from "../navbar-website/navbar-website.component";
import { HeaderWebsiteComponent } from "./header-website.component";

@NgModule({
  declarations: [
    HeaderWebsiteComponent,
    NavbarWebsiteComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [HeaderWebsiteComponent],
  providers: [CommonService],
  bootstrap: [HeaderWebsiteComponent]
})
export class HeaderWebsiteModule {}
