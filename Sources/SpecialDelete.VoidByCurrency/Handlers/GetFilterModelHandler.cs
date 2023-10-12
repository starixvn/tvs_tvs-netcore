using MediatR;
using SpecialDelete.VoidByCurrency.Services;
using SpecialDelete.VoidByCurrency.ViewModels;

namespace SpecialDelete.VoidByCurrency.Handlers;

public class GetFilterModelRequest : IRequest<FilterViewModel>
{
}

public class GetFilterModelHandler : IRequestHandler<GetFilterModelRequest, FilterViewModel>
{
    private readonly FilterAreaService filterAreaService;

    public GetFilterModelHandler(FilterAreaService filterAreaService)
    {
        this.filterAreaService = filterAreaService;
    }

    public async Task<FilterViewModel> Handle(GetFilterModelRequest request, CancellationToken cancellationToken)
    {
        var filterViewModel = new FilterViewModel
        {
            GroupLicensees = await filterAreaService.GetLicensees(),
            Remark = await filterAreaService.GetRemark(),
            Currencies = await filterAreaService.GetCurrencies()
        };

        return filterViewModel;
    }
}