using System.IO;

namespace TicketVoidingSystem.Utilities;

using MessagePack;

public static class MessagePackCloner
{
    public static T Clone<T>(T obj)
    {
        var options = MessagePack.Resolvers.ContractlessStandardResolver.Options;
        using var ms = new MemoryStream();

        MessagePackSerializer.Serialize(ms, obj, options);

        ms.Position = 0;

        return MessagePackSerializer.Deserialize<T>(ms, options);
    }
}