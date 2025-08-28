export class FilterWithHdpModel {
  filterFromTransTime: string;
  filterToTransTime: string;
  homeFavorite: string;
  awayFavorite: string;
  actualMarket: string;
  hdpValue: string;
  liveIndicator: number;
  filterBetType: FilterBetType;
}

export class FilterBetType {
  filterBetIdX: string;
  filterBetIdY: string;
  filterBetTypeId: string;

  constructor(filterBetIdX?: string, filterBetIdY?: string, filterBetTypeId?: string){
    this.filterBetIdX = filterBetIdX;
    this.filterBetIdY = filterBetIdY;
    this.filterBetTypeId = filterBetTypeId;
  }
}