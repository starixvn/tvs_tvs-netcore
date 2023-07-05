using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest.VoidedTickets;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.VoidedTickets;
using TicketVoidingSystem.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest.VoidedTickets;

public class GetVoidedTicketsServiceTests : IClassFixture<AppSettingFixture>, IClassFixture<RemotingRefFixture>
{
    private readonly IMapper mapper;

    private readonly IDynamicRepository repository;
    private readonly GetVoidedTicketsServiceImp service;

    public GetVoidedTicketsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        mapper = Substitute.For<IMapper>();
        service = new GetVoidedTicketsServiceImp(repository, mapper);
    }

    [Fact]
    public async void GetTickets_ValidQuery_ReturnVoidedTicketModel()
    {
        // Arrange
        var query = new GetVoidedTicketsQuery();
        mapper.Map<GetVoidedTicketsCriteria>(Arg.Any<GetVoidedTicketsQuery>()).Returns(new GetVoidedTicketsCriteria());
        repository.FetchAsync<VoidedTicketModel>(Arg.Is(new GetVoidedTicketsCriteria
        {
            SiteDbGroupId = 1
        })).ReturnsForAnyArgs(new List<VoidedTicketModel>
        {
            new()
            {
                TransId = 1
            }
        });

        // Act 
        var result = await service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count());
    }

    [Fact]
    public async void GetTickets_ValidQuery_ReturnVoidedTickets14()
    {
        // Arrange
        var query = new GetVoidedTicketsQuery
        {
            IssueTypeId = 17
        };
        mapper.Map<GetVoidedTickets14Criteria>(Arg.Any<GetVoidedTicketsQuery>())
            .Returns(new GetVoidedTickets14Criteria());
        repository.FetchAsync<VoidedTicketModel>(Arg.Is(new GetVoidedTickets14Criteria
        {
            SiteDbGroupId = 1
        })).ReturnsForAnyArgs(new List<VoidedTicketModel>
        {
            new()
            {
                TransId = 1
            }
        });

        // Act 
        var result = await service.GetTickets(query);

        // Assert

        Assert.NotNull(result);
        Assert.Equal(3, result.Count());
    }

    [Fact]
    public async void GetTickets_InputIsCreditOnlyTrue_ReturnVoidedTicketModel()
    {
        // Arrange
        var query = new GetVoidedTicketsQuery
        {
            IsCreditOnly = true
        };
        mapper.Map<GetVoidedTicketsCriteria>(Arg.Any<GetVoidedTicketsQuery>()).Returns(new GetVoidedTicketsCriteria());
        repository.FetchAsync<VoidedTicketModel>(Arg.Is(new GetVoidedTicketsCriteria
        {
            SiteDbGroupId = 1
        })).ReturnsForAnyArgs(new List<VoidedTicketModel>
        {
            new()
            {
                GroupName = "Credit",
                TransId = 1
            }
        });

        // Act 
        var result = await service.GetTickets(query);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count());
    }


    [Fact]
    public async void GetMatchInfo_InputMatchId_ReturnVoidedTicketModel()
    {
        // Arrange

        repository.GetAsync<Match>(Arg.Any<GetVoidedTicketsCriteria>()).ReturnsForAnyArgs(new Match
        {
            MatchId = 123
        });

        // Act 
        var result = await service.GetMatchInfo(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(123, result.MatchId);
    }
}