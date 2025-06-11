using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using SpecialDelete.VoidByBetId.Handlers;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.SharedApi.Criteria.SharedApi;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Handlers;

[Category("VoidByBetId")]
public class GetAbnormalBetSubIssueTypesHandlerTest
{
    [Fact]
    public async Task Handle_ValidRequest_ReturnAbnormalSubIssueTypes()
    {
        // Arrange
        var request = new GetAbnormalBetSubIssueTypesRequest();
        var repository = Substitute.For<IDynamicRepository>();
        var handler = new GetAbnormalBetSubIssueTypesHandler(repository);

        var subIssueTypes = new List<SubIssueType>
        {
            new() { SubIssueTypeId = 1, IssueTypeId = IssueTypeConstant.AbnormalBet },
            new() { SubIssueTypeId = 2, IssueTypeId = IssueTypeConstant.AbnormalBet },
            new() { SubIssueTypeId = 3, IssueTypeId = IssueTypeConstant.DangerAccepted }
        };

        repository.FetchAsync<SubIssueType>(Arg.Any<GetSubIssueTypeCriteria>())
            .Returns(subIssueTypes);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(2, result.Count());
        Assert.All(result, x => Assert.Equal(IssueTypeConstant.AbnormalBet, x.IssueTypeId));
    }

    [Fact]
    public async Task Handle_EmptySubIssueTypes_ReturnEmptyList()
    {
        // Arrange
        var request = new GetAbnormalBetSubIssueTypesRequest();
        var repository = Substitute.For<IDynamicRepository>();
        var handler = new GetAbnormalBetSubIssueTypesHandler(repository);

        repository.FetchAsync<SubIssueType>(Arg.Any<GetSubIssueTypeCriteria>())
            .Returns(new List<SubIssueType>());

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task Handle_RemovedSubIssueTypes_ExcludeFromResult()
    {
        // Arrange
        var request = new GetAbnormalBetSubIssueTypesRequest();
        var repository = Substitute.For<IDynamicRepository>();
        var handler = new GetAbnormalBetSubIssueTypesHandler(repository);

        var subIssueTypes = new List<SubIssueType>
        {
            new() { SubIssueTypeId = SubIssueTypeConstant.RemovedList[0], IssueTypeId = IssueTypeConstant.AbnormalBet },
            new() { SubIssueTypeId = 2, IssueTypeId = IssueTypeConstant.AbnormalBet }
        };

        repository.FetchAsync<SubIssueType>(Arg.Any<GetSubIssueTypeCriteria>())
            .Returns(subIssueTypes);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Single(result);
        Assert.Equal(2, result.First().SubIssueTypeId);
    }
}