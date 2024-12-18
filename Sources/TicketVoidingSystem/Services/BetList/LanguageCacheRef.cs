using System.Collections.Generic;
using Fanex.BetList.Core.TicketHelper;
using Fanex.RemotingRef;

namespace TicketVoidingSystem.Services.BetList;

public class LanguageCacheRef(string language, IRemotingRefService remotingRefService = null)
    : ICacheRef
{
    private static readonly string DefaultValue = string.Empty;

    private readonly IRemotingRefService remotingRefService = remotingRefService ?? new RemotingRefService();

    public string GetBetType(string betTypeId, string resourceId, long refNo)
        => remotingRefService.GetBetTypeName(betTypeId, language, DefaultValue, resourceId, refNo);

    public string GetParentBetTypeIdByBetTypeId(string betTypeId, string defaultParentBetTypeId)
        => remotingRefService.GetParentIdByBetTypeId(betTypeId, defaultParentBetTypeId);

    public string GetSportName(string sportId)
        => remotingRefService.GetSportName(sportId, language);

    public string GetTeamName(string teamId)
        => remotingRefService.GetTeamName(teamId, language);

    public string GetTeamName3rd(string team3rdId)
        => remotingRefService.GetTeamName3rd(team3rdId, language);

    public string GetRouletteBetItem(string itemId)
        => remotingRefService.GetRouletteBetItem(itemId, language);

    public string GetCasinoBetItem(string betStatusId)
        => remotingRefService.GetCasinoBetItem(betStatusId, language, DefaultValue);

    public string GetLeagueName(string leagueId)
        => remotingRefService.GetLeagueName(leagueId, language);

    public string GetLeagueName(string leagueId, string leagueGroupId)
        => remotingRefService.GetLeagueName(leagueId, leagueGroupId);

    public string GetLeagueName3rd(string league3rdId)
        => remotingRefService.GetLeagueName3rd(league3rdId, language);

    public string GetHorseTeamName(string codeId)
        => remotingRefService.GetHorseTeamName(codeId, language, DefaultValue);

    public string GetOddsTypeName(string oddsTypeId)
        => remotingRefService.GetOddsTypeName(oddsTypeId, language);

#pragma warning disable S3874 // "out" and "ref" parameters should not be used

    public string GetKenoBetChoiceName(string kenoBetChoiceId, out string kenoBetTypeId)
        => remotingRefService.GetKenoBetChoice(kenoBetChoiceId, language, out kenoBetTypeId);

#pragma warning restore S3874 // "out" and "ref" parameters should not be used

    public string GetKenoBetTypeName(string kenoBetTypeId)
        => remotingRefService.GetKenoBetType(kenoBetTypeId, language);

    public string GetResourceData(string refId, string resourceId)
        => remotingRefService.GetResourceDataByRefIdAndResourceId(refId, resourceId, language, DefaultValue);

    public IList<string> GetCombinationTypeCombo(string betTeam, string betCheck, int handicap1, int handicap2)
        => remotingRefService.GetCombinationTypeCombo(betTeam, betCheck, handicap1, handicap2, language);

    public string GetFastMarketsChoice(string betTypeId, string betTeam, int handicap1, int handicap2)
        => remotingRefService.GetFastMarketsChoice(betTypeId, betTeam, handicap1, handicap2, language);

#pragma warning disable S3874 // "out" and "ref" parameters should not be used

    public string GetLotteryBetChoiceName(string lotteryBetChoiceId, out string lotteryBetTypeId)
        => remotingRefService.GetLotteryBetChoice(lotteryBetChoiceId, language, out lotteryBetTypeId);

#pragma warning restore S3874 // "out" and "ref" parameters should not be used

    public string GetLotteryBetTypeName(string lotteryBettypeId)
        => remotingRefService.GetLotteryBetType(lotteryBettypeId, language);

    public string GetBetRadarMatchCodeFormat(string matchCode)
        => remotingRefService.GetBetRadarMatchCodeFormat(matchCode, language);

    public string GetDisplayedBetType(string betTypeId, string resourceId, long refNo)
        => remotingRefService.GetDisplayedBetTypeName(betTypeId, resourceId, refNo, language, DefaultValue);

    public string GetTableGamesBetChoiceName(string tableGamesBetChoiceId, out string tableGamesBetTypeId)
        => remotingRefService.GetTableGamesBetChoice(tableGamesBetChoiceId, language, out tableGamesBetTypeId);

    public string GetTableGamesBetTypeName(string tableGamesBetTypeId)
        => remotingRefService.GetTableGamesBetType(tableGamesBetTypeId, language);

    public string GetVirtualSportMatchCodeFormat(string matchCode, string refId)
        => remotingRefService.GetVirtualSportMatchCodeFormat(matchCode, refId, language);
}