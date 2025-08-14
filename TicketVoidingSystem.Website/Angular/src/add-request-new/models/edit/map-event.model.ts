import { PrimitiveProperty } from "../primitive-property.model";
import { RequestDetailViewModel } from "../request-detail.model";
import { RequestModel } from "../request.model";

export class MapEventArg {
  primitiveProperty: PrimitiveProperty;
  requestModel: RequestModel;
  detailViewModel: RequestDetailViewModel;
}