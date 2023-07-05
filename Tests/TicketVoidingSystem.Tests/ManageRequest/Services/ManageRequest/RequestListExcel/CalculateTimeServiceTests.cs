using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.RequestListExcel;

public class CalculateTimeServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly CalculateTimeServiceImp service;

    public CalculateTimeServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new CalculateTimeServiceImp(repository);
    }

    [Fact]
    public async Task GetCalculateTime_ValidData_ReturnListGetCalculateTimeModel()
    {
        // Arrange
        var query = new List<string> { "a" };
        var activeModels = new List<GetCalculateTimeModel>
        {
            new()
            {
                RequestId = 1, CalcHalfTime = new DateTime(2015, 12, 31, 5, 10, 20),
                CalcFullTime = new DateTime(2015, 12, 31, 5, 10, 20)
            },
            new()
            {
                RequestId = 2, CalcHalfTime = new DateTime(2015, 12, 31, 5, 10, 43),
                CalcFullTime = new DateTime(2015, 12, 31, 5, 10, 18)
            },
            new()
            {
                RequestId = 1, CalcHalfTime = new DateTime(2015, 12, 31, 5, 10, 1),
                CalcFullTime = new DateTime(2015, 12, 31, 5, 10, 12)
            },
            new()
            {
                RequestId = 3, CalcHalfTime = new DateTime(2015, 12, 31, 5, 10, 1),
                CalcFullTime = new DateTime(2015, 12, 31, 5, 10, 15)
            }
        };
        var archivedModels = new List<GetCalculateTimeModel>
        {
            new()
            {
                RequestId = 1, CalcHalfTime = new DateTime(2012, 12, 31, 5, 10, 2),
                CalcFullTime = new DateTime(2018, 12, 31, 5, 10, 20)
            },
            new()
            {
                RequestId = 2, CalcHalfTime = new DateTime(1013, 12, 31, 5, 10, 2),
                CalcFullTime = new DateTime(2022, 12, 31, 5, 10, 18)
            },
            new()
            {
                RequestId = 3, CalcHalfTime = new DateTime(1012, 12, 31, 5, 10, 9),
                CalcFullTime = new DateTime(2011, 12, 31, 5, 10, 12)
            },
            new()
            {
                RequestId = 3, CalcHalfTime = new DateTime(2015, 12, 31, 5, 10, 9),
                CalcFullTime = new DateTime(2011, 12, 31, 5, 10, 15)
            }
        };
        repository.FetchAsync<GetCalculateTimeModel>(Arg.Compat.Any<GetCalculateTimeCriteria>())
            .Returns(Task.FromResult<IEnumerable<GetCalculateTimeModel>>(activeModels));
        repository.FetchAsync<GetCalculateTimeModel>(Arg.Compat.Any<GetCalculateTimeArchiveCriteria>())
            .Returns(Task.FromResult<IEnumerable<GetCalculateTimeModel>>(archivedModels));

        // Act
        var actual = await service.GetCalculateTime(query);
        var resultList = actual.ToList();

        // Assert
        Assert.Equal(3, resultList.Count);
        Assert.Equal(new DateTime(2012, 12, 31, 5, 10, 2), resultList[0].CalcHalfTime);
        Assert.Equal(new DateTime(2015, 12, 31, 5, 10, 12), resultList[0].CalcFullTime);
        Assert.Equal(new DateTime(1013, 12, 31, 5, 10, 2), resultList[1].CalcHalfTime);
        Assert.Equal(new DateTime(2015, 12, 31, 5, 10, 18), resultList[1].CalcFullTime);
        Assert.Equal(new DateTime(1012, 12, 31, 5, 10, 9), resultList[2].CalcHalfTime);
        Assert.Equal(new DateTime(2011, 12, 31, 5, 10, 12), resultList[2].CalcFullTime);
    }
}