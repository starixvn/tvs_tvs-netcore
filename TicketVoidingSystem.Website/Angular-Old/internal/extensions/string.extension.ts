interface String {
    isSettled(): boolean;
}

String.prototype.isSettled = function (this: string): boolean {
    return this.toLowerCase().indexOf('won') > -1
        || this.toLowerCase().indexOf('lose') > -1
        || this.toLowerCase().indexOf('draw') > -1;
}