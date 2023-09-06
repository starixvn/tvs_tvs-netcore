using TicketVoidingSystem.Resources;

namespace TicketVoidingSystem.Services.SendEmail.Subject;

public interface SubjectLabelsService
{
    string It();

    string Licensee();
}

public class SubjectVoidImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_VoidedBetsReportFor;

    public string It() => StringResource.Subject_VoidedBetsReportForIt;
}

public class SubjectVoidDuplicateTicketsImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_DuplicateTicketVoidedFor;

    public string It() => StringResource.Subject_DuplicateTicketVoidedForIt;
}

public class SubjectVoidAbnormalImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_VoidedAbnormalBetsReport;

    public string It() => StringResource.Subject_VoidedAbnormalBetsReportIt;
}

public class SubjectVoidCashOutImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_VoidedCashOut;

    public string It() => StringResource.Subject_VoidedCashOutIt;
}

public class SubjectVoidNumberGameImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_VoidedNumberGame;

    public string It() => StringResource.Subject_VoidedNumberGameIt;
}

public class SubjectVoidVirtualSportsImp : SubjectLabelsService
{
    public string It() => StringResource.Subject_VoidedVirtualSportsIt;

    public string Licensee() => StringResource.Subject_VoidedVirtualSports;
}

public class SubjectRecoverImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_RecoveredBetReport;

    public string It() => StringResource.Subject_RecoveredBetReportIt;
}

public class SubjectRecoverCashOutImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_RecoveredCashOut;

    public string It() => StringResource.Subject_RecoveredCashOutIt;
}

public class SubjectRecoverNumberGameImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_RecoveredNumberGame;

    public string It() => StringResource.Subject_RecoveredNumberGameIt;
}

public class SubjectRecoverParlayImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_RecoveredParlay;

    public string It() => StringResource.Subject_RecoveredParlayIt;
}

public class SubjectRecoverVirtualSportsImp : SubjectLabelsService
{
    public string Licensee() => StringResource.Subject_RecoveredVirtualSports;

    public string It() => StringResource.Subject_RecoveredVirtualSportsIt;
}