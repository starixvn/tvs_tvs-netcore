export class BetTypeAutoCheckByIssue {
  static readonly WRONG_HDP = [1,7,20,21,601,602,606,607,608,609,612,613,614,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646];
  static readonly WRONG_1ST_HDP = [7,21,606,608,633,630,631,609,612,613,614];
  static readonly WRONG_OU = [3,8,401,402,403,404,610,615,616,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646];
  static readonly WRONG_1ST_OU = [8,403,404,610,615,616,633];
  static readonly WRONG_QUARTER_HDP = [609,612,613,614,630,631];
}

export class BetTypeAutoUnCheckByIssue {
  static readonly WRONG_SCORE = [2,12,611,618,619,620,621,622,623,624,625,626,627,628,629];
}

export class BetTypeAutoUnCheckBySubIssue {
  static readonly WRONG_QUARTER_OU = [610,615,616];
}