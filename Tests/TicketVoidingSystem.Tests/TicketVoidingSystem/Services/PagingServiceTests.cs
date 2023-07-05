using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services;

public class PagingServiceTests
{
    private readonly PagingServiceImp service;

    public PagingServiceTests()
    {
        service = new PagingServiceImp();
    }

    [Fact]
    public void Paging_HasValidData_ReturnExpected()
    {
        // Arrange
        var tickets = new List<GetTicketModel> { new(), new(), new(), new() };
        var expected = new List<GetTicketModel> { new(), new() };

        // Act
        var actual = service.Paging(tickets, 1, 2);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void Groups_HasValidData_ReturnExpected()
    {
        // Arrange
        var tickets = new List<GetTicketModel>
        {
            new() { GroupName = "1" }, new() { GroupName = "1" }, new() { GroupName = "2" }, new() { GroupName = "2" }
        };
        var expected = new List<Group<GetTicketModel>>
        {
            new()
            {
                Name = "1",
                DisplayTotalTickets = 0,
                Tickets = new List<GetTicketModel> { new() { GroupName = "1" }, new() { GroupName = "1" } }
            },
            new()
            {
                Name = "2",
                DisplayTotalTickets = 0,
                Tickets = new List<GetTicketModel> { new() { GroupName = "2" }, new() { GroupName = "2" } }
            }
        };

        // Act
        var actual = service.Groups(tickets, ticket => ticket.GroupName);

        // Assert
        AssertExtension.Equal(expected, actual);
    }

    [Fact]
    public void PagingGroups_HasValidData_ReturnExpected()
    {
        // Arrange
        var groups = new List<Group<GetTicketModel>>
        {
            new()
            {
                Name = "1",
                DisplayTotalTickets = 0,
                Tickets = new List<GetTicketModel> { new() { GroupName = "1" }, new() { GroupName = "1" } }
            },
            new()
            {
                Name = "2",
                DisplayTotalTickets = 0,
                Tickets = new List<GetTicketModel> { new() { GroupName = "2" }, new() { GroupName = "2" } }
            }
        };
        var expected = new List<Group<GetTicketModel>>
        {
            new()
            {
                Name = "2",
                DisplayTotalTickets = 0,
                Tickets = new List<GetTicketModel> { new() { GroupName = "2" }, new() { GroupName = "2" } }
            }
        };

        // Act
        var actual = service.PagingGroups(groups, 1, 2);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}