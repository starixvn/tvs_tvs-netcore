using System.IO.Compression;
using System.Text;
using System.Text.Json;
using Fanex.Logging;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface CompressDataService
{
    string CompressTicket<T>(IEnumerable<T> tickets);

    IEnumerable<T> DecompressTickets<T>(string logInfoTicketsJson);
}

public class CompressDataAddRequestServiceImp : CompressDataService
{
    public string CompressTicket<T>(IEnumerable<T> tickets)
    {
        var ticketZipped = CompressJson(tickets);
        var hexString = $"0x{Convert.ToHexString(ticketZipped)}";
        return hexString;
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

    public IEnumerable<T> DecompressTickets<T>(string logInfoTicketsJson)
    {
        try
        {
            var compressedBytes = Convert.FromHexString(logInfoTicketsJson.TrimStart('0', 'x'));
            return DecompressJson<T>(compressedBytes);
        }
        catch (Exception e)
        {
            LogService.Error(e.Message, e);
            return [];
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