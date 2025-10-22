import { inject, Injectable } from "@angular/core";
import { AdvancedModeConstants } from "../../../utility/components/advanced-mode/advanced-mode.constants";
import { CheckedBetType, OddsInfo } from "../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model";
import { BetType, GroupBetTypesModel } from "../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model";
import { DateFullTimeNewComponent } from "../../../utility/components/date-time/date-full-time-new/date-full-time-new.component";
import { Tooltip } from "../../../utility/components/tooltip/tooltip.model";
import { BetTypeAutoCheckByIssue, BetTypeAutoCheckBySubIssue, BetTypeAutoUnCheckByIssue } from "../../../utility/constants/bettype-auto-check-list.constant";
import { IssueTypeConstant } from "../../../utility/constants/issue-type.constant";
import { SubIssueTypeConstant } from "../../../utility/constants/sub-issue-type.constant";
import { TEXT } from "../../../utility/constants/text";
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { StaticService } from "../../../utility/services/static.service";
import { TemplateContent } from "../../../utility/components/template-message/template-message/template.model";
import { GroupBetTypesService } from "../../../utility/components/advanced-mode/group-bettypes/group-bettypes.service";

@Injectable()
export class FilterService {
    private readonly BET_ITEM_SUB_PARLAY = 'Sub Parlay';
    private readonly FROM_DATE_TIME_CLASS = 'from-date-time';

    private readonly groupBetTypesService = inject(GroupBetTypesService);
    
    getSelectionSubParlays(bet: string, selectedComboParlay: string[]) {
        return bet !== this.BET_ITEM_SUB_PARLAY ? "" : selectedComboParlay.join(',');
    }

    isSelectionNotValid(bet: string, selectedComboParlay: string[]) {
        const selectionSubParlays = this.getSelectionSubParlays(bet, selectedComboParlay);
        return bet === this.BET_ITEM_SUB_PARLAY && (!selectionSubParlays || selectionSubParlays === "");
    }

    isTransDateValidity(fromTimeComponent: DateFullTimeNewComponent, toTimeComponent: DateFullTimeNewComponent, fromDateTime: string, toDateTime: string, tooltip: Tooltip): boolean {
        return fromTimeComponent.validateWithTooltip() && toTimeComponent.validateWithTooltip()
            && StaticService.isFromTimeSameOrBeforeToTime(fromDateTime, toDateTime, tooltip, this.FROM_DATE_TIME_CLASS);
    }

    private unCheckBetTypeByCondition(betTypeAutoCheckList: number[], allBetTypes: BetType[]) {
        allBetTypes.forEach(x => {
            if (betTypeAutoCheckList.includes(x.id)) {
                x.isChecked = false;
            }
        });
    }

    inValidMatch(matchId: string, isSuccessMatch: boolean, tooltip: Tooltip): boolean {
        if (!matchId) {
            tooltip.display('match-id', TEXT.REQUIRED_MATCHID);
            return true;
        }
        if (!isSuccessMatch) {
            tooltip.display('match-id', TEXT.INVALID_MATCHID);
            return true;
        }
        return false;
    }

    private isPlayerValueMatchWithOddsInfo(oddsInfo: OddsInfo, value: string): boolean {
        return (value === oddsInfo.playerId?.toString()) || (value === `${oddsInfo.betChoice},${oddsInfo.oddsId}`);
    }

    mapPlayerValueToOddsInfo(playerValueSelected: string[], oddsInfo: OddsInfo[]): OddsInfo[] {
        const distinctPlayerValue = [...new Set(playerValueSelected)];
        return distinctPlayerValue.map(value => {
            return oddsInfo.find(x => this.isPlayerValueMatchWithOddsInfo(x, value));
        }).filter(x => x);
    }

    private splitCricketBetTypeQuery(betType: CheckedBetType): string[] {
        if (betType.transdesc) {
            return betType.transdesc.split(',');
        }

        if (betType.oddsId && betType.betTeam) {
            const betTeams = betType.betTeam.split(',');
            const oddsIds = betType.oddsId.split(',');
            return betTeams.map((team, i) => `${team},${oddsIds[i]}`);
        }

        return [];
    }

