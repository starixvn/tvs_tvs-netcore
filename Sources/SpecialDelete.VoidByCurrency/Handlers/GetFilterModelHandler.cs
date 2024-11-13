using MediatR;
using SpecialDelete.VoidByCurrency.Services;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.SharedApi.Services.SharedApi;

namespace SpecialDelete.VoidByCurrency.Handlers;

public class GetFilterModelRequest : IRequest<FilterViewModel>;

public class GetFilterModelHandler(
    FilterAreaService filterAreaService,
    FilterCurrencyLicenseeService filterCurrencyLicenseeService)
    : IRequestHandler<GetFilterModelRequest, FilterViewModel>
{
    public async Task<FilterViewModel> Handle(GetFilterModelRequest request, CancellationToken cancellationToken)
    {
        var filterViewModel = new FilterViewModel
        {
            GroupLicensees = await filterCurrencyLicenseeService.GetGroupLicensees(),
            Currencies = await filterCurrencyLicenseeService.GetCurrencies(),
            Remark = await filterAreaService.GetRemark()
        };

        return filterViewModel;
    }
}