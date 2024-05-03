namespace TicketVoidingSystem.ManageRequest.Constants;

public static class ActionVoidRequestConstant
{
    public const string QueueActionVoidInstant = "VoidInstant";
    public const string QueueActionVoidInstantPolicy = "VoidInstantPolicy";
    public const string QueueActionVoidInstantNoPolicy = "VoidInstantNopolicy";
    public const string QueueActionVoidResultKeyed = "VoidResultKeyed";
    public const string QueueActionRecoverInstant = "RecoverInstant";

    public const byte ManualVoidId = 5;
    public const byte AutoVoidWinningId = 1;
    public const byte AutoVoidAllInstantId = 4;
    public const byte AutoVoidAllInstantWithOutPolicyId = 8;
    public const byte AutoVoidAllResultKeyedId = 9;
    public const byte AutoVoidAllInstantWithPolicyId = 10;
    public const byte AutoRecoverId = 11;

    public static IEnumerable<QueueAutoVoidModel> QueueAutoVoidList =>
        new List<QueueAutoVoidModel>
        {
            new() { Id = AutoVoidAllInstantId, Name = QueueActionVoidInstant },
            new() { Id = AutoVoidAllInstantWithOutPolicyId, Name = QueueActionVoidInstantNoPolicy },
            new() { Id = AutoVoidAllInstantWithPolicyId, Name = QueueActionVoidInstantPolicy },
            new() { Id = AutoRecoverId, Name = QueueActionRecoverInstant }
        };
}

public class QueueAutoVoidModel
{
    public string Name { get; set; }
    public int Id { get; set; }
}