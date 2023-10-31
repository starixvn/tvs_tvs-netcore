using MediatR;
using SpecialDelete.VoidByBetId.Models;
using SpecialDelete.VoidByBetId.Services.Validation;
using SpecialDelete.VoidByBetId.ViewModels;

namespace SpecialDelete.VoidByBetId.Handlers;

public class CheckAbnormalBetRequest : CheckAbnormalBetModel, IRequest<ResultCheckAbnormalBetViewModel>
{
}

public class CheckAbnormalBetHandler : IRequestHandler<CheckAbnormalBetRequest, ResultCheckAbnormalBetViewModel>
{
    private readonly CheckAbnormalBetService checkAbnormalBetService;

    public CheckAbnormalBetHandler(CheckAbnormalBetService checkAbnormalBetService)
    {
        this.checkAbnormalBetService = checkAbnormalBetService;
    }

    public async Task<ResultCheckAbnormalBetViewModel> Handle(CheckAbnormalBetRequest request, CancellationToken cancellationToken)
    {
        return await checkAbnormalBetService.GetValidation(request);
    }
}