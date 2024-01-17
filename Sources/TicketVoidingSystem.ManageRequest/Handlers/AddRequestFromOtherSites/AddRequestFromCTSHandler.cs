using System.Text.Json;
using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Handlers.AddRequestFromOtherSites;

public class AddRequestFromCTSRequest : AddRequestFromCTSModel, IRequest<string>
{
}

public class AddRequestFromCTSHandler : IRequestHandler<AddRequestFromCTSRequest, string>
{
    public async Task<string> Handle(AddRequestFromCTSRequest request, CancellationToken cancellationToken)
    {
        return await Task.FromResult(ConvertAddRequestModelToJson(request));
    }

    private static string ConvertAddRequestModelToJson(AddRequestFromCTSModel model)
    {
        var transformModel = new AddRequestFromCTSModel
        {
            IssueTypeId = IssueTypeConstant.AbnormalBet.ToString(),
            SubIssueTypeId = model.SubIssueTypeId,
            ActionId = model.ActionId,
            IsTest = model.IsTest,
            TransIds = model.TransIds
        };

        return JsonSerializer.Serialize(transformModel, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
    }
}