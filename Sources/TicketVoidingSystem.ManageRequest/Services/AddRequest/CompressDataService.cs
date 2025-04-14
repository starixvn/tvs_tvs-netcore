using Fanex.Logging;
using System.Buffers;
using System.IO.Compression;
using System.Text;
using System.Text.Json;
using TicketVoidingSystem.Utilities;

namespace TicketVoidingSystem.ManageRequest.Services.AddRequest;

public interface CompressDataService
{
    string CompressTicket<T>(IEnumerable<T> tickets);

    IEnumerable<T> DecompressTickets<T>(string logInfoTicketsJson);
}

public class CompressDataAddRequestServiceImp : CompressDataService
{
    private const int BufferSize = 81920; // 80KB for optimal performance

    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        WriteIndented = false,
        DefaultBufferSize = BufferSize,
        AllowTrailingCommas = false,
        MaxDepth = 64
    };

    public string CompressTicket<T>(IEnumerable<T> tickets)
    {
        var ticketZipped = CompressJson(tickets);
        return $"0x{Convert.ToHexString(ticketZipped)}";
    }

    private static byte[] CompressJson<T>(IEnumerable<T> groups)
    {
        var json = JsonSerializer.Serialize(groups, SerializerOptions);
        var bytes = Encoding.Unicode.GetBytes(json);

        using var outputStream = new MemoryStream(BufferSize);
        using (var compressionStream = new GZipStream(outputStream, CompressionLevel.Fastest))
        {
            compressionStream.Write(bytes, 0, bytes.Length);
        }

        return outputStream.ToArray();
    }

    public IEnumerable<T> DecompressTickets<T>(string logInfoTicketsJson)
    {
        if (string.IsNullOrEmpty(logInfoTicketsJson))
        {
            return [];
        }

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
        var buffer = ArrayPool<byte>.Shared.Rent(BufferSize);
        try
        {
            using var inputStream = new MemoryStream(compressedBytes);
            using var decompressionStream = new GZipStream(inputStream, CompressionMode.Decompress);
            using var outputStream = new MemoryStream(BufferSize);

            int bytesRead;
            while ((bytesRead = decompressionStream.Read(buffer, 0, buffer.Length)) > 0)
            {
                outputStream.Write(buffer, 0, bytesRead);
            }

            var jsonBytes = outputStream.ToArray();
            var json = Encoding.Unicode.GetString(jsonBytes);

            return Helper.DeserializeObjectIgnoreNullValue<IEnumerable<T>>(json);
        }
        finally
        {
            ArrayPool<byte>.Shared.Return(buffer);
        }
    }
}