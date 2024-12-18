using System.Collections.Generic;
using System.Collections.Immutable;

namespace TicketVoidingSystem.Constants;

public static class SportTypeConstant
{
    public const int Sportsbook = 0;

    public const int VirtualSports = 1;

    public const int CashOut = 5;

    public const int Basketball = 2;

    public const int NumberGame = 161;

    public const int Lucky3Game = 160;

    public const int Happy5 = 164;

    public const int Bullfighting = 207;

    public const int Baseball = 8;

    public const int VirtualFootballCup = 178;     // Virtual Sports 3

    public const int VirtualFootballLeague = 179;     // Virtual Sports 3

    public const int VirtualCockFighting = 188;     // Virtual Sports 4

    public const int VirtualSportsVs4 = 9908;     // Virtual Sports 4

    public const int VirtuallySoccer = 147;     // Virtual Sports 5

    public const int VirtualHorseRacing = 198;     // Virtual Sports 2

    public const int VirtualDogRacing = 177;     // Virtual Sports 2

    public const int VirtualBetByBasketball = 134;     // Virtual Sports 6

    public static readonly ImmutableDictionary<int, string> RefIdVirtualSports = new Dictionary<int, string>
    {
        { VirtualFootballCup, "LVS_MatchCode" },
        { VirtualFootballLeague, "LVS_MatchCode" },
        { VirtualCockFighting, "EGVS_MatchCode" },
        { VirtualSportsVs4, "EGVS_MatchCode" },
        { VirtuallySoccer, "VYVS_MatchCode" }
    }.ToImmutableDictionary();
}