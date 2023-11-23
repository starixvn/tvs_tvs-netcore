using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Handlers;
using SpecialDelete.VoidByCurrency.Models;
using SpecialDelete.VoidByCurrency.Services;
using SpecialDelete.VoidByCurrency.ViewModels;
using Xunit;

namespace TicketVoidingSystem.Tests.VoidByCurrency.Handlers;


public class GetFilterModelHandlerTest
{
    [Fact]
    public async Task GetFilterModel_HasRequest_CallGetFilterModelByVoidByCurrencyService()
    {
        // Arrange
        var expected = new FilterViewModel
        {
            Remark = "Something here",
            Currencies = new List<Currency> { new() { CurrencyCode = "CNY" } },
            GroupLicensees = new List<GroupLicensee> { new() { GroupName = "UUS" } }
        };
        var request = new GetFilterModelRequest();
        var filterAreaService = Substitute.For<FilterAreaService>();
        filterAreaService.GetLicensees().ReturnsForAnyArgs(expected.GroupLicensees);
        filterAreaService.GetRemark().ReturnsForAnyArgs(expected.Remark);
        filterAreaService.GetCurrencies().ReturnsForAnyArgs(expected.Currencies);
        var handler = new GetFilterModelHandler(filterAreaService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}