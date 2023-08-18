using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.SharedApi.Handlers.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.SharedApi.Handlers.SharedApi;

public class GetIssueTypePermissionListHandlerTests
{
    private readonly SessionService sessionService;
    private readonly GetIssueTypePermissionListRequest request;
    private readonly GetIssueTypePermissionListHandler handler;

    public GetIssueTypePermissionListHandlerTests()
    {
        sessionService = Substitute.For<SessionService>();
        handler = new GetIssueTypePermissionListHandler(sessionService);
        request = new GetIssueTypePermissionListRequest();
    }

    [Fact]
    public async Task Handle_Returns_ExpectedListIssueTypes()
    {
        // Arrange

        // Mock the sessionService.HasPermission method to return true for all IssueTypeFunctionKeysConstant values
        foreach (var issueTypeFunctionKey in IssueTypeFunctionKeysConstant.IssueTypeFunctionKeyList)
        {
            sessionService.HasPermission(issueTypeFunctionKey.FunctionKey, Fanex.NAP.Core.Business.Constant.Policy.Read).Returns(true);
        }

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(16, result.ToList().Count);
    }

    [Fact]
    public async Task Handle_Returns_Empty()
    {
        // Arrange

        // Mock the sessionService.HasPermission method to return false for all IssueTypeFunctionKeysConstant values
        foreach (var issueTypeFunctionKey in IssueTypeFunctionKeysConstant.IssueTypeFunctionKeyList)
        {
            sessionService.HasPermission(issueTypeFunctionKey.FunctionKey, Fanex.NAP.Core.Business.Constant.Policy.Read).Returns(false);
        }

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }
}