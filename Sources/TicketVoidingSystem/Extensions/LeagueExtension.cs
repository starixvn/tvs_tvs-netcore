using System.Collections.Generic;

namespace TicketVoidingSystem.Extensions;

public static class LeagueExtension
{
    private static readonly List<int> LeagueGroupIdsSaBa = new List<int> { 42, 74, 108 };

    public static bool IsLeagueGroupIdSaBa(this int leagueGroupId)
    {
        return LeagueGroupIdsSaBa.Contains(leagueGroupId);
    }
}