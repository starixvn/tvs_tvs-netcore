using MediatR;
using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Services.Excel;

namespace TicketVoidingSystem.ManageRequest.Handlers.ManageRequest;

public class GetExcelVoidedTicketForSendLetstalkRequest : GetVoidedTicketsQuery, IRequest<byte[]>;

public class GetExcelVoidedTicketForSendLetstalkHandler(ExcelService<GetVoidedTicketsQuery> excelService)
    : IRequestHandler<GetExcelVoidedTicketForSendLetstalkRequest, byte[]>
{
    public async Task<byte[]> Handle(GetExcelVoidedTicketForSendLetstalkRequest request, CancellationToken cancellationToken)
    {
        request.IsCreditOnly = true;

        return await excelService.GenerateContentAsByteArray(request, TemplateExcelPath.TicketVoiding_VoidedTickets);
    }
}