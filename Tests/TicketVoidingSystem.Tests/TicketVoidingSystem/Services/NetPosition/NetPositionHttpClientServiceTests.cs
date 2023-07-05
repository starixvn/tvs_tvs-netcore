using NSubstitute;
using System.Net.Http;
using System.Threading.Tasks;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services;
using TicketVoidingSystem.Services.NetPosition;
using Xunit;

namespace TicketVoidingSystem.Tests.TicketVoidingSystem.Services.NetPosition
{
    public class NetPositionHttpClientServiceTests : AppSettingFixture
    {
        private readonly HttpClient httpClient;
        private readonly LoggingService loggingService;
        private readonly NetPositionHttpClientServiceImp service;

        public NetPositionHttpClientServiceTests()
        {
            httpClient = Substitute.For<HttpClient>();
            loggingService = Substitute.For<LoggingService>();
            AppSettingService.AppSetting.NetPositionUrl = "http://remotingref-api.nexdev.net/main/";
            service = new NetPositionHttpClientServiceImp(httpClient, loggingService);
        }

        [Fact]
        public async Task PostRequest_HasNoGetResponse_ReturnException()
        {
            // Arrange
            const string transIdCrickets = "123";
            const string actionType = "456";
            
            // Act
            var actual = await service.PostRequest(transIdCrickets, actionType);

            // Assert
            Assert.Equal(ErrorCode.Default, actual.ErrorCode);
        }
    }
}
