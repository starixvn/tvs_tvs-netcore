namespace TicketVoidingSystem.Constants;

public static class ErrorCode
{
    public const int ExecuteQueryFail = 109;

    public const int ExecuteQueryAPIFail = 106;

    public const int MaxLengthStringAPI = 169;

    public const int SendMessageOrEmailFail = 136;

    public const int SendLetstalkFail = 137;

    public const int Default = 1;

    public const int Authorize = 403;

    public const int WrongPassword = 121;

    public const int InsertQueueException = 122;

    public const int DivideMessageMailDetail = -9999;

    /// <summary>
    /// After void service
    /// </summary>

    public const int ExceptionWhenRunAfterVoid = 134;

    public const int SendEmailToLicenseeFail = 135;

    public const int SendEmailToLicenseeSuccess = 235;

    public const int LicenseeFail = 136;

    public const int LicenseeSuccess = 236;

    public const int VoidRequestSuccess = 238;
    public const int NegativeBalanceUsers = 138;
}