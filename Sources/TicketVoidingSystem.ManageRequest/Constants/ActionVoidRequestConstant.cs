namespace TicketVoidingSystem.ManageRequest.Constants;

public static class ActionVoidRequestConstant
{
    public const byte ManualVoid = 5;
    public const byte AutoVoidWinning = 1;
    public const byte AutoVoidAllInstant = 4;
    public const byte AutoVoidAllInstantWithOutPolicy = 8;
    public const byte AutoVoidAll5mBeforeKickOff = 6;
    public const byte AutoVoidAll10mBeforeKickOff = 7;
}