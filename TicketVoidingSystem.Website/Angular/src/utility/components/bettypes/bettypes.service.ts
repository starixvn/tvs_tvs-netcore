import { Injectable } from '@angular/core';
import { BallSequence, BetTypeModel, BetTypesModel } from './bettypes.model';
import { Product } from '../../constants/config';
import isUndefined from 'lodash/isUndefined';
import { PrimaryBetType } from '../advanced-mode/group-bettypes/group-bettypes.model';

@Injectable({
  providedIn: 'root'
})
export class BetTypesService {
  changeAll(betTypes: BetTypeModel[], isChecked: boolean) {
    betTypes.forEach(item => item.isChecked = isChecked);
  }

  changeItem(model: BetTypesModel) {
    model.isChecked = model.betTypes
      .filter(betType => betType.isShow)
      .every(betType => betType.isChecked);
  }

  getCheckedBetTypes(betTypes: BetTypeModel[]): string[] {
    return betTypes
      .filter(betType => betType.isShow && betType.isChecked)
      .map(betType => betType.id);
  }

  checkDisplay(betTypes: BetTypeModel[]): boolean {
    return betTypes.some(betType => betType.isShow);
  }

  private renameNumberGame(id: string, name: string): string {
    switch (id) {
      case '85':
      case '86':
        return 'Next ' + name;

      default:
        return name;
    }
  }

  private getBallSequence(id: string): number[] {
    switch (id) {
      case '88':
      case '87':
        return BallSequence.LiveSecondOrThird;

      default:
        return BallSequence.LiveAll;
    }
  }

  displayNumberGame(model: BetTypeModel, product: number, sportType: number, ballSequence: number[]) {
    if (product === Product.NUMBER_GAME) {
      const intId = parseInt(model.id, 10);
      if (sportType === 161) {
        const isBallSequence = ballSequence.filter(x => {
          return model.ballSequence.indexOf(x) > -1;
        });
        model.isShow = intId >= 85 && intId <= 91 && isBallSequence.length > 0;
      } else if (sportType === 164) {
        model.isShow = intId >= 8101 && intId <= 8105;
      } else {
        model.isShow = false;
      }
    }
  }

  initBetTypesModel(betTypes: BetTypeModel[], isChecked: boolean) {
    const newBetTypeModel = new BetTypesModel();
    newBetTypeModel.isChecked = isChecked;
    newBetTypeModel.betTypes = [];
    betTypes.forEach(item => {
      const betType = this.initBetTypeModel(item.id, item.name, item.liveIndicator, item.type, isChecked);
      newBetTypeModel.betTypes.push(betType);
    });

    return newBetTypeModel;
  }

  initBetTypeModel(id: string, name: string, liveIndicator: boolean, type: number, isChecked: boolean) {
    const newBetTypeModel = new BetTypeModel();
    newBetTypeModel.id = id;
    newBetTypeModel.name = this.renameNumberGame(id, name);
    newBetTypeModel.ballSequence = type === Product.NUMBER_GAME ? this.getBallSequence(id) : [];
    newBetTypeModel.liveIndicator = liveIndicator;
    newBetTypeModel.type = type;
    newBetTypeModel.isChecked = isChecked;
    newBetTypeModel.value = isUndefined(PrimaryBetType.ROOT[id]) ? id : PrimaryBetType.ROOT[id];

    return newBetTypeModel;
  }
}
