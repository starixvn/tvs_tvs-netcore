using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Handlers.ManageRequest
{
    public class GetGeneralInfoHandlerTests
    {
        [Fact]
        public async Task Handle_ValidRequest_HasCallGetGeneralInfoViewModel()
        {
            var request = new GetGeneralInfoRequest { RequestId = 12345 };
            var getGeneralInfoService = Substitute.For<GetGeneralInfoService>();
            getGeneralInfoService.GetGeneralInfoViewModel(Arg.Any<GetGeneralInfoRequest>()).ReturnsForAnyArgs(new GeneralInfoViewModel());
            var handler = new GetGeneralInfoHandler(getGeneralInfoService);

            // Act
            var model = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.NotNull(model);
            await getGeneralInfoService.Received().GetGeneralInfoViewModel(Arg.Any<GetGeneralInfoRequest>());
        }
    }
}