using System.Collections.Generic;
using Fanex.BetList.Core.TicketHelper;
using Fanex.RemotingRef;

namespace TicketVoidingSystem.Services.BetList;

public class LanguageCacheRef : ICacheRef
{
    private readonly string CurrentLanguage;
    private static readonly string DefaultValue = string.Empty;

    private readonly IRemotingRefService remotingRefService;

    public LanguageCacheRef(string language, IRemotingRefService remotingRefService = null)
    {
        this.remotingRefService = remotingRefService ?? new RemotingRefService();
        CurrentLanguage = language;
    }

    public string GetBetType(string betTypeId, string resourceId, long refNo)
        => remotingRefService.GetBetTypeName(betTypeId, CurrentLanguage, DefaultValue, resourceId, refNo);

    public string GetParentBetTypeIdByBetTypeId(string betTypeId, string defaultParentBetTypeId)
        => remotingRefService.GetParentIdByBetTypeId(betTypeId, defaultParentBetTypeId);

    public string GetSportName(string sportId)
        => remotingRefService.GetSportName(sportId, CurrentLanguage);

    public string GetTeamName(string teamId)
        => remotingRefService.GetTeamName(teamId, CurrentLanguage);

    public string GetTeamName3rd(string team3rdId)
        => remotingRefService.GetTeamName3rd(team3rdId, CurrentLanguage);

    public string GetRouletteBetItem(string itemId)
        => remotingRefService.GetRouletteBetItem(itemId, CurrentLanguage);

    public string GetCasinoBetItem(string betStatusId)
        => remotingRefService.GetCasinoBetItem(betStatusId, CurrentLanguage, DefaultValue);

    public string GetLeagueName(string leagueId)
        => remotingRefService.GetLeagueName(leagueId, CurrentLanguage);

    public string GetLeagueName(string leagueId, string leagueGroupId)
        => remotingRefService.GetLeagueName(leagueId, leagueGroupId);

    public string GetLeagueName3rd(string league3rdId)
        => remotingRefService.GetLeagueName3rd(league3rdId, CurrentLanguage);

    public string GetHorseTeamName(string codeId)
        => remotingRefService.GetHorseTeamName(codeId, CurrentLanguage, DefaultValue);

    public string GetOddsTypeName(string oddsTypeId)
        => remotingRefService.GetOddsTypeName(oddsTypeId, CurrentLanguage);

#pragma warning disable S3874 // "out" and "ref" parameters should not be used

    public string GetKenoBetChoiceName(string kenoBetChoiceId, out string kenoBetTypeId)
        => remotingRefService.GetKenoBetChoice(kenoBetChoiceId, CurrentLanguage, out kenoBetTypeId);

#pragma warning restore S3874 // "out" and "ref" parameters should not be used

    public string GetKenoBetTypeName(string kenoBetTypeId)
        => remotingRefService.GetKenoBetType(kenoBetTypeId, CurrentLanguage);

    public string GetResourceData(string refId, string resourceId)
        => remotingRefService.GetResourceDataByRefIdAndResourceId(refId, resourceId, CurrentLanguage, DefaultValue);

    public IList<string> GetCombinationTypeCombo(string betTeam, string betCheck, int handicap1, int handicap2)
        => remotingRefService.GetCombinationTypeCombo(betTeam, betCheck, handicap1, handicap2, CurrentLanguage);

    public string GetFastMarketsChoice(string betTypeId, string betTeam, int handicap1, int handicap2)
        => remotingRefService.GetFastMarketsChoice(betTypeId, betTeam, handicap1, handicap2, CurrentLanguage);

#pragma warning disable S3874 // "out" and "ref" parameters should not be used

    public string GetLotteryBetChoiceName(string lotteryBetChoiceId, out string lotteryBetTypeId)
        => remotingRefService.GetLotteryBetChoice(lotteryBetChoiceId, CurrentLanguage, out lotteryBetTypeId);

#pragma warning restore S3874 // "out" and "ref" parameters should not be used

    public string GetLotteryBetTypeName(string lotteryBettypeId)
        => remotingRefService.GetLotteryBetType(lotteryBettypeId, CurrentLanguage);

    public string GetBetRadarMatchCodeFormat(string matchCode)
        => remotingRefService.GetBetRadarMatchCodeFormat(matchCode, CurrentLanguage);

    public string GetDisplayedBetType(string betTypeId, string resourceId, long refNo)
        => remotingRefService.GetDisplayedBetTypeName(betTypeId, resourceId, refNo, CurrentLanguage, DefaultValue);

    public string GetTableGamesBetChoiceName(string tableGamesBetChoiceId, out string tableGamesBetTypeId)
        => remotingRefService.GetTableGamesBetChoice(tableGamesBetChoiceId, CurrentLanguage, out tableGamesBetTypeId);

    public string GetTableGamesBetTypeName(string tableGamesBetTypeId)
        => remotingRefService.GetTableGamesBetType(tableGamesBetTypeId, CurrentLanguage);
}