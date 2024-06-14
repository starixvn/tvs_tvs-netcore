using System.Drawing;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.ManageRequest.RequestListExcel;

public interface CellService
{
    void SetStyle(ExcelWorksheet worksheet);

    void RenderDataWorksheet(ExcelWorksheet worksheet, IEnumerable<ExcelRequestModel> requests);
}

public class CellServiceImp : CellService
{
    public void SetStyle(ExcelWorksheet worksheet)
    {
        var lastRow = worksheet.Dimension.End.Row;
        var lasCol = worksheet.Dimension.End.Column;

        worksheet.Cells[2, 1, lastRow, lasCol].Style.Border.Top.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[2, 1, lastRow, lasCol].Style.Border.Left.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[2, 1, lastRow, lasCol].Style.Border.Right.Style = ExcelBorderStyle.Thin;
        worksheet.Cells[2, 1, lastRow, lasCol].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

        worksheet.Cells.Style.Font.Size = 8;
        worksheet.Cells.Style.Font.Name = "Tahoma";
        worksheet.Cells.Style.WrapText = true;

        worksheet.Cells[$"A2:D{lastRow}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        worksheet.Cells[$"A2:D{lastRow}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
    }

    public void RenderDataWorksheet(ExcelWorksheet worksheet, IEnumerable<ExcelRequestModel> requests)  // NOSONAR
    {
        var index = 2;

        foreach (var request in requests)
        {
            worksheet.Cells[index, 1].Value = request.EventDateMatch;
            worksheet.Cells[index, 2].Value = request.KickOffTimeMatch;
            worksheet.Cells[index, 3].Value = request.League;
            worksheet.Cells[index, 4].Value = request.Event;
            worksheet.Cells[index, 5].Value = request.Trader;
            worksheet.Cells[index, 6].Value = request.LA;
            worksheet.Cells[index, 7].Value = request.Remark;
            worksheet.Cells[index, 8].Value = request.TVAndIPTV;
            worksheet.Cells[index, 9].Value = request.Provider;
            worksheet.Cells[index, 10].Value = request.Source;
            worksheet.Cells[index, 11].Value = request.VarCheck;
            worksheet.Cells[index, 12].Value = request.Action;
            worksheet.Cells[index, 13].Value = request.MistakenBy;
            worksheet.Cells[index, 14].Value = request.CreatedBy;
            worksheet.Cells[index, 15].Value = request.PerformedBy;
            worksheet.Cells[index, 16].Value = request.DecidedBy;
            worksheet.Cells[index, 17].Value = request.CheckedBy;
            worksheet.Cells[index, 18].Value = request.Message;
            worksheet.Cells[index, 19].Value = request.RequestId;
            worksheet.Cells[index, 20].Value = request.Sport;
            worksheet.Cells[index, 21].Value = request.IssueType;
            worksheet.Cells[index, 22].Value = request.SubIssueType;
            worksheet.Cells[index, 23].Value = request.MatchId;
            worksheet.Cells[index, 24].Value = request.CalculatedScore;
            worksheet.Cells[index, 25].Value = request.Description;
            worksheet.Cells[index, 26].Value = request.BetType;
            worksheet.Cells[index, 27].Value = request.NoOfTickets;
            worksheet.Cells[index, 28].Value = request.CreatedTime;
            worksheet.Cells[index, 29].Value = request.CalcHalfTime;
            worksheet.Cells[index, 30].Value = request.CalcFullTime;

            if (request.NumberOfRequestDetails > 1)
            {
                MergeCells(worksheet, index, index + (int)request.NumberOfRequestDetails - 1);
                SetValueMergeCells(worksheet, index, index + (int)request.NumberOfRequestDetails - 1, request);
            }

            if (request is { NumberOfRequestDetails: not null, Index: not null } && request.Index % 2 != 0)
            {
                HighlightBackground(worksheet, index, index + (int)request.NumberOfRequestDetails - 1);
            }

            index++;
        }
    }

    private static void MergeCells(ExcelWorksheet worksheet, int rowStart, int rowEnd)
    {
        worksheet.Cells[$"S{rowStart}:S{rowEnd}"].Merge = true;
        worksheet.Cells[$"T{rowStart}:T{rowEnd}"].Merge = true;
        worksheet.Cells[$"U{rowStart}:U{rowEnd}"].Merge = true;
    }

    private static void SetValueMergeCells(ExcelWorksheet worksheet, int rowStart, int rowEnd, ExcelRequestModel model)
    {
        worksheet.Cells[$"L{rowStart}:L{rowEnd}"].Value = model.Action;
        worksheet.Cells[$"M{rowStart}:M{rowEnd}"].Value = model.MistakenBy;
        worksheet.Cells[$"N{rowStart}:N{rowEnd}"].Value = model.CreatedBy;
        worksheet.Cells[$"O{rowStart}:O{rowEnd}"].Value = model.PerformedBy;
        worksheet.Cells[$"P{rowStart}:P{rowEnd}"].Value = model.DecidedBy;
        worksheet.Cells[$"Q{rowStart}:Q{rowEnd}"].Value = model.CheckedBy;
        worksheet.Cells[$"S{rowStart}:S{rowEnd}"].Value = model.RequestId;
        worksheet.Cells[$"T{rowStart}:T{rowEnd}"].Value = model.Sport;
        worksheet.Cells[$"U{rowStart}:U{rowEnd}"].Value = model.IssueType;
        worksheet.Cells[$"AB{rowStart}:AB{rowEnd}"].Value = model.CreatedTime;
        worksheet.Cells[$"AC{rowStart}:AC{rowEnd}"].Value = model.CalcHalfTime;
        worksheet.Cells[$"AD{rowStart}:AD{rowEnd}"].Value = model.CalcFullTime;
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int rowStart, int rowEnd)
    {
        worksheet.Cells[$"A{rowStart}:AD{rowEnd}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[$"A{rowStart}:AD{rowEnd}"].Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
    }
}