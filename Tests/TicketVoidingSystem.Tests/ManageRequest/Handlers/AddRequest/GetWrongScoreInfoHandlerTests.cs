using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class GetWrongScoreInfoHandlerTests
{
    private readonly GetWrongScoreInfoHandler handler;
    private readonly WrongScoreInfoService wrongScoreInfoService;

    public GetWrongScoreInfoHandlerTests()
    {
        wrongScoreInfoService = Substitute.For<WrongScoreInfoService>();
        handler = new GetWrongScoreInfoHandler(wrongScoreInfoService);
    }

    [Fact]
    public async Task Handler_Successful_HasCallExpected()
    {
        // Arrange
        wrongScoreInfoService.GetWrongScoreInfo(Arg.Any<GetWrongScoreInfoRequest>())
            .ReturnsForAnyArgs(new List<WrongScoreInfoViewModel>());
        // Act
        _ = await handler.Handle(null, CancellationToken.None);

        // Assert
        await wrongScoreInfoService.Received(1).GetWrongScoreInfo(Arg.Any<GetWrongScoreInfoRequest>());
    }
}