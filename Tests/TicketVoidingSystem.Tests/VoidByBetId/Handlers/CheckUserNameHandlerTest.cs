using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using SpecialDelete.VoidByBetId.Handlers;
using SpecialDelete.VoidByBetId.Models;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByBetId.Handlers
{
    [Category("VoidByBetId")]
    public class CheckUserNameHandlerTest
    {
        [Fact]
        public async Task CheckUserName_RepositoryReturnNull_ReturnZero()
        {
            // Arrange
            const string expected = "0";
            var request = new CheckUserNameRequest { UserName = "ABC" };
            var repository = Substitute.For<IDynamicRepository>();
            repository.Fetch<CustomerInfo>(request).ReturnsForAnyArgs(new List<CustomerInfo>());
            var handler = new CheckUserNameHandler(repository);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.Equal(expected, actual);
        }

        [Fact]
        public async Task CheckUserName_RepositoryReturnCustomerInfo_ReturnZero()
        {
            // Arrange
            const string expected = "123";
            var request = new CheckUserNameRequest { UserName = "ABC" };
            var customer = new CustomerInfo { CustId = 123, Currency = 20, RoleID = 1 };
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<CustomerInfo>(request).ReturnsForAnyArgs(new List<CustomerInfo> { customer });
            var handler = new CheckUserNameHandler(repository);

            // Act
            var actual = await handler.Handle(request, CancellationToken.None);

            // Assert
            Assert.Equal(expected, actual);
        }
    }
}