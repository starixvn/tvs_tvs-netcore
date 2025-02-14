using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.Extensions;

public static class SportTypeExtension
{
    public static bool IsHaveJackTimeCashOutTickets(this int sportType)
    {
        return sportType is SportTypeConstant.Soccer or SportTypeConstant.Basketball;
    }
}