    getPlayerValueSelectedFromBetTypeQuery(betTypes: CheckedBetType[]): string[] {
        const cricketBetTypeIdList = AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER.split(',');
        const cricketBetTypeList = betTypes.filter(x => {
            return cricketBetTypeIdList.includes(x.id.toString());
        });

        return cricketBetTypeList.flatMap(betType => this.splitCricketBetTypeQuery(betType));
    }


    replaceEnglishForChinese(selectedOddsInfo: OddsInfo[]) {
        selectedOddsInfo.forEach(player => {
            if (!player.playNamesChineseTraditional) {
                player.playNamesChineseTraditional = player.playerName;
            }
            if (!player.playNamesChineseSimplified) {
                player.playNamesChineseSimplified = player.playerName;
            }
        });
    }

    updateIssueTypes(data: IssueTypesModel) {
        const hiddenIssueTypes = [
            IssueTypeConstant.EARLY_KICK_OFF,
            IssueTypeConstant.WRONG_KICK_OFF,
            IssueTypeConstant.ABNORMAL_BET,
            IssueTypeConstant.AB_REAL_MEMBER,
            IssueTypeConstant.RECOVER_TICKET,
            IssueTypeConstant.WRONG_OFFERED_NAME
        ]
        if (data && data.issueTypes) {
            data.issueTypes = data.issueTypes.filter(x => !hiddenIssueTypes.includes(x.issueTypeId.toString()));
        }
        return data;
    }

    private checkAllBetType(allBetTypes: BetType[]) {
        allBetTypes.forEach(x => {
            x.isChecked = true;
        });
    }

    private unCheckAllBetType(allBetTypes: BetType[]) {
        allBetTypes.forEach(x => {
            x.isChecked = false;
        });
    }

    private issueTypeSupportBasketball(issueType: string): boolean {
        const IssueTypeSupportBasketball = [IssueTypeConstant.WRONG_HDP, IssueTypeConstant.WRONG_1ST_HDP,
        IssueTypeConstant.WRONG_OU, IssueTypeConstant.WRONG_1ST_OU, IssueTypeConstant.WRONG_QUARTER_HDP,
        IssueTypeConstant.WRONG_SCORE];

        return IssueTypeSupportBasketball.includes(issueType);
    }

    handleBetTypeOfBasketball(eventType: string, issueType: string, subIssueType: string, allBetTypes: BetType[], groupBetTypes: GroupBetTypesModel) {
        if (!this.issueTypeSupportBasketball(issueType)) {
            return;
        }
        this.unCheckAllBetType(allBetTypes);
        this.checkBetTypeForWrongHdp(eventType, issueType, allBetTypes);
        this.checkBetTypeForWrong1StHdp(eventType, issueType, allBetTypes);
        this.checkBetTypeForWrong1StOu(eventType, issueType, allBetTypes);
        this.checkBetTypeForWrongQuarterHdp(eventType, issueType, allBetTypes);
        this.checkBetTypeForWrongOu(eventType, issueType, subIssueType, allBetTypes);

        if (issueType === IssueTypeConstant.WRONG_SCORE) {
            this.checkAllBetType(allBetTypes);
            this.unCheckBetTypeByCondition(BetTypeAutoUnCheckByIssue.WRONG_SCORE, allBetTypes);
        }

        this.groupBetTypesService.changeCheckGroupByBetTypes(groupBetTypes.groupBetTypes);
        this.groupBetTypesService.changeCheckedGroupToModel(groupBetTypes);
    }

