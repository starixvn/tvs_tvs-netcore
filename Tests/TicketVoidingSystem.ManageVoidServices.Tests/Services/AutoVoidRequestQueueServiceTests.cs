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
    public class AutoVoidRequestQueueServiceTests
    {
        [Fact]
        public async Task GetQueueInAllServers_ExecuteSuccessful_ReturnExpected()
        {
            // Arrange
            var model = new AutoVoidRequestQueueModel();
            var models = new List<AutoVoidRequestQueueModel> { model };
            var criteria = new GetAutoVoidRequestQueueCriteria();
            criteria.IsValid();
            criteria.GetSettingKey();
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<AutoVoidRequestQueueModel>(criteria)
                .ReturnsForAnyArgs(models);
            var service = new AutoVoidRequestQueueServiceImp(repository);

            // Act
            var actual = await service.GetQueueInAllServers("", 1);

            // Assert
            await repository.Received()
                .FetchAsync<AutoVoidRequestQueueModel>(Arg.Compat.Any<GetAutoVoidRequestQueueCriteria>());
            Assert.NotNull(actual);
        }

        [Fact]
        public async Task UpdateQueue_ExecuteSuccessful_RepositoryHasCalled()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();
            var service = new AutoVoidRequestQueueServiceImp(repository);

            // Act
            await service.UpdateQueue(1, 1, "", 1, true, "");

            // Assert
            await repository.Received(1)
                .ExecuteAsync(Arg.Compat.Is<UpdateAutoVoidRequestQueueCriteria>(x => x.StatusId == 1));
        }
    }
}