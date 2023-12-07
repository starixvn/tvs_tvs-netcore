using System.IO.Compression;
using System.Text;
using System.Text.Json;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest.AbnormalAccount;

public interface CompressDataAddRequestService
{
    string CompressTicket(IEnumerable<TicketCalculateWinLostAccount> tickets);
}

public class CompressDataAddRequestServiceImp : CompressDataAddRequestService
{
    public string CompressTicket(IEnumerable<TicketCalculateWinLostAccount> tickets)
    {
        var jsonTickets = TicketsToJsonModel(tickets);
        var ticketZipped = CompressJson(jsonTickets);
        var hexString = $"0x{Convert.ToHexString(ticketZipped)}";
        return hexString;
    }

    private static IEnumerable<TicketAddRequestJson> TicketsToJsonModel(IEnumerable<TicketCalculateWinLostAccount> tickets)
    {
        var jsonTickets = tickets.Select(x => new TicketAddRequestJson
        {
            mid = x.MatchId,
            t = x.TransId,
            c = x.CustId,
            btype = x.BetType,
            bid = x.BetId,
            isP = x.IsMixParlay,
            sitedb = x.SiteDbGroupId,
            isV14 = x.IsVoid14
        });

        return jsonTickets;
    }

    private static byte[] CompressJson<T>(IEnumerable<T> groups)
    {
        var json = JsonSerializer.Serialize(groups);

        var bytes = Encoding.Unicode.GetBytes(json);
        using var memoryStream = new MemoryStream();
        using (var gs = new GZipStream(memoryStream, CompressionMode.Compress))
        {
            gs.Write(bytes, 0, bytes.Length);
        }

        return memoryStream.ToArray();
    }
}