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

export class TemplateSetting {
    templateId: number;
    subIssueTypeId: number;
    sportType?: number;
    isCheckedVar?: boolean;
}

export class TemplateSettings {
    templateSettings: TemplateSetting[];
    messageTemplates: TemplateModel[];
}