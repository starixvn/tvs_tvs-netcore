using AutoMapper;
using TicketVoidingSystem.VoidSingleBet;

namespace TicketVoidingSystem.Tests.VoidSingleBet;

internal static class TestSetup
{
    internal static IMapper CreateMapper()
    {
        var mockMapper = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new VoidSingleBetProfile());
        });

        return mockMapper.CreateMapper();
    }
}