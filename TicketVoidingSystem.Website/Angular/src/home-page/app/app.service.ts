import { inject, Injectable } from "@angular/core";
import { HttpService } from "../../utility/services/http.service";
import { IssueTypeHomePage } from "./models/issue-type-home-page.model";

@Injectable({
  providedIn: 'root',
})
export class AppService {
  httpService = inject(HttpService);

  async getIssueTypeHomePage(issueTypeIds: string): Promise<IssueTypeHomePage[]> {
    return this.httpService.postJson({ issueTypeIds }, 'api/SharedApi/GetIssueTypeHomePage');
  }
}