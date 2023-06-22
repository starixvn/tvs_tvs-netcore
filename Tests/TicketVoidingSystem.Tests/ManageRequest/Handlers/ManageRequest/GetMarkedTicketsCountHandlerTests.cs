using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.MarkTickets.Criteria.MarkUnmarkTickets;
using TicketVoidingSystem.MarkTickets.Models.MarkUnmarkTickets;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class GetMarkedTicketsCountHandlerTests
    {
        // [Fact]
        // public async Task Handler_HasRequest_ReturnResults()
        // {
        //     var request = new GetMarkedTicketsCountRequest();
        //     var model = new AllMarkedTicketModel
        //     {
        //         Total = 10
        //     };
        //     var models = new List<AllMarkedTicketModel> { model };
        //     var repository = Substitute.For<IDynamicRepository>();
        //     var session = Substitute.For<SessionService>();
        //     repository.FetchAsync<AllMarkedTicketModel>(Arg.Any<AllMarkedTicketsCriteria>(), CancellationToken.None).ReturnsForAnyArgs(models);
        //     var handler = new GetMarkedTicketsCountHandler(repository, session);

        //     var actual = await handler.Handle(request, CancellationToken.None);

        //     Assert.True(actual > 0);
        // }
    }
}