using System;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Models;
using TicketVoidingSystem.Services;
using Xunit;
using Substitute = NSubstitute.Substitute;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class CopyRequestInfoHandlerTests
    {
        [Theory]
        [InlineData(FilterByConstant.AcceptTime, "Accept time")]
        [InlineData(FilterByConstant.TransTime, "Trans time")]
        public async Task Handler_ServiceExecute_ReturnSuccessfulResult(int filterBy, string filterByValue)
        {
            // Arrange
            var copyRequestInfoModel = new CopyRequestInfoModel{ KickOffTime = new DateTime(2022,2,2,2,2,2),
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

            var expected = "K.O Time: 02:02 PM"
                                  + $"{ Environment.NewLine}League: "
                                  + $"{ Environment.NewLine}Match: "
                                  + $"{ Environment.NewLine}Match ID: 123"
                                  + $"{ Environment.NewLine}Request No: 456"
                                  + $"{ Environment.NewLine}Issue Type: IssueTypeName - SubIssueTypeName"
                                  + $"{ Environment.NewLine}VAR: NO"
                                  + $"{ Environment.NewLine}Provider: Provider"
                                  + $"{ Environment.NewLine}Start Void Time: 02:02:02.000 AM ({filterByValue})"
                                  + $"{Environment.NewLine}";

                repository.GetAsync<CopyRequestInfoModel>(Arg.Any<CopyRequestInfoRequest>(), CancellationToken.None).ReturnsForAnyArgs(copyRequestInfoModel);
            var handler = new CopyRequestInfoHandler(repository, matchService);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            await repository.Received().GetAsync<CopyRequestInfoModel>(Arg.Any<CopyRequestInfoRequest>(), CancellationToken.None);
            Assert.Equal(expected, actual.Info);
        }
    }
}