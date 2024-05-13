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
        handler = new CheckDuplicateTicketsHandler(repository, matchInfoAddRequestService);
    }

    [Fact]
    public async Task Handler_Successful_ReturnModelExpected()
    {
        // Arrange
        var request = new CheckDuplicateTicketsRequest { IssueTypeId = 1 };
        var result = (new[] { new MatchInfoAddRequest() }, new[] { new ValidationDuplicateTickets() },
            new[] { new TransInfoAddRequestModel() }, new List<string>());

        repository.GetAsync<string>(Arg.Any<GetTransInfoDuplicateTicketsCriteria>()).ReturnsForAnyArgs("TransInfo");
        repository.FetchMultipleAsync<MatchInfoAddRequest, ValidationDuplicateTickets, TransInfoAddRequestModel, string>(Arg.Any<CheckDuplicateTicketsCriteria>()).ReturnsForAnyArgs(result);
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