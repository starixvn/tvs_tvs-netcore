import { RequestDetailViewModel } from "../request.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class LogInfoArg {
  primitiveProperty: PrimitiveProperty;
  detailViewModel: RequestDetailViewModel;
}