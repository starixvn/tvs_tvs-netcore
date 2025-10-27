import { IssueTypes } from "../../../../../component/filter/issue-types.model";
import { OthersModel } from "../../../../../component/others/others.model";
import { TvDetectionModel } from "../../../../../component/tv-detection/tv-detection.model";
import { ValidationBusinessRuleArgs } from "./validation.model";

export class SaveRequestArg extends ValidationBusinessRuleArgs {
  others: OthersModel;
  issueTypes: IssueTypes;
  tvDetectionModel: TvDetectionModel;
}