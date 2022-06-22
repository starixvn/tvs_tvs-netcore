export class IssueType {
  issueTypeId: number;
  issueTypeName: string;
}

export class SubIssueType {
  subIssueTypeId: number;
  issueTypeId: number;
  subIssueTypeName: string;
  subIssueTypeNameCS: string;
}


export class IssueTypesModel {
  issueTypes: IssueType[] = [];
  subIssueTypes: SubIssueType[] = [];
}

export class IssueInfo extends SubIssueType {
  name: string;
}
