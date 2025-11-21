using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRemark;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using Xunit;
using OperatorInfo = TicketVoidingSystem.ManageRequest.Models.OperatorInfo;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRemark;

public class GetRemarkServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly RequestExtraInfoXmlService requestExtraInfoXmlService;
    private readonly GetRemarkServiceImp service;

    public GetRemarkServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        requestExtraInfoXmlService = Substitute.For<RequestExtraInfoXmlService>();
        service = new GetRemarkServiceImp(repository, requestExtraInfoXmlService);
    }

    [Fact]
    public async Task GetRemark_ValidRemarkId_ReturnAddRemarkModel()
    {
        // Arrange
        var remarkId = 1;
        var remark = new AddRemarkModel
        {
            RemarkId = remarkId,
            MatchId = 1,
            OperatorInfo = "<root><operator operatorId=\"1\" operatorType=\"1\" /></root>"
        };
        var operators = new List<OperatorInfo>
        {
            new() { OperatorId = 1, OperatorType = 1 }
        };
        repository.GetAsync<AddRemarkModel>(Arg.Any<GetRemarkCriteria>())
            .ReturnsForAnyArgs(remark);
        requestExtraInfoXmlService.ParseXmlToOperators(Arg.Any<string>())
            .ReturnsForAnyArgs(operators);

        // Act
        var actual = await service.GetRemark(remarkId);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(remarkId, actual.RemarkId);
        Assert.NotNull(actual.OperatorsList);
        Assert.Single(actual.OperatorsList);
        await repository.Received().GetAsync<AddRemarkModel>(Arg.Any<GetRemarkCriteria>());
    }

    [Fact]
    public async Task GetRemark_RemarkNotFound_ReturnNull()
    {
        // Arrange
        var remarkId = 999;
        repository.GetAsync<AddRemarkModel>(Arg.Any<GetRemarkCriteria>())
            .ReturnsForAnyArgs((AddRemarkModel)null);

        // Act
        var actual = await service.GetRemark(remarkId);

        // Assert
        Assert.Null(actual);
        await repository.Received().GetAsync<AddRemarkModel>(Arg.Any<GetRemarkCriteria>());
    }

    [Fact]
    public async Task GetRemark_OperatorInfoIsNull_ReturnEmptyOperatorsList()
    {
        // Arrange
        var remarkId = 1;
        var remark = new AddRemarkModel
        {
            RemarkId = remarkId,
            MatchId = 1,
            OperatorInfo = null
        };
        repository.GetAsync<AddRemarkModel>(Arg.Any<GetRemarkCriteria>())
            .ReturnsForAnyArgs(remark);
        requestExtraInfoXmlService.ParseXmlToOperators(Arg.Any<string>())
            .ReturnsForAnyArgs(new List<OperatorInfo>());

        // Act
        var actual = await service.GetRemark(remarkId);

        // Assert
        Assert.NotNull(actual);
        Assert.NotNull(actual.OperatorsList);
        Assert.Empty(actual.OperatorsList);
    }

    [Fact]
    public async Task GetRemark_OperatorInfoIsEmpty_ReturnEmptyOperatorsList()
    {
        // Arrange
        var remarkId = 1;
        var remark = new AddRemarkModel
        {
            RemarkId = remarkId,
            MatchId = 1,
            OperatorInfo = string.Empty
        };
        repository.GetAsync<AddRemarkModel>(Arg.Any<GetRemarkCriteria>())
            .ReturnsForAnyArgs(remark);
        requestExtraInfoXmlService.ParseXmlToOperators(Arg.Any<string>())
            .ReturnsForAnyArgs(new List<OperatorInfo>());

        // Act
        var actual = await service.GetRemark(remarkId);

        // Assert
        Assert.NotNull(actual);
        Assert.NotNull(actual.OperatorsList);
        Assert.Empty(actual.OperatorsList);
    }
}