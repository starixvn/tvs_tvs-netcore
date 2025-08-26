import { FilterModel } from '../../../add-request-new/component/filter/filter.model';
import { IssueTypes } from '../../../add-request-new/component/filter/issue-types.model';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { OthersModel } from '../others/others.model';

// Type definitions for template contexts
export interface EventContentContext {
    eventModel: unknown; // Can be EventTicket14Model, WrongScoreModel, etc.
    otherModel: OthersModel;
    filterModel: FilterModel;
    issueTypes: IssueTypes;
    primitiveProperty: PrimitiveProperty;
}

export interface OthersContentContext {
    otherModel: OthersModel;
    primitiveProperty: PrimitiveProperty;
}

declare global {
    interface Window {
        issueTypeId?: string;
        isEdit?: boolean;
    }
}