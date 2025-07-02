import { TvDetectionModel } from "../../components/tv-detection/tv-detection.model";
import { IssueTypes } from "../../filter/issue-types.model";
import { OthersModel } from "../../others/others.model";
import { ValidationBusinessRuleArgs } from "./validation.model";

export class SaveRequestArg extends ValidationBusinessRuleArgs {
  isVoided: boolean;
  others: OthersModel;
  issueTypes: IssueTypes;
  tvDetectionModel: TvDetectionModel;
}