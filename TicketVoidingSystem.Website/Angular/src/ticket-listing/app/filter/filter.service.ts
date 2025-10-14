import { Injectable } from '@angular/core';
import { Product } from '../../../utility/constants/config';
import { GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetTypesModel } from '../../../utility/components/bettypes/bettypes.model';
import { BetTypesComponent } from '../../../utility/components/bettypes/bettypes.component';

@Injectable()
export class FilterService {
    private isSportTypeVs7(sportType: number) {
        const sportTypeVs7 = [125, 126, 127];
        return sportTypeVs7.includes(sportType);
    }

    private isInvalidProduct0(product: number, sportType: number): boolean {
        return ((product === 0) && sportType > 99 && sportType !== 154);
    }

    private isInvalidProduct1(product: number, sportType: number): boolean {
        return (product === 1 && sportType !== 161 && sportType !== 164);
    }

    private isInvalidSecondGroupOtherProducts(sportType: number): boolean {
        return (
            sportType !== 175
        );
    }

    private isInvalidFirstGroupOtherProducts(sportType: number): boolean { // NOSONAR
        return (
            sportType > 99 &&
            sportType !== 154 &&
            sportType !== 161 &&
            sportType !== 164 &&
            (sportType < 180 || sportType > 186) &&
            ((sportType < 190 || sportType > 199) && sportType !== 177) &&
            sportType !== 178 && sportType !== 179 &&
            sportType !== 188 && sportType !== 147 &&
            !this.isSportTypeVs6(sportType) &&
            !this.isSportTypeVs7(sportType)
        );
    }

    private isSportTypeVs6(sportType: number): boolean {
        const sportTypeVs6 = [134, 116, 114];
        return sportTypeVs6.includes(sportType);
    }

    isInvalidOtherProducts(sportType: number): boolean {
        return (
            this.isInvalidFirstGroupOtherProducts(sportType) &&
            this.isInvalidSecondGroupOtherProducts(sportType)
        );
    }

    isSelectionNotValid(singleOrSubParlay: string, selectedComboParlay: string[]): boolean {
        const selectionSubParlays = this.getSelectionSubParlays(singleOrSubParlay, selectedComboParlay);
        return singleOrSubParlay === "SubParlay" && selectionSubParlays === "";
    }

    private inValidSportTypeVirtualSport(sportType: number) { // NOSONAR
        return (sportType < 180 || sportType > 186)                         //sportTypes invalid in  Virtual Sports
            && ((sportType < 190 || sportType > 199) && sportType !== 177)      //sportTypes invalid in  Virtual Sports 2
            && (sportType !== 178 && sportType !== 179)                         //sportTypes invalid in  Virtual Sports 3
            && (sportType !== 188)                                              //sportTypes invalid in  Virtual Sports 4
            && (sportType !== 147)                                              //sportTypes invalid in  Virtual Sports 5
            && !this.isSportTypeVs6(sportType)                                  //sportTypes invalid in  Virtual Sports 6
            && !this.isSportTypeVs7(sportType);                                 //sportTypes invalid in  Virtual Sports 7
    }

    private isInvalidProduct2(product: number, sportType: number): boolean {
        return (product === 2 && this.inValidSportTypeVirtualSport(sportType));
    }

    private isInvalidProduct9(product: number, sportType: number): boolean {
        return (product === 9 && sportType !== 175);
    }

    invalidProduct(product: number, sportType: number): boolean {
        return (
            this.isInvalidProduct0(product, sportType)
            || this.isInvalidProduct1(product, sportType)
            || this.isInvalidProduct2(product, sportType)
            || this.isInvalidProduct9(product, sportType)
            || this.isInvalidOtherProducts(sportType)
        );
    }

    getSelectionSubParlays(bet: string, selectedComboParlay: string[]) {
        return bet !== "SubParlay" ? "" : selectedComboParlay.join(',');
    }

    enableGroupBetTypesAndAdvancedMode(groupBetTypesComponent: GroupBetTypesComponent): void {
        if (groupBetTypesComponent) {
            groupBetTypesComponent.isDisabledAllBetTypes = false;
        }
    }

    enableBetTypesAndAdvancedMode(betTypesComponent: BetTypesComponent): void {
        if (betTypesComponent) {
            betTypesComponent.isDisabledAllBetTypes = false;
        }
    }

    checkAndDisabledAllBetTypes(product: number, isReSettled: boolean, betTypesComponent: BetTypesComponent, betTypes: BetTypesModel): void {
        if (product === Product.BET_BUILDER) {
            if (isReSettled) {
                if (betTypesComponent) {
                    betTypesComponent.isDisabledAllBetTypes = true;
                }
                betTypes.isChecked = true;
                betTypes.betTypes.forEach(x => {
                    x.isChecked = true;
                });
            } else {
                this.enableBetTypesAndAdvancedMode(betTypesComponent);
            }
        }
    }

    checkAndDisabledAllGroupBetTypes(product: number, isReSettled: boolean, groupBetTypesComponent: GroupBetTypesComponent, groupBetTypes: GroupBetTypesModel): void {
        if (product === Product.SPORTS_BOOK) {
            if (isReSettled) {
                if (groupBetTypesComponent) {
                    groupBetTypesComponent.isDisabledAllBetTypes = true;
                }
                groupBetTypes.isChecked = true;
                groupBetTypes.groupBetTypes.forEach(x => {
                    x.isChecked = true;
                    x.betTypes.forEach(y => y.isChecked = true);
                });
            } else {
                this.enableGroupBetTypesAndAdvancedMode(groupBetTypesComponent);
            }
        }
    }
}