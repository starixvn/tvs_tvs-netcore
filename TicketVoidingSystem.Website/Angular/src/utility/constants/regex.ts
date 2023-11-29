export class RegexConstant {
  static readonly MULTIPLE_DECIMAL = /^-?\d{1,5}(\.\d{1,3})?(&-?\d{1,5}(\.\d{1,3})?)*?$/;
  static readonly SINGLE_DECIMAL = /^-?\d{1,5}(\.\d{1,3})?$/;
  static readonly ACCOUNT_VOID_LIMIT = /^(?!0+\.00)(?=.{1,15}(\.|$))(?!0(?!\.))\d{1,15}(,\d{3})*(\.\d{1,4})?$/;
  static readonly ONLY_NUMBER = /^[0-9]*$/;
}