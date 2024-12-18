using System.Collections.Generic;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.AddRequest;
using TicketVoidingSystem.ManageRequest.Services.AddRequest;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.AddRequest;

public class GetDecidedByServiceTests
{
    [Fact]
    public async void UpdateDataFromRemotingRef_HasMatchInfoIsNull_ReturnNull()
    {
        // Arrange
        var repository = Substitute.For<IDynamicRepository>();
        var service = new GetDecidedByServiceImp(repository);
        var request = new GetDecidedByRequest();
        var decidedBySelect = new List<string> { "AA", "SSNVA", "SSNVTOM" };
        repository.FetchAsync<string>(request).Returns(decidedBySelect);
        string[] expected = ["SSNVA", "SSNVTOM", "AA"];

        // Act
        var actual = await service.GetDecidedBy(request);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}