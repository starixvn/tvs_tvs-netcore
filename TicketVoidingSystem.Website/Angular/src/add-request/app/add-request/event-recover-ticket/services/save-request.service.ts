import { Injectable } from '@angular/core';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable({
  providedIn: 'root'
})
export class SaveRequestService {

  constructor(
    private readonly addRequestService: AddRequestService,
  ) { }

  async executeSave(args: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(args);
    await this.addRequestService.executeSaveRequest(args.isEdit, args.requestId, query, args.addRequestStore);
  }

  private initAddRequestQuery(args: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = args.primitiveProps.transInfoJson;
    query.issueTypeId = args.filter.issueTypeId;
    query.subIssueTypeId = args.filter.subIssueTypeId;
    query.actionId = args.filter.action;
    query.isTest = args.filter.isTest;
    query.isVoided = args.filter.isVoided;
    query.decidedBy = args.others.decidedBy;
    query.remark = args.others.remark;
    query.recoverTicketsInfo = args.recoverTicketModel;

    return query;
  }
}