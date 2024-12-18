using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.BetList.Core.Entities;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LogInfo;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LogInfo;

public class LogInfoHelperServiceTests
{
    private readonly GetTransInfoService getTransInfoService = Substitute.For<GetTransInfoService>();
    private readonly BetListService betListService = Substitute.For<BetListService>();
    private readonly CopyRequestInfoService copyRequestInfoService = Substitute.For<CopyRequestInfoService>();
    public LogInfoHelperService service;

    [Fact]
    public async Task GetTransInfoJson_HasCallGetTransInfoJson()
    {
        // Arrange
        service = new LogInfoHelperServiceImp(getTransInfoService, null, null);

        // Act
        _ = await service.GetTransInfoJson(new GetLogInfoQuery());

        // Assert
        await getTransInfoService.Received(1).GetTransInfoJson(Arg.Any<GetTransInfoQuery>());
    }

    [Fact]
    public async Task UpdateBetTypeTicketsInfo_HasUpdateBetTypeName()
    {
        // Arrange
        List<BetTypeTicketsInfo> betTypeTickets = [new() { BetId = 1, BetTypeId = 3 }];
        betListService.GetBetTypeName(Arg.Any<Ticket>()).Returns("Handicap");
        service = new LogInfoHelperServiceImp(null, betListService, copyRequestInfoService);

        // Act
        await service.UpdateBetTypeTicketsInfo(54321, betTypeTickets);

        // Assert
        await copyRequestInfoService.UpdatePlayerNameForBetTypeNextManOut(54321, Arg.Any<IEnumerable<BetTypeTicketsInfo>>());
        Assert.Equal("Handicap", betTypeTickets[0].BetTypeName);
    }
}