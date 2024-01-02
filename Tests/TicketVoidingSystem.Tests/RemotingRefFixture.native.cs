using System;
using Fanex.BetList.Core;
using Fanex.BetList.Core.RemotingRef;
using Fanex.RemotingRef;

namespace TicketVoidingSystem.Tests;

public class RemotingRefFixture
{
    public RemotingRefFixture()
    {
        RefDataTypeContainer
            .ConnectTo(new Uri("http://remotingref-api-core.nexdev.net/"))
            .FromApplication("NAP-SpecialDelete-LOCAL")
            .RegisterSupportedLanguages("en-US", "zh-TW", "zh-CN");
        BetListManager.RegisterRemotingRef(new CacheRef());
    }
}