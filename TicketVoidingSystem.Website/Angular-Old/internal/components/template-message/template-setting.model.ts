import * as _ from 'lodash';
import { TemplateModel } from './template.model';

export class IssueType {
  issueTypeId: number;
  issueTypeName: string;
}

export class SubIssueType {
  subIssueTypeId: number;
  issueTypeId: number;
  subIssueTypeName: string;
}

export class IssueTypesModel {
  issueTypes: IssueType[] = [];
  subIssueTypes: SubIssueType[] = [];
}

export class TemplateSetting {
  templateId: number;
  subIssueTypeId: number;
  sportType?: number;
}

export class TemplateSettings {
  issueTypes: IssueType[] = [];
  subIssueTypes: SubIssueType[] = [];
  templateSettings: TemplateSetting[] = [];
  messageTemplates: TemplateModel[] = [];
  
  issueId: string;
  selectedSubIssueTypes: SubIssueType[] = [];
  subIssueId: string;
  templateId: string;
}
