interface String {
  isSettled(): boolean;
  isNumber(): boolean;
}

String.prototype.isSettled = function (this: string): boolean {
  return this.toLowerCase().indexOf('won') > -1
    || this.toLowerCase().indexOf('lose') > -1
    || this.toLowerCase().indexOf('draw') > -1;
};

String.prototype.isNumber = function (this: string): boolean {
  return /^\+?(0|[1-9]\d*)$/.test(this);
};
