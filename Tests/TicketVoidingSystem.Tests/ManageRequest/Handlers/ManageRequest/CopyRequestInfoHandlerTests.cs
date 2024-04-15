using System;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Services;
using Xunit;
using Substitute = NSubstitute.Substitute;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class CopyRequestInfoHandlerTests
    {
        [Theory]
        [InlineData(FilterByConstant.AcceptTime)]
        [InlineData(FilterByConstant.TransTime)]
        public async Task Handler_ServiceExecute_ReturnExactModel(int filterBy)
        {
            // Arrange
            var copyRequestInfoModel = new RequestInfoForCopy
            {
                GlobalShowTime = new DateTime(2022, 2, 2, 2, 2, 2),
                MatchId = 123,
                RequestId = "456",
                IssueTypeName = "IssueTypeName",
                SubIssueTypeName = "SubIssueTypeName",
                Provider = "Provider",
                StartVoidTime = new DateTime(2022, 2, 2, 2, 2, 2),
                FilterBy = filterBy,
            };
            var request = new CopyRequestInfoRequest { RequestId = 123 };
            var repository = Substitute.For<IDynamicRepository>();
            var matchService = Substitute.For<MatchService>();
            repository.GetAsync<RequestInfoForCopy>(Arg.Any<CopyRequestInfoRequest>(), CancellationToken.None).ReturnsForAnyArgs(copyRequestInfoModel);
            var handler = new CopyRequestInfoHandler(repository, matchService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            await repository.Received().GetAsync<RequestInfoForCopy>(Arg.Any<CopyRequestInfoRequest>(), CancellationToken.None);
            Assert.Equal(copyRequestInfoModel, actual);
        }
    }
}