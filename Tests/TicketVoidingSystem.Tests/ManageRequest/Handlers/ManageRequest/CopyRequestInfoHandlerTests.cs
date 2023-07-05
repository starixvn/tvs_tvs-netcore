using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class CopyRequestInfoHandlerTests
    {
        [Theory]
        [InlineData(FilterByConstant.AcceptTime)]
        [InlineData(FilterByConstant.TransTime)]
        public async Task Handler_ServiceExecute_ReturnSuccessfulResult(int filterBy)
        {
            // Arrange
            var copyRequestInfoModel = new CopyRequestInfoModel{ FilterBy = filterBy };
            var request = new CopyRequestInfoRequest { RequestId = 123 };
            var repository = Substitute.For<IDynamicRepository>();
            var matchService = Substitute.For<MatchService>();

            repository.GetAsync<CopyRequestInfoModel>(Arg.Any<CopyRequestInfoRequest>(), CancellationToken.None).ReturnsForAnyArgs(copyRequestInfoModel);
            var handler = new CopyRequestInfoHandler(repository, matchService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            await repository.Received().GetAsync<CopyRequestInfoModel>(Arg.Any<CopyRequestInfoRequest>(), CancellationToken.None);
            Assert.NotNull(actual);
        }
    }
}