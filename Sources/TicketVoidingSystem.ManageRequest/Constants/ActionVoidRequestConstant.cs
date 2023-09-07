namespace TicketVoidingSystem.ManageRequest.Constants;

public static class ActionVoidRequestConstant
{
    public const string QueueActionVoidInstant = "VoidInstant";
    public const string QueueActionVoidInstant5m = "VoidInstant5m";
    public const string QueueActionVoidInstant10m = "VoidInstant10m";
    public const string QueueActionVoidInstantNoPolicy = "VoidInstantNopolicy";
    public const string QueueActionVoidResultKeyed = "VoidResultKeyed";

    public const byte ManualVoid = 5;
    public const byte AutoVoidWinningId = 1;
    public const byte AutoVoidAllInstantId = 4;
    public const byte AutoVoidAllInstantWithOutPolicyId = 8;
    public const byte AutoVoidAll5mBeforeKickOffId = 6;
    public const byte AutoVoidAll10mBeforeKickOffId = 7;
    public const byte AutoVoidAllResultKeyedId = 9;

    public static IEnumerable<QueueAutoVoidModel> QueueAutoVoidList =>
        new List<QueueAutoVoidModel>
        {
            new() { Id = AutoVoidAllInstantId, Name = QueueActionVoidInstant },
            new() { Id = AutoVoidAllInstantWithOutPolicyId, Name = QueueActionVoidInstantNoPolicy },
            new() { Id = AutoVoidAll5mBeforeKickOffId, Name = QueueActionVoidInstant5m },
            new() { Id = AutoVoidAll10mBeforeKickOffId, Name = QueueActionVoidInstant10m }
        };
}

public class QueueAutoVoidModel
{
    public string Name { get; set; }
    public int Id { get; set; }
}