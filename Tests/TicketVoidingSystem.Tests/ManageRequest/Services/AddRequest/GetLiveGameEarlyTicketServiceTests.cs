using System.Collections.Generic;
using System.Linq;
using NSubstitute;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest
{
    public class GetLogInfoTicketServiceTests
    {
        public MapTicketsService mapTicketsService;
        public CompressDataService compressDataService;
        public GetLogInfoTicketsService service;

        [Fact]
        public void GetTicketsViewModel_ShouldReturnEmptyViewModel_WhenNoTickets()
        {
            // Arrange
            var getTicketModels = Enumerable.Empty<GetTicketModel>();

            var request = new GetLogInfoTicketsRequest
            {
                LiveGameEarlyTicketsJson = "",
                issueTypeId = 1
            };
            compressDataService = Substitute.For<CompressDataService>();
            compressDataService.DecompressTickets(request.LiveGameEarlyTicketsJson).Returns(getTicketModels);

            service = new GetLogInfoTicketsServiceImp(null, compressDataService);

            // Act
            var result = service.GetTicketsViewModel(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.TotalSingle);
            Assert.Empty(result.Groups);
        }

        [Fact]
        public void GetTicketsViewModel_ShouldReturnViewModelWithTickets_WhenTicketsExist()
        {
            // Arrange
            var request = new GetLogInfoTicketsRequest
            {
                LiveGameEarlyTicketsJson = "compressedData",
                issueTypeId = 1
            };

            var getTicketModels = new List<GetTicketModel>
            {
                new() { SubBetType = 2 },
                new() { SubBetType = 3 }
            };
            var ticket = new TicketViewModel { BetType = "Handicap" };

            compressDataService = Substitute.For<CompressDataService>();
            mapTicketsService = Substitute.For<MapTicketsService>();
            compressDataService.DecompressTickets(request.LiveGameEarlyTicketsJson).Returns(getTicketModels);
            mapTicketsService.MapFromGetTicketModelToTicketViewModel(Arg.Any<GetTicketModel>(), null, ChoiceType.None, 1).Returns(ticket);

            service = new GetLogInfoTicketsServiceImp(mapTicketsService, compressDataService);

            // Act
            var result = service.GetTicketsViewModel(request);

            // Assert
            Assert.Equal(2, result.TotalSingle);
            Assert.Single(result.Groups);
            Assert.Equal("Handicap", result.Groups.First().Name);
        }
    }
}