using System;
using System.Collections.Generic;
using NSubstitute;
using System.Threading.Tasks;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using Xunit;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Constants;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest
{
    public class MapTicketsServiceTests
    {
        private readonly BetListCoreService betListCoreService;
        private readonly MapTicketsServiceImp service;
        public MapTicketsServiceTests()
        {
            betListCoreService = Substitute.For<BetListCoreService>();
            service = new MapTicketsServiceImp(betListCoreService);
        }

        [Fact]
        public async Task MapToGroupTicketViewModel_HasCall_ReturnTicketViewModel()
        {
            // Arrange
            var group = new Group<GetTicketModel>
            {
                Name = "123",
                DisplayTotalTickets = 1,
                Tickets = new List<GetTicketModel> { new GetTicketModel{ TransDate = new DateTime(2022, 9, 5, 1, 1, 1), Status = "done",
                MainTransId = 1, SubTransId = 1, TransId = 1}}
            };
            var query = new GroupTicketsMappingParameters { Group = group, VoidPermission = new VoidPermission(),
                Match = new Match(), IssueTypeId = 1 };
            betListCoreService.GetTicket(Arg.Any<GetTicketModel>(), Arg.Any<Match>(), Arg.Any<ChoiceType>(), 1)
                .ReturnsForAnyArgs(new TicketViewModel());
            var ticket = new List<TicketViewModel> { new TicketViewModel { TransDate = new DateTime(2022, 9, 5, 1, 1, 1).ToString(FormatKey.DateTimeWithMillisecondAndSlash),
            BetId = "1", Value = "1", MainTransId = "1", WinLoss = "0", Score = "", IsDisable = true} };
            
            var expected = new Group<TicketViewModel>
            {
                Name = "123",
                Tickets = ticket,
                DisplayTotalTickets = 1               
            };

            // Act
            var result = service.MapToGroupTicketViewModel(query);

            // Assert

            AssertExtension.Equal(expected, result);
        }

    }
}
