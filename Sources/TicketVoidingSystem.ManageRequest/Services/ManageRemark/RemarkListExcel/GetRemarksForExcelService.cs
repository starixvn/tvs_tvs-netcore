using TicketVoidingSystem.Constants;
using TicketVoidingSystem.Extensions;
using TicketVoidingSystem.ManageRequest.Constants;
using TicketVoidingSystem.ManageRequest.Models.ManageRemark;
using TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRemark.RemarkListExcel;

public interface GetRemarksForExcelService
{
    Task<IEnumerable<ExcelRemarkModel>> GetRemarksExcel(SelectRemarksQuery query);
}

public class GetRemarksForExcelServiceImp(
    GetRemarksService getRemarksService,
    RenderRemarkService renderRemarkService,
    ConvertRequestsService convertRequestsService)
    : GetRemarksForExcelService
{
    public async Task<IEnumerable<ExcelRemarkModel>> GetRemarksExcel(SelectRemarksQuery query)
    {
        var remarks = await getRemarksService.GetRemarks(query);
        renderRemarkService.UpdateDescription(remarks);

        var excelRemarks = new List<ExcelRemarkModel>();
        int? index = 0;

        foreach (var remark in remarks)
        {
            index++;
            var excelRemark = MapToExcelRemarkModel(remark);
            excelRemark.Index = index;
            excelRemarks.Add(excelRemark);
        }

        return excelRemarks;
    }

    private ExcelRemarkModel MapToExcelRemarkModel(Models.ManageRemark.RemarkModel remark)
    {
        var excelRemark = new ExcelRemarkModel
        {
            // Basic fields
            MatchId = remark.MatchId.ToString(),
            CreatedTime = remark.CreatedDate.ZoneManila().ToString(FormatKey.LongDateFormatTimeWithSlash),
            CalculatedScore = remark.SettlementStatus,
            Action = GetActionName(remark.ActionId),

            // User fields
            MistakenBy = remark.MistakenBy,
            CreatedBy = remark.CreatedBy,
            PerformedBy = remark.PerformedBy,
            TVAndIPTV = remark.Iptv,
            Trader = remark.Trader,
            LA = remark.Suspender,
            Source = remark.Source,
            Remark = remark.Remark,
            Message = remark.Message,
            Description = remark.DescriptionInput,
            DecidedBy = remark.DecidedBy,
            Provider = remark.Provider,

            CloseCaseBy = remark.CloseCaseBy,
            EventDateMatch = remark.EventDate.ZoneManila().ToString(FormatKey.ShortDateFormatWithHyphen),
            KickOffTimeMatch = remark.KickOffTime.ZoneManila().ToString(FormatKey.OnlyTimeWithPeriodFormat),
            Sport = remark.SportTypeName,
            Event = remark.EventName,
            League = remark.LeagueName,
            VarCheck = convertRequestsService.GetVarCheckValue(remark.IsCheckedVar)
        };

        return excelRemark;
    }

    private static string GetActionName(string? actionId)
    {
        return ActionRemarkConstant.ActionRemark.GetValueOrDefault(actionId, "");
    }
}