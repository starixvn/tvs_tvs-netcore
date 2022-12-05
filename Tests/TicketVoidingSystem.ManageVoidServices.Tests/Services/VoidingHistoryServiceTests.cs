using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using TicketVoidingSystem.ManageVoidServices.Criteria;
using TicketVoidingSystem.ManageVoidServices.Models;
using TicketVoidingSystem.ManageVoidServices.Services;
using Xunit;

namespace TicketVoidingSystem.ManageVoidServices.Tests.Services
{
    public class VoidingHistoryServiceTests
    {
        [Fact]
        public async Task GetByRequestId_ExecuteSuccessful_ReturnExpected()
        {
            // Arrange
            var model = new VoidingHistoryModel();
            var models = new List<VoidingHistoryModel> { model };
            var criteria = new GetVoidingHistoryCriteria();
            criteria.GetSettingKey();
            criteria.IsValid();
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<VoidingHistoryModel>(criteria)
                .ReturnsForAnyArgs(models);
            var service = new VoidingHistoryServiceImp(repository);

            // Act
            var actual = await service.GetByRequestId(1);

            // Assert
            await repository.Received()
                .FetchAsync<VoidingHistoryModel>(Arg.Compat.Any<GetVoidingHistoryCriteria>());
            Assert.NotNull(actual);
        }

        [Fact]
        public async Task UpdateVoidingHistory_ExecuteSuccessful_RepositoryHasCalled()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();
            var service = new VoidingHistoryServiceImp(repository);

            // Act
            await service.UpdateVoidingHistory(1, 1);

            // Assert
            await repository.Received(1)
                .ExecuteAsync(Arg.Compat.Is<UpdateVoidingHistoryCriteria>(x => x.StatusId == 1));
        }
    }
}