import { PrimitiveProperty } from '../../models/primitive-property.model';
import { ModelType } from '../../types/model-type.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { OthersModel } from '../others/others.model';

export interface EventContentContext {
    eventModel: ModelType;
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
    }
}