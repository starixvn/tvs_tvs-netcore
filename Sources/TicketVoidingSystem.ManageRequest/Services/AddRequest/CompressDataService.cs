using System.IO.Compression;
using System.Text;
using System.Text.Json;
using TicketVoidingSystem.ManageRequest.Models;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface CompressDataService
{
    string CompressTicket(IEnumerable<TicketCalculateWinLostAccount> tickets);

    IEnumerable<GetTicketModel> DecompressTickets(string logInfoTicketsJson);
}

public class CompressDataAddRequestServiceImp : CompressDataService
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

    public IEnumerable<GetTicketModel> DecompressTickets(string logInfoTicketsJson)
    {
        try
        {
            var compressedBytes = Convert.FromHexString(logInfoTicketsJson.TrimStart('0', 'x'));
            var tickets = DecompressJson<GetTicketModel>(compressedBytes);
            return tickets.OrderBy(x => x.TransId);
        }
        catch
        {
            return Enumerable.Empty<GetTicketModel>();
        }
    }

    private static IEnumerable<T> DecompressJson<T>(byte[] compressedBytes)
    {
        using var memoryStream = new MemoryStream(compressedBytes);
        using var gs = new GZipStream(memoryStream, CompressionMode.Decompress);
        using var resultStream = new MemoryStream();
        gs.CopyTo(resultStream);

        var json = Encoding.Unicode.GetString(resultStream.ToArray());

        return Helper.DeserializeObjectIgnoreNullValue<IEnumerable<T>>(json);
    }
}