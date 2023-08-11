export class RegexConstant {
  static readonly MULTIPLE_DECIMAL = /^-?\d{1,5}(\.\d{1,3})?(&-?\d{1,5}(\.\d{1,3})?)*?$/;
  static readonly SINGLE_DECIMAL = /^-?\d{1,5}(\.\d{1,3})?$/;
  static readonly ONLY_NUMBER = /^[0-9]*$/;
}