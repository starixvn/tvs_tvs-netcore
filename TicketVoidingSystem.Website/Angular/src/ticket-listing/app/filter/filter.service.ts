import { inject, Injectable } from '@angular/core';
import { Product } from '../../../utility/constants/config';
import { GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetTypesModel } from '../../../utility/components/bettypes/bettypes.model';
import { BetTypesComponent } from '../../../utility/components/bettypes/bettypes.component';
import { AppService } from '../app.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../utility/constants/text';
import { StaticService } from '../../../utility/services/static.service';
import { MatchModel } from '../../../utility/models/match.model';

@Injectable()
export class FilterService {
    private readonly appService = inject(AppService);

    async getLicenseeSelectList() {
        const licensees = await this.appService.getLicensees();
        let licenseeSelectList: { id: number, name: string }[] = [
            { id: 0, name: 'All' },
            { id: -1, name: 'Credit' }
        ];

        if (licensees && licensees.length > 0) {
            const licenseeItems = licensees.map(l => ({
                id: l.id,
                name: l.name,
                group: 'Licensee'
            }));

            licenseeSelectList = [...licenseeSelectList, ...licenseeItems];
        }
        return licenseeSelectList;
    }

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
            sportType !== 188 && sportType !== 147 && sportType !== 134 &&
            !this.isSportTypeVs7(sportType)
        );
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

    inValidSportTypeVirtualSport(sportType: number) { // NOSONAR
        return (sportType < 180 || sportType > 186)                         //sportTypes invalid in  Virtual Sports
            && ((sportType < 190 || sportType > 199) && sportType !== 177)      //sportTypes invalid in  Virtual Sports 2
            && (sportType !== 178 && sportType !== 179)                         //sportTypes invalid in  Virtual Sports 3
            && (sportType !== 188)                                              //sportTypes invalid in  Virtual Sports 4
            && (sportType !== 147)                                              //sportTypes invalid in  Virtual Sports 5
            && (sportType !== 134)                                              //sportTypes invalid in  Virtual Sports 6
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

    isBetBuilder(product: number): boolean {
        return product === Product.BET_BUILDER;
    }

    checkAndDisabledAllBetTypes(product: number, isReSettled: boolean, betTypesComponent: BetTypesComponent, betTypes: BetTypesModel): void {
        if (this.isBetBuilder(product)) {
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

    isSportsBookOrHybridParlay(product: number): boolean {
        return product === Product.SPORTS_BOOK || product === Product.HYBRID_PARLAY;
    }

    checkAndDisabledAllGroupBetTypes(product: number, isReSettled: boolean, groupBetTypesComponent: GroupBetTypesComponent, groupBetTypes: GroupBetTypesModel): void {
        if (this.isSportsBookOrHybridParlay(product)) {
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

    isShowCheckboxAffected(product: number, groupBetTypes: GroupBetTypesModel, betTypes: BetTypesModel): boolean {
        if (this.isSportsBookOrHybridParlay(product)) {
            return groupBetTypes && groupBetTypes.groupBetTypes.length > 0;
        }
        if (this.isBetBuilder(product)) {
            return betTypes && betTypes.betTypes.length > 0;
        }

        return false;
    }

    invalidMatch(matchId: string, match: MatchModel, tooltip: Tooltip): boolean {
        if (matchId === '' || matchId === undefined) {
            tooltip.display('match-id', TEXT.REQUIRED_MATCHID);
            return true;
        }
        if (!StaticService.isNumber(matchId) || match === null) {
            tooltip.display('match-id', TEXT.INVALID_MATCHID);
            return true;
        }

        return false;
    }
}