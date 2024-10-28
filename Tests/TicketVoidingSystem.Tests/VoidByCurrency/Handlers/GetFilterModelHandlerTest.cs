using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NSubstitute;
using SpecialDelete.VoidByCurrency.Handlers;
using SpecialDelete.VoidByCurrency.Services;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.SharedApi.Models;
using TicketVoidingSystem.SharedApi.Services.SharedApi;
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
        var filterCurrencyLicenseeService = Substitute.For<FilterCurrencyLicenseeService>();
        filterCurrencyLicenseeService.GetGroupLicensees().ReturnsForAnyArgs(expected.GroupLicensees);
        filterCurrencyLicenseeService.GetCurrencies().ReturnsForAnyArgs(expected.Currencies);
        filterAreaService.GetRemark().ReturnsForAnyArgs(expected.Remark);
        var handler = new GetFilterModelHandler(filterAreaService, filterCurrencyLicenseeService);

        // Act
        var actual = await handler.Handle(request, CancellationToken.None);

        // Assert
        AssertExtension.Equal(expected, actual);
    }
}