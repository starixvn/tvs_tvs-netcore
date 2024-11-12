using System.Collections.Immutable;

namespace TicketVoidingSystem.Constants;

public static class SubIssueTypeConstant
{
    public const int FixGame = 31;
    public const int SystemFormulaBet = 38;
    public const int WrongHDP = 8;
    public const int Wrong1stHDP = 9;
    public const int WrongHDPAwayVirtualHeadReversed = 22;
    public const int WrongHDPHomeVirtualHeadReversed = 23;
    public const int Wrong1stHDPAwayVirtualHeadReversed = 24;
    public const int Wrong1stHDPHomeVirtualHeadReversed = 25;
    public const int WrongOU = 10;
    public const int Wrong1stOU = 11;
    public const int Handicap = 6;
    public const int FirstHalfHandicap = 119;
    public const int OverUnder = 120;
    public const int FirstHalfOverUnder = 121;

    public const int AbnormalBet_Abnormal = 27;
    public const int AbnormalBet_ABBet = 32;

    public const int AbnormalAccount_Abnormal = 39;
    public const int AbnormalAccount_ABBet = 104;

    public static readonly ImmutableArray<int> RemovedList = [AbnormalBet_Abnormal, AbnormalBet_ABBet, AbnormalAccount_Abnormal, AbnormalAccount_ABBet
    ];
}