    private checkBetTypeForWrongHdp(eventType: string, issueType: string, allBetTypes: BetType[]) {
        if (issueType !== IssueTypeConstant.WRONG_HDP) {
            return;
        }
        if (eventType === "0") {
            this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_HDP_NON_LIVE, allBetTypes);
            return;
        }
        if (eventType === "1") {
            this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_HDP_LIVE, allBetTypes);
            return;
        }
        this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_HDP, allBetTypes);
    }

    private checkBetTypeForWrong1StHdp(eventType: string, issueType: string, allBetTypes: BetType[]) {
        if (issueType !== IssueTypeConstant.WRONG_1ST_HDP) {
            return;
        }
        if (eventType === "0") {
            this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_1ST_HDP_NON_LIVE, allBetTypes);
            return;
        }
        if (eventType === "1") {
            this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_1ST_HDP_LIVE, allBetTypes);
            return;
        }
        this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_1ST_HDP, allBetTypes);
    }

    private checkBetTypeForWrong1StOu(eventType: string, issueType: string, allBetTypes: BetType[]) {
        if (issueType !== IssueTypeConstant.WRONG_1ST_OU) {
            return;
        }
        if (eventType === "0") {
            this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_1ST_OU_NON_LIVE, allBetTypes);
            return;
        }
        if (eventType === "1") {
            this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_1ST_OU_LIVE, allBetTypes);
            return;
        }
        this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_1ST_OU, allBetTypes);
    }

    private checkBetTypeForWrongQuarterHdp(eventType: string, issueType: string, allBetTypes: BetType[]) {
        if (issueType !== IssueTypeConstant.WRONG_QUARTER_HDP) {
            return;
        }
        if (eventType === "0") {
            this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_QUARTER_HDP_NON_LIVE, allBetTypes);
            return;
        }
        if (eventType === "1") {
            this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_QUARTER_HDP_LIVE, allBetTypes);
            return;
        }
        this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_QUARTER_HDP, allBetTypes);
    }

    private checkBetTypeForWrongOu(eventType: string, issueType: string, subIssueType: string, allBetTypes: BetType[]) {
        if (issueType !== IssueTypeConstant.WRONG_OU) {
            return;
        }
        if (subIssueType === SubIssueTypeConstant.WRONG_QUARTER_OU) {
            if (eventType === "0") {
                this.checkBetTypeByCondition(BetTypeAutoCheckBySubIssue.WRONG_QUARTER_OU_NON_LIVE, allBetTypes);
                return;
            }
            if (eventType === "1") {
                this.checkBetTypeByCondition(BetTypeAutoCheckBySubIssue.WRONG_QUARTER_OU_LIVE, allBetTypes);
                return;
            }
            this.checkBetTypeByCondition(BetTypeAutoCheckBySubIssue.WRONG_QUARTER_OU, allBetTypes);
        }
        else {
            if (eventType === "0") {
                this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_OU_NON_LIVE, allBetTypes);
                return;
            }
            if (eventType === "1") {
                this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_OU_LIVE, allBetTypes);
                return;
            }
            this.checkBetTypeByCondition(BetTypeAutoCheckByIssue.WRONG_OU, allBetTypes);
        }
    }

    private checkBetTypeByCondition(betTypeAutoCheckList: number[], allBetTypes: BetType[]) {
        allBetTypes.forEach(x => {
            if (betTypeAutoCheckList.includes(x.id)) {
                x.isChecked = true;
            }
        });
    }

    getPlayerNamesSelected(betTypes: CheckedBetType[], oddsInfo: OddsInfo[]) {
        const playerNamesSelected = new TemplateContent();
        playerNamesSelected.msgEnglish = '';
        playerNamesSelected.msgChineseTraditional = '';
        playerNamesSelected.msgChineseSimplified = '';
        playerNamesSelected.msgChineseNewSimplified = '';

        const playerValueSelected = this.getPlayerValueSelectedFromBetTypeQuery(betTypes);
        if (playerValueSelected.length) {
            const selectedOddsInfo = this.mapPlayerValueToOddsInfo(playerValueSelected, oddsInfo);
            this.replaceEnglishForChinese(selectedOddsInfo);
            playerNamesSelected.msgEnglish = [...new Set(selectedOddsInfo.map(x => x.playerName))].join(' & ');
            playerNamesSelected.msgChineseTraditional = [...new Set(selectedOddsInfo.map(x => x.playNamesChineseTraditional))].join(' 和 ');
            playerNamesSelected.msgChineseSimplified = [...new Set(selectedOddsInfo.map(x => x.playNamesChineseSimplified))].join(' 和 ');
            playerNamesSelected.msgChineseNewSimplified = [...new Set(selectedOddsInfo.map(x => x.playNamesChineseSimplified))].join(' 和 ');
        }

        return playerNamesSelected;
    }
}