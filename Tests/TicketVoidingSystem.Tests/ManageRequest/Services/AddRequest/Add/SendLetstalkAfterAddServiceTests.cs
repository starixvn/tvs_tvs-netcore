using System.Collections.Generic;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;
using TicketVoidingSystem.ManageRequest.ViewModels;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.Letstalk;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest.Add;

public class SendLetstalkAfterAddServiceTests
{
    private readonly NotificationLetstalkService notificationLetstalkService;
    private readonly SendLetstalkAfterAddServiceImp service;

    public SendLetstalkAfterAddServiceTests()
    {
        var sessionService = Substitute.For<SessionService>();
        notificationLetstalkService = Substitute.For<NotificationLetstalkService>();
        service = new SendLetstalkAfterAddServiceImp(sessionService, notificationLetstalkService);
    }

    [Theory]
    [InlineData(1, 31)]
    [InlineData(2, 38)]
    [InlineData(3, 31)]
    public async Task Execute_Successful_CalledExpected(int filterBy, int subIssueTypeId)
    {
        // Arrange
        var model = new AbnormalBetViewModel
        {
            FilterBy = filterBy,
            Matches = new List<MatchInfoAddRequest> { new() { MatchId = 1 } },
            SubIssueTypeId = subIssueTypeId,
            SendLetstalkModels = new List<SendLetstalkModel>
            {
                new (){ IsHasUusTickets = false, MatchId = 1 },
                new (){ IsHasUusTickets = true, MatchId = 1 }
            }
        };

        // Act
        await service.Execute(model, 1223);

        // Assert
        await notificationLetstalkService.Received(1)
            .SendToGroupAbnormalBetRequest(Arg.Any<string>(), Arg.Any<string>(), null);
    }

    [Fact]
    public async Task Execute_InValidQuery_NotCalledExpected()
    {
        // Arrange

        // Act
        await service.Execute(new AbnormalBetViewModel(), 1223);

        // Assert
        await notificationLetstalkService.Received(0)
            .SendToGroupAbnormalBetRequest(Arg.Any<string>(), Arg.Any<string>(), null);
    }
}