export class RegexConstant {
  static readonly DECIMAL = /^\d+(\.\d+)?$/;
  static readonly MULTIPLE_DECIMAL = /^-?\d{1,5}(\.\d{1,3})?(&-?\d{1,5}(\.\d{1,3})?)*?$/;
}