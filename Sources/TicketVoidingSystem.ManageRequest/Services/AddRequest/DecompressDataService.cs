using System.IO.Compression;
using System.Text;
using System.Text.Json;
using TicketVoidingSystem.ManageRequest.Models;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface DecompressDataService
{
    IEnumerable<GetTicketModel> DecompressTickets(string liveGameEarlyTicketsJson);
}

public class DecompressDataServiceImp : DecompressDataService
{
    public IEnumerable<GetTicketModel> DecompressTickets(string liveGameEarlyTicketsJson)
    {
        var compressedBytes = Convert.FromHexString(liveGameEarlyTicketsJson.TrimStart('0', 'x'));
        var tickets = DecompressJson<GetTicketModel>(compressedBytes);

        return tickets;
    }

    private static IEnumerable<T> DecompressJson<T>(byte[] compressedBytes)
    {
        using var memoryStream = new MemoryStream(compressedBytes);
        using var gs = new GZipStream(memoryStream, CompressionMode.Decompress);
        using var resultStream = new MemoryStream();
        gs.CopyTo(resultStream);

        var json = Encoding.Unicode.GetString(resultStream.ToArray());
        return JsonSerializer.Deserialize<IEnumerable<T>>(json);
    }
}