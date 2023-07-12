import { RequestModel } from "../../../add-request/app/add-request/models/request.model";
import { RequestDetailViewModel } from "../request.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class MapEventArg {
  primitiveProperty: PrimitiveProperty;
  requestModel: RequestModel;
  detailViewModel: RequestDetailViewModel;
}