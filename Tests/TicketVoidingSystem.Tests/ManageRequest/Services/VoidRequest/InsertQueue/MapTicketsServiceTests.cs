using System.Collections.Generic;
using System.Linq;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.VoidRequest.InsertQueue;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.VoidRequest.InsertQueue;

public class MapTicketsServiceTests
{
    [Fact]
    public void MapBetIdToRequestDetailTicket_ReturnExpected()
    {
        // Arrange
        var tickets = new List<BetId>
        {
            new() { TransId = "1", MatchId = 1 },
            new() { TransId = "2" }
        };
        var expected = new List<RequestDetailTicketModel>
        {
            new() { TransId = 1, MatchId = 1, VoidActionId = 5 },
            new() { TransId = 2, MatchId = 0, VoidActionId = 5 }
        };
        var service = new MapTicketsServiceImp();

        // Act
        var actual = service.MapBetIdToRequestDetailTicket(tickets, 0, 0);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void MapBetIdToRequestDetailTicket_NoHasTicket_ReturnExpected()
    {
        // Arrange
        var service = new MapTicketsServiceImp();

        // Act
        var actual = service.MapBetIdToRequestDetailTicket(null, 0, 0);

        // Assert
        Assert.Empty(actual);
    }

    [Fact]
    public void SetVoidingTypeForTickets_ReturnExpected()
    {
        // Arrange
        var validation = new CheckTicketValidationOutput
        {
            VoidSingleTickets = new List<RequestDetailTicketModel> { new() { TransId = 1 } },
            VoidParlayTickets = new List<RequestDetailTicketModel> { new() { TransId = 2 } },
            CancelCOTickets = new List<RequestDetailTicketModel> { new() { TransId = 3 } },
            VoidCricketTickets = new List<RequestDetailTicketModel> { new() { TransId = 4 } },
            VoidParlayTickets14 = new List<RequestDetailTicketModel> { new() { TransId = 6 } },
            VoidSingleTickets14 = new List<RequestDetailTicketModel> { new() { TransId = 5 } },
            RecoverCricketTickets = new List<RequestDetailTicketModel> { new() { TransId = 14 } },
            RecoverParlayTickets = new List<RequestDetailTicketModel> { new() { TransId = 12 } },
            RecoverParlayTickets14 = new List<RequestDetailTicketModel>(),
            RecoverSingleTickets = new List<RequestDetailTicketModel> { new() { TransId = 11 } },
            RecoverSingleTickets14 = null,
        };

        var groupTickets = new List<RequestDetailTicketModel>
        {
            new (){TransId = 1, VoidingTypeId = 1}, new (){TransId = 2, VoidingTypeId = 2},new (){TransId = 3, VoidingTypeId=3},
            new (){TransId=4, VoidingTypeId = 4},new (){TransId = 5, VoidingTypeId = 5},new (){TransId = 6, VoidingTypeId = 6},
            new (){TransId = 11, VoidingTypeId = 11},new (){TransId = 12, VoidingTypeId = 12},new (){TransId = 14, VoidingTypeId = 14}
        };
        var service = new MapTicketsServiceImp();

        // Act
        var actual = service.SetVoidingTypeForTickets(validation);

        // Assert
        AssertExtension.Equal(groupTickets, actual);
        Assert.Equal(VoidingTypeConstant.Single, validation.VoidSingleTickets.First().VoidingTypeId);
    }
}