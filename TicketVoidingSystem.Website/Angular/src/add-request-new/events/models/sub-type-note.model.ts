export class SubIssueTypeNoteModel {
  groupId: number;
  note: string;
}

export class GetSubIssueTypeNoteQuery {
  issueTypeId: number;
  userId: number;
}

export class SaveSubIssueTypeNoteQuery {
  issueTypeId: number;
  userId: number;
  groupId: number;
  note: string;
}