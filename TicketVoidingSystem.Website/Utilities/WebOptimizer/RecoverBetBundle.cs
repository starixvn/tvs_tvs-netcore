using Microsoft.Extensions.DependencyInjection;
using WebOptimizer;

namespace TicketVoidingSystem.Website.Utilities.WebOptimizer;

public static class RecoverBetBundle
{
    public static void AddRecoverBetBundle(this IAssetPipeline pipeline)
    {
        //// style bundle
        pipeline.AddLessBundle("/old-page/bundle/recover-bet.css", "old-page/recover-bet/recover-bet.less");

        //// script bundle
        pipeline.AddJavaScriptBundle("/old-page/bundle/recover-bet.js",
            "old-page/scripts/_Libs/Utils/stdlib.js",
            "old-page/scripts/Common/Message.Helper.js",
            "old-page/scripts/_Libs/ContextMenu/jquery.contextMenu.js",
            "old-page/scripts/Common/ContextMenu.Helper.js",
            "old-page/recover-bet/scripts/recover-bet.js",
            "old-page/scripts/sub-parlay-ticket.js");
    }
}