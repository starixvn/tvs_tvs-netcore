import { inject, Injectable } from '@angular/core';
import { AddRequestQuery } from '../../../../../models/add-request.query';
import { AddRequestService } from '../../../../../services/add-request.service';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable()
export class SaveRequestService {
  private readonly addRequestService = inject(AddRequestService);

  async executeSave(args: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(args);
    await this.addRequestService.executeSaveRequest(args.isEdit, args.requestId, query, args.addRequestStore);
  }

  private initAddRequestQuery(args: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = args.primitiveProps.transInfoJson;
    query.transIds = args.transIds;
    query.issueTypeId = args.filter.issueTypeId;
    query.subIssueTypeId = args.filter.subIssueTypeId;
    query.actionId = args.filter.action;
    query.isTest = args.filter.isTest;
    query.isVoided = args.filter.isVoided;
    query.filterBy = args.filterBy;

    query.decidedBy = args.others.decidedBy;
    query.remark = args.others.remark;

    return query;
  }
}