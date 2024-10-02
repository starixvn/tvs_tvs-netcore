using MediatR;
using SpecialDelete.VoidByCurrency.Services;
using SpecialDelete.VoidByCurrency.ViewModels;
using TicketVoidingSystem.SharedApi.Services.SharedApi;

namespace SpecialDelete.VoidByCurrency.Handlers;

public class GetFilterModelRequest : IRequest<FilterViewModel>
{
}

public class GetFilterModelHandler : IRequestHandler<GetFilterModelRequest, FilterViewModel>
{
    private readonly FilterAreaService filterAreaService;
    private readonly FilterCurrencyLicenseeService filterCurrencyLicenseeService;

    public GetFilterModelHandler(FilterAreaService filterAreaService, FilterCurrencyLicenseeService filterCurrencyLicenseeService)
    {
        this.filterAreaService = filterAreaService;
        this.filterCurrencyLicenseeService = filterCurrencyLicenseeService;
    }

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