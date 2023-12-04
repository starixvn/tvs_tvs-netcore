using AutoMapper;
using TicketVoidingSystem.MarkTickets;

namespace TicketVoidingSystem.Tests.MarkTickets;

internal static class TestSetup
{
    internal static IMapper CreateMapper()
    {
        var mockMapper = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new MarkTicketsProfile());
        });

        return mockMapper.CreateMapper();
    }
}