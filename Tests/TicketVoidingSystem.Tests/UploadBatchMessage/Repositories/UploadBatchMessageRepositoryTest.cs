using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using SpecialDelete.UploadBatchMessage.Criteria;
using SpecialDelete.UploadBatchMessage.Models;
using SpecialDelete.UploadBatchMessage.Repositories;
using Xunit;

namespace TicketVoidingSystem.Tests.UploadBatchMessage.Repositories;


public class UploadBatchMessageRepositoryTest
{
    [Fact]
    public async Task GetReceivedUsers_ValidCriteria_ReturnDataFromRepository()
    {
        // Arrange
        var fakeData = new ValueTuple<IEnumerable<ReceivedUserViewModel>, IEnumerable<string>>(
            new List<ReceivedUserViewModel> { new() { CustId = 1111 } },
            new List<string> { "136546,4964" });
        var expected = new MessageResult
        {
            CreditTrans = fakeData.Item1.ToList(),
            InvalidTransId = fakeData.Item2.FirstOrDefault()
        };
        var criteria = new GetReceivedUsersCriteria { TransIds = "1,2,3" };
        var dynamicRepository = Substitute.For<IDynamicRepository>();
        dynamicRepository
            .FetchMultipleAsync<ReceivedUserViewModel, string>(criteria)
            .ReturnsForAnyArgs(fakeData);
        var repository = new UploadBatchMessageRepositoryImp(dynamicRepository);

        // Act
        var actual = await repository.GetReceivedUsers(criteria);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}