using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.VoidSingleBet.Handlers;
using TicketVoidingSystem.VoidSingleBet.Models;
using TicketVoidingSystem.VoidSingleBet.Services.GetTickets;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidSingleBet.Handlers;

public class GetLogInfoHandlerTests
{
    [Fact]
    public async Task Handle_WhenGetTicketsHaveEmptyData_ReturnZeroCount()
    {
        // Arrange
        var request = new GetLogInfoRequest();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(new List<GetTicketModel>());
        var handler = new GetLogInfoHandler(getTicketsService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(0, actual.TotalItems);
        Assert.Equal(0, actual.SingleCount);
        Assert.Equal(0, actual.ParlayCount);
        Assert.Equal(DateTime.MinValue, actual.FromTransTime);
        Assert.Equal(DateTime.MinValue, actual.ToTransTime);
        Assert.Null(actual.FromCheckTime);
        Assert.Null(actual.ToCheckTime);
    }

    [Theory]
    [ClassData(typeof(TestDataGenerator))]
    public async Task GetTickets_HaveTicketsDisplay_AssignDataTicket(List<GetTicketModel> tickets, int singleCount, int parlayCount)
    {
        // Arrange
        var request = new GetLogInfoRequest();
        var getTicketsService = Substitute.For<GetTicketsService>();
        getTicketsService.GetTickets(request).ReturnsForAnyArgs(tickets);
        var handler = new GetLogInfoHandler(getTicketsService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.Equal(tickets.Count, actual.TotalItems);
        Assert.Equal(singleCount, actual.SingleCount);
        Assert.Equal(parlayCount, actual.ParlayCount);
    }
}

public class TestDataGenerator : IEnumerable<object[]>
{
    private IEnumerable<object[]> _data =>
        new List<object[]>
        {
            new object[] { new List<GetTicketModel> {new () {IsMixParlay = false , TransDate = DateTime.Parse("8/21/2023 3:59:28 PM"), CheckTime  = DateTime.Parse("8/21/2023 3:59:28 PM") } },
                1, 0},
            new object[] { new List<GetTicketModel> {new () {IsMixParlay = true , TransDate = DateTime.Parse("8/21/2023 3:59:28 PM"), CheckTime  = DateTime.Parse("8/21/2023 3:59:28 PM") } },
                0, 1 },
            new object[] { new List<GetTicketModel> {new () {IsMixParlay = true , TransDate = DateTime.Parse("8/21/2023 3:59:28 PM"), CheckTime  = DateTime.Parse("8/21/2023 3:59:28 PM") },
                    new () {IsMixParlay = false , TransDate = DateTime.Parse("8/21/2023 3:59:28 PM"), CheckTime  = DateTime.Parse("8/21/2023 3:59:28 PM") } },
                1, 1 },
        };

    public IEnumerator<object[]> GetEnumerator() => _data.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}