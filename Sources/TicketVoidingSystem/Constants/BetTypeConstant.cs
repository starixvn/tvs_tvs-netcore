namespace TicketVoidingSystem.Constants;

public static class BetTypeConstant
{
    public const int SystemParlay = 29;

    public const int Outright = 10;

    public const int Fglg = 14;

    public const int Htft = 16;

    public const int MinVirtualSportBetType = 1201;

    public const int MaxVirtualSportBetType = 1299;

    public const int MinSportingSolutionBetType = 1301;

    public const int MaxSportingSolutionBetType = 1399;

    public const int FirstNumberGame = 81;

    public const int SecondNumberGame = 120;

    public const int FirstMetricGame = 801;

    public const int SecondMetricGame = 809;

    public const int FirstLucky3 = 1600;

    public const int SecondLucky3 = 1610;

    public const int FirstVirtualSport = 2701;

    public const int SecondVirtualSport = 2899;

    public const int VirtualSportParlay = 2799;

    public const int PenaltyShootoutCombo = 376;

    public const int Handicap = 1;

    public const int OverUnder = 3;

    public const int FirstHalfHandicap = 7;

    public const int FirstHalfOverUnder = 8;

    public const int SabaOUTimeMachine = 228;

    public const int SabaHdpTimeMachine = 229;

    public const int BitCoinOverUnder = 7901;

    public const int VirtualSport4MixParlay = 10449;

    public const int VirtualSport4MatchWinner = 10400;

    public const int VirtualSport5MixParlay = 11099;

    public static readonly int[] VirtualSports = [1231, 1232, 1233, 1237, 1238];
    public static readonly int[] BetTypesNotNeedRefNoGetBetType = [9, 2799, 10449, 11099];
}