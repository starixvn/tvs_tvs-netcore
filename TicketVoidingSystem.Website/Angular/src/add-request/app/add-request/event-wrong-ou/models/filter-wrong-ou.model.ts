import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';
export class FilterWrongOuModel {
  filterFromTransTime: string;
  filterToTransTime: string;
  actualMarket: string;
  wrongMarket: string;
  liveIndicator: number;
  filterBetType: FilterBetType;
}