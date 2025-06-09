export class PagingConstant {
  static readonly INDEX_ZERO = 0;
  static readonly SIZE_DEFAULT = 3000;
  static readonly SIZE_ONE = 500;
  static readonly SIZE_TWO = 1000;
  static readonly SIZE_THREE = 2000;
  static readonly SIZE_FOUR = 3000;
  static readonly SIZE_50 = 50;
  static readonly GO_TO_PAGE = '...';
  static readonly PREVIOUS = '<';
  static readonly NEXT = '>';
}

export class PagingModel {
  public page = 1;
  public pageSize = 3000;
  public total = 0;
  public selection = [PagingConstant.SIZE_ONE, PagingConstant.SIZE_TWO, PagingConstant.SIZE_THREE, PagingConstant.SIZE_FOUR];

  constructor(paging = null) {
    for (const key in paging) {
      if (paging.hasOwnProperty(key)) {
        this[key] = paging[key];
      }
    }
  }

  public get begin(): number {
    return Math.min((this.page - 1) * this.pageSize + 1, this.total);
  }

  public get end(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }
}
