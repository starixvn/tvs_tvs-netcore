using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageRequest.Criteria.ManageRequest;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest;
using TicketVoidingSystem.ManageRequest.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.ManageRequest.Services.ManageRequest
{
    public class WrongScoreInfoServiceTests
    {
        private readonly IDynamicRepository repository;
        private readonly WrongScoreInfoServiceImp service;

        public WrongScoreInfoServiceTests()
        {
            repository = Substitute.For<IDynamicRepository>();
            service = new WrongScoreInfoServiceImp(repository);
        }

        [Fact]
        public async Task GetWrongScoreInfo_WhenCalled_ReturnListWrongScoreInfoViewModel()
        {
            // Arrange
            var criteria = new GetWrongScoreInfoCriteria();
            var expected = new List<WrongScoreInfoViewModel>();
            repository.FetchAsync<WrongScoreInfoViewModel>(Arg.Any<GetWrongScoreInfoCriteria>()).ReturnsForAnyArgs(expected);

            // Act
            var actual = await service.GetWrongScoreInfo(criteria);

            // Assert
            AssertExtension.Equal(expected, actual);
        }
    }
}