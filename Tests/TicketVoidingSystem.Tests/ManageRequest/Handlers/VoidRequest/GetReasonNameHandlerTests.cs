using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.VoidRequest;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services.BetList;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest;

public class GetReasonNameHandlerTests
{
    [Fact]
    public async Task Handler_HasVoidedReasonIsNull_ReturnExpected()
    {
        // Arrange
        var voidedReason = new VoidedReason();
        var request = new GetReasonNameRequest { SubId = 123, SportTypeId = 1 };
        var repository = Substitute.For<IDynamicRepository>();
        var betListService = Substitute.For<BetListService>();
        var handler = new GetReasonNameHandler(repository, betListService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(actual, voidedReason);
    }

    [Fact]
    public async Task Handler_HasSportTypeIdPositive_ReturnExpected()
    {
        // Arrange
        var request = new GetReasonNameRequest { SubId = 123, SportTypeId = 1 };
        var repository = Substitute.For<IDynamicRepository>();
        var betListService = Substitute.For<BetListService>();
        var reason = new VoidedReason { ReasonEnglish = "@@", ReasonChineseSimplified = "@@1" };
        repository.GetAsync<VoidedReason>(Arg.Any<GetReasonNameCriteria>()).ReturnsForAnyArgs(reason);
        betListService.GetSportTypeName(0, null).ReturnsForAnyArgs("456");
        var handler = new GetReasonNameHandler(repository, betListService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal("456 - @@", actual.ReasonEnglish);
        Assert.Equal("456 - @@1", actual.ReasonChineseSimplified);
    }

    [Fact]
    public async Task Handler_HasSportTypeIdMinus_ReturnExpected()
    {
        // Arrange
        var request = new GetReasonNameRequest { SubId = 123, SportTypeId = -1 };
        var repository = Substitute.For<IDynamicRepository>();
        var betListService = Substitute.For<BetListService>();
        var reason = new VoidedReason { ReasonEnglish = "@@", ReasonChineseSimplified = "@@1" };
        repository.GetAsync<VoidedReason>(Arg.Any<GetReasonNameCriteria>()).ReturnsForAnyArgs(reason);
        var handler = new GetReasonNameHandler(repository, betListService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal("@@", actual.ReasonEnglish);
        Assert.Equal("@@1", actual.ReasonChineseSimplified);
    }
}