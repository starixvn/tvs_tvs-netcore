namespace TicketVoidingSystem.Services.SendEmail.Subject;

public enum VoidType
{
    None,
    Abnormal,
    CashOut,
    NumberGame,
    VirtualSports
}

public enum RecoverType
{
    None,
    Default,
    CashOut,
    NumberGame,
    Parlay,
    VirtualSports
}

public static class SubjectFactory
{
    public static SubjectLabelsService CreateVoid(VoidType type)
    {
        SubjectLabelsService subjectLabels = type switch
        {
            VoidType.CashOut => new SubjectVoidCashOutImp(),
            VoidType.NumberGame => new SubjectVoidNumberGameImp(),
            VoidType.VirtualSports => new SubjectVoidVirtualSportsImp(),
            VoidType.Abnormal => new SubjectVoidAbnormalImp(),
            _ => new SubjectVoidImp()
        };

        return subjectLabels;
    }

    public static SubjectLabelsService CreateRecover(RecoverType type)
    {
        SubjectLabelsService subjectLabels = type switch
        {
            RecoverType.CashOut => new SubjectRecoverCashOutImp(),
            RecoverType.NumberGame => new SubjectRecoverNumberGameImp(),
            RecoverType.Parlay => new SubjectRecoverParlayImp(),
            RecoverType.VirtualSports => new SubjectRecoverVirtualSportsImp(),
            _ => new SubjectRecoverImp()
        };

        return subjectLabels;
    }
}