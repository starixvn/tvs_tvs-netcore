using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.AddRequest;

public class CheckDuplicateTicketsHandlerTests
{
    private readonly CheckDuplicateTicketsHandler handler;
    private readonly MatchInfoAddRequestService matchInfoAddRequestService;
    private readonly IDynamicRepository repository;

    public CheckDuplicateTicketsHandlerTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        matchInfoAddRequestService = Substitute.For<MatchInfoAddRequestService>();
        handler = new CheckDuplicateTicketsHandler(repository, matchInfoAddRequestService, null);
    }

    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckDuplicateTicketsRequest { IssueTypeId = 1 };
        var result = new IEnumerable<object>[3];
        result[0] = new[] { new MatchInfoAddRequest() };
        result[1] = new[] { new ValidationDuplicateTickets() };
        result[2] = new[] { new TransInfoAddRequestModel() };

        var mappingTypes = new[]
        {
            typeof(MatchInfoAddRequest), typeof(ValidationDuplicateTickets), typeof(TransInfoAddRequestModel),
            typeof(string)
        };
        repository.GetAsync<string>(Arg.Any<GetTransInfoDuplicateTicketsCriteria>()).ReturnsForAnyArgs("TransInfo");
        repository.FetchMultipleAsync(Arg.Any<CheckDuplicateTicketsCriteria>(), mappingTypes,
            CancellationToken.None).ReturnsForAnyArgs(result);
        matchInfoAddRequestService.UpdateDataFromRemotingRef(Arg.Any<MatchInfoAddRequest>())
            .ReturnsForAnyArgs(new MatchInfoAddRequest());
        var viewModel = new CheckDuplicateTicketsViewModel
        {
            Match = new MatchInfoAddRequest(),
            Validation = new ValidationDuplicateTickets(),
            TransInfoAddRequestModel = new TransInfoAddRequestModel()
        };

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(viewModel, actual);
    }
}