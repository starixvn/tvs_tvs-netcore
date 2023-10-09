export class TemplateContent {
    msgEnglish: string;
    msgChineseTraditional: string;
    msgChineseSimplified: string;
    msgChineseNewSimplified: string;
}

export class TemplateModel extends TemplateContent {
    templateId: number;
    inputTexts: InputText[];
}

export class InputText extends TemplateContent {
    name: string;
    msgEnglishValue: string;
    msgChineseTraditionalValue: string;
    msgChineseSimplifiedValue: string;
    msgChineseNewSimplifiedValue: string;
    hideChinese: boolean;
}

export class TemplateValue {
    sportType?: TemplateContent;
    homeTeamName?: TemplateContent;
    awayTeamName?: TemplateContent;
    leagueName?: TemplateContent;
    eventDate?: string;
    eventType?: string;
    kickOffTime?: string;
    fromTime?: Date;
    toTime?: Date;
    totalTickets?: number;
    score?: string;
    checkSettled?: boolean;
    sportTypeId?: number;
}