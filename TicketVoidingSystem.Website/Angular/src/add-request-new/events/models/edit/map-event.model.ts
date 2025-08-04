import { PrimitiveProperty } from "../primitive-property.model";
import { RequestModel } from "../request.model";
import { RequestDetailViewModel } from "../request.model copy";

export class MapEventArg {
  primitiveProperty: PrimitiveProperty;
  requestModel: RequestModel;
  detailViewModel: RequestDetailViewModel;
}