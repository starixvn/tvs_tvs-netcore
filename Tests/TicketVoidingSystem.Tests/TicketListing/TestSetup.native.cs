using AutoMapper;
using TicketVoidingSystem.TicketListing;

namespace TicketVoidingSystem.Tests.TicketListing;

internal static class TestSetup
{
    internal static IMapper CreateMapper()
    {
        var mockMapper = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new TicketListingProfile());
        });

        return mockMapper.CreateMapper();
    }
}