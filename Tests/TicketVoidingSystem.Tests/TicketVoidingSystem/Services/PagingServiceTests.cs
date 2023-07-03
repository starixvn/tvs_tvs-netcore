using System.Collections.Generic;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services
{
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
            var tickets = new List<GetTicketModel> { new GetTicketModel(), new GetTicketModel(), new GetTicketModel(), new GetTicketModel() };
            var expected = new List<GetTicketModel> { new GetTicketModel(), new GetTicketModel() };

            // Act
            var actual = service.Paging(tickets, 1, 2);

            // Assert
            AssertExtension.Equal(expected, actual);
        }

        [Fact]
        public void Groups_HasValidData_ReturnExpected()
        {
            // Arrange
            var tickets = new List<GetTicketModel> { new GetTicketModel { GroupName = "1" }, new GetTicketModel { GroupName = "1" }, new GetTicketModel { GroupName = "2" }, new GetTicketModel { GroupName = "2" } };
            var expected = new List<Group<GetTicketModel>> {
                new Group<GetTicketModel>
                {
                    Name = "1",
                    DisplayTotalTickets = 0,
                    Tickets = new List<GetTicketModel> { new GetTicketModel { GroupName = "1" }, new GetTicketModel { GroupName = "1" }}
                },
                new Group<GetTicketModel>
                {
                    Name = "2",
                    DisplayTotalTickets = 0,
                    Tickets = new List<GetTicketModel> { new GetTicketModel { GroupName = "2" }, new GetTicketModel { GroupName = "2" }}
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
            var groups = new List<Group<GetTicketModel>> {
                new Group<GetTicketModel>
                {
                    Name = "1",
                    DisplayTotalTickets = 0,
                    Tickets = new List<GetTicketModel> { new GetTicketModel { GroupName = "1" }, new GetTicketModel { GroupName = "1" }}
                },
                new Group<GetTicketModel>
                {
                    Name = "2",
                    DisplayTotalTickets = 0,
                    Tickets = new List<GetTicketModel> { new GetTicketModel { GroupName = "2" }, new GetTicketModel { GroupName = "2" }}
                }
            };
            var expected = new List<Group<GetTicketModel>> {
                new Group<GetTicketModel>
                {
                    Name = "2",
                    DisplayTotalTickets = 0,
                    Tickets = new List<GetTicketModel> { new GetTicketModel { GroupName = "2" }, new GetTicketModel { GroupName = "2" }}
                }
            };

            // Act
            var actual = service.PagingGroups(groups, 1, 2);

            // Assert
            AssertExtension.Equal(expected, actual);
        }
    }
}