export class ActionRemark {
  static readonly REFUND = "0";
  static readonly WAITING = "1";
  static readonly TAKE_NOTE = "2";
  static readonly VOID_TICKET = "3";

  private static readonly _ACTION_REMARK = new Map<string, string>([
    [ActionRemark.REFUND, 'Refund'],
    [ActionRemark.WAITING, 'Waiting'],
    [ActionRemark.TAKE_NOTE, 'Take Note'],
    [ActionRemark.VOID_TICKET, 'Void Ticket']
  ]);

  static get ACTION_REMARK(): Map<string, string> {
    return new Map(
      Array.from(this._ACTION_REMARK.entries())
        .sort((a, b) => a[1].localeCompare(b[1]))
    );
  }
}