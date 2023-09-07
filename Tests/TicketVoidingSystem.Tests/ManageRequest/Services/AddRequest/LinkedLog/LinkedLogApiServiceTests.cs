using System.Net.Http;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.LinkedLog;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.LinkedLog;

public class LinkedLogApiServiceTests
{
    private readonly LinkedLogHttpClientService linkedLogHttpClientService;
    private readonly LinkedLogApiServiceImp service;

    public LinkedLogApiServiceTests()
    {
        linkedLogHttpClientService = Substitute.For<LinkedLogHttpClientService>();
        service = new LinkedLogApiServiceImp(linkedLogHttpClientService);
    }

    [Fact]
    public async Task GetLinkedLog_ValidData_CalledExpected()
    {
        // Arrange
        var getLinkedLogModel = new GetLinkedLogModel { MatchId = 1, LiveIndicator = 1 };

        linkedLogHttpClientService.PostHttpRequest(Arg.Any<PoolHouseLinkedLogRequest>())
            .ReturnsForAnyArgs(new HttpResponseMessage());

        // Act
        await service.GetLinkedLog(getLinkedLogModel);

        // Assert
        await linkedLogHttpClientService.Received(1).PostHttpRequest(Arg.Any<PoolHouseLinkedLogRequest>());
    }
}