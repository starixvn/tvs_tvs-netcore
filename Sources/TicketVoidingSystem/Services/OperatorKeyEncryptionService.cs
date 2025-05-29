using System;
using System.Text;
using TicketVoidingSystem.Models;

namespace TicketVoidingSystem.Services;

public interface OperatorKeyEncryptionService
{
    string EncryptOperatorKey(string operatorKey);

    string DecryptOperatorKey(string encryptedKey);

    Result ValidateOperatorKey(string encryptedKey);
}

public class OperatorKeyEncryptionServiceImp : OperatorKeyEncryptionService
{
    private const string TVS_SecretKey = "TVS_2025_7x9k#mP2$vL5nQ8@jR3";
    private const string OriginOperatorKey = "aB3$kL9#mN2@pQ5";

    public string EncryptOperatorKey(string operatorKey)
    {
        if (string.IsNullOrEmpty(operatorKey))
        {
            throw new ArgumentNullException(nameof(operatorKey));
        }

        var keyBytes = Encoding.UTF8.GetBytes(TVS_SecretKey);
        var textBytes = Encoding.UTF8.GetBytes(operatorKey);
        var result = new byte[textBytes.Length];

        for (var i = 0; i < textBytes.Length; i++)
        {
            result[i] = (byte)(textBytes[i] ^ keyBytes[i % keyBytes.Length]);
        }

        return Convert.ToBase64String(result);
    }

    public string DecryptOperatorKey(string encryptedKey)
    {
        if (string.IsNullOrEmpty(encryptedKey))
        {
            throw new ArgumentNullException(nameof(encryptedKey));
        }

        try
        {
            var keyBytes = Encoding.UTF8.GetBytes(TVS_SecretKey);
            var encryptedBytes = Convert.FromBase64String(encryptedKey);
            var result = new byte[encryptedBytes.Length];

            for (var i = 0; i < encryptedBytes.Length; i++)
            {
                result[i] = (byte)(encryptedBytes[i] ^ keyBytes[i % keyBytes.Length]);
            }

            return Encoding.UTF8.GetString(result);
        }
        catch (Exception)
        {
            throw new InvalidOperationException("Failed to decrypt operator key");
        }
    }

    public Result ValidateOperatorKey(string encryptedKey)
    {
        // Validate operator key
        if (string.IsNullOrEmpty(encryptedKey))
        {
            return new Result { ErrorCode = 403, ErrorMsg = "Operator key is required." };
        }

        // Decrypt and validate the operator key
        try
        {
            var decryptedKey = DecryptOperatorKey(encryptedKey);
            if (decryptedKey != OriginOperatorKey)
            {
                return new Result { ErrorCode = 403, ErrorMsg = "Invalid operator key." };
            }
        }
        catch (Exception)
        {
            return new Result { ErrorCode = 403, ErrorMsg = "Failed to validate operator key." };
        }

        return new Result { ErrorCode = 0 }; // Success
    }
}