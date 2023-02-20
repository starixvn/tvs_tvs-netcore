namespace TicketVoidingSystem.Constants;

public static class NetPositionConstant
{
    public const string ActionVoid = "VOID";

    public const string ActionRecover = "RECOVER";
}

public static class ServiceApiType
{
    public const int Cricket = 1;
}

public static class ServiceApiStatus
{
    public const int Waiting = 0;

    public const int Finished = 1;

    public const int Failed = 2;
}