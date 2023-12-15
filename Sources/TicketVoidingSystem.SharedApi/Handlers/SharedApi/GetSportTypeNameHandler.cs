using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketVoidingSystem.Services.BetList;

namespace TicketVoidingSystem.SharedApi.Handlers.SharedApi;

public class GetSportTypeNameRequest : IRequest<string>
{
    public int SportType { get; set; }
    public string LanguageCode { get; set; }
}

public class GetSportTypeNameHandler : IRequestHandler<GetSportTypeNameRequest, string>
{
    private readonly BetListService betListService;

    public GetSportTypeNameHandler(BetListService betListService)
    {
        this.betListService = betListService;
    }

    public async Task<string> Handle(GetSportTypeNameRequest request, CancellationToken cancellationToken)
    {
        var name = betListService.GetSportTypeName(request.SportType, request.LanguageCode);
        return await Task.FromResult(name);
    }
}