namespace SpecialDelete.UploadBatchMessage.Models;

using System.Collections.Generic;

public class MessageResult
{
    private string invalidTransId = string.Empty;

    public List<ReceivedUserViewModel> CreditTrans { get; set; }

    public string InvalidTransId
    {
        get
        {
            if (!string.IsNullOrEmpty(invalidTransId))
            {
                invalidTransId = invalidTransId.Replace("^", ",");
            }

            return invalidTransId;
        }

        set => invalidTransId = value;
    }
}