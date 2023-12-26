namespace SpecialDelete.RecoverParlayBet.Models;

using System;

public interface EmailSupport
{
    string BetFrom { get; }

    DateTime DateTime { get; }

    bool IsCsd { get; }

    bool IsItQa { get; }

    bool IsItSupport { get; }
}