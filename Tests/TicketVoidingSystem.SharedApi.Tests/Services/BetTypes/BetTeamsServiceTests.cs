using System.Threading.Tasks;
using NSubstitute;
using Xunit;
using System.Collections.Generic;
using Fanex.Data.Repository;
using TicketVoidingSystem.SharedApi.Services.BetTypes;
using TicketVoidingSystem.Utilities;
using TicketVoidingSystem.SharedApi.Models.BetTypes;

namespace TicketVoidingSystem.SharedApi.Tests.Services.BetTypes;

public class BetTeamsServiceTests
{
    private readonly IDynamicRepository repository;
    private readonly BetTeamsServiceImp service;

    public BetTeamsServiceTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        service = new BetTeamsServiceImp();
    }

    // [Fact]
    // public async Task Get_Return_ListBetTeamNotNull()
    // {
    //      // Arrange
    //         var jsonPath = "../../../../TicketVoidingSystem.Website/App_Data/Data/AdvancedMode.json";
    //         var betTeams = new List<BetTeam> { new BetTeam(), new BetTeam(), new BetTeam() };
    //         var advancedMode = new AdvancedMode { };
            
    //         //Helper.DeserializeJsonFileToObject<AdvancedMode>(jsonPath).ReturnsForAnyArgs(advancedMode);           

    //         // Act
    //         var result = service.Get();

    //         // Assert
    //         Assert.NotNull(result);
    //         Assert.Equal(betTeams, result);
    // }
}