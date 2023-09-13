using System.Drawing;
using Epplus.Mapper.Extensions;
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
        worksheet.Cells[2, 7, lastRow, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.HighlightFont($"R2:R{lastRow}", "LEFT(L2,1)=\"-\"", Color.Red);
        worksheet.Cells.Style.Font.Size = 8;
        worksheet.Cells.Style.Font.Name = "Tahoma";
        worksheet.Cells.Style.WrapText = true;
        worksheet.Cells[2, 17, lastRow, 18].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        worksheet.Cells[2, 17, lastRow, 18].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
    }

    public void RenderDataWorksheet(ExcelWorksheet worksheet, IEnumerable<ExcelRequestModel> requests)  // NOSONAR
    {
        var index = 2;

        foreach (var request in requests)
        {
            worksheet.Cells[index, 1].Value = request.RequestId;
            worksheet.Cells[index, 2].Value = request.Sport;
            worksheet.Cells[index, 3].Value = request.IssueType;
            worksheet.Cells[index, 4].Value = request.SubIssueType;
            worksheet.Cells[index, 5].Value = request.MatchId;
            worksheet.Cells[index, 6].Value = request.CalculatedScore;
            worksheet.Cells[index, 7].Value = request.Description;
            worksheet.Cells[index, 8].Value = request.Event;
            worksheet.Cells[index, 9].Value = request.League;
            worksheet.Cells[index, 10].Value = request.VarCheck;
            worksheet.Cells[index, 11].Value = request.BetType;
            worksheet.Cells[index, 12].Value = request.NoOfTickets;
            worksheet.Cells[index, 13].Value = request.Action;
            worksheet.Cells[index, 14].Value = request.CreatedBy;
            worksheet.Cells[index, 15].Value = request.CreatedTime;
            worksheet.Cells[index, 16].Value = request.CalcHalfTime;
            worksheet.Cells[index, 17].Value = request.CalcFullTime;
            worksheet.Cells[index, 18].Value = request.MistakenBy;
            worksheet.Cells[index, 19].Value = request.DecidedBy;
            worksheet.Cells[index, 20].Value = request.PerformedBy;
            worksheet.Cells[index, 21].Value = request.CheckedBy;

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
        worksheet.Cells[$"A{rowStart}:A{rowEnd}"].Merge = true;
        worksheet.Cells[$"B{rowStart}:B{rowEnd}"].Merge = true;
        worksheet.Cells[$"C{rowStart}:C{rowEnd}"].Merge = true;
        worksheet.Cells[$"M{rowStart}:M{rowEnd}"].Value = true;
        worksheet.Cells[$"N{rowStart}:N{rowEnd}"].Value = true;
        worksheet.Cells[$"O{rowStart}:O{rowEnd}"].Value = true;
        worksheet.Cells[$"P{rowStart}:P{rowEnd}"].Value = true;
        worksheet.Cells[$"Q{rowStart}:Q{rowEnd}"].Value = true;
        worksheet.Cells[$"R{rowStart}:R{rowEnd}"].Value = true;
        worksheet.Cells[$"S{rowStart}:S{rowEnd}"].Value = true;
        worksheet.Cells[$"T{rowStart}:T{rowEnd}"].Value = true;
        worksheet.Cells[$"U{rowStart}:U{rowEnd}"].Value = true;
    }

    private static void SetValueMergeCells(ExcelWorksheet worksheet, int rowStart, int rowEnd, ExcelRequestModel model)
    {
        worksheet.Cells[$"A{rowStart}:A{rowEnd}"].Value = model.RequestId;
        worksheet.Cells[$"B{rowStart}:B{rowEnd}"].Value = model.Sport;
        worksheet.Cells[$"C{rowStart}:C{rowEnd}"].Value = model.IssueType;
        worksheet.Cells[$"M{rowStart}:M{rowEnd}"].Value = model.Action;
        worksheet.Cells[$"N{rowStart}:N{rowEnd}"].Value = model.CreatedBy;
        worksheet.Cells[$"O{rowStart}:O{rowEnd}"].Value = model.CreatedTime;
        worksheet.Cells[$"P{rowStart}:P{rowEnd}"].Value = model.CalcHalfTime;
        worksheet.Cells[$"Q{rowStart}:Q{rowEnd}"].Value = model.CalcFullTime;
        worksheet.Cells[$"R{rowStart}:R{rowEnd}"].Value = model.MistakenBy;
        worksheet.Cells[$"S{rowStart}:S{rowEnd}"].Value = model.DecidedBy;
        worksheet.Cells[$"T{rowStart}:T{rowEnd}"].Value = model.PerformedBy;
        worksheet.Cells[$"U{rowStart}:U{rowEnd}"].Value = model.CheckedBy;
    }

    private static void HighlightBackground(ExcelWorksheet worksheet, int rowStart, int rowEnd)
    {
        worksheet.Cells[$"A{rowStart}:U{rowEnd}"].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[$"A{rowStart}:U{rowEnd}"].Style.Fill.BackgroundColor.SetColor(Color.LemonChiffon);
    }
}