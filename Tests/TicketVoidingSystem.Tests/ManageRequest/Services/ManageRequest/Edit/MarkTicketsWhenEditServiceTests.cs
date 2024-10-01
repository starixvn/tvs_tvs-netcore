using NSubstitute;
using TicketVoidingSystem.ManageRequest.Services.AddRequest.Add;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.Edit;

public class MarkTicketsWhenEditServiceTests
{
    private readonly MarkTicketsService markTicketsService;
    private readonly MarkTicketsWhenAddEditServiceImp service;

    public MarkTicketsWhenEditServiceTests()
    {
        markTicketsService = Substitute.For<MarkTicketsService>();
        service = new MarkTicketsWhenAddEditServiceImp(markTicketsService);
    }

    //[Fact]
    //public async Task Execute_ValidData_ReturnTransInfo()
    //{
    //    // Arrange
    //    var query = new EditRequestQuery { MarkTransIds = "1", IssueTypeId = 1, UnMarkTransIds = "1" };
    //    var results = new List<Result>();
    //    markTicketsService
    //        .MarkTicketsInTVS(Arg.Any<string>(), query.IssueTypeId, MarkTypeConstant.ExecuteMarkTickets)
    //        .ReturnsForAnyArgs(results);

    //    // Act
    //    var actual = await service.Execute(query.IssueTypeId, query.MarkTransIds, query.UnMarkTransIds);

    //    // Assert
    //    AssertExtension.Equal(results, actual);
    //}
}