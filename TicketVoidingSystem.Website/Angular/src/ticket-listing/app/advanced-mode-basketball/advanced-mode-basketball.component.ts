import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { ItemsSelect } from '../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../utility/constants/text';

const BasketballBetTypes = [609, 610, 611, 612, 613, 614, 615, 616, 617, 627, 628, 629, 630, 631];
const BadmintonBetTypes = [707, 708, 709, 710, 711, 712, 713, 714];
const PHAIO5BetTypes = [381, 382, 383, 384, 385];

@Component({
  selector: 'advanced-mode-basketball',
  templateUrl: './advanced-mode-basketball.component.html',
  styleUrls: ['./advanced-mode-basketball.component.scss']
})
export class AdvancedModeBasketballComponent implements OnInit, OnChanges {
  @Input() checkedIds: number[] = [];
  public selection: MultipleSelection;
  public isShow: boolean;
  public isShowContent = true;
  public filterName: string;
  isDisabled: boolean;
  tooltip = new Tooltip();

  constructor(private readonly element: ElementRef) {
    this.tooltip.element = this.element;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['checkedIds']) {
      this.renderSelection();
      this.isShow = this.isBasketball() || this.isBadminton() || this.isPHAIO5();
    }
  }

  isBasketball(): boolean {
    return _.intersection(BasketballBetTypes, this.checkedIds).length > 0;
  }

  isBadminton(): boolean {
    return _.intersection(BadmintonBetTypes, this.checkedIds).length > 0;
  }

  isPHAIO5(): boolean {
    return _.intersection(PHAIO5BetTypes, this.checkedIds).length > 0;
  }

  renderSelection() {
    this.selection = new MultipleSelection();
    this.selection.isCheckAll = true;
    this.selection.checkAllCheckBoxText = 'All';
    this.selection.allItemsCheckedText = 'All';
    this.selection.noneItemCheckedText = 'Select options';
    this.selection.maxWidth = '120px';
    this.selection.items = [
      new ItemsSelect(0, '801', '1', true, true, true, []),
      new ItemsSelect(0, '802', '2', true, true, true, []),
      new ItemsSelect(0, '803', '3', true, true, true, []),
      new ItemsSelect(0, '804', '4', true, true, true, [])
    ];

    if (this.isBasketball()) {
      this.filterName = 'Quarter X Bet types:';
    }

    if (this.isBadminton()) {
      this.filterName = 'Game X Bet types:';
      this.selection.items.push(new ItemsSelect(0, '805', '5', true, true, true, []));
    }

    if (this.isPHAIO5()) {
      this.filterName = 'Round X Bet types:';
      this.selection.items.push(new ItemsSelect(0, '805', '5', true, true, true, []));
    }

    this.selection.checkAllItems(true);
  }

  getSelection(): string {
    const maxTotalItemsInSelection = this.isBasketball() ? 4 : 5;
    const value = this.selection.getValueItems();

    if (value.split(',').length === maxTotalItemsInSelection) {
      return 'All';
    } else {
      return value;
    }
  }

  validate(): boolean {
    if (!this.isShow) {
      return true;
    }
    const isValid = this.selection.getValueItems().length > 0;
    if (!isValid) {
      this.tooltip.display('advanced-mode-basketball', TEXT.EMPTY_SELECT);
    }
    return isValid;
  }
}