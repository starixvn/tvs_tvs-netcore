namespace TicketVoidingSystem.ManageRequest.Constants;

public static class FilterByConstant
{
    public const byte TransTime = 1;

    public const byte AcceptTime = 2;

    // Abnormal bet, Duplicate tickets
    // Single = null
    public const byte MixParlay = 1;

    public const byte SystemParlay = 2;

    public const byte HybridParlay = 4;
}