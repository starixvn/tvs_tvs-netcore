namespace TicketVoidingSystem.ManageRequest.Constants;

public static class VoidingTypeConstant
{
    public const byte Single = 1;

    //// for Main + Sub parlay
    public const byte Parlay = 2;

    public const byte CancelCashOut = 3;

    public const byte Cricket = 4;

    public const byte Single14 = 5;

    //// for Main + Sub parlay 14
    public const byte Parlay14 = 6;

    //// RECOVER
    public const byte RecoverSingle = 11;

    //// for Main + Sub parlay
    public const byte RecoverParlay = 12;

    public const byte RecoverCricket = 14;

    public const byte RecoverSingle14 = 15;

    //// for Main + Sub parlay 14
    public const byte RecoverParlay14 = 16;

    // HybridParlay

    public const byte HybridParlay = 18;

    public const byte SubHybridParlay = 20;

    public const byte HybridParlay14 = 22;
}