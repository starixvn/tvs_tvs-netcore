using System.Collections.Generic;
using System.Threading;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.VoidRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.VoidRequest
{
    public class GetTicketsHandlerTests
    {
        private readonly GetTicketsService getTicketsService;
        private readonly MapTicketsService mapTicketsService;
        private readonly PagingService pagingService;
        private readonly TicketsViewModelService ticketsViewModelService;
        private readonly CheckPermissionOnRequestService checkPermissionOnRequestService;
        private readonly GetTicketsHandler handler;

        public GetTicketsHandlerTests()
        {
            getTicketsService = Substitute.For<GetTicketsService>();
            mapTicketsService = Substitute.For<MapTicketsService>();
            pagingService = Substitute.For<PagingService>();
            ticketsViewModelService = Substitute.For<TicketsViewModelService>();
            checkPermissionOnRequestService = Substitute.For<CheckPermissionOnRequestService>();
            handler = new GetTicketsHandler(getTicketsService, mapTicketsService, pagingService, ticketsViewModelService, checkPermissionOnRequestService);
        }

        [Fact]
        public void GetTickets_HaveTicketsDisplay_AssignDataTicket()
        {
            // Arrange
            var request = new GetTicketsRequest{ Match = new Match{ MatchId = 1} };
            var listGroup = new List<Group<GetTicketModel>>
             {
                 new Group<GetTicketModel>
                 {
                     Tickets = new List<GetTicketModel> { new GetTicketModel() }
                 }
             };
            var data = new List<GetTicketModel>();
            var voidPermission = checkPermissionOnRequestService.GetVoidPermission().ReturnsForAnyArgs(new VoidPermission());
            getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
            mapTicketsService.MapToGroupTicketViewModel(Arg.Any<GroupTicketsMappingParameters>()).ReturnsForAnyArgs(new Group<TicketViewModel>());
            pagingService.Paging(data, default, default).ReturnsForAnyArgs(new List<GetTicketModel> { new GetTicketModel() });
            pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);

            // Act
            var actual = handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.NotNull(actual);
        }

        [Fact]
        public void GetTickets_GenerateGroup_ReturnEmpty()
        {
            // Arrange
            var request = new GetTicketsRequest { Match = new Match { MatchId = 0 } };
            var listGroup = new List<Group<GetTicketModel>>
            {
                new Group<GetTicketModel>
                {
                    Tickets = new List<GetTicketModel> { new GetTicketModel() }
                }
            };
            var data = new List<GetTicketModel>();
            var voidPermission = checkPermissionOnRequestService.GetVoidPermission().ReturnsForAnyArgs(new VoidPermission());
            getTicketsService.GetTickets(request).ReturnsForAnyArgs(data);
            mapTicketsService.MapToGroupTicketViewModel(Arg.Any<GroupTicketsMappingParameters>()).ReturnsForAnyArgs(new Group<TicketViewModel>());
            pagingService.Paging(data, default, default).ReturnsForAnyArgs(new List<GetTicketModel> ());
            pagingService.Groups(data, ticket => ticket.GroupName).ReturnsForAnyArgs(listGroup);

            // Act
            var actual = handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.NotNull(actual);
        }
        
    }